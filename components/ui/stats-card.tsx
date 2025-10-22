'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatItem {
  label: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

interface StatsCardProps {
  stats: StatItem[]
  className?: string
  columns?: number
}

interface SingleStatProps extends StatItem {
  className?: string
}

export function SingleStat({
  label,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className
}: SingleStatProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className={cn('text-center p-4', className)}>
      {Icon && (
        <Icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
      )}
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {label}
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
      {trend && trendValue && (
        <p className={cn('text-xs mt-1', trendColors[trend])}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
        </p>
      )}
    </div>
  )
}

export function StatsCard({
  stats,
  className,
  columns = 4
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className={cn(
          'grid gap-4',
          columns === 2 && 'md:grid-cols-2',
          columns === 3 && 'md:grid-cols-3',
          columns === 4 && 'md:grid-cols-4',
          columns === 5 && 'md:grid-cols-5',
        )}>
          {stats.map((stat, index) => (
            <SingleStat key={index} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}