'use client'

import { TrendingUp, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TradeDecisionProps {
  shouldEnter: boolean
  className?: string
}

export function TradeDecision({ shouldEnter, className }: TradeDecisionProps) {
  return (
    <div className={cn(
      'p-4 rounded-lg flex items-center',
      shouldEnter
        ? 'bg-green-50 dark:bg-green-900/20'
        : 'bg-red-50 dark:bg-red-900/20',
      className
    )}>
      {shouldEnter ? (
        <>
          <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-600">ENTER TRADE</span>
        </>
      ) : (
        <>
          <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
          <span className="font-semibold text-red-600">DO NOT ENTER</span>
        </>
      )}
    </div>
  )
}