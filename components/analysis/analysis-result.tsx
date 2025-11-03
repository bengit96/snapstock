"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  Shield,
  DollarSign,
  ArrowLeft,
  Activity,
  Plus,
  MessageSquare,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { PullbackEntryRecommendation } from "@/components/analysis/pullback-entry-recommendation";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ChartAnalysis } from "@/lib/types";
import Image from "next/image";
import { AnalysisLimitModal } from "@/components/modals/analysis-limit-modal";
import { useBillingUsage } from "@/lib/api/hooks/useBilling";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AnalysisFeedbackModal,
  type FeedbackData,
} from "@/components/feedback/analysis-feedback-modal";
import { toast } from "sonner";

interface AnalysisResultProps {
  analysis: ChartAnalysis;
  existingFeedback?: FeedbackData;
}

export function AnalysisResult({
  analysis,
  existingFeedback,
}: AnalysisResultProps) {
  const router = useRouter();
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(existingFeedback);
  const { data: usageData } = useBillingUsage();

  // Stock symbol editing state
  const [isEditingSymbol, setIsEditingSymbol] = useState(false);
  const [editedSymbol, setEditedSymbol] = useState(analysis.stockSymbol || "");
  const [isSavingSymbol, setIsSavingSymbol] = useState(false);
  const [stockSymbol, setStockSymbol] = useState(analysis.stockSymbol);
  console.log(analysis);

  const handleSaveSymbol = async () => {
    setIsSavingSymbol(true);
    try {
      const response = await fetch(
        `/api/analysis/${analysis.id}/stock-symbol`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stockSymbol: editedSymbol }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update stock symbol");
      }

      const result = await response.json();
      setStockSymbol(result.data.stockSymbol);
      setIsEditingSymbol(false);
      toast.success("Stock symbol updated successfully", {
        description: `Changed to ${result.data.stockSymbol || "Unknown"}`,
      });
    } catch (error) {
      console.error("Error updating stock symbol:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update stock symbol";
      toast.error("Failed to update stock symbol", {
        description: errorMessage,
      });
    } finally {
      setIsSavingSymbol(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedSymbol(stockSymbol || "");
    setIsEditingSymbol(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveSymbol();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleFeedbackSubmit = async (feedbackData: FeedbackData) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: analysis.id,
          ...feedbackData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit feedback");
      }

      const result = await response.json();
      setFeedback(result.feedback);

      toast.success("Feedback saved successfully!", {
        description: "Your analysis feedback has been recorded.",
      });

      // Refresh the page to show updated feedback
      router.refresh();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save feedback";
      toast.error("Failed to save feedback", {
        description: errorMessage,
      });
      throw error;
    }
  };

  const handleAnalyzeAnother = () => {
    // Skip limit check for admins
    if (usageData?.role === "admin") {
      router.push("/dashboard/analyze");
      return;
    }

    // Check if user has reached their limit
    if (usageData) {
      const { analysesUsed, analysesLimit } = usageData;
      if (
        analysesLimit !== null &&
        analysesLimit !== undefined &&
        analysesUsed >= analysesLimit
      ) {
        setIsLimitModalOpen(true);
        return;
      }
    }

    // Redirect to analyze page
    router.push("/dashboard/analyze");
  };

  const getGradeStyles = (grade: string) => {
    const gradeStyles: Record<string, string> = {
      "A+": "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white font-black",
      A: "bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white font-black",
      "B+": "bg-gradient-to-br from-lime-500 via-green-500 to-lime-600 text-white font-black",
      B: "bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 text-gray-900 font-black",
      "C+": "bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white font-black",
      C: "bg-gradient-to-br from-orange-600 via-red-500 to-orange-700 text-white font-black",
      D: "bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white font-black",
      F: "bg-gradient-to-br from-red-700 via-rose-700 to-red-800 text-white font-black",
    };
    return (
      gradeStyles[grade] ||
      "bg-gradient-to-br from-gray-400 to-gray-500 text-white font-black"
    );
  };

  // Get background color based on grade (F=red to A+=green gradient)
  const getGradeBackgroundColor = (grade: string) => {
    const gradeColors: Record<string, string> = {
      "A+": "from-green-50 via-emerald-50 to-green-100 dark:from-green-950 dark:via-emerald-950 dark:to-green-900",
      A: "from-green-50 via-green-100 to-emerald-50 dark:from-green-900 dark:via-green-950 dark:to-emerald-900",
      "B+": "from-lime-50 via-green-50 to-lime-100 dark:from-lime-900 dark:via-green-900 dark:to-lime-950",
      B: "from-yellow-50 via-amber-50 to-yellow-100 dark:from-yellow-900 dark:via-amber-900 dark:to-yellow-950",
      "C+": "from-orange-50 via-yellow-50 to-orange-100 dark:from-orange-900 dark:via-yellow-900 dark:to-orange-950",
      C: "from-orange-50 via-red-50 to-orange-100 dark:from-orange-900 dark:via-red-900 dark:to-orange-950",
      D: "from-red-50 via-rose-50 to-red-100 dark:from-red-900 dark:via-rose-900 dark:to-red-950",
      F: "from-red-50 via-rose-50 to-red-100 dark:from-red-950 dark:via-rose-950 dark:to-red-900",
    };
    return (
      gradeColors[grade] ||
      "from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
    );
  };

  // Get border and text color for badge (matches card background theme)
  const getGradeBadgeStyle = (grade: string) => {
    const styles: Record<string, { border: string; text: string; bg: string }> =
      {
        "A+": {
          border: "border-emerald-600 dark:border-emerald-500",
          text: "text-emerald-800 dark:text-emerald-200 font-extrabold",
          bg: "bg-white/90 dark:bg-gray-900/70",
        },
        A: {
          border: "border-green-600 dark:border-green-500",
          text: "text-green-800 dark:text-green-200 font-extrabold",
          bg: "bg-white/90 dark:bg-gray-900/70",
        },
        "B+": {
          border: "border-lime-600 dark:border-lime-500",
          text: "text-lime-800 dark:text-lime-200 font-extrabold",
          bg: "bg-white/90 dark:bg-gray-900/70",
        },
        B: {
          border: "border-yellow-600 dark:border-yellow-500",
          text: "text-yellow-800 dark:text-yellow-200 font-extrabold",
          bg: "bg-white/90 dark:bg-gray-900/70",
        },
        "C+": {
          border: "border-orange-600 dark:border-orange-500",
          text: "text-orange-800 dark:text-orange-200 font-extrabold",
          bg: "bg-white/90 dark:bg-gray-900/70",
        },
        C: {
          border: "border-orange-700 dark:border-orange-600",
          text: "text-orange-900 dark:text-orange-200 font-extrabold",
          bg: "bg-white/90 dark:bg-gray-900/70",
        },
        D: {
          border: "border-red-600 dark:border-red-500",
          text: "text-red-800 dark:text-red-200 font-extrabold",
          bg: "bg-white/90 dark:bg-gray-900/70",
        },
        F: {
          border: "border-red-700 dark:border-red-600",
          text: "text-red-900 dark:text-red-200 font-extrabold",
          bg: "bg-white/90 dark:bg-gray-900/70",
        },
      };
    return (
      styles[grade] || {
        border: "border-gray-600 dark:border-gray-500",
        text: "text-gray-800 dark:text-gray-200 font-extrabold",
        bg: "bg-white/90 dark:bg-gray-900/70",
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
          title="Back to History"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to History</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <TooltipProvider>
            {/* Feedback Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "gap-2 border-2 transition-all flex-1 sm:flex-none",
                    feedback
                      ? feedback.wasCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 hover:border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                        : "border-red-500 bg-red-50 dark:bg-red-900/20 hover:border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                      : "hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  )}
                >
                  {feedback ? (
                    <>
                      {feedback.wasCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                      <span className="text-sm font-medium hidden sm:inline">
                        {feedback.wasCorrect ? "Accurate" : "Inaccurate"}
                      </span>
                      <span className="text-sm font-medium sm:hidden">
                        {feedback.wasCorrect ? "✓" : "✗"}
                      </span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      <span className="hidden sm:inline">Track Accuracy</span>
                      <span className="sm:hidden">Track</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {feedback
                    ? "View and edit your feedback on this analysis"
                    : "Track how accurate this analysis was"}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Analyze Another Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAnalyzeAnother}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 shadow-lg flex-1 sm:flex-none"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">
                    Analyze Another Chart
                  </span>
                  <span className="sm:hidden">New Analysis</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analyze a new chart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Stock Symbol Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            {isEditingSymbol ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedSymbol}
                    onChange={(e) =>
                      setEditedSymbol(e.target.value.toUpperCase())
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="TICKER"
                    maxLength={5}
                    className="text-2xl font-black text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-purple-500 rounded-lg px-3 py-1 w-32 uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveSymbol}
                    disabled={isSavingSymbol}
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    title="Save (Enter)"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSavingSymbol}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    title="Cancel (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  Press{" "}
                  <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                    Enter
                  </kbd>{" "}
                  to save,{" "}
                  <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                    Esc
                  </kbd>{" "}
                  to cancel
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                  {stockSymbol || "Unknown Symbol"}
                </h2>
                <button
                  onClick={() => setIsEditingSymbol(true)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                  title="Edit stock symbol"
                >
                  <Edit2 className="w-4 h-4 text-gray-600 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200" />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {analysis.timeframe && (
              <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-semibold border border-purple-200 dark:border-purple-800">
                {analysis.timeframe}
              </span>
            )}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {format(new Date(analysis.createdAt), "MMM d, yyyy • HH:mm")}
            </p>
          </div>
        </motion.div>

        {/* General Analysis - Plain Language Explanation */}
        {analysis.chartSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 shadow-xl border-2 border-indigo-200 dark:border-indigo-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                <Activity className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  General Analysis
                </h3>
              </div>
            </div>
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
              {analysis.chartSummary}
            </p>
          </motion.div>
        )}

        {/* Chart Image & Grade Card - Side by Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start"
        >
          {/* Chart Image */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="relative w-full">
              <Image
                width={900}
                height={400}
                src={analysis.imageUrl}
                alt={`Chart for ${analysis.stockSymbol || "analysis"}`}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Grade Card */}
          {analysis.grade && (
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 shadow-xl bg-gradient-to-br w-full lg:min-w-[280px] lg:max-w-[280px]",
                getGradeBackgroundColor(analysis.grade)
              )}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Grade Badge */}
                <div
                  className={cn(
                    "w-32 h-32 rounded-2xl flex items-center justify-center text-6xl shadow-2xl",
                    getGradeStyles(analysis.grade || "")
                  )}
                >
                  {analysis.grade}
                </div>

                {/* Decision Badge */}
                {(() => {
                  const badgeStyle = getGradeBadgeStyle(analysis.grade);
                  return (
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 shadow-md",
                        badgeStyle.bg,
                        badgeStyle.border,
                        badgeStyle.text
                      )}
                    >
                      {analysis.shouldEnter ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                      <span className="text-xl font-bold">
                        {analysis.gradeLabel}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </motion.div>

        {/* Analysis Results */}
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Trade Setup Card */}
          {analysis.entryPrice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Trade Setup
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Entry Price */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Entry Price</span>
                  </div>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    ${parseFloat(analysis.entryPrice).toFixed(2)}
                  </p>
                </div>

                {/* Stop Loss */}
                {analysis.stopLoss && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <Shield className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium">Stop Loss</span>
                    </div>
                    <p className="text-3xl font-black text-red-600 dark:text-red-400">
                      ${parseFloat(analysis.stopLoss).toFixed(2)}
                    </p>
                  </div>
                )}

                {/* Take Profit */}
                {analysis.takeProfit && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Take Profit</span>
                    </div>
                    <p className="text-3xl font-black text-green-600 dark:text-green-400">
                      ${parseFloat(analysis.takeProfit).toFixed(2)}
                    </p>
                  </div>
                )}

                {/* Risk/Reward */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">Risk/Reward</span>
                  </div>
                  <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                    1:{parseFloat(analysis.riskRewardRatio || "0").toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}


          {/* Pullback Entry Recommendation */}
          {analysis.pullbackRecommendation && (
            <PullbackEntryRecommendation
              recommendation={analysis.pullbackRecommendation}
              currentPrice={analysis.entryPrice ? parseFloat(analysis.entryPrice) : undefined}
            />
          )}

          {/* Trade Thesis - For traders with technical knowledge */}
          {analysis.tradeThesis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 shadow-xl border-2 border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                  <Activity className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    Trade Thesis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Technical analysis summary
                  </p>
                </div>
              </div>
              <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                {analysis.tradeThesis}
              </p>
            </motion.div>
          )}

          {/* Overall Reason - Quick verdict */}
          {analysis.overallReason && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.37 }}
              className="bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-50 dark:from-cyan-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 rounded-2xl p-6 shadow-xl border-2 border-cyan-200 dark:border-cyan-800"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Bottom Line
                  </h4>
                  <p className="text-base text-gray-800 dark:text-gray-200">
                    {analysis.overallReason}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Key Strengths & Concerns */}
          {((analysis.keyStrengths && analysis.keyStrengths.length > 0) ||
            (analysis.keyConcerns && analysis.keyConcerns.length > 0)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Key Strengths */}
              {analysis.keyStrengths && analysis.keyStrengths.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-6 shadow-xl border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="bg-green-600 p-2 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-green-700 dark:text-green-300">
                        Key Strengths
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Why this setup looks good
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {analysis.keyStrengths.map((strength, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-l-4 border-green-500"
                      >
                        <p className="text-gray-900 dark:text-white flex items-start gap-2">
                          <span className="text-green-600 mt-0.5 flex-shrink-0">
                            ✓
                          </span>
                          <span>{strength}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Concerns */}
              {analysis.keyConcerns && analysis.keyConcerns.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-2xl p-6 shadow-xl border-2 border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="bg-orange-600 p-2 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-orange-700 dark:text-orange-300">
                        Key Concerns
                      </h4>
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        Risks to watch out for
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {analysis.keyConcerns.map((concern, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-l-4 border-orange-500"
                      >
                        <p className="text-gray-900 dark:text-white flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5 flex-shrink-0">
                            ⚠
                          </span>
                          <span>{concern}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Signals Section - Two Column Layout */}
          {((analysis.activeBullishSignals &&
            analysis.activeBullishSignals.length > 0) ||
            (analysis.activeBearishSignals &&
              analysis.activeBearishSignals.length > 0)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                Market Signals
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Bullish Signals Column */}
                {analysis.activeBullishSignals &&
                  analysis.activeBullishSignals.length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-6 shadow-xl border-2 border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="bg-green-600 p-2 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-green-700 dark:text-green-300">
                            Bullish Signals
                          </h4>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {analysis.activeBullishSignals.length} detected
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {analysis.activeBullishSignals.map((signal, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-l-4 border-green-500"
                          >
                            <p className="font-bold text-gray-900 dark:text-white flex items-start gap-2 mb-2">
                              <span className="text-green-600 mt-0.5">✓</span>
                              {signal.name}
                            </p>
                            {signal.explanation && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-5 leading-relaxed">
                                {signal.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Bearish Signals Column */}
                {analysis.activeBearishSignals &&
                  analysis.activeBearishSignals.length > 0 && (
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 rounded-2xl p-6 shadow-xl border-2 border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="bg-red-600 p-2 rounded-lg">
                          <TrendingDown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-red-700 dark:text-red-300">
                            Bearish Signals
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {analysis.activeBearishSignals.length} detected
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {analysis.activeBearishSignals.map((signal, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-l-4 border-red-500"
                          >
                            <p className="font-bold text-gray-900 dark:text-white flex items-start gap-2 mb-2">
                              <span className="text-red-600 mt-0.5">✗</span>
                              {signal.name}
                            </p>
                            {signal.explanation && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-5 leading-relaxed">
                                {signal.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </motion.div>
          )}

          {/* No-Go Conditions */}
          {analysis.activeNoGoConditions &&
            analysis.activeNoGoConditions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-2xl p-6 shadow-xl border-2 border-yellow-300 dark:border-yellow-700"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-yellow-600 p-2 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-yellow-800 dark:text-yellow-300">
                      Risk Factors
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      {analysis.activeNoGoConditions.length} warning(s) detected
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {analysis.activeNoGoConditions.map((condition, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-yellow-500"
                    >
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      <p className="font-bold text-gray-900 dark:text-white">
                        {condition.name}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
        </div>
      </div>

      {/* Analysis Limit Modal */}
      <AnalysisLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        analysesUsed={usageData?.analysesUsed ?? 0}
        analysesLimit={usageData?.analysesLimit ?? 0}
        subscriptionTier={usageData?.subscriptionTier ?? "free"}
      />

      {/* Feedback Modal */}
      <AnalysisFeedbackModal
        analysis={analysis}
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        existingFeedback={feedback}
      />
    </div>
  );
}
