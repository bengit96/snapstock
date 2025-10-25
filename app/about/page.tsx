'use client'

import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Brain, Target, Users, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">About SnapPChart</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Empowering momentum traders with AI-powered chart analysis
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
              SnapPChart was built to democratize professional-grade trading analysis. We believe that every trader,
              regardless of experience level, deserves access to sophisticated tools that can help them make better
              trading decisions.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              By combining cutting-edge AI technology with proven momentum trading strategies, we&apos;ve created a
              platform that analyzes charts the way professional traders do—but in seconds instead of minutes.
            </p>
          </motion.section>

          {/* What We Do */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">What We Do</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
              SnapPChart uses advanced AI to analyze stock charts and provide instant, actionable trading recommendations.
              Our platform evaluates over 40 technical signals, identifies chart patterns, and calculates optimal entry points,
              stop losses, and profit targets.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our advanced AI evaluates charts using the same principles professional momentum traders use,
                  but with the speed and consistency only AI can provide.
                </p>
              </div>
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Risk Management</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Every analysis includes precise entry points, stop losses, and profit targets calculated to
                  maintain favorable risk/reward ratios.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Our Values */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">Our Values</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Transparency</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We show you exactly why our AI makes each recommendation, explaining the signals and patterns it detects.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Accuracy</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Our AI is continuously refined to provide the most accurate analysis possible, helping you avoid bad trades.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Professional-grade trading tools should be available to everyone, not just institutional traders.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Who We Serve */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">Who We Serve</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
              SnapPChart is designed for momentum traders who want to make faster, more informed trading decisions.
              Whether you&apos;re:
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-lg">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                A day trader looking to quickly validate setups before entering positions
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                A swing trader seeking confluence before taking trades
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                A beginner learning to identify high-probability patterns
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                An experienced trader wanting a second opinion on your analysis
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mt-4">
              SnapPChart helps you trade with more confidence and discipline.
            </p>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Trade Smarter?</h2>
            <p className="text-lg mb-6">
              Join thousands of traders using SnapPChart to make better trading decisions.
            </p>
            <a
              href="/login"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started Now
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
