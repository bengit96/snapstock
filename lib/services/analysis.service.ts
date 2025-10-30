/**
 * Analysis Service
 * Handles chart analysis business logic
 */

import { db } from '@/lib/db'
import { chartAnalyses, users, userActivity } from '@/lib/db/schema'
import { eq, and, gte } from 'drizzle-orm'
import { put } from '@vercel/blob'
import { analyzeChart } from '@/lib/trading/analysis'
import { analyzeChartWithAI } from '@/lib/openai'
import { validateImageFile, generateSecureFilename } from '@/lib/utils/file-validation'
import { SUBSCRIPTION_LIMITS } from '@/lib/constants'
import { logger } from '@/lib/utils/logger'
import type { Session } from 'next-auth'

interface AnalysisRequest {
  userId: string
  imageFile: File
  session: Session
}

interface AnalysisLimitsResult {
  allowed: boolean
  reason?: string
  freeAnalysesRemaining?: number
  monthlyUsed?: number
  monthlyLimit?: number
}

export class AnalysisService {
  /**
   * Check if user can perform analysis
   */
  async checkAnalysisLimits(userId: string, isAdmin: boolean, isFreeUser: boolean): Promise<AnalysisLimitsResult> {
    if (isAdmin) {
      return { allowed: true }
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (userResult.length === 0) {
      return { allowed: false, reason: 'User not found' }
    }

    const user = userResult[0]

    // Check free trial limits
    if (isFreeUser) {
      const freeAnalysesUsed = user.freeAnalysesUsed || 0
      const freeAnalysesLimit = user.freeAnalysesLimit || 1

      if (freeAnalysesUsed >= freeAnalysesLimit) {
        return {
          allowed: false,
          reason: 'Free trial limit reached',
          freeAnalysesRemaining: 0,
        }
      }

      return {
        allowed: true,
        freeAnalysesRemaining: freeAnalysesLimit - freeAnalysesUsed,
      }
    }

    // Check monthly limits for paid users
    const tier = user.subscriptionTier as 'monthly' | 'yearly' | 'lifetime'
    const monthlyLimit = SUBSCRIPTION_LIMITS[tier]?.monthlyAnalyses

    // Only check if there's a limit (null = unlimited for lifetime)
    if (monthlyLimit !== null && monthlyLimit !== undefined) {
      const monthStart = new Date()
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)

      const thisMonthAnalyses = await db
        .select()
        .from(chartAnalyses)
        .where(
          and(
            eq(chartAnalyses.userId, userId),
            gte(chartAnalyses.createdAt, monthStart)
          )
        )

      if (thisMonthAnalyses.length >= monthlyLimit) {
        return {
          allowed: false,
          reason: 'Monthly limit reached',
          monthlyUsed: thisMonthAnalyses.length,
          monthlyLimit,
        }
      }

      return {
        allowed: true,
        monthlyUsed: thisMonthAnalyses.length,
        monthlyLimit,
      }
    }

    // Unlimited (lifetime tier)
    return { allowed: true }
  }

  /**
   * Upload image to blob storage
   */
  async uploadImage(file: File, userId: string): Promise<string> {
    const secureFilename = generateSecureFilename(userId, file.name)
    const blob = await put(secureFilename, file, {
      access: 'public',
    })
    return blob.url
  }

  /**
   * Process chart analysis
   */
  async processAnalysis(request: AnalysisRequest): Promise<{
    analysisId: string
    result: ReturnType<typeof analyzeChart>
    aiAnalysis: Awaited<ReturnType<typeof analyzeChartWithAI>>
    isFreeUser: boolean
    freeAnalysesRemaining?: number
  }> {
    const { userId, imageFile, session } = request

    // Get user details
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (userResult.length === 0) {
      throw new Error('User not found')
    }

    const user = userResult[0]
    const isFreeUser = !user.subscriptionStatus || user.subscriptionStatus !== 'active'

    // Validate image
    const validationResult = await validateImageFile(imageFile)
    if (!validationResult.valid) {
      throw new Error(validationResult.error || 'Invalid image file')
    }

    // Upload image
    logger.info('Uploading chart image', { userId })
    let imageUrl: string
    try {
      imageUrl = await this.uploadImage(imageFile, userId)
      logger.info('Image uploaded to blob storage', { userId, imageUrl })
    } catch (uploadError) {
      logger.error('Failed to upload image to blob storage', uploadError, { userId })
      throw new Error('Failed to upload image. Please try again.')
    }

    // Convert to base64 for OpenAI
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Analyze with AI
    logger.info('Analyzing chart with OpenAI', { userId })
    const aiAnalysis = await analyzeChartWithAI(base64Image)

    if (!aiAnalysis.isValidChart) {
      throw new Error(
        'The uploaded image does not appear to be a valid stock chart. Please upload a screenshot of a stock chart with visible price action, volume bars, and technical indicators.'
      )
    }

    // Run trading strategy analysis
    const analysisResult = analyzeChart({
      activeSignalIds: aiAnalysis.activeSignals || [],
      activeNoGoIds: aiAnalysis.activeNoGoConditions || [],
      currentPrice: aiAnalysis.currentPrice,
      supportLevel: aiAnalysis.supportLevel,
      resistanceLevel: aiAnalysis.resistanceLevel,
    })

    // Save to database
    const [savedAnalysis] = await db
      .insert(chartAnalyses)
      .values({
        userId,
        imageUrl,
        stockSymbol: aiAnalysis.stockSymbol || undefined,
        isValidChart: true,
        grade: analysisResult.grade,
        gradeLabel: analysisResult.gradeLabel,
        gradeColor: analysisResult.gradeColor,
        totalScore: analysisResult.totalScore ? Math.round(analysisResult.totalScore) : null,
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
      userId,
      action: 'chart_analysis',
      metadata: {
        analysisId: savedAnalysis.id,
        stockSymbol: aiAnalysis.stockSymbol,
        grade: analysisResult.grade,
        confidence: aiAnalysis.confidence,
      },
    })

    // Update free analyses count
    if (isFreeUser) {
      await db
        .update(users)
        .set({
          freeAnalysesUsed: (user.freeAnalysesUsed || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
    }

    const freeAnalysesRemaining = isFreeUser
      ? (user.freeAnalysesLimit || 1) - ((user.freeAnalysesUsed || 0) + 1)
      : undefined

    return {
      analysisId: savedAnalysis.id,
      result: analysisResult,
      aiAnalysis,
      isFreeUser,
      freeAnalysesRemaining,
      user,
    }
  }
}

export const analysisService = new AnalysisService()

