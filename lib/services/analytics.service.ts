/**
 * Analytics Service
 * Tracks user events and page visits
 */

import { db } from '@/lib/db/client'
import { analyticsEvents } from '@/lib/db/schema'
import { NextRequest } from 'next/server'
import { discordService } from './discord.service'
import { eq, gte, and } from 'drizzle-orm'
import { logger } from '@/lib/utils/logger'

interface AnalyticsEventData {
  eventType: string
  userId?: string
  sessionId?: string
  metadata?: Record<string, unknown>
}

interface RequestInfo {
  ipAddress?: string
  userAgent?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

class AnalyticsService {
  /**
   * Extract request information from Next.js request
   */
  private extractRequestInfo(request: NextRequest): RequestInfo {
    const headers = request.headers
    const url = new URL(request.url)

    return {
      ipAddress: headers.get('x-forwarded-for') || headers.get('x-real-ip') || undefined,
      userAgent: headers.get('user-agent') || undefined,
      referrer: headers.get('referer') || headers.get('referrer') || undefined,
      utmSource: url.searchParams.get('utm_source') || undefined,
      utmMedium: url.searchParams.get('utm_medium') || undefined,
      utmCampaign: url.searchParams.get('utm_campaign') || undefined,
    }
  }

  /**
   * Track an analytics event
   */
  async trackEvent(
    data: AnalyticsEventData,
    request?: NextRequest
  ): Promise<void> {
    try {
      const requestInfo = request ? this.extractRequestInfo(request) : {}

      await db.insert(analyticsEvents).values({
        eventType: data.eventType,
        userId: data.userId,
        sessionId: data.sessionId,
        metadata: data.metadata,
        ...requestInfo,
      })
    } catch (error) {
      logger.error('Failed to track analytics event', error)
      // Don't throw - analytics failures shouldn't break the app
    }
  }

  /**
   * Track landing page visit
   */
  async trackLandingPageVisit(
    request: NextRequest,
    userId?: string
  ): Promise<void> {
    const requestInfo = this.extractRequestInfo(request)

    await this.trackEvent(
      {
        eventType: 'landing_page_visit',
        userId,
        sessionId: this.getSessionId(request),
      },
      request
    )

    // Send Discord notification for landing page visits
    await discordService.notifyLandingPageVisit({
      ipAddress: requestInfo.ipAddress,
      referrer: requestInfo.referrer,
      utmSource: requestInfo.utmSource,
      utmMedium: requestInfo.utmMedium,
      utmCampaign: requestInfo.utmCampaign,
    })
  }

  /**
   * Track pricing page visit
   */
  async trackPricingPageVisit(
    request: NextRequest,
    userId?: string
  ): Promise<void> {
    await this.trackEvent(
      {
        eventType: 'pricing_page_visit',
        userId,
        sessionId: this.getSessionId(request),
      },
      request
    )
  }

  /**
   * Track payment page visit
   */
  async trackPaymentPageVisit(
    request: NextRequest,
    userId?: string,
    tier?: string
  ): Promise<void> {
    await this.trackEvent(
      {
        eventType: 'payment_page_visit',
        userId,
        sessionId: this.getSessionId(request),
        metadata: { tier },
      },
      request
    )
  }

  /**
   * Track signup
   */
  async trackSignup(
    userId: string,
    email: string,
    referralCode?: string,
    request?: NextRequest
  ): Promise<void> {
    await this.trackEvent(
      {
        eventType: 'signup',
        userId,
        metadata: { email, referralCode },
      },
      request
    )
  }

  /**
   * Track conversion (signup → paid)
   */
  async trackConversion(
    userId: string,
    tier: string,
    amount: number,
    request?: NextRequest
  ): Promise<void> {
    await this.trackEvent(
      {
        eventType: 'conversion',
        userId,
        metadata: { tier, amount },
      },
      request
    )
  }

  /**
   * Track chart analysis
   */
  async trackAnalysis(
    userId: string,
    metadata: {
      analysisId: string
      stockSymbol?: string
      grade: string
      isFree?: boolean
    },
    request?: NextRequest
  ): Promise<void> {
    await this.trackEvent(
      {
        eventType: 'chart_analysis',
        userId,
        metadata,
      },
      request
    )
  }

  /**
   * Track referral usage
   */
  async trackReferralUsage(
    referralCode: string,
    newUserId: string,
    request?: NextRequest
  ): Promise<void> {
    await this.trackEvent(
      {
        eventType: 'referral_used',
        userId: newUserId,
        metadata: { referralCode },
      },
      request
    )
  }

  /**
   * Get or create session ID from request
   */
  private getSessionId(request: NextRequest): string {
    // Try to get from cookie, or create a new one
    const sessionCookie = request.cookies.get('analytics_session')
    if (sessionCookie) {
      return sessionCookie.value
    }

    // Generate new session ID
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get analytics summary
   */
  async getSummary(days: number = 7): Promise<{
    totalVisits: number
    totalSignups: number
    totalConversions: number
    conversionRate: number
  }> {
    try {
      const since = new Date()
      since.setDate(since.getDate() - days)

      // Count landing page visits
      const visitsResult = await db
        .select()
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'landing_page_visit'),
            gte(analyticsEvents.createdAt, since)
          )
        )

      // Count signups
      const signupsResult = await db
        .select()
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'signup'),
            gte(analyticsEvents.createdAt, since)
          )
        )

      // Count conversions
      const conversionsResult = await db
        .select()
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'conversion'),
            gte(analyticsEvents.createdAt, since)
          )
        )

      const totalVisits = visitsResult.length
      const totalSignups = signupsResult.length
      const totalConversions = conversionsResult.length
      const conversionRate =
        totalSignups > 0 ? (totalConversions / totalSignups) * 100 : 0

      return {
        totalVisits,
        totalSignups,
        totalConversions,
        conversionRate,
      }
    } catch (error) {
      logger.error('Failed to get analytics summary', error)
      return {
        totalVisits: 0,
        totalSignups: 0,
        totalConversions: 0,
        conversionRate: 0,
      }
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService()
