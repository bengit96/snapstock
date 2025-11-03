"use client";

import { motion } from "framer-motion";
import { AlertCircle, TrendingUp, TrendingDown, Target, Clock } from "lucide-react";
import { PullbackRecommendation } from "@/lib/types";

interface PullbackEntryRecommendationProps {
  recommendation: PullbackRecommendation;
  currentPrice?: number;
}

export function PullbackEntryRecommendation({
  recommendation,
  currentPrice,
}: PullbackEntryRecommendationProps) {
  // Determine the alert type and styling based on the recommendation
  const getAlertStyle = () => {
    if (recommendation.isPullbackEntry) {
      return {
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-800",
        textColor: "text-green-800 dark:text-green-200",
        iconColor: "text-green-600 dark:text-green-400",
        Icon: Target,
        title: "Pullback Entry Opportunity",
      };
    } else if (recommendation.waitForPullback) {
      return {
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        textColor: "text-yellow-800 dark:text-yellow-200",
        iconColor: "text-yellow-600 dark:text-yellow-400",
        Icon: Clock,
        title: "Wait for Pullback",
      };
    } else {
      return {
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        textColor: "text-blue-800 dark:text-blue-200",
        iconColor: "text-blue-600 dark:text-blue-400",
        Icon: AlertCircle,
        title: "Entry Recommendation",
      };
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`rounded-lg border-2 ${alertStyle.borderColor} ${alertStyle.bgColor} p-6 mb-6`}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 ${alertStyle.iconColor}`}>
          <alertStyle.Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-3 ${alertStyle.textColor}`}>
            {alertStyle.title}
          </h3>

          {/* Main Recommendation */}
          <div className={`mb-4 ${alertStyle.textColor}`}>
            <p className="text-base leading-relaxed">
              {recommendation.recommendation}
            </p>
          </div>

          {/* Pullback Details Grid */}
          {(recommendation.hasPullback || recommendation.waitForPullback) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Pullback Pattern */}
              {recommendation.pullbackPattern && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Pattern Detected
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {recommendation.pullbackPattern}
                  </p>
                </div>
              )}

              {/* Pullback Level */}
              {recommendation.pullbackLevel && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Target Entry Level
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    ${recommendation.pullbackLevel.toFixed(2)}
                    {currentPrice && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        ({((recommendation.pullbackLevel - currentPrice) / currentPrice * 100).toFixed(1)}% from current)
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Support Level */}
              {recommendation.supportLevel && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Key Support Level
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    ${recommendation.supportLevel.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Pullback Strength */}
              {recommendation.pullbackStrength && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Pullback Strength
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      recommendation.pullbackStrength === 'strong'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : recommendation.pullbackStrength === 'moderate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                    }`}>
                      {recommendation.pullbackStrength.charAt(0).toUpperCase() + recommendation.pullbackStrength.slice(1)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Entry Trigger */}
          {recommendation.entryTrigger && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Entry Trigger Signal
              </h4>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {recommendation.entryTrigger}
              </p>
            </div>
          )}

          {/* Confirmation Criteria */}
          {recommendation.pullbackConfirmation && (
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirmation Criteria
              </h4>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {recommendation.pullbackConfirmation}
              </p>
            </div>
          )}

          {/* Action Items */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Recommended Actions:
            </h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {recommendation.isPullbackEntry && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>This is a valid pullback entry opportunity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>Consider entering at the current level with appropriate stop loss</span>
                  </li>
                  {recommendation.entryTrigger && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span>Wait for confirmation: {recommendation.entryTrigger}</span>
                    </li>
                  )}
                </>
              )}
              {recommendation.waitForPullback && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠</span>
                    <span>Price is extended - avoid chasing the move</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠</span>
                    <span>Set alerts for pullback to support levels</span>
                  </li>
                  {recommendation.pullbackLevel && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠</span>
                      <span>Target entry zone: ${recommendation.pullbackLevel.toFixed(2)}</span>
                    </li>
                  )}
                </>
              )}
              {!recommendation.isPullbackEntry && !recommendation.waitForPullback && recommendation.hasPullback && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                    <span>Monitor price action at current pullback level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                    <span>Look for volume confirmation on any bounce</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}