'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/login-form'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { APP_NAME, ROUTES } from '@/lib/constants'

function LoginContent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Link
            href={ROUTES.landing}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <CardTitle className="text-2xl font-bold">
            Sign in to {APP_NAME}
          </CardTitle>
          <CardDescription>
            Enter your email to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo={ROUTES.home} />

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            By signing in, you agree to our{' '}
            <Link href={ROUTES.terms} className="underline hover:text-gray-900 dark:hover:text-gray-100">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href={ROUTES.privacy} className="underline hover:text-gray-900 dark:hover:text-gray-100">
              Privacy Policy
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <ErrorBoundary>
      <LoginContent />
    </ErrorBoundary>
  )
}