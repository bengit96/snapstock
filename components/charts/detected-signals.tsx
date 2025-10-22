'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Signal {
  name: string
  points: number
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
      badge: 'bg-green-100 dark:bg-green-800/30'
    },
    bearish: {
      container: 'bg-red-50 dark:bg-red-900/20',
      title: 'text-red-700 dark:text-red-300',
      badge: 'bg-red-100 dark:bg-red-800/30'
    }
  }

  const classes = variantClasses[variant]

  return (
    <div className={cn('p-2 rounded', classes.container)}>
      <p className={cn('text-xs font-medium mb-1', classes.title)}>
        {title}:
      </p>
      <div className="flex flex-wrap gap-1">
        {signals.map((signal, idx) => (
          <span
            key={idx}
            className={cn('text-xs px-2 py-1 rounded', classes.badge)}
          >
            {signal.name} ({variant === 'bullish' ? '+' : '-'}{Math.abs(signal.points)})
          </span>
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