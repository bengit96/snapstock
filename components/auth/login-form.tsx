'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorMessage } from '@/components/ui/error-message'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Mail } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signIn } from 'next-auth/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface LoginFormProps {
  redirectTo?: string
  onSuccess?: () => void
  showTooltip?: boolean
}

export function LoginForm({ redirectTo, onSuccess, showTooltip = false }: LoginFormProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const { update } = useSession()

  // Show tooltip when modal opens, hide after 5 seconds or when user interacts
  useEffect(() => {
    if (showTooltip && !acceptedTerms) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        setTooltipOpen(true)
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setTooltipOpen(false)
        }, 5000)
      }, 300)
      
      return () => clearTimeout(timer)
    } else {
      setTooltipOpen(false)
    }
  }, [showTooltip, acceptedTerms])

  // Hide tooltip when user checks the checkbox
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked)
    if (e.target.checked) {
      setTooltipOpen(false)
    }
  }

  const { sendOTP, verifyOTP, isLoading, error, clearError } = useAuth({
    redirectTo,
    onSuccess: async () => {
      console.log('🎯 LoginForm onSuccess: Starting session refresh...')
      try {
        await update()
        console.log('✅ Session refreshed successfully')
        onSuccess?.()
      } catch (error) {
        console.error('❌ Session refresh failed:', error)
        // Still call onSuccess even if refresh fails
        onSuccess?.()
      }
    }
  })

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await sendOTP(email)
    if (success) {
      setStep('otp')
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    await verifyOTP(email, otp)
  }

  const handleReset = () => {
    setStep('email')
    setOtp('')
    clearError()
  }

  const handleGoogleSignIn = async () => {
    if (!acceptedTerms) {
      return
    }

    setGoogleLoading(true)
    try {
      await signIn('google', {
        callbackUrl: redirectTo || '/',
        redirect: true
      })
    } catch (error) {
      console.error('Google sign-in error:', error)
      setGoogleLoading(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'email' ? (
        <motion.div
          key="email-step"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Terms and Conditions Checkbox */}
          <TooltipProvider>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex items-start space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptedTerms}
                      onChange={handleTermsChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      required
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-sm">
                    You must accept the terms and conditions to enable Google sign-in
                  </p>
                </TooltipContent>
              </Tooltip>
              <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300">
                I have read and agree to the{' '}
                <Link
                  href={ROUTES.terms}
                  target="_blank"
                  className="text-purple-600 hover:text-purple-700 underline font-medium"
                >
                  Terms of Service
                </Link>
                ,{' '}
                <Link
                  href={ROUTES.privacy}
                  target="_blank"
                  className="text-purple-600 hover:text-purple-700 underline font-medium"
                >
                  Privacy Policy
                </Link>
                , and{' '}
                <Link
                  href="/disclaimer"
                  target="_blank"
                  className="text-purple-600 hover:text-purple-700 underline font-medium"
                >
                  Risk Disclaimer
                </Link>
                . I understand that trading involves substantial risk of loss.
              </label>
            </motion.div>
          </TooltipProvider>

          {/* Google Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || !acceptedTerms}
            >
              {googleLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or continue with email
              </span>
            </div>
          </motion.div>

          {/* Email Form */}
          <form onSubmit={handleSendOTP} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </motion.div>

            {error && <ErrorMessage message={error} onDismiss={clearError} />}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !acceptedTerms}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                {isLoading ? 'Sending...' : 'Send verification code'}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      ) : (
        <motion.form
          key="otp-step"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleVerifyOTP}
          className="space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="otp">Verification code</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We've sent a code to {email}. Check your spam/junk folder if you don't see it.
            </p>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              maxLength={6}
              required
              disabled={isLoading}
              className="text-center text-2xl tracking-widest"
            />
          </motion.div>

          {error && <ErrorMessage message={error} onDismiss={clearError} />}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {isLoading ? 'Verifying...' : 'Verify & Sign in'}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleReset}
              disabled={isLoading}
            >
              Use different email
            </Button>
          </motion.div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}