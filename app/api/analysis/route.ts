import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { analysisService } from '@/lib/services/analysis.service'
import { discordService } from '@/lib/services/discord.service'
import { analyticsService } from '@/lib/services/analytics.service'
import { emailNotificationService } from '@/lib/services/email-notification.service'
import { withRateLimit, RATE_LIMITS } from '@/lib/utils/rate-limit'
import { logger } from '@/lib/utils/logger'
import { ApiResponse } from '@/lib/utils/api-response'
import type { Session } from 'next-auth'

export async function POST(request: NextRequest) {
  let session: Session | null = null

  try {
    session = await auth()

    if (!session || !session.user?.id) {
      return ApiResponse.unauthorized('Please sign in to continue')
    }

    // Get user details to check admin status and subscription
    const { db } = await import('@/lib/db')
    const { users } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (userResult.length === 0) {
      return ApiResponse.notFound('User not found')
    }

    const user = userResult[0]
    const isAdmin = user.role === 'admin'
    const isFreeUser = !user.subscriptionStatus || user.subscriptionStatus !== 'active'

    // Apply rate limiting only for non-admin users
    if (!isAdmin) {
      const rateLimitResult = await withRateLimit(
        request,
        RATE_LIMITS.analysis,
        session.user.id
      )

      if (!rateLimitResult.success) {
        return NextResponse.json(
          {
            error: 'Too many analysis requests. Please try again later.',
            retryAfter: rateLimitResult.reset,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': rateLimitResult.limit.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            },
          }
        )
      }
    }

    // Check analysis limits
    const limitsResult = await analysisService.checkAnalysisLimits(
      session.user.id,
      isAdmin,
      isFreeUser
    )

    if (!limitsResult.allowed) {
      if (limitsResult.reason === 'Free trial limit reached') {
        return NextResponse.json(
          {
            error: limitsResult.reason,
            message: 'You have used your free analysis. Please subscribe to continue.',
            freeAnalysesUsed: user.freeAnalysesUsed,
            freeAnalysesLimit: user.freeAnalysesLimit,
          },
          { status: 402 }
        )
      }

      if (limitsResult.reason === 'Monthly limit reached') {
        return NextResponse.json(
          {
            error: limitsResult.reason,
            message: `You have reached your monthly limit of ${limitsResult.monthlyLimit} analyses. Your limit will reset on the 1st of next month.`,
            monthlyLimit: limitsResult.monthlyLimit,
            monthlyUsed: limitsResult.monthlyUsed,
            tier: user.subscriptionTier,
          },
          { status: 402 }
        )
      }

      return ApiResponse.error(limitsResult.reason || 'Analysis limit reached', 402)
    }

    // Get image from form data
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return ApiResponse.badRequest('No image provided')
    }

    // Process analysis using service
    logger.info('Processing chart analysis', { userId: session.user.id })
    const analysisData = await analysisService.processAnalysis({
      userId: session.user.id,
      imageFile,
      session,
    })

    const { analysisId, result: analysisResult, aiAnalysis, isFreeUser: isFree, freeAnalysesRemaining, user: updatedUser } = analysisData

    // Track analytics
    await analyticsService.trackAnalysis(
      session.user.id,
      {
        analysisId,
        stockSymbol: aiAnalysis.stockSymbol,
        grade: analysisResult.grade,
        isFree,
      },
      request
    )

    // Send Discord notification
    await discordService.notifyAnalysis({
      userId: session.user.id,
      email: updatedUser.email,
      stockSymbol: aiAnalysis.stockSymbol,
      grade: analysisResult.grade,
      shouldEnter: analysisResult.shouldEnter,
      confidence: aiAnalysis.confidence,
      isFree,
    })

    // Prepare response
    const response = {
      id: analysisId,
      ...analysisResult,
      stockSymbol: aiAnalysis.stockSymbol,
      chartDescription: aiAnalysis.chartDescription,
      aiConfidence: aiAnalysis.confidence,
      isFreeUser: isFree,
      freeAnalysesRemaining,
      detectedSignals: {
        bullish: analysisResult.activeBullishSignals.map((s) => ({
          name: s.name,
          points: s.points,
          explanation: s.explanation,
        })),
        bearish: analysisResult.activeBearishSignals.map((s) => ({
          name: s.name,
          points: Math.abs(s.points),
          explanation: s.explanation,
        })),
        noGo: analysisResult.activeNoGoConditions.map((c) => c.name),
      },
      disclaimer:
        'This analysis is for educational and informational purposes only. The recommendations are based on technical analysis patterns and historical probability, but do not guarantee future market performance. Markets are inherently unpredictable and volatile. This is NOT financial advice. Always conduct your own research, consider your risk tolerance, and consult with a licensed financial advisor before making any investment decisions. Trading stocks involves substantial risk of loss.',
    }

    return NextResponse.json(response)
  } catch (error) {
    logger.error('Error in analysis route', error, { userId: session?.user?.id })

    // Send email notification for critical errors
    await emailNotificationService.sendErrorNotification({
      error: error instanceof Error ? error.message : 'Unknown error in analysis route',
      context: 'Chart Analysis API',
      stackTrace: error instanceof Error ? error.stack : undefined,
      userId: session?.user?.id,
    })

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return ApiResponse.serverError(
          'OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.'
        )
      }

      if (error.message.includes('Invalid chart')) {
        return ApiResponse.badRequest(error.message)
      }

      if (error.message.includes('Invalid image')) {
        return ApiResponse.badRequest(error.message)
      }
    }

    return ApiResponse.serverError('Analysis failed. Please try again.')
  }
}
