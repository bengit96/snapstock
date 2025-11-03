'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/login-form'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { APP_NAME, ROUTES } from '@/lib/constants'

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const callbackUrl = searchParams.get('callbackUrl') || ROUTES.home

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('🎯 Login page: User already authenticated, redirecting to:', callbackUrl)
      console.log('User data:', { email: session.user?.email, id: session.user?.id })

      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        router.push(callbackUrl)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [status, router, callbackUrl, session])

  // Debug session status
  useEffect(() => {
    console.log('Login page session status:', status)
    console.log('Login page session data:', session)
  }, [status, session])

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Already authenticated, don't show login form while redirecting
  if (status === 'authenticated' && session) {
    console.log('🔄 Login page: Already authenticated, showing redirect state')
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Redirecting to home...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
          <LoginForm redirectTo={callbackUrl} />

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
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </ErrorBoundary>
  )
}