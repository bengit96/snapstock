'use client'

import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalysisDetailsProps {
  reasons: string[]
  totalScore: number
  confluenceCount: number
  className?: string
}

export function AnalysisDetails({
  reasons,
  totalScore,
  confluenceCount,
  className
}: AnalysisDetailsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Reasons */}
      {reasons && reasons.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Analysis Details
          </h3>
          <ul className="text-sm space-y-1">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confluence Summary */}
      {confluenceCount > 0 && (
        <div className="pt-4 border-t dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Confluence Areas:</span>
            <span className="font-semibold">{confluenceCount}</span>
          </div>
        </div>
      )}
    </div>
  )
}