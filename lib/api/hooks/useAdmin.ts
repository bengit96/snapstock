import { useQuery } from '@tanstack/react-query'
import apiClient from '../client'

type ApiSuccessResponse<T> = {
  success: true
  data: T
  message?: string
}

const extractResponseData = <T>(response: ApiSuccessResponse<T> | undefined): T => {
  if (!response || response.success !== true || !response.data) {
    throw new Error('Invalid response structure from server')
  }

  return response.data
}

interface User {
  id: string
  email: string
  name: string | null
  role: 'user' | 'admin'
  subscriptionStatus: string | null
  subscriptionTier: string | null
  subscriptionEndDate: string | null
  freeAnalysesUsed: number
  freeAnalysesLimit: number
  createdAt: string
  updatedAt: string
  totalAnalyses: number
}

interface AdminStats {
  totalUsers: number
  totalAdmins: number
  activeSubscriptions: number
  totalAnalyses: number
}

interface AdminData {
  users: User[]
  stats: AdminStats
}

interface DropoffSegment {
  id: string
  email: string
  name: string | null
  segment: string
  priority: number
  analysisCount: number
  isPaid: boolean
  subscriptionTier: string | null
  daysSinceSignup: number
  daysSinceLastActivity: number | null
  createdAt: string
}

interface RecentSignup {
  id: string
  email: string
  name: string | null
  createdAt: string
  analysisCount: number
  isPaid: boolean
  needsAttention: boolean
}

interface AnalyticsData {
  summary: {
    totalUsers: number
    paidUsers: number
    usersWithZeroGenerations: number
    usersWithOneGeneration: number
    freeUsersExhausted: number
    uniquePricingVisitors: number
    viewedPricingNoPurchase: number
    checkoutInitiated: number
    checkoutAbandoned: number
    activeUsers7Days: number
    activeUsers30Days: number
  }
  conversionRates: {
    signupToFirstGenRate: string
    firstGenToPaymentRate: string
    pricingToCheckoutRate: string
    checkoutToPaymentRate: string
    overallConversionRate: string
  }
  timing: {
    avgTimeToFirstGenHours: string
  }
  dropoffSegments: DropoffSegment[]
  recentSignups: RecentSignup[]
}

// Fetch admin users data
export const useAdminUsers = () => {
  return useQuery<AdminData>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await apiClient.get<ApiSuccessResponse<AdminData>>(
        '/api/admin/users'
      )

      return extractResponseData(response.data)
    },
  })
}

// Fetch admin analytics data
export const useAdminAnalytics = () => {
  return useQuery<AnalyticsData>({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      const response = await apiClient.get<ApiSuccessResponse<AnalyticsData>>(
        '/api/admin/analytics'
      )

      return extractResponseData(response.data)
    },
  })
}
