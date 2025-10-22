'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PricingCardProps {
  tier: 'monthly' | 'yearly' | 'lifetime'
  title: string
  price: number
  period: string
  description: string
  features: string[]
  badge?: string
  badgeVariant?: 'default' | 'popular' | 'lifetime'
  isPopular?: boolean
  savings?: string
  onSubscribe: () => void
  isLoading?: boolean
  buttonVariant?: 'default' | 'outline'
  buttonText?: string
}

export function PricingCard({
  tier,
  title,
  price,
  period,
  description,
  features,
  badge,
  badgeVariant = 'default',
  isPopular = false,
  savings,
  onSubscribe,
  isLoading = false,
  buttonVariant = 'outline',
  buttonText
}: PricingCardProps) {
  const badgeColors = {
    default: 'bg-gray-800',
    popular: 'bg-gradient-to-r from-purple-600 to-pink-600',
    lifetime: 'bg-gray-800'
  }

  const isLifetime = tier === 'lifetime'

  return (
    <Card className={cn(
      'relative border-2 hover:border-purple-500 transition-all hover:shadow-xl',
      isPopular && 'border-purple-600 shadow-xl transform scale-105'
    )}>
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className={cn(
            'text-white px-4 py-1 rounded-full text-sm font-semibold',
            badgeColors[badgeVariant]
          )}>
            {badge}
          </div>
        </div>
      )}

      <CardHeader className={cn('pb-8', badge && 'pt-8')}>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">${Math.floor(price)}</span>
          {price % 1 !== 0 && (
            <span className="text-xl text-gray-600">
              .{((price % 1) * 100).toFixed(0)}
            </span>
          )}
          <span className="text-gray-500 block text-sm mt-2">{period}</span>
          {savings && (
            <span className="text-green-600 font-semibold text-sm">{savings}</span>
          )}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              {isLifetime && index >= features.length - 4 ? (
                <Award className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              )}
              <span className={cn(
                isPopular && index > 0 && 'font-semibold'
              )}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Button
          className={cn(
            'w-full',
            buttonVariant === 'default' && 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
          )}
          variant={buttonVariant}
          onClick={onSubscribe}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : (buttonText || `Start ${title}`)}
        </Button>
      </CardContent>
    </Card>
  )
}