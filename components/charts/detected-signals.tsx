'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Signal {
  name: string
  points: number
  explanation?: string
}

interface DetectedSignalsProps {
  bullish?: Signal[]
  bearish?: Signal[]
  noGo?: string[]
  className?: string
}

export function DetectedSignals({
  bullish = [],
  bearish = [],
  noGo = [],
  className
}: DetectedSignalsProps) {
  if (!bullish.length && !bearish.length && !noGo.length) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="font-semibold flex items-center">
        <Sparkles className="mr-2 h-4 w-4" />
        AI-Detected Signals
      </h3>

      {bullish.length > 0 && (
        <SignalGroup
          title="Bullish Signals"
          signals={bullish}
          variant="bullish"
        />
      )}

      {bearish.length > 0 && (
        <SignalGroup
          title="Bearish Signals"
          signals={bearish}
          variant="bearish"
        />
      )}

      {noGo.length > 0 && (
        <NoGoSignals conditions={noGo} />
      )}
    </div>
  )
}

/**
 * Signal group component
 */
function SignalGroup({
  title,
  signals,
  variant
}: {
  title: string
  signals: Signal[]
  variant: 'bullish' | 'bearish'
}) {
  const variantClasses = {
    bullish: {
      container: 'bg-green-50 dark:bg-green-900/20',
      title: 'text-green-700 dark:text-green-300',
      text: 'text-green-800 dark:text-green-200',
      explanation: 'text-green-700 dark:text-green-300'
    },
    bearish: {
      container: 'bg-red-50 dark:bg-red-900/20',
      title: 'text-red-700 dark:text-red-300',
      text: 'text-red-800 dark:text-red-200',
      explanation: 'text-red-700 dark:text-red-300'
    }
  }

  const classes = variantClasses[variant]

  return (
    <div className={cn('p-3 rounded-lg', classes.container)}>
      <p className={cn('text-sm font-semibold mb-2', classes.title)}>
        {title}
      </p>
      <div className="space-y-2">
        {signals.map((signal, idx) => (
          <div key={idx} className="space-y-0.5">
            <p className={cn('text-sm font-medium', classes.text)}>
              • {signal.name}
            </p>
            {signal.explanation && (
              <p className={cn('text-xs ml-3', classes.explanation)}>
                {signal.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * No-go signals component
 */
function NoGoSignals({ conditions }: { conditions: string[] }) {
  return (
    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
      <p className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">
        NO-GO Conditions:
      </p>
      <div className="flex flex-wrap gap-1">
        {conditions.map((condition, idx) => (
          <span
            key={idx}
            className="text-xs bg-red-200 dark:bg-red-800/50 px-2 py-1 rounded font-medium"
          >
            {condition}
          </span>
        ))}
      </div>
    </div>
  )
}