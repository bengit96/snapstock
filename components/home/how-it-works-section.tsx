'use client'

import { motion } from 'framer-motion'

interface StepProps {
  number: number
  title: string
  description: string
  showConnector?: boolean
  index?: number
}

function Step({ number, title, description, showConnector, index = 0 }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="relative"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: index * 0.2 + 0.3, duration: 0.5, type: 'spring' }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4"
      >
        {number}
      </motion.div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>

      {showConnector && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
          className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 origin-left"
        />
      )}
    </motion.div>
  )
}

export function HowItWorksSection() {
  const steps: Omit<StepProps, 'showConnector'>[] = [
    {
      number: 1,
      title: 'Upload Your Chart',
      description: 'Screenshot your chart with MACD, Volume Profile, EMA 9/20/200, and VWAP visible. Upload to SnapPChart.'
    },
    {
      number: 2,
      title: 'AI Analyzes in Under 5 Seconds',
      description: 'Our advanced AI examines 40+ signals, patterns, and confluence zones instantly.'
    },
    {
      number: 3,
      title: 'Execute with Confidence',
      description: 'Receive your grade (A-F), exact entry point, stop loss, and profit target to trade like a pro.'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Three Simple Steps to Better Trading
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            From chart to trade plan in seconds
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Step
                key={index}
                {...step}
                showConnector={index < steps.length - 1}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}