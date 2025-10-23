'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnalysisHistory } from '@/lib/hooks/useApi'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { getGradeBadgeClass } from '@/lib/utils/grade.utils'
import type { DetailedAnalysisResult } from '@/lib/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface RecentAnalysesProps {
  className?: string
}

export function RecentAnalyses({ className }: RecentAnalysesProps) {
  const { data, isLoading, error } = useAnalysisHistory({
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Analyses</CardTitle>
        <CardDescription>
          Your recent chart analyses and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner message="Loading recent analyses..." />
        ) : error ? (
          <ErrorMessage message="Failed to load recent analyses" />
        ) : data && data.length > 0 ? (
          <AnalysesList analyses={data} />
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Analyses list component
 */
function AnalysesList({ analyses }: { analyses: DetailedAnalysisResult[] }) {
  return (
    <div className="space-y-3">
      {analyses.map((analysis, index) => (
        <AnalysisItem key={analysis.id} analysis={analysis} index={index} />
      ))}
    </div>
  )
}

/**
 * Analysis item component
 */
function AnalysisItem({ analysis, index }: { analysis: DetailedAnalysisResult; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 + 0.1, duration: 0.3, type: 'spring' }}
          className={cn(
            'px-3 py-1 rounded text-white font-bold text-sm',
            getGradeBadgeClass(analysis.grade)
          )}
        >
          {analysis.grade}
        </motion.div>
        <div>
          <p className="font-medium">
            {analysis.stockSymbol || 'Unknown Symbol'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Score: {analysis.totalScore} points
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn(
          'text-sm font-medium',
          analysis.shouldEnter ? 'text-green-600' : 'text-red-600'
        )}>
          {analysis.shouldEnter ? 'ENTER' : 'SKIP'}
        </p>
        {analysis.aiConfidence && (
          <p className="text-xs text-gray-500">
            Confidence: {analysis.aiConfidence}%
          </p>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>Your recent analyses will appear here</p>
      <p className="text-sm mt-2">All analyses are saved automatically</p>
    </div>
  )
}