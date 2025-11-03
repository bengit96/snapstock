'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, TrendingUp, Volume2, DollarSign, Newspaper } from 'lucide-react'
import { STOCK_SELECTION_CRITERIA } from '@/lib/constants'

interface CriteriaItemProps {
  icon: React.ElementType
  label: string
  description: string
  index: number
}

function CriteriaItem({ icon: Icon, label, description, index }: CriteriaItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{label}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-green-500 mt-1" />
    </motion.div>
  )
}

export function StockCriteriaSection() {
  const criteria = [
    {
      icon: DollarSign,
      label: STOCK_SELECTION_CRITERIA.priceRange.label,
      description: STOCK_SELECTION_CRITERIA.priceRange.description
    },
    {
      icon: TrendingUp,
      label: STOCK_SELECTION_CRITERIA.float.label,
      description: STOCK_SELECTION_CRITERIA.float.description
    },
    {
      icon: TrendingUp,
      label: STOCK_SELECTION_CRITERIA.movePercentage.label,
      description: STOCK_SELECTION_CRITERIA.movePercentage.description
    },
    {
      icon: Volume2,
      label: STOCK_SELECTION_CRITERIA.relativeVolume.label,
      description: STOCK_SELECTION_CRITERIA.relativeVolume.description
    },
    {
      icon: Newspaper,
      label: STOCK_SELECTION_CRITERIA.catalyst.label,
      description: STOCK_SELECTION_CRITERIA.catalyst.description
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Built for Long Momentum Trading
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            SnapPChart specializes in low float, fast-moving stocks for long positions. Our AI analyzes charts that meet these proven momentum criteria:
          </p>
        </motion.div>

        {/* Criteria Grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {criteria.map((item, index) => (
            <CriteriaItem key={index} {...item} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400">
            These criteria help identify long momentum setups that historically show strong upward price movement
          </p>
        </motion.div>
      </div>
    </section>
  )
}
