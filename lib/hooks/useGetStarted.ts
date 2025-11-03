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

    // If on landing page, scroll to upload section
    if (isLandingPage) {
      const uploadSection = document.getElementById('upload-chart')
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } else {
      // If on other page, redirect to landing page with hash
      router.push('/#upload-chart')
    }
  }, [status, isLandingPage, router])

  return {
    handleGetStarted,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading'
  }
}
