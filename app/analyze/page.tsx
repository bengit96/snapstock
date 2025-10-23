'use client'

import { useState, useCallback, useEffect } from 'react'
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
  const { status } = useSession()
  const router = useRouter()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(ROUTES.dashboard)
    }
  }, [status, router])

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
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-6">
                <span className="text-2xl">⚡</span>
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  AI-Powered Analysis in Seconds
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Analyze Your Chart with AI
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Upload a stock chart and get instant momentum trading insights with GPT-4 Vision
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
              className="mt-16 max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 shadow-xl border border-purple-100 dark:border-purple-900/50">
                <h2 className="text-3xl font-bold mb-2 text-center">
                  What You&apos;ll Get
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                  Comprehensive AI-powered analysis in seconds
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-8">
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-transform group-hover:scale-110">
                      <span className="text-white font-bold text-2xl">A-F</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Trade Grade</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clear rating from A+ to F based on 40+ technical signals and confluence
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-transform group-hover:scale-110">
                      <span className="text-white font-bold text-2xl">📍</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Entry & Exit Points</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Precise entry price, stop loss, and profit targets with risk/reward ratios
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-transform group-hover:scale-110">
                      <span className="text-white font-bold text-2xl">⚡</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Instant Results</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      GPT-4 Vision analyzes your chart in under 5 seconds with detailed reasoning
                    </p>
                  </div>
                </div>

                {/* Additional Benefits */}
                <div className="mt-8 pt-8 border-t border-purple-200 dark:border-purple-800">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">40+ Technical Signals</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">MACD, RSI, Volume, Patterns & More</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">No-Go Conditions</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Identifies red flags to avoid bad trades</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Confluence Scoring</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Multiple signals aligning for high probability</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">AI Reasoning</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Understand exactly why you should or shouldn&apos;t trade</p>
                      </div>
                    </div>
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
