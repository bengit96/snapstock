"use client";

import { Navigation } from "@/components/layout/navigation";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogPage() {
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
            <h1 className="text-5xl font-bold mb-4">SnapPChart Blog</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Trading insights, platform updates, and momentum trading
              strategies
            </p>
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center p-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
          >
            <BookOpen className="w-20 h-20 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              We&apos;re working on bringing you valuable content about momentum
              trading strategies, chart analysis techniques, and platform
              updates. Check back soon!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:ben@snappchart.app?subject=Blog Updates Notification"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Get Notified
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-gray-700 transition"
              >
                Back to Home
              </a>
            </div>
          </motion.div>

          {/* Upcoming Topics */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              What to Expect
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">
                  Trading Strategies
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Learn momentum trading techniques, chart patterns, and risk
                  management strategies
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Platform Updates</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Stay informed about new features, AI improvements, and
                  platform enhancements
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Market Insights</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Analysis of current market conditions and how to adapt your
                  trading approach
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
