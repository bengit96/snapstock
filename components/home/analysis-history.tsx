'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Filter,
  FileImage,
  Plus,
  Sparkles,
  Grid3x3,
  List,
  SortDesc,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAnalyses } from '@/lib/api/hooks/useAnalysis'
import { Button } from '@/components/ui/button'

interface AnalysisHistoryProps {}

export function AnalysisHistory({}: AnalysisHistoryProps = {}) {
  const router = useRouter()
  const { data: analyses = [], isLoading } = useAnalyses()
  const [sortBy, setSortBy] = useState<'date' | 'newest' | 'oldest'>('newest')
  const [gradeFilter, setGradeFilter] = useState<'all' | 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const handleAnalysisClick = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`)
  }

  // Filter by grade
  const filteredAnalyses = gradeFilter === 'all'
    ? analyses
    : analyses.filter(analysis => analysis.grade === gradeFilter)

  // Sort analyses
  const sortedAnalyses = [...filteredAnalyses].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return 0
  })

  // Paginate
  const totalPages = Math.ceil(sortedAnalyses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAnalyses = sortedAnalyses.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleFilterChange = (filter: typeof gradeFilter) => {
    setGradeFilter(filter)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: typeof sortBy) => {
    setSortBy(sort)
    setCurrentPage(1)
  }

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

  if (isLoading) {
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
        className="space-y-4"
      >
        {/* Title and count */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analysis History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {sortedAnalyses.length} {sortedAnalyses.length === 1 ? 'analysis' : 'analyses'}
            {gradeFilter !== 'all' && ` (filtered by ${gradeFilter})`}
          </p>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Start Analysis Button */}
            <Button
              onClick={() => router.push('/dashboard/analyze')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 shadow-lg h-11"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start New Analysis
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-3 h-11">
              <SortDesc className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                className="bg-transparent border-none text-sm text-gray-900 dark:text-white focus:ring-0 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 px-3 h-11">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={gradeFilter}
                onChange={(e) => handleFilterChange(e.target.value as typeof gradeFilter)}
                className="bg-transparent border-none text-sm text-gray-900 dark:text-white focus:ring-0 focus:outline-none cursor-pointer"
              >
                <option value="all">All Grades</option>
                <option value="A+">A+ Only</option>
                <option value="A">A Only</option>
                <option value="B+">B+ Only</option>
                <option value="B">B Only</option>
                <option value="C+">C+ Only</option>
                <option value="C">C Only</option>
                <option value="D">D Only</option>
                <option value="F">F Only</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 h-11">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-4 py-2 rounded-l-lg transition-colors flex items-center gap-2',
                  viewMode === 'grid'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
                title="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-4 py-2 rounded-r-lg transition-colors flex items-center gap-2',
                  viewMode === 'list'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
                title="List view"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {sortedAnalyses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
            <FileImage className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Ready to start?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Upload your first chart and get AI-powered analysis in seconds
          </p>
          <Button
            onClick={() => router.push('/dashboard/analyze')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Start Your First Analysis
          </Button>
        </motion.div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {paginatedAnalyses.map((analysis, index) => (
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

                    {/* Accuracy Badge - Top Left */}
                    {analysis.feedbackWasCorrect !== null && (
                      <div className="absolute top-3 left-3">
                        <div className={cn(
                          "px-3 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-sm",
                          analysis.feedbackWasCorrect
                            ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700"
                            : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700"
                        )}>
                          {analysis.feedbackWasCorrect ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Accurate</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Inaccurate</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

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
      ) : (
        /* List View */
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {paginatedAnalyses.map((analysis, index) => {
              const feedbackColorClass = analysis.feedbackWasCorrect === true
                ? 'bg-green-50/80 dark:bg-green-900/20 hover:bg-green-100/80 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800'
                : analysis.feedbackWasCorrect === false
                ? 'bg-red-50/80 dark:bg-red-900/20 hover:bg-red-100/80 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-100 dark:border-gray-700'

              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleAnalysisClick(analysis.id)}
                  className="cursor-pointer"
                >
                  <div className={cn(
                    "rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border p-4",
                    feedbackColorClass
                  )}>
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                      <img
                        src={analysis.imageUrl}
                        alt={`Chart for ${analysis.stockSymbol || 'Unknown'}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {analysis.stockSymbol || 'Unknown Symbol'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {analysis.gradeLabel || 'No grade'}
                          </p>
                        </div>

                        {/* Grade Badge */}
                        {analysis.grade && (
                          <div className={cn(
                            "px-3 py-1 rounded-full font-bold text-sm flex-shrink-0",
                            getGradeStyles(analysis.grade, analysis.gradeColor)
                          )}>
                            {analysis.grade}
                          </div>
                        )}
                      </div>

                      {/* Details Row */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                        {/* Accuracy Badge - Prominent */}
                        {analysis.feedbackWasCorrect !== null && (
                          <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs",
                            analysis.feedbackWasCorrect
                              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700"
                              : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700"
                          )}>
                            {analysis.feedbackWasCorrect ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Accurate</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Inaccurate</span>
                              </>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(analysis.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(analysis.createdAt), 'HH:mm')}</span>
                        </div>
                        {analysis.shouldEnter !== null && (
                          <div className="flex items-center gap-1">
                            {analysis.shouldEnter ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span className="text-green-600 dark:text-green-400 font-medium">Enter</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <span className="text-red-600 dark:text-red-400 font-medium">Skip</span>
                              </>
                            )}
                          </div>
                        )}
                        {analysis.entryPrice && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Entry:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              ${parseFloat(analysis.entryPrice).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-8"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              // Show first, last, current, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                      page === currentPage
                        ? "bg-purple-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    )}
                  >
                    {page}
                  </button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="text-gray-400 px-1">
                    ...
                  </span>
                )
              }
              return null
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
