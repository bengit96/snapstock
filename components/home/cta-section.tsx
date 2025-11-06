'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useGetStarted } from '@/lib/hooks/useGetStarted'

interface CTASectionProps {
  title?: string
  description?: string
  buttonText?: string
  subtext?: string
}

export function CTASection({
  title = 'Ready to Transform Your Trading?',
  description = 'Join traders worldwide using SnapPChart to analyze momentum setups across all markets. Get your first analysis free—no credit card required.',
  buttonText = 'Generate Your Free Analysis',
  subtext = 'One free analysis to try it out. Then subscribe for continued access.'
}: CTASectionProps) {
  const { handleGetStarted } = useGetStarted()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-2"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.5 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-purple-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px", amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center px-2"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-purple-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto sm:min-w-[280px] shadow-lg shadow-purple-500/25 h-12 sm:h-auto"
            >
              <span className="truncate">{buttonText}</span> <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            </Button>
          </motion.div>
        </motion.div>
        {subtext && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px", amount: 0.5 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-purple-200 text-xs sm:text-sm mt-3 sm:mt-4 px-2"
          >
            {subtext}
          </motion.p>
        )}
      </div>
    </section>
  )
}