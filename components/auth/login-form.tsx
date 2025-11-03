'use client'

import { useState } from 'react'
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

interface LoginFormProps {
  redirectTo?: string
  onSuccess?: () => void
}

export function LoginForm({ redirectTo, onSuccess }: LoginFormProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const { sendOTP, verifyOTP, isLoading, error, clearError } = useAuth({
    redirectTo,
    onSuccess
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

  return (
    <AnimatePresence mode="wait">
      {step === 'email' ? (
        <motion.form
          key="email-step"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSendOTP}
          className="space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
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

          {/* Terms and Conditions Checkbox */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex items-start space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              required
            />
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

          {error && <ErrorMessage message={error} onDismiss={clearError} />}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
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
        </motion.form>
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