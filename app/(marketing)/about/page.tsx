"use client";

import { useState } from "react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Brain, Target, Users, Sparkles, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const [showTooltip, setShowTooltip] = useState(false);

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
              Built exclusively for momentum day traders who demand speed and
              precision
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
              SnapPChart was built specifically for momentum day traders who
              need to make split-second decisions in fast-moving markets. We
              understand that momentum trading requires speed, precision, and
              confidence— there&apos;s no time for second-guessing when a setup
              presents itself.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              By combining cutting-edge AI technology with proven momentum day
              trading strategies, we&apos;ve created a platform that analyzes
              charts the way professional momentum traders do—but in seconds
              instead of minutes. When you&apos;re trading high-momentum stocks,
              every second counts.
            </p>
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                <strong className="text-purple-600 dark:text-purple-400">
                  Long-Bias Focus:
                </strong>{" "}
                SnapPChart exclusively analyzes long positions. We don&apos;t
                analyze short setups. Trading is challenging enough—we believe
                in perfecting one strategy rather than spreading our expertise
                thin. Our AI is specifically trained and optimized for
                identifying high-probability long setups.
              </p>
            </div>
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
              SnapPChart uses advanced AI to analyze high-momentum stock charts
              and provide instant, actionable trading recommendations for day
              traders. Our platform evaluates over 40 technical signals
              optimized for momentum setups, identifies explosive chart
              patterns, and calculates optimal entry points, stop losses, and
              profit targets—all designed for intraday momentum plays.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  AI-Powered Long Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our advanced AI evaluates charts using the same principles
                  professional momentum day traders use— volume surges,
                  breakouts, relative strength—but with the speed and
                  consistency only AI can provide. Optimized exclusively for
                  long positions.
                </p>
              </div>
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  Intraday Risk Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Every analysis includes precise intraday entry points, tight
                  stop losses, and profit targets calculated for long momentum
                  plays, helping you capture upward moves while protecting your
                  capital.
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
                  We show you exactly why our AI makes each recommendation,
                  explaining the signals and patterns it detects.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Accuracy</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Our AI is continuously refined to provide the most accurate
                  analysis possible, helping you avoid bad trades.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Professional-grade trading tools should be available to
                  everyone, not just institutional traders.
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
              SnapPChart is built exclusively for momentum day traders who:
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-lg">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Trade high-momentum stocks with significant intraday price
                movement
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Need to quickly validate breakout and momentum setups in
                real-time
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Scan multiple stocks throughout the day looking for explosive
                opportunities
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Require precise entry points and tight stop losses for intraday
                trades
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Value speed and accuracy when momentum setups present themselves
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mt-4">
              If you&apos;re a momentum day trader, SnapPChart gives you the
              edge you need to capitalize on fast-moving opportunities with
              confidence and discipline.
            </p>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Trade Momentum with Confidence?
            </h2>
            <p className="text-lg mb-6">
              Join momentum day traders using SnapPChart to catch explosive
              moves with precision and speed.
            </p>
            <a
              href="/login"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started Now
            </a>
          </motion.div>

          {/* Subtle Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <div className="relative inline-block">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                <Info className="w-3 h-3" />
                <span>Affiliation Disclosure</span>
              </button>

              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-3 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg z-50">
                  <div className="relative">
                    <p className="leading-relaxed">
                      SnapPChart is not affiliated with, endorsed by, or
                      connected to Ross Cameron or any of his trading education
                      companies. We are independent fans of momentum trading
                      strategies and have developed this tool based on publicly
                      available technical analysis approaches.
                    </p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
