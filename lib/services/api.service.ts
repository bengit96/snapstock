import { API_ROUTES } from '@/lib/constants'
import apiClient from '@/lib/api/client'
import type { ApiResponse, ChartUploadResponse, DetailedAnalysisResult } from '@/lib/types'

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Send OTP to email
   */
  async sendOTP(email: string): Promise<void> {
    await apiClient.post(API_ROUTES.auth.sendOTP, { email })
  }
}

/**
 * Analysis Service
 */
class AnalysisService {
  /**
   * Analyze uploaded chart
   */
  async analyzeChart(file: File): Promise<DetailedAnalysisResult> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await apiClient.post<DetailedAnalysisResult>(
      API_ROUTES.analysis,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  }

  /**
   * Get analysis history
   */
  async getHistory(): Promise<DetailedAnalysisResult[]> {
    const response = await apiClient.get<{ data: DetailedAnalysisResult[] }>(
      `${API_ROUTES.analysis}/history`
    )
    return response.data.data || []
  }

  /**
   * Get analysis by ID
   */
  async getById(id: string): Promise<DetailedAnalysisResult> {
    const response = await apiClient.get<DetailedAnalysisResult>(
      `${API_ROUTES.analysis}/${id}`
    )
    return response.data
  }
}

/**
 * Stripe Service
 */
class StripeService {
  /**
   * Create checkout session
   */
  async createCheckout(tier: 'monthly' | 'yearly' | 'lifetime'): Promise<string> {
    const response = await apiClient.post<{ url: string }>(
      API_ROUTES.stripe.checkout,
      { tier }
    )
    return response.data.url
  }

  /**
   * Create customer portal session
   */
  async createPortal(): Promise<string> {
    const response = await apiClient.post<{ url: string }>(
      API_ROUTES.stripe.portal
    )
    return response.data.url
  }
}

/**
 * Referral Service
 */
class ReferralService {
  /**
   * Get referral stats
   */
  async getStats(): Promise<{
    code: string
    totalReferrals: number
    successfulReferrals: number
    pendingRewards: number
    claimedRewards: number
  }> {
    const response = await apiClient.get('/api/referrals/stats')
    return response.data
  }
}

/**
 * Usage Service
 */
class UsageService {
  /**
   * Get usage stats
   */
  async getStats(): Promise<{
    totalAnalyses: number
    thisMonth: number
    thisWeek: number
    recentAnalyses: Array<{
      id: string
      stockSymbol?: string
      grade: string
      createdAt: string
    }>
    freeAnalysesUsed?: number
    freeAnalysesLimit?: number
  }> {
    const response = await apiClient.get('/api/usage/stats')
    return response.data
  }
}

/**
 * Analytics Service
 */
class AnalyticsTrackingService {
  /**
   * Track event
   */
  async trackEvent(eventType: string, metadata?: Record<string, any>): Promise<void> {
    await apiClient.post('/api/analytics/track', {
      eventType,
      metadata,
    })
  }
}

// Export service instances
export const authService = new AuthService()
export const analysisService = new AnalysisService()
export const stripeService = new StripeService()
export const referralService = new ReferralService()
export const usageService = new UsageService()
export const analyticsTrackingService = new AnalyticsTrackingService()
