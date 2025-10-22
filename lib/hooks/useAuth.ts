import { useState, useCallback } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/api.service'
import { ERROR_MESSAGES, SUCCESS_MESSAGES, ROUTES } from '@/lib/constants'

interface UseAuthOptions {
  redirectTo?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

/**
 * Custom hook for authentication
 */
export function useAuth(options?: UseAuthOptions) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Send OTP to email
   */
  const sendOTP = useCallback(
    async (email: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await authService.sendOTP(email)
        return true
      } catch (err: any) {
        const message = err.message || ERROR_MESSAGES.generic
        setError(message)
        options?.onError?.(message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [options]
  )

  /**
   * Verify OTP and sign in
   */
  const verifyOTP = useCallback(
    async (email: string, code: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await signIn('credentials', {
          email,
          code,
          redirect: false,
        })

        if (result?.error) {
          throw new Error(result.error)
        }

        options?.onSuccess?.()

        if (options?.redirectTo) {
          router.push(options.redirectTo)
        } else {
          router.push(ROUTES.dashboard)
        }

        return true
      } catch (err: any) {
        const message = err.message || ERROR_MESSAGES.otpInvalid
        setError(message)
        options?.onError?.(message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [router, options]
  )

  /**
   * Sign out
   */
  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      await signOut({
        callbackUrl: ROUTES.home,
        redirect: true
      })
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Check if user has active subscription
   */
  const hasActiveSubscription = useCallback(() => {
    return session?.user?.subscriptionStatus === 'active'
  }, [session])

  /**
   * Get subscription tier
   */
  const getSubscriptionTier = useCallback(() => {
    return session?.user?.subscriptionTier || null
  }, [session])

  return {
    // Session data
    user: session?.user || null,
    isAuthenticated: !!session,
    isLoading: status === 'loading' || isLoading,
    error,

    // Subscription status
    hasActiveSubscription: hasActiveSubscription(),
    subscriptionTier: getSubscriptionTier(),

    // Actions
    sendOTP,
    verifyOTP,
    logout,
    clearError: () => setError(null),
  }
}