'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function useGetStarted() {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isLandingPage = pathname === '/' || pathname === ''

  const handleGetStarted = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()

    // If authenticated, redirect to protected analyze page
    if (status === 'authenticated') {
      router.push('/dashboard/analyze')
      return
    }

    // If not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    // If loading, do nothing (wait for status to resolve)
  }, [status, router])

  return {
    handleGetStarted,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading'
  }
}
