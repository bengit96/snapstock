import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { chartAnalyses, userActivity, users } from '@/lib/db/schema'
import { analyzeChart } from '@/lib/trading/analysis'
import { analyzeChartWithAI } from '@/lib/openai'
import { discordService } from '@/lib/services/discord.service'
import { analyticsService } from '@/lib/services/analytics.service'
import { emailNotificationService } from '@/lib/services/email-notification.service'
import { eq } from 'drizzle-orm'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  let session: any = null

  try {
    session = await auth()

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user details
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = userResult[0]
    const isFreeUser = !user.subscriptionStatus || user.subscriptionStatus !== 'active'

    // Check free trial limits
    if (isFreeUser) {
      if ((user.freeAnalysesUsed || 0) >= (user.freeAnalysesLimit || 1)) {
        return NextResponse.json(
          {
            error: 'Free trial limit reached',
            message: 'You have used your free analysis. Please subscribe to continue and get unlimited analyses.',
            freeAnalysesUsed: user.freeAnalysesUsed,
            freeAnalysesLimit: user.freeAnalysesLimit,
          },
          { status: 402 }
        )
      }
    }

    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Upload image to Vercel Blob Storage
    let imageUrl: string
    try {
      const blob = await put(`charts/${session.user.id}/${Date.now()}-${imageFile.name}`, imageFile, {
        access: 'public',
      })
      imageUrl = blob.url
      console.log('Image uploaded to blob storage:', imageUrl)
    } catch (uploadError) {
      console.error('Failed to upload image to blob storage:', uploadError)
      // Fallback: proceed without storing the image
      imageUrl = 'upload-failed'
    }

    // Convert file to base64 for OpenAI
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Analyze chart with OpenAI GPT-4 Vision
    console.log('Analyzing chart with OpenAI...')
    const aiAnalysis = await analyzeChartWithAI(base64Image)

    // Check if it's a valid chart
    if (!aiAnalysis.isValidChart) {
      return NextResponse.json(
        {
          error: 'Invalid chart',
          message: 'The uploaded image does not appear to be a valid stock chart. Please upload a screenshot of a stock chart with visible price action, volume bars, and technical indicators.',
          confidence: aiAnalysis.confidence
        },
        { status: 400 }
      )
    }

    // Run trading strategy analysis on the detected signals
    const analysisResult = analyzeChart({
      activeSignalIds: aiAnalysis.activeSignals,
      activeNoGoIds: aiAnalysis.activeNoGoConditions,
      currentPrice: aiAnalysis.currentPrice,
      supportLevel: aiAnalysis.supportLevel,
      resistanceLevel: aiAnalysis.resistanceLevel,
    })

    // Save to database
    const [savedAnalysis] = await db
      .insert(chartAnalyses)
      .values({
        userId: session.user.id,
        imageUrl: imageUrl, // Store blob URL instead of base64
        stockSymbol: aiAnalysis.stockSymbol || 'UNKNOWN',
        isValidChart: true,
        grade: analysisResult.grade,
        gradeLabel: analysisResult.gradeLabel,
        gradeColor: analysisResult.gradeColor,
        totalScore: analysisResult.totalScore,
        shouldEnter: analysisResult.shouldEnter,
        entryPrice: analysisResult.entryPrice?.toString(),
        stopLoss: analysisResult.stopLoss?.toString(),
        takeProfit: analysisResult.takeProfit?.toString(),
        riskRewardRatio: analysisResult.riskRewardRatio?.toString(),
        activeBullishSignals: analysisResult.activeBullishSignals,
        activeBearishSignals: analysisResult.activeBearishSignals,
        activeNoGoConditions: analysisResult.activeNoGoConditions,
        confluenceCount: analysisResult.confluenceCount,
        confluenceCategories: analysisResult.confluenceCategories,
        analysisReason: analysisResult.reasons.join('. '),
      })
      .returning()

    // Log activity
    await db.insert(userActivity).values({
      userId: session.user.id,
      action: 'chart_analysis',
      metadata: {
        analysisId: savedAnalysis.id,
        stockSymbol: aiAnalysis.stockSymbol,
        grade: analysisResult.grade,
        confidence: aiAnalysis.confidence
      },
    })

    // Update free analyses count for free users
    if (isFreeUser) {
      await db
        .update(users)
        .set({
          freeAnalysesUsed: (user.freeAnalysesUsed || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id))
    }

    // Track analytics
    await analyticsService.trackAnalysis(
      session.user.id,
      {
        analysisId: savedAnalysis.id,
        stockSymbol: aiAnalysis.stockSymbol,
        grade: analysisResult.grade,
        isFree: isFreeUser,
      },
      request
    )

    // Send Discord notification
    await discordService.notifyAnalysis({
      userId: session.user.id,
      email: user.email,
      stockSymbol: aiAnalysis.stockSymbol,
      grade: analysisResult.grade,
      shouldEnter: analysisResult.shouldEnter,
      confidence: aiAnalysis.confidence,
      isFree: isFreeUser,
    })

    // Prepare response with enhanced information
    const response = {
      id: savedAnalysis.id,
      ...analysisResult,
      stockSymbol: aiAnalysis.stockSymbol,
      chartDescription: aiAnalysis.chartDescription,
      aiConfidence: aiAnalysis.confidence,
      isFreeUser,
      freeAnalysesRemaining: isFreeUser
        ? (user.freeAnalysesLimit || 1) - ((user.freeAnalysesUsed || 0) + 1)
        : undefined,
      detectedSignals: {
        bullish: analysisResult.activeBullishSignals.map(s => ({
          name: s.name,
          points: s.points
        })),
        bearish: analysisResult.activeBearishSignals.map(s => ({
          name: s.name,
          points: Math.abs(s.points)
        })),
        noGo: analysisResult.activeNoGoConditions.map(c => c.name)
      }
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error in analysis route:', error)

    // Send email notification for critical errors
    await emailNotificationService.sendErrorNotification({
      error: error.message || 'Unknown error in analysis route',
      context: 'Chart Analysis API',
      stackTrace: error.stack,
      userId: session?.user?.id,
    })

    // Check if it's an OpenAI API error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}