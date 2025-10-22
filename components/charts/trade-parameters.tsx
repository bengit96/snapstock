'use client'

import { Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TradeParametersProps {
  entryPrice?: number
  stopLoss?: number
  takeProfit?: number
  riskRewardRatio?: number
  className?: string
}

export function TradeParameters({
  entryPrice,
  stopLoss,
  takeProfit,
  riskRewardRatio,
  className
}: TradeParametersProps) {
  if (!entryPrice) return null

  return (
    <div className={cn(
      'space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg',
      className
    )}>
      <h3 className="font-semibold flex items-center">
        <Target className="mr-2 h-4 w-4" />
        Trade Parameters
      </h3>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <ParameterItem
          label="Entry Price"
          value={`$${entryPrice.toFixed(2)}`}
        />
        <ParameterItem
          label="Stop Loss"
          value={`$${stopLoss?.toFixed(2) || 'N/A'}`}
          valueClassName="text-red-600"
        />
        <ParameterItem
          label="Take Profit"
          value={`$${takeProfit?.toFixed(2) || 'N/A'}`}
          valueClassName="text-green-600"
        />
        <ParameterItem
          label="Risk/Reward"
          value={riskRewardRatio ? `1:${riskRewardRatio.toFixed(2)}` : 'N/A'}
        />
      </div>
    </div>
  )
}

/**
 * Parameter item component
 */
function ParameterItem({
  label,
  value,
  valueClassName
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div>
      <span className="text-gray-600 dark:text-gray-400">{label}:</span>
      <span className={cn('ml-2 font-medium', valueClassName)}>{value}</span>
    </div>
  )
}