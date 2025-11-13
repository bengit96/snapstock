"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  useBillingUsage,
  useCreateCheckout,
  useOpenBillingPortal,
} from "@/lib/api/hooks/useBilling";
import { format, differenceInDays } from "date-fns";
import {
  CreditCard,
  Calendar,
  BarChart3,
  Crown,
  Zap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // React Query hooks
  const { data: usageData, isLoading: loading, refetch } = useBillingUsage();
  const createCheckout = useCreateCheckout();
  const openBillingPortal = useOpenBillingPortal();

  // Redirect if not authenticated (client-side only via useEffect)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  // Return null while redirecting
  if (!session) {
    return null;
  }

  const handleUpgrade = async (tier: "monthly" | "yearly") => {
    try {
      const data = await createCheckout.mutateAsync({ tier });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to start checkout. Please try again.");
    }
  };

  const handleManageBilling = async () => {
    try {
      const data = await openBillingPortal.mutateAsync();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to open billing portal. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  const hasSubscription = usageData?.subscriptionTier !== null;
  const isActiveSubscription = usageData?.subscriptionStatus === "active";
  const isCancelledSubscription = usageData?.subscriptionStatus === "cancelled";
  const isMonthly = usageData?.subscriptionTier === "monthly";
  const isYearly = usageData?.subscriptionTier === "yearly";
  const isFreeTrial = !hasSubscription || isCancelledSubscription;
  const daysUntilReset = usageData?.currentPeriodEnd
    ? differenceInDays(new Date(usageData.currentPeriodEnd), new Date())
    : null;

  const analysesRemaining =
    usageData?.analysesLimit !== null && usageData?.analysesLimit !== undefined
      ? Math.max(0, usageData.analysesLimit - usageData.analysesUsed)
      : "Unlimited";

  const freeAnalysesUsed = usageData?.analysesUsed || 0;
  const freeAnalysesLimit = usageData?.freeAnalysesLimit || 1; // Get dynamic limit from API (can be 1, 3, etc.)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Billing & Usage
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your subscription and track your usage
            </p>
          </div>

          {/* Current Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Current Plan
                </h2>
                <div className="flex items-center gap-3">
                  {isYearly ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
                      <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        Yearly Plan
                      </span>
                    </div>
                  ) : isMonthly ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                        Monthly Plan
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Free Plan
                      </span>
                    </div>
                  )}

                  {usageData?.subscriptionStatus === "active" && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  )}
                </div>
              </div>

              {hasSubscription && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleManageBilling}
                  disabled={openBillingPortal.isPending}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {openBillingPortal.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  Manage Billing
                </motion.button>
              )}
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Analyses Used */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">Analyses This Period</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {usageData?.analysesUsed || 0}
                  </span>
                  {usageData?.analysesLimit && (
                    <span className="text-gray-500 dark:text-gray-400">
                      / {usageData.analysesLimit}
                    </span>
                  )}
                </div>
                {!hasSubscription && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {freeAnalysesLimit} free analysis available
                  </p>
                )}
              </div>

              {/* Analyses Remaining */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Analyses Remaining</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isFreeTrial
                    ? Math.max(0, freeAnalysesLimit - freeAnalysesUsed)
                    : analysesRemaining}
                </div>
                {isFreeTrial && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {freeAnalysesUsed >= freeAnalysesLimit
                      ? "Upgrade for unlimited analyses"
                      : "Free analysis available"}
                  </p>
                )}
                {usageData?.analysesLimit === null && hasSubscription && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Unlimited with lifetime plan
                  </p>
                )}
                {usageData?.analysesLimit !== null && hasSubscription && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Resets monthly
                  </p>
                )}
              </div>

              {/* Billing Cycle */}
              {hasSubscription && daysUntilReset !== null && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Next Billing Date</span>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {daysUntilReset}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      days remaining
                    </p>
                  </div>
                  {usageData?.currentPeriodEnd && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(
                        new Date(usageData.currentPeriodEnd),
                        "MMM d, yyyy"
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Upgrade Options */}
          {!isYearly && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {hasSubscription ? "Upgrade Your Plan" : "Choose a Plan"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Plan */}
                {!isMonthly && !isYearly && (
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Monthly
                      </h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          $19.99
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          /month
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        100 analyses per month
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Cancel anytime
                      </li>
                    </ul>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpgrade("monthly")}
                      disabled={createCheckout.isPending}
                      className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {createCheckout.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        "Start Monthly"
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* Yearly Plan */}
                {!isYearly && (
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-purple-500 relative"
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full">
                        SAVE 17%
                      </span>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Yearly
                      </h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          $199.99
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          /year
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Just $16.67/month
                      </p>
                    </div>

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        300 analyses per month
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Priority Support
                      </li>
                    </ul>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpgrade("yearly")}
                      disabled={createCheckout.isPending}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 shadow-lg"
                    >
                      {createCheckout.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : isMonthly ? (
                        "Upgrade to Yearly"
                      ) : (
                        "Get Yearly - Best Value"
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
