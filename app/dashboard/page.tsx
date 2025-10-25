'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AuthenticatedHeader } from '@/components/layout/authenticated-header'
import { Footer } from '@/components/layout/footer'
import { AnalyzeUpload } from '@/components/analyze/analyze-upload'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  const handleImageUpload = async (image: string) => {
    setUploadedImage(image)
    setError(null)
    setAnalyzing(true)

    try {
      // Check if user has available analyses
      const usageResponse = await fetch('/api/billing/usage')
      const usageData = await usageResponse.json()

      if (usageData.analysesLimit !== null && usageData.analysesUsed >= usageData.analysesLimit) {
        setError('You have reached your analysis limit. Please upgrade your plan to continue.')
        setAnalyzing(false)
        return
      }

      // Convert base64 to blob
      const base64Response = await fetch(image)
      const blob = await base64Response.blob()

      // Create FormData with the image file
      const formData = new FormData()
      formData.append('image', blob, 'chart.png')

      // Create analysis
      const response = await fetch('/api/analysis', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      // Redirect to analysis result page
      router.push(`/analysis/${data.id}`)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze chart')
      setAnalyzing(false)
    }
  }

  const handleImageClear = () => {
    setUploadedImage(null)
    setError(null)
    setAnalyzing(false)
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <AuthenticatedHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <AuthenticatedHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        {analyzing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Analyzing Your Chart
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI is examining your chart for patterns and signals...
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="w-full">
            <AnalyzeUpload
              onImageUpload={handleImageUpload}
              onImageClear={handleImageClear}
              uploadedImage={uploadedImage}
              showLogin={false}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto mt-4"
              >
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
                  {error}
                  {error.includes('limit') && (
                    <button
                      onClick={() => router.push('/billing')}
                      className="block w-full mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Upgrade Plan
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}