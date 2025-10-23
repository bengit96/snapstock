'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { motion } from 'framer-motion'

interface CTASectionProps {
  title?: string
  description?: string
  buttonText?: string
  subtext?: string
}

export function CTASection({
  title = 'Ready to Transform Your Trading?',
  description = 'Join thousands of traders who are already making smarter decisions with SnapPChart. Get your first analysis free—no credit card required.',
  buttonText = 'Generate Your Free Analysis',
  subtext = 'One free analysis to try it out. Then subscribe for unlimited access.'
}: CTASectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white mb-6"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.5 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px", amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href={ROUTES.analyze}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 shadow-xl">
                {buttonText} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
        {subtext && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px", amount: 0.5 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-purple-200 text-sm mt-4"
          >
            {subtext}
          </motion.p>
        )}
      </div>
    </section>
  )
}