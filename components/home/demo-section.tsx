"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, TrendingUp, Target, AlertTriangle, Activity, ArrowDown } from "lucide-react";
import { DemoVideoPlayer } from "./demo-video-player";

export function DemoSection() {
  const handleScrollToUpload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('upload-chart');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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

        {/* Main Demo Video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mb-12"
        >
          <DemoVideoPlayer
            videoSrc="https://xxbzzkqzvzk04tvk.public.blob.vercel-storage.com/snappchart%20video.mp4"
            tiktokVideoId="7570362710345436434"
            thumbnailSrc="/screenshot-original.png"
            alt="Real SnapStock AI analysis demo - Upload chart, get instant AI analysis with grade and trade setup"
          />
        </motion.div>

        {/* What's included - Cleaner, less cluttered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-center text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            What's Included in Every Analysis
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Comprehensive AI-powered insights covering technical signals, risk assessment, and actionable trade plans
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Analysis & Grade */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                AI Analysis & Grade
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Plain-language market assessment with A-F quality rating
              </p>
            </div>

            {/* Trade Setup */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Complete Trade Setup
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Entry price, stop loss, take profit, and risk/reward ratios
              </p>
            </div>

            {/* Trade Thesis */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-indigo-100 dark:border-indigo-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Trade Thesis
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Detailed technical reasoning and strategic trade rationale
              </p>
            </div>

            {/* Bullish & Bearish Signals */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-emerald-100 dark:border-emerald-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Bullish & Bearish Signals
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Detected patterns with detailed explanations for both sides
              </p>
            </div>

            {/* Strengths & Concerns */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-100 dark:border-orange-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Strengths & Concerns
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                What makes the setup attractive and risks to watch
              </p>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-yellow-100 dark:border-yellow-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Risk Assessment
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                No-go conditions and critical warning signals
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Get all of this for <span className="font-bold text-purple-600 dark:text-purple-400">every chart you upload</span>
          </p>
          <a
            href="#upload-chart"
            onClick={handleScrollToUpload}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            <CheckCircle2 className="w-5 h-5" />
            Try your free chart analysis now!
          </a>
        </motion.div>
      </div>
    </section>
  );
}
