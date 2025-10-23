'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GradeDisplay } from './grade-display'
import { TradeParameters } from './trade-parameters'
import { DetectedSignals } from './detected-signals'
import { TradeDecision } from './trade-decision'
import { AnalysisDetails } from './analysis-details'
import { Brain, BarChart } from 'lucide-react'
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
      {/* Stock Symbol & AI Confidence */}
      {(result.stockSymbol || result.aiConfidence) && (
        <motion.div variants={itemVariants}>
          <StockInfo
            symbol={result.stockSymbol}
            confidence={result.aiConfidence}
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
 * Stock info component
 */
function StockInfo({
  symbol,
  confidence
}: {
  symbol?: string
  confidence?: number
}) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {symbol && (
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Symbol:</span>
          <span className="ml-2 font-semibold text-lg">{symbol}</span>
        </div>
      )}
      {confidence !== undefined && (
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <span className="text-sm">AI Confidence: {confidence}%</span>
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