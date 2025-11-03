"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnalyzeUpload } from "@/components/analyze/analyze-upload";
import { useBillingUsage } from "@/lib/api/hooks/useBilling";
import { AnalysisLimitModal } from "@/components/modals/analysis-limit-modal";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProtectedAnalyzePage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [hasProcessedPendingImage, setHasProcessedPendingImage] =
    useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // React Query hooks
  const { data: usageData, refetch: refetchUsage } = useBillingUsage();

  // Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  const handleImageUpload = async (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setError(null);
    setIsAnalyzing(true);

    try {
      // Skip limit checks for admin users
      if (!isAdmin) {
        // Refetch usage to get latest data
        const { data: latestUsage } = await refetchUsage();

        if (
          latestUsage?.analysesLimit !== null &&
          latestUsage?.analysesLimit !== undefined &&
          latestUsage?.analysesUsed >= latestUsage?.analysesLimit
        ) {
          setIsLimitModalOpen(true);
          setIsAnalyzing(false);
          return;
        }
      }

      // Use the consolidated API endpoint with JSON body
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          setIsLimitModalOpen(true);
          setIsAnalyzing(false);
          return;
        }
        throw new Error(errorData.error || "Failed to analyze chart");
      }

      const result = await response.json();

      // Extract data from the API response wrapper
      const data = result.data || result;

      // Clear the pending image from sessionStorage
      sessionStorage.removeItem("pendingAnalysisImageUrl");

      // Brief delay to show completion before redirect for smoother UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to analysis result page
      router.push(`/analysis/${data.id}`);
    } catch (err) {
      console.error("Analysis error:", err);
      setIsAnalyzing(false);

      // Check if it's a 402 error (payment required / limit reached) - but not for admins
      if (!isAdmin && err instanceof Error && err.message.includes("limit")) {
        setIsLimitModalOpen(true);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to analyze chart"
        );
      }
    }
  };

  const handleImageClear = () => {
    setUploadedImage(null);
    setError(null);
    setIsLimitModalOpen(false);
    setIsAnalyzing(false);
  };

  const handleRetry = () => {
    setUploadedImage(null);
    setError(null);
    setIsAnalyzing(false);
  };

  // Check for pending image from public analyze page and auto-process
  useEffect(() => {
    if (
      status === "authenticated" &&
      !hasProcessedPendingImage &&
      !isAnalyzing
    ) {
      const storedImageUrl = sessionStorage.getItem("pendingAnalysisImageUrl");
      if (storedImageUrl) {
        setHasProcessedPendingImage(true);
        handleImageUpload(storedImageUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, hasProcessedPendingImage]);

  if (status === "loading") {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Analyzing Your Chart
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI is examining your chart for patterns and signals...
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="w-full">
            <AnalyzeUpload
              onImageUpload={handleImageUpload}
              onImageClear={handleImageClear}
              uploadedImage={uploadedImage}
              showLogin={false}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto mt-4"
              >
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
                        Analysis Failed
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Try Again with Another Chart
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Analysis Limit Modal */}
      <AnalysisLimitModal
        isOpen={isLimitModalOpen}
        onClose={(shouldRedirect = true) => {
          setIsLimitModalOpen(false);
          // Clear the uploaded image state
          setUploadedImage(null);
          setError(null);
          setIsAnalyzing(false);
          // Only redirect to home if user clicked "Maybe Later" or closed the modal
          if (shouldRedirect) {
            router.push('/');
          }
        }}
        analysesUsed={usageData?.analysesUsed ?? 0}
        analysesLimit={usageData?.analysesLimit ?? 0}
        subscriptionTier={usageData?.subscriptionTier ?? "free"}
      />
    </div>
  );
}
