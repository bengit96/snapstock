"use client";

import { Navigation } from "@/components/layout/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function MomentumTradingPost() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:gap-3 transition-all mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header with gradient */}
            <header className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 md:p-12 text-white">
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6 opacity-90">
                <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  Nov 8, 2025
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Clock className="w-4 h-4" />
                  8 min read
                </span>
                <span className="bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm font-semibold">
                  Trading Strategy
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Understanding Momentum Trading: A Practical Approach
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 leading-relaxed">
                How to identify stocks in play and execute profitable momentum trades
              </p>
            </header>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Introduction */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-8 border-l-4 border-purple-600 pl-6 italic">
                  Momentum trading has become one of the most talked-about strategies in day trading circles, and for good reason. When done correctly, it allows traders to capture significant moves in a relatively short period. The core principle is straightforward: identify stocks that are moving strongly in one direction and trade alongside that movement.
                </p>

                {/* Section */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    What Makes Momentum Trading Work
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    The foundation of momentum trading rests on a simple observation about market behavior. When a stock starts moving with conviction, it tends to continue in that direction for a period of time. This happens because of the way information spreads through the market and how traders react to price action.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Think about what happens when a stock gaps up on strong news. Early buyers start pushing the price higher. Other traders notice the movement and jump in. The increased volume and price action attracts even more attention. You get this cascade effect where momentum feeds on itself.
                  </p>
                </div>

                {/* Section with Chart */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    Finding Stocks in Play
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    The first step in momentum trading is identifying which stocks are actually worth watching. You need stocks that have a reason to move. This usually means looking for catalysts: earnings reports, FDA approvals, major contract announcements, sector rotation, or breaking news.
                  </p>

                  {/* Featured Chart */}
                  <div className="my-8 rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-lg">
                    <Image
                      src="/blog/momentum-chart.svg"
                      alt="Example of strong momentum with higher highs and higher lows"
                      width={1200}
                      height={600}
                      className="w-full h-auto"
                    />
                  </div>

                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    Volume is critical here. A stock can have great news, but if nobody is trading it, momentum cannot build. I typically look for stocks trading at least 2-3 times their average daily volume in the first hour of trading. High relative volume tells you that traders are paying attention.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    The float size matters too. Smaller float stocks can move more dramatically on the same amount of buying pressure. A stock with 10 million shares in the float will respond differently to a surge of buying than one with 500 million shares outstanding.
                  </p>
                </div>

                {/* Section */}
                <div className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Reading the Price Action
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    Once you have identified potential candidates, you need to understand how the stock is actually trading. This is where many new traders struggle. They see a stock up 20% and assume they should buy immediately. That approach leads to getting caught in pullbacks or buying right before profit-taking hits.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    Strong momentum shows itself in specific ways. The stock makes higher highs and higher lows. Pullbacks are shallow and brief. When the stock pulls back to support levels, buyers step in quickly. Volume increases on the moves up and decreases on the moves down. These are the signs that momentum is real and sustainable.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Pay attention to how the stock handles key price levels. Does it blast through resistance or struggle at each level? When it pulls back, does it hold above the previous high? These details tell you about the strength of the move and whether buyers are still in control.
                  </p>
                </div>

                {/* Section with Chart */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    Entry Timing and Execution
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    Getting into a momentum trade at the right time makes a huge difference in your results. The ideal entry comes on a pullback to support after the trend is established. You want to see the stock prove it can move, then wait for a consolidation or small dip, then enter as it starts to break higher again.
                  </p>

                  {/* VWAP Chart */}
                  <div className="my-8 rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-lg">
                    <Image
                      src="/blog/vwap-chart.svg"
                      alt="VWAP pullback entry setup showing ideal entry point"
                      width={1200}
                      height={600}
                      className="w-full h-auto"
                    />
                  </div>

                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    The VWAP (Volume Weighted Average Price) serves as a useful reference point for many momentum traders. Stocks trading above VWAP often have institutional buying support. When a stock pulls back to VWAP and holds, that can offer a good entry opportunity. If it breaks below VWAP and cannot reclaim it quickly, that is often a warning sign.
                  </p>

                  {/* Pullback Chart */}
                  <div className="my-8 rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-lg">
                    <Image
                      src="/blog/pullback-chart.svg"
                      alt="First pullback pattern showing entry after consolidation"
                      width={1200}
                      height={600}
                      className="w-full h-auto"
                    />
                  </div>

                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    First pullbacks tend to offer the best risk-reward. After a stock makes its initial move higher, it will usually consolidate or pull back slightly. If it holds above a key level and then breaks out again, that second leg can be very profitable. You have a clear stop level and the stock has already proven it can move.
                  </p>
                </div>

                {/* Section */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Managing Risk
                  </h2>
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-6 mb-6 rounded-r-lg">
                    <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                      Every momentum trade needs a clear stop loss level determined before entry. The nature of these trades means they can reverse quickly. Without a predetermined exit point, small losses can become large ones very fast.
                    </p>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    Position sizing becomes especially important in momentum trading. The volatility can be significant. Using smaller position sizes than you might in other strategies helps you stay in the game even when trades go against you. Calculate your risk based on the distance to your stop loss, not just the share price.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    One approach that works well is scaling out of positions as the trade moves in your favor. Take some profit at your first target, move your stop to breakeven, and let the rest run. This locks in gains while giving you exposure to potential larger moves.
                  </p>
                </div>

                {/* Section */}
                <div className="mb-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Common Mistakes to Avoid
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Chasing</h3>
                      <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Chasing is probably the biggest trap in momentum trading. Seeing a stock up 40% and buying it at the high of day rarely works out well. If you miss an initial move, wait for a setup. There will be other opportunities.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Holding Too Long</h3>
                      <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Holding positions too long is another frequent error. Momentum trades are not investments. The game is to capture the move and get out. When the momentum slows, when volume dries up, or when the stock starts making lower lows, the trade is over. Exit and look for the next setup.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Trading Every Move</h3>
                      <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Trading every stock that moves is tempting but inefficient. Focus on the best setups. Quality over quantity applies strongly here. One or two well-executed trades will always beat five marginal ones.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Putting It Together
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    Momentum trading requires active management and quick decision-making. You need to be watching your positions, ready to act when the situation changes. This is not passive trading where you can set and forget.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    The key is developing a systematic approach. Start with a scan for high volume stocks with catalysts. Analyze the price action to confirm real momentum. Wait for proper entry points rather than chasing. Manage your risk with clear stops. Take profits systematically instead of hoping for infinite continuation.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    Success in momentum trading comes from repetition and consistency. The more you practice identifying quality setups and executing your plan, the better your results become. Focus on process over outcomes in the short term. Track your trades, review what worked and what did not, and refine your approach over time.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    The learning curve can be steep, but momentum trading offers real potential for those willing to put in the work. Start small, follow your rules, and remember that protecting your capital is always the first priority.
                  </p>
                </div>

                {/* Disclaimer */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-8 mt-12">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-purple-600 dark:text-purple-400 text-base">Disclaimer:</strong>{" "}
                    This article is for educational purposes only and does not constitute financial advice. Trading stocks carries substantial risk and is not suitable for every investor. Past performance does not guarantee future results. Always conduct your own research and consider consulting with a licensed financial advisor before making trading decisions.
                  </p>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Related Posts / CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Apply These Strategies?</h3>
            <p className="text-lg mb-6 text-purple-100">
              SnapPChart uses AI to analyze charts and identify momentum setups in real-time.
            </p>
            <Link
              href="/#features"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition shadow-lg"
            >
              Explore Features
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
