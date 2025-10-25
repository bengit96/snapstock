'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  className?: string
}

interface StatItemProps {
  value: string
  label: string
  index?: number
}

function StatItem({ value, label, index = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  )
}

export function HeroSection({ className }: HeroSectionProps) {
  const stats = [
    { value: 'AI', label: 'Powered Analysis' },
    { value: 'Fast', label: 'Analysis' },
    { value: 'Smart', label: 'Insights' },
    { value: '24/7', label: 'Available' }
  ]

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 pt-32 pb-20 px-4 ${className || ''}`}>
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-gray-100/25 dark:bg-grid-gray-700/25 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

      <div className="container mx-auto text-center relative">
        {/* Badge */}
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
        >
          Trade Like a Pro with
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 block mt-2">
            AI-Powered Analysis
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4"
        >
          SnapPChart is built for momentum traders targeting low float, fast-moving stocks.
          Get rapid AI-powered analysis—from chart screenshot to precise entry, stop loss, and profit targets.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4"
        >
          <Link href={ROUTES.analyze}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25">
                Analyze Your Chart Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
          <Link href="#demo">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                Watch Demo
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}