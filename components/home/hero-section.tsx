"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGetStarted } from "@/lib/hooks/useGetStarted";

interface HeroSectionProps {
  className?: string;
}

interface StatItemProps {
  value: string;
  label: string;
  index?: number;
}

function StatItem({ value, label, index = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
      className="text-center"
    >
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}

export function HeroSection({ className }: HeroSectionProps) {
  const { handleGetStarted } = useGetStarted();

  const stats = [
    { value: "FREE", label: "Analysis for Everyone" },
    { value: "AI", label: "Powered Analysis" },
    { value: "Fast", label: "Results" },
    { value: "Smart", label: "Insights" },
  ];

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 pt-32 pb-20 px-4 ${
        className || ""
      }`}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-gray-100/25 dark:bg-grid-gray-700/25 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

      <div className="container mx-auto text-center relative">
        {/* Badge */}
        {/* Free Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0, duration: 0.4 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold text-sm mb-6 shadow-lg"
        >
          ✨ Everyone Gets 1 FREE Analysis
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
        >
          Trade with Confidence using
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 block mt-2">
            AI-Powered Analysis
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4"
        >
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Try it free!
          </span>{" "}
          Upload your chart and get instant AI-powered analysis with precise
          entry points, stop losses, and profit targets for momentum trading.
          <span className="block mt-3 text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-400">
            Works with Stocks, Forex, Crypto, Futures & More • Optimized for
            momentum setups
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex justify-center mb-12 px-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="text-lg px-8 w-auto min-w-[320px] bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25 font-bold"
            >
              🚀 Get FREE AI Analysis Now{" "}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
