'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { ChartUpload } from '@/components/charts/chart-upload'
import { AnalysisResults } from '@/components/charts/analysis-results'
import { LoginModal } from '@/components/modals/login-modal'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ROUTES } from '@/lib/constants'
import { motion } from 'framer-motion'

export default function AnalyzePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // If user is already logged in, redirect to dashboard
  if (status === 'authenticated') {
    router.push(ROUTES.dashboard)
    return null
  }

  const handleDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      // Convert file to data URL for preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        // Show login modal after image is uploaded
        setShowLoginModal(true)
      }
      reader.readAsDataURL(files[0])
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navigation />

        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-4">
                Analyze Your Chart with AI
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Upload a stock chart and get instant momentum trading insights in under 5 seconds
              </p>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <ChartUpload
                  onDrop={handleDrop}
                  uploadedImage={uploadedImage}
                  isUploading={false}
                  error={null}
                  onErrorDismiss={() => {}}
                />
              </motion.div>

              {/* Analysis Results Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <AnalysisResults result={null} />
              </motion.div>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  What You'll Get
                </h2>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">A-F</span>
                    </div>
                    <h3 className="font-semibold mb-2">Trade Grade</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clear rating from A+ to F based on 40+ signals
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">📍</span>
                    </div>
                    <h3 className="font-semibold mb-2">Entry & Exit</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Precise entry, stop loss, and profit targets
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">⚡</span>
                    </div>
                    <h3 className="font-semibold mb-2">Instant Analysis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Results in under 5 seconds with AI
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
