"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TrendingUp, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisLimitModalProps {
  isOpen: boolean;
  onClose: (shouldRedirect?: boolean) => void;
  analysesUsed: number;
  analysesLimit: number;
  subscriptionTier: string;
}

export function AnalysisLimitModal({
  isOpen,
  onClose,
  analysesUsed,
  analysesLimit,
  subscriptionTier,
}: AnalysisLimitModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose(false); // Don't redirect to home when navigating to billing
    router.push("/billing");
  };

  const handleViewPricing = () => {
    onClose(false); // Don't redirect to home when navigating to pricing
    router.push("/pricing");
  };

  const isFreeUser = subscriptionTier === "free";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose(true)}>
      <DialogContent className="sm:max-w-[500px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              {isFreeUser
                ? "Free Trial Limit Reached"
                : "Monthly Analysis Limit Reached"}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {isFreeUser ? (
                <>
                  You've used your free analysis. Upgrade now to unlock
                  unlimited stock analysis and advanced insights!
                </>
              ) : (
                <>
                  You've reached your monthly limit of{" "}
                  <strong>{analysesLimit} analyses</strong>. Upgrade your plan
                  for more analyses or wait until next month.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {/* Usage Display */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Analyses Used
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {analysesUsed} / {analysesLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Upgrade to unlock:
              </p>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>100-300 monthly analyses</strong> depending on your
                    plan
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Advanced stock insights and analysis
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Crown className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Priority support and updates
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 pt-4">
              <Button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
              >
                Upgrade Now
              </Button>
              <Button
                onClick={handleViewPricing}
                variant="outline"
                className="w-full"
              >
                View Pricing Plans
              </Button>
              <Button
                onClick={() => onClose(true)}
                variant="ghost"
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
