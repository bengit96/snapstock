'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

interface HeroSectionProps {
  className?: string
}

interface StatItemProps {
  value: string
  label: string
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  )
}

export function HeroSection({ className }: HeroSectionProps) {
  const stats: StatItemProps[] = [
    { value: '40+', label: 'Trading Signals' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '<3s', label: 'Analysis Time' },
    { value: '24/7', label: 'Available' }
  ]

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 pt-32 pb-20 px-4 ${className || ''}`}>
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-gray-100/25 dark:bg-grid-gray-700/25 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

      <div className="container mx-auto text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Powered by GPT-4 Vision AI
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Trade Like a Pro with
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 block mt-2">
            AI-Powered Analysis
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          SnapPChart uses advanced AI and Ross Cameron's proven strategy to analyze your charts in seconds.
          Get instant grades, precise entry points, and professional risk management—all with a simple screenshot.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-12">
          <Link href={ROUTES.login}>
            <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25">
              Start Trading Smarter <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button size="lg" variant="outline" className="text-lg px-8 border-2">
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}