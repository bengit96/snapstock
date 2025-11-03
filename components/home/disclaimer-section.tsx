'use client'

import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

export function DisclaimerSection() {
  return (
    <section className="py-12 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 p-8 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Important Disclaimer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                SnapPChart is not affiliated with, endorsed by, or connected to Ross Cameron or any of his trading education companies.
                We are independent fans of his momentum trading strategies and have developed this tool to assist traders who use similar
                technical analysis approaches. Any references to trading strategies or methodologies are based on publicly available
                information and our own interpretation of momentum trading principles.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                <strong>Long-Bias Analysis Only:</strong> SnapPChart focuses exclusively on long positions. We rarely analyze short setups.
                Trading is challenging enough—we believe in perfecting one strategy rather than spreading focus across multiple approaches.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
