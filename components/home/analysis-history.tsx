'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Download,
  FileImage
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Analysis {
  id: string
  stockSymbol: string | null
  grade: string | null
  gradeColor: string | null
  gradeLabel: string | null
  shouldEnter: boolean | null
  entryPrice: string | null
  stopLoss: string | null
  takeProfit: string | null
  riskRewardRatio: string | null
  createdAt: string
  imageUrl: string
}

interface AnalysisHistoryProps {
  userId: string
}

export function AnalysisHistory({ userId }: AnalysisHistoryProps) {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'grade'>('date')

  useEffect(() => {
    fetchAnalyses()
  }, [userId])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/analyses/history')
      const data = await response.json()
      setAnalyses(data.analyses || [])
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalysisClick = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`)
  }

  // Filter and sort analyses
  const filteredAnalyses = analyses
    .filter((analysis) => {
      if (!searchQuery) return true
      return analysis.stockSymbol?.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === 'grade' && a.grade && b.grade) {
        const gradeOrder = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
        return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade)
      }
      return 0
    })

  const getGradeStyles = (grade: string | null, gradeColor: string | null) => {
    if (!grade || !gradeColor) return 'bg-gray-100 text-gray-600'

    const colorMap: Record<string, string> = {
      'text-green-500': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'text-emerald-500': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'text-yellow-500': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'text-orange-500': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'text-red-500': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }

    return colorMap[gradeColor] || 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analysis History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'} performed
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'grade')}
            className="h-11 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="grade">Sort by Grade</option>
          </select>
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredAnalyses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
            <FileImage className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No analyses found' : 'No analyses yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'Upload your first chart to get started'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            Analyze Your First Chart
          </motion.button>
        </motion.div>
      ) : (
        /* Analysis Cards Grid */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredAnalyses.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => handleAnalysisClick(analysis.id)}
                className="cursor-pointer"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                  {/* Image Preview */}
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-900">
                    <img
                      src={analysis.imageUrl}
                      alt={`Chart for ${analysis.stockSymbol || 'Unknown'}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Grade Badge */}
                    {analysis.grade && (
                      <div className="absolute top-3 right-3">
                        <div className={cn(
                          "px-3 py-1.5 rounded-full font-bold text-sm",
                          getGradeStyles(analysis.grade, analysis.gradeColor)
                        )}>
                          {analysis.grade}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {analysis.stockSymbol || 'Unknown Symbol'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {analysis.gradeLabel || 'No grade'}
                        </p>
                      </div>
                      {analysis.shouldEnter !== null && (
                        <div className={cn(
                          "p-2 rounded-lg",
                          analysis.shouldEnter
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        )}>
                          {analysis.shouldEnter ? (
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Trade Details */}
                    {analysis.entryPrice && (
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Entry:</span>
                          <span className="ml-1 font-medium text-gray-900 dark:text-white">
                            ${parseFloat(analysis.entryPrice).toFixed(2)}
                          </span>
                        </div>
                        {analysis.riskRewardRatio && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">R:R:</span>
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">
                              {parseFloat(analysis.riskRewardRatio).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Date and Action */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(analysis.createdAt), 'MMM d, yyyy')}
                        <Clock className="w-3 h-3 ml-2" />
                        {format(new Date(analysis.createdAt), 'HH:mm')}
                      </div>
                      <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Export Button */}
      {analyses.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            <Download className="w-4 h-4" />
            Export History
          </button>
        </motion.div>
      )}
    </div>
  )
}