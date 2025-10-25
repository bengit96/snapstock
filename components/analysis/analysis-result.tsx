'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  Shield,
  DollarSign,
  Calendar,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AnalysisResultProps {
  analysis: any // Using any for now, should be typed properly
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const router = useRouter()

  const getGradeStyles = (grade: string, gradeColor: string) => {
    const colorMap: Record<string, string> = {
      'text-green-500': 'from-green-400 to-emerald-500',
      'text-emerald-500': 'from-emerald-400 to-green-500',
      'text-yellow-500': 'from-yellow-400 to-amber-500',
      'text-orange-500': 'from-orange-400 to-red-500',
      'text-red-500': 'from-red-400 to-pink-500',
    }
    return colorMap[gradeColor] || 'from-gray-400 to-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={() => router.push('/home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to History
        </button>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Chart Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <img
            src={analysis.imageUrl}
            alt={`Chart for ${analysis.stockSymbol || 'analysis'}`}
            className="w-full h-auto"
          />
        </motion.div>

        {/* Analysis Results */}
        <div className="space-y-6">
          {/* Grade Card */}
          {analysis.grade && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysis.stockSymbol || 'Analysis Result'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {format(new Date(analysis.createdAt), 'MMMM d, yyyy • HH:mm')}
                  </p>
                </div>
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br",
                  getGradeStyles(analysis.grade, analysis.gradeColor)
                )}>
                  {analysis.grade}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {analysis.shouldEnter ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {analysis.gradeLabel}
                  </span>
                </div>

                {analysis.analysisReason && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {analysis.analysisReason}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Trade Setup Card */}
          {analysis.entryPrice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trade Setup
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Entry Price</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    ${parseFloat(analysis.entryPrice).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Stop Loss</span>
                  </div>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    ${parseFloat(analysis.stopLoss).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Take Profit</span>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${parseFloat(analysis.takeProfit).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Risk/Reward</span>
                  </div>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    1:{parseFloat(analysis.riskRewardRatio).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Signals Card */}
          {(analysis.activeBullishSignals?.length > 0 || analysis.activeBearishSignals?.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Active Signals
              </h3>

              <div className="space-y-4">
                {/* Bullish Signals */}
                {analysis.activeBullishSignals?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Bullish Signals ({analysis.activeBullishSignals.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {analysis.activeBullishSignals.map((signal: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {signal.name}
                          </span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            +{signal.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bearish Signals */}
                {analysis.activeBearishSignals?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        Bearish Signals ({analysis.activeBearishSignals.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {analysis.activeBearishSignals.map((signal: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {signal.name}
                          </span>
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">
                            -{signal.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* No-Go Conditions */}
          {analysis.activeNoGoConditions?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Risk Factors
              </h3>

              <div className="space-y-2">
                {analysis.activeNoGoConditions.map((condition: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {condition.name}
                      </p>
                      {condition.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {condition.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}