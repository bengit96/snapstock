'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { LoginModal } from '@/components/modals/login-modal'
import { PageLoading } from '@/components/ui/page-loading'
import { AnalyzeUpload } from '@/components/analyze/analyze-upload'
import { ROUTES } from '@/lib/constants'

export default function AnalyzePage() {
  const { status } = useSession()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(ROUTES.dashboard)
    }
  }, [status, router])

  const handleImageUpload = (image: string) => {
    // When non-authenticated user uploads, show login modal
    setShowLoginModal(true)
  }

  if (status === 'loading') {
    return <PageLoading />
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <Navigation />

        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <AnalyzeUpload
            onImageUpload={handleImageUpload}
            showLogin={true}
          />
        </main>

        <Footer />
      </div>

      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
      />
    </>
  )
}