"use client";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import {
  TrendingUp,
  Volume2,
  Zap,
  Target,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { MOMENTUM_TRADING_CRITERIA } from "@/lib/constants";

export default function RecommendedTradeSetupPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Recommended Trade Setup
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The momentum trading methodology that powers SnapPChart&apos;s AI
              analysis engine
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-16 p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">The Ideal Setup</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
              SnapPChart is designed to identify and validate high-probability
              momentum trading setups. Our AI analyzes over 40 technical
              signals to evaluate whether a chart presents a favorable risk/reward
              opportunity based on momentum trading principles.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              The best trades combine strong bullish signals across multiple
              technical categories while avoiding critical warning signs that
              could derail the setup.
            </p>
          </motion.section>

          {/* Stock Selection Criteria */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">
                Stock Selection Criteria
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
              For optimal results, look for stocks/charts that exhibit these
              characteristics:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <CriteriaCard
                icon={TrendingUp}
                label={MOMENTUM_TRADING_CRITERIA.trend.label}
                description={MOMENTUM_TRADING_CRITERIA.trend.description}
                details="The stock should be in a clear uptrend with higher highs and higher lows. Look for momentum stocks that are leading the market."
              />
              <CriteriaCard
                icon={Volume2}
                label={MOMENTUM_TRADING_CRITERIA.volume.label}
                description={MOMENTUM_TRADING_CRITERIA.volume.description}
                details="Volume should be significantly above average, indicating strong institutional interest and participation."
              />
              <CriteriaCard
                icon={Zap}
                label={MOMENTUM_TRADING_CRITERIA.volatility.label}
                description={MOMENTUM_TRADING_CRITERIA.volatility.description}
                details="The stock should have enough intraday volatility to reach profit targets while maintaining a favorable risk/reward ratio."
              />
              <CriteriaCard
                icon={Activity}
                label={MOMENTUM_TRADING_CRITERIA.catalyst.label}
                description={MOMENTUM_TRADING_CRITERIA.catalyst.description}
                details="News events, earnings, FDA approvals, or market catalysts can provide the fuel for explosive momentum moves."
              />
              <CriteriaCard
                icon={Shield}
                label={MOMENTUM_TRADING_CRITERIA.liquidity.label}
                description={MOMENTUM_TRADING_CRITERIA.liquidity.description}
                details="Sufficient liquidity ensures you can enter and exit positions quickly without significant slippage."
              />
            </div>
          </motion.section>

          {/* Key Entry Signals */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold">Key Entry Signals</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
              SnapPChart&apos;s AI looks for confluence of multiple bullish
              signals across these categories:
            </p>

            <div className="space-y-6">
              <SignalCategory
                title="Volume Analysis"
                signals={[
                  "High buying volume with increasing participation",
                  "Low selling volume indicating lack of distribution",
                  "Volume confirmation on breakouts and rallies",
                ]}
                color="purple"
              />
              <SignalCategory
                title="Trend & Pattern Recognition"
                signals={[
                  "Breakout from consolidation or chart patterns (flags, pennants, triangles)",
                  "Price trading above key moving averages (VWAP, EMA)",
                  "Clean uptrend structure with higher highs and higher lows",
                ]}
                color="blue"
              />
              <SignalCategory
                title="Momentum Indicators"
                signals={[
                  "Strong relative strength vs. market",
                  "Bullish MACD crossovers and histogram expansion",
                  "RSI in bullish zone without overbought extremes",
                ]}
                color="green"
              />
              <SignalCategory
                title="Support & Price Action"
                signals={[
                  "Successful pullback to support levels (moving averages, VWAP)",
                  "Bull flags and healthy consolidation patterns",
                  "Strong bullish candlestick patterns at key levels",
                ]}
                color="pink"
              />
            </div>
          </motion.section>

          {/* Warning Signs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h2 className="text-3xl font-bold">Critical Warning Signs</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
              Certain conditions can disqualify an otherwise promising setup.
              SnapPChart flags these &quot;No-Go&quot; conditions:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <WarningCard
                title="Downtrend Structure"
                description="Lower highs and lower lows indicate bearish control. Avoid trading against the trend."
              />
              <WarningCard
                title="Heavy Distribution"
                description="Excessive selling volume or distribution patterns suggest institutional selling pressure."
              />
              <WarningCard
                title="Weak Technical Position"
                description="Breaking below key support levels or trading below critical moving averages."
              />
              <WarningCard
                title="Exhaustion Patterns"
                description="Parabolic moves, extreme RSI readings, or signs of momentum exhaustion."
              />
              <WarningCard
                title="Poor Risk/Reward"
                description="Setups where the distance to logical stop loss exceeds the potential profit target."
              />
              <WarningCard
                title="Low Quality Chart"
                description="Choppy price action, erratic patterns, or insufficient chart clarity for analysis."
              />
            </div>
          </motion.section>

          {/* Trade Execution */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">Trade Execution Framework</h2>
            </div>

            <div className="space-y-6">
              <ExecutionStep
                number={1}
                title="Entry Point"
                description="Enter on breakout confirmation with volume or on pullback to support levels. Wait for clear trigger rather than chasing."
              />
              <ExecutionStep
                number={2}
                title="Stop Loss Placement"
                description="Place stops below recent swing lows, support levels, or VWAP. Use tight stops for momentum trades to maintain favorable risk/reward."
              />
              <ExecutionStep
                number={3}
                title="Profit Targets"
                description="Target previous resistance levels, measured moves from chart patterns, or extension levels. Scale out of positions as targets are reached."
              />
              <ExecutionStep
                number={4}
                title="Risk/Reward Ratio"
                description="Maintain minimum 2:1 reward/risk ratio. The best momentum setups often offer 3:1 or better risk/reward opportunities."
              />
            </div>
          </motion.section>

          {/* How SnapPChart Helps */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-16 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg"
          >
            <h2 className="text-3xl font-bold mb-6">
              How SnapPChart Evaluates Your Charts
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 text-lg">
              <p>
                When you upload a chart, SnapPChart&apos;s AI analyzes it
                against this comprehensive momentum trading framework:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Signal Detection:</strong> Identifies all active
                    bullish and bearish signals with confidence levels
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Confluence Analysis:</strong> Measures the strength
                    of signal alignment across multiple technical categories
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Warning Detection:</strong> Flags critical no-go
                    conditions that could invalidate the setup
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Grade Assignment:</strong> Scores the setup from F
                    to A+ based on overall quality and probability
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Trade Parameters:</strong> Calculates optimal entry
                    points, stop losses, and profit targets with risk/reward
                    ratios
                  </span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find High-Probability Setups?
            </h2>
            <p className="text-lg mb-6">
              Let SnapPChart&apos;s AI help you identify and validate momentum
              trading opportunities in seconds.
            </p>
            <a
              href="/login"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Analyzing Charts
            </a>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-yellow-800 dark:text-yellow-600">
                Disclaimer:
              </strong>{" "}
              This trading methodology is for educational purposes only and does
              not constitute financial advice. Past performance does not
              guarantee future results. All trading involves risk, and you could
              lose money. Always conduct your own analysis and consider
              consulting with a licensed financial advisor before making trading
              decisions.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Helper Components

function CriteriaCard({
  icon: Icon,
  label,
  description,
  details,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  details: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
      <div className="flex items-start gap-4 mb-3">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 ml-16">
        {details}
      </p>
    </div>
  );
}

function SignalCategory({
  title,
  signals,
  color,
}: {
  title: string;
  signals: string[];
  color: string;
}) {
  const colorClasses = {
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",
  };

  return (
    <div
      className={`p-6 rounded-lg border-2 ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <ul className="space-y-3">
        {signals.map((signal, index) => (
          <li
            key={index}
            className="flex items-start text-gray-700 dark:text-gray-300"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>{signal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WarningCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExecutionStep({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xl">{number}</span>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}

