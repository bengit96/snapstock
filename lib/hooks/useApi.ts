/**
 * React Query hooks for API calls
 * Provides centralized data fetching with loading and error states
 */

import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import {
  analysisService,
  stripeService,
  referralService,
  usageService,
} from '@/lib/services/api.service'
import type { DetailedAnalysisResult } from '@/lib/types'

// Query keys
export const queryKeys = {
  analysisHistory: ['analysis', 'history'] as const,
  analysisById: (id: string) => ['analysis', id] as const,
  referralStats: ['referrals', 'stats'] as const,
  usageStats: ['usage', 'stats'] as const,
}

/**
 * Hook to analyze chart
 */
export function useAnalyzeChart(
  options?: UseMutationOptions<DetailedAnalysisResult, Error, File>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => analysisService.analyzeChart(file),
    onSuccess: () => {
      // Invalidate and refetch history after successful analysis
      queryClient.invalidateQueries({ queryKey: queryKeys.analysisHistory })
      queryClient.invalidateQueries({ queryKey: queryKeys.usageStats })
    },
    ...options,
  })
}

/**
 * Hook to get analysis history
 */
export function useAnalysisHistory(
  options?: Omit<UseQueryOptions<DetailedAnalysisResult[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.analysisHistory,
    queryFn: () => analysisService.getHistory(),
    staleTime: 30000, // 30 seconds
    ...options,
  })
}

/**
 * Hook to get analysis by ID
 */
export function useAnalysisById(
  id: string,
  options?: Omit<UseQueryOptions<DetailedAnalysisResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.analysisById(id),
    queryFn: () => analysisService.getById(id),
    enabled: !!id,
    ...options,
  })
}

/**
 * Hook to create Stripe checkout
 */
export function useCreateCheckout(
  options?: UseMutationOptions<string, Error, 'monthly' | 'yearly' | 'lifetime'>
) {
  return useMutation({
    mutationFn: (tier: 'monthly' | 'yearly' | 'lifetime') =>
      stripeService.createCheckout(tier),
    ...options,
  })
}

/**
 * Hook to create Stripe portal session
 */
export function useCreatePortal(
  options?: UseMutationOptions<string, Error, void>
) {
  return useMutation({
    mutationFn: () => stripeService.createPortal(),
    ...options,
  })
}

/**
 * Hook to get referral stats
 */
export function useReferralStats(
  options?: Omit<UseQueryOptions<{
    code: string
    totalReferrals: number
    successfulReferrals: number
    pendingRewards: number
    claimedRewards: number
  }, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.referralStats,
    queryFn: () => referralService.getStats(),
    staleTime: 60000, // 1 minute
    ...options,
  })
}

/**
 * Hook to get usage stats
 */
export function useUsageStats(
  options?: Omit<UseQueryOptions<{
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
  }, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.usageStats,
    queryFn: () => usageService.getStats(),
    staleTime: 30000, // 30 seconds
    ...options,
  })
}
