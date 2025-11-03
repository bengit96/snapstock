'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Target, DollarSign, Clock, Shield, BarChart3, Lock, CheckCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  index?: number
}

interface SimpleFeatureProps {
  icon: LucideIcon
  title: string
  description: string
  index?: number
}

function FeatureCard({ icon: Icon, title, description, features, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px", amount: 0.2 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg h-full">
        <CardHeader>
          <Icon className="h-10 w-10 text-purple-600 mb-4" />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SimpleFeature({ icon: Icon, title, description, index = 0 }: SimpleFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px", amount: 0.3 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="text-center p-6"
    >
      <Icon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  )
}

export function FeaturesSection() {
  const mainFeatures: FeatureCardProps[] = [
    {
      icon: Brain,
      title: 'Advanced AI Analysis',
      description: 'Cutting-edge AI that understands charts like a professional trader',
      features: [
        'Identifies candlestick patterns instantly',
        'Recognizes support and resistance levels',
        'Detects volume patterns and momentum'
      ]
    },
    {
      icon: Target,
      title: 'Precision Grading System',
      description: 'Get instant A-F grades based on proven technical signals',
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
      title: 'Fast Analysis',
      description: 'Quick AI-powered chart evaluation'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Optimized risk/reward for every trade'
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
            Professional-grade long-bias analysis tools powered by cutting-edge AI
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {additionalFeatures.map((feature, index) => (
            <SimpleFeature key={index} {...feature} index={index} />
          ))}
        </div>

        {/* Chart Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px", amount: 0.2 }}
          transition={{ duration: 0.3 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <h3 className="text-2xl font-bold text-center mb-2">Chart Requirements</h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              For optimal AI analysis, ensure your chart includes these indicators:
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="font-semibold text-purple-600 mb-1">MACD</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Moving Average Convergence Divergence</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="font-semibold text-purple-600 mb-1">Volume Profile</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">For identifying key price levels</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="font-semibold text-purple-600 mb-1">VWAP</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Volume Weighted Average Price</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm md:col-span-3">
                <div className="font-semibold text-purple-600 mb-1">EMAs: 9, 20, 200</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Exponential Moving Averages for trend analysis</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}