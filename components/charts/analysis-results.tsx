'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GradeDisplay } from './grade-display'
import { TradeParameters } from './trade-parameters'
import { DetectedSignals } from './detected-signals'
import { TradeDecision } from './trade-decision'
import { AnalysisDetails } from './analysis-details'
import { Brain, BarChart, Info } from 'lucide-react'
import type { DetailedAnalysisResult } from '@/lib/types'
import { motion } from 'framer-motion'

interface AnalysisResultsProps {
  result: DetailedAnalysisResult | null
  className?: string
}

export function AnalysisResults({ result, className }: AnalysisResultsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          AI-powered trade recommendations using momentum trading strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result ? (
          <ResultContent result={result} />
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Result content component
 */
function ResultContent({ result }: { result: DetailedAnalysisResult }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Chart Info & AI Confidence */}
      {(result.timeframe || result.aiConfidence || result.chartQuality) && (
        <motion.div variants={itemVariants}>
          <ChartInfo
            timeframe={result.timeframe}
            confidence={result.aiConfidence}
            chartQuality={result.chartQuality}
          />
        </motion.div>
      )}

      {/* Trade Thesis - Most Important Section */}
      {result.tradeThesis && (
        <motion.div variants={itemVariants}>
          <TradeThesis thesis={result.tradeThesis} />
        </motion.div>
      )}

      {/* Key Strengths & Concerns */}
      {(result.keyStrengths || result.keyConcerns) && (
        <motion.div variants={itemVariants}>
          <KeyFactors
            strengths={result.keyStrengths}
            concerns={result.keyConcerns}
          />
        </motion.div>
      )}

      {/* Grade Display */}
      <motion.div variants={itemVariants}>
        <GradeDisplay
          grade={result.grade}
          label={result.gradeLabel}
          description={result.gradeDescription}
        />
      </motion.div>

      {/* Trade Decision */}
      <motion.div variants={itemVariants}>
        <TradeDecision shouldEnter={result.shouldEnter} />
      </motion.div>

      {/* Trade Parameters */}
      {result.shouldEnter && (
        <motion.div variants={itemVariants}>
          <TradeParameters
            entryPrice={result.entryPrice}
            stopLoss={result.stopLoss}
            takeProfit={result.takeProfit}
            riskRewardRatio={result.riskRewardRatio}
          />
        </motion.div>
      )}

      {/* Detected Signals */}
      {result.detectedSignals && (
        <motion.div variants={itemVariants}>
          <DetectedSignals
            bullish={result.detectedSignals.bullish}
            bearish={result.detectedSignals.bearish}
            noGo={result.detectedSignals.noGo}
          />
        </motion.div>
      )}

      {/* Chart Description */}
      {result.chartDescription && (
        <motion.div variants={itemVariants}>
          <ChartDescription description={result.chartDescription} />
        </motion.div>
      )}

      {/* Analysis Details */}
      <motion.div variants={itemVariants}>
        <AnalysisDetails
          reasons={result.reasons}
          totalScore={result.totalScore}
          confluenceCount={result.confluenceCount}
        />
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={itemVariants}>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                Educational Purposes Only
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                This analysis is based on technical patterns and probabilities. Markets are unpredictable and past patterns don't guarantee future results. Always do your own research and consult a financial advisor before trading.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="text-center py-12 text-gray-500">
      <BarChart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      <p>Upload a stock chart to see AI-powered analysis</p>
      <p className="text-sm mt-2 text-purple-600">
        AI will analyze your chart instantly
      </p>
    </div>
  )
}

/**
 * Chart info component with quality score
 */
function ChartInfo({
  timeframe,
  confidence,
  chartQuality
}: {
  timeframe?: string
  confidence?: number
  chartQuality?: number
}) {
  const getQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-600 dark:text-green-400'
    if (quality >= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getQualityLabel = (quality: number) => {
    if (quality >= 9) return 'Exceptional Setup'
    if (quality >= 7) return 'Strong Setup'
    if (quality >= 5) return 'Decent Setup'
    return 'Weak Setup'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
      {timeframe && (
        <div className="flex items-center gap-2">
          <BarChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Timeframe</div>
            <div className="font-semibold">{timeframe}</div>
          </div>
        </div>
      )}
      {confidence !== undefined && (
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">AI Confidence</div>
            <div className="font-semibold">{confidence}%</div>
          </div>
        </div>
      )}
      {chartQuality !== undefined && (
        <div className="flex items-center gap-2">
          <div className={`font-bold text-2xl ${getQualityColor(chartQuality)}`}>
            {chartQuality}/10
          </div>
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Chart Quality</div>
            <div className={`text-sm font-semibold ${getQualityColor(chartQuality)}`}>
              {getQualityLabel(chartQuality)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Trade thesis component - the key narrative
 */
function TradeThesis({ thesis }: { thesis: string }) {
  return (
    <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-2 uppercase tracking-wide">
            Trade Thesis
          </h3>
          <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
            {thesis}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Key factors component showing strengths and concerns
 */
function KeyFactors({
  strengths,
  concerns
}: {
  strengths?: string[]
  concerns?: string[]
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="text-sm font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Key Strengths
          </h4>
          <ul className="space-y-2">
            {strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns */}
      {concerns && concerns.length > 0 && (
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h4 className="text-sm font-bold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Key Concerns
          </h4>
          <ul className="space-y-2">
            {concerns.map((concern, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">⚠</span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * Chart description component
 */
function ChartDescription({ description }: { description: string }) {
  return (
    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
      <p className="text-sm flex items-start">
        <Brain className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
        <span className="italic">{description}</span>
      </p>
    </div>
  )
}