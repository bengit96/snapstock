"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

export function DemoSection() {
  return (
    <section
      id="demo"
      className="py-20 px-4 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm mb-4 shadow-lg">
            ✨ See What You Get
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Real Analysis Example
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Here's what our AI delivers after analyzing your chart
          </p>
        </motion.div>

        {/* Demo Content */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Sample Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-purple-200/50 dark:border-purple-700/50 shadow-xl bg-white dark:bg-gray-800">
              {/* Chart placeholder - you can replace with actual sample image */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center p-6">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                  <p className="text-gray-600 dark:text-gray-400 font-semibold">
                    Sample Chart Analysis
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Works with any market - Stocks, Forex, Crypto, Futures
                  </p>
                </div>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-lg">
                ANY MARKET
              </div>
            </div>
          </motion.div>

          {/* Right: Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            {/* Grade Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold opacity-90">
                  Setup Grade
                </span>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">A</span>
                <span className="text-lg opacity-90">Excellent Setup</span>
              </div>
              <p className="text-sm mt-2 opacity-90">
                Strong momentum with clear entry signals
              </p>
            </div>

            {/* Trade Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                Trade Plan
              </h3>

              {/* Entry Point */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Entry Point
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    Entry: 0.6850
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Pullback to support level
                  </div>
                </div>
              </div>

              {/* Stop Loss */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Stop Loss
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    Stop: 0.6720
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    1.9% risk - below key support
                  </div>
                </div>
              </div>

              {/* Profit Targets */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Profit Targets
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        0.7050
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        Target 1: +2.9%
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        0.7250
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        Target 2: +5.8%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-800">
              <h4 className="font-bold text-sm text-purple-900 dark:text-purple-100 mb-3">
                Key Insights
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Strong bullish momentum confirmed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Volume spike indicates institutional interest</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Risk/reward ratio: 1:2.3 (favorable)</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Get this level of detail for <span className="font-bold text-purple-600 dark:text-purple-400">every chart you upload</span>
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold text-sm shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            Your first analysis is FREE
          </div>
        </motion.div>
      </div>
    </section>
  );
}
