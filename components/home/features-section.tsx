'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Target, DollarSign, Clock, Shield, BarChart3, Lock, CheckCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
}

interface SimpleFeatureProps {
  icon: LucideIcon
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description, features }: FeatureCardProps) {
  return (
    <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
      <CardHeader>
        <Icon className="h-10 w-10 text-purple-600 mb-4" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function SimpleFeature({ icon: Icon, title, description }: SimpleFeatureProps) {
  return (
    <div className="text-center p-6">
      <Icon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}

export function FeaturesSection() {
  const mainFeatures: FeatureCardProps[] = [
    {
      icon: Brain,
      title: 'GPT-4 Vision Analysis',
      description: 'Advanced AI that understands charts like a professional trader',
      features: [
        'Identifies candlestick patterns instantly',
        'Recognizes support and resistance levels',
        'Detects volume patterns and momentum'
      ]
    },
    {
      icon: Target,
      title: 'Precision Grading System',
      description: 'Get instant A-F grades based on 40+ proven signals',
      features: [
        'Multi-factor confluence analysis',
        'Automatic no-go zone detection',
        'Clear reasoning for every decision'
      ]
    },
    {
      icon: DollarSign,
      title: 'Complete Trade Planning',
      description: 'Exact entry, stop loss, and profit targets calculated',
      features: [
        'Risk/reward ratios optimized',
        'Position sizing recommendations',
        'Multiple timeframe alignment'
      ]
    }
  ]

  const additionalFeatures: SimpleFeatureProps[] = [
    {
      icon: Clock,
      title: 'Real-Time Analysis',
      description: 'Get results in under 3 seconds'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Never exceed 2:1 risk/reward'
    },
    {
      icon: BarChart3,
      title: 'Any Chart Type',
      description: 'Works with all trading platforms'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and safe'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to Trade with Confidence
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Professional-grade analysis tools powered by cutting-edge AI
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {additionalFeatures.map((feature, index) => (
            <SimpleFeature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}