'use client'

import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useChartAnalysis } from '@/lib/hooks/useChartAnalysis'
import { Header } from '@/components/layout/header'
import { ChartUpload } from '@/components/charts/chart-upload'
import { AnalysisResults } from '@/components/charts/analysis-results'
import { RecentAnalyses } from '@/components/dashboard/recent-analyses'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { ROUTES } from '@/lib/constants'
import { motion } from 'framer-motion'

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const {
    uploadedImage,
    analysisResult,
    isAnalyzing,
    error,
    analyzeChart,
    reset
  } = useChartAnalysis({
    onError: (error) => {
      console.error('Analysis error:', error)
    }
  })

  const handleDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      analyzeChart(files[0])
    }
  }, [analyzeChart])

  // Handle loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    )
  }

  // Handle authentication
  if (!session) {
    router.push(ROUTES.login)
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={session.user as any} />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <ChartUpload
              onDrop={handleDrop}
              uploadedImage={uploadedImage}
              isUploading={isAnalyzing}
              error={error}
              onErrorDismiss={reset}
            />
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AnalysisResults result={analysisResult} />
          </motion.div>
        </motion.div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <RecentAnalyses className="mt-8" />
        </motion.div>
      </main>
    </div>
  )
}

/**
 * Dashboard page with error boundary
 */
export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  )
}