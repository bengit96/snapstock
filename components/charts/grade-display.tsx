'use client'

import { cn } from '@/lib/utils'
import { getGradeBadgeClass, getGradeLabel } from '@/lib/utils/grade.utils'
import type { TradeGrade } from '@/lib/types'

interface GradeDisplayProps {
  grade: TradeGrade
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function GradeDisplay({
  grade,
  label,
  description,
  size = 'md',
  className
}: GradeDisplayProps) {
  const sizeClasses = {
    sm: {
      container: 'p-4',
      badge: 'text-xl px-4 py-2',
      label: 'text-lg',
      description: 'text-xs'
    },
    md: {
      container: 'p-6',
      badge: 'text-3xl px-6 py-3',
      label: 'text-xl',
      description: 'text-sm'
    },
    lg: {
      container: 'p-8',
      badge: 'text-4xl px-8 py-4',
      label: 'text-2xl',
      description: 'text-base'
    }
  }

  const classes = sizeClasses[size]
  const gradeLabel = label || getGradeLabel(grade)

  return (
    <div className={cn(
      'text-center bg-gray-50 dark:bg-gray-800 rounded-lg',
      classes.container,
      className
    )}>
      <div className={cn(
        'inline-block rounded-full text-white font-bold',
        getGradeBadgeClass(grade),
        classes.badge
      )}>
        {grade}
      </div>

      <p className={cn('mt-2 font-semibold', classes.label)}>
        {gradeLabel}
      </p>

      {description && (
        <p className={cn(
          'text-gray-600 dark:text-gray-400 mt-1',
          classes.description
        )}>
          {description}
        </p>
      )}
    </div>
  )
}