'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('🔒 AuthGuard: User not authenticated, redirecting to login')
      router.push(ROUTES.login)
    }
  }, [status, router])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (status === 'unauthenticated') {
    return null
  }

  // User is authenticated, show protected content
  return <>{children}</>
}
