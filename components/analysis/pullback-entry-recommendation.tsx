"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
} from "lucide-react";
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
        </div>
      </div>
    </motion.div>
  );
}
