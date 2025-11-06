"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  STOCK_SELECTION_CHECKLIST,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export function UploadSection() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        const file = acceptedFiles[0];

        try {
          // Upload image to blob storage immediately
          const formData = new FormData();
          formData.append("image", file);

          const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to upload image");
          }

          const data = await response.json();

          // Store blob URL in sessionStorage
          sessionStorage.setItem("pendingAnalysisImageUrl", data.imageUrl);

          // Redirect to analyze page
          router.push("/analyze");
        } catch (error) {
          console.error("Upload error:", error);
          setIsUploading(false);

          // Show user-friendly error message
          alert(
            error instanceof Error
              ? error.message
              : "Failed to upload image. Please try again."
          );
        }
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: isUploading,
  });

  return (
    <section
      id="upload-chart"
      className="py-20 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20"
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold text-sm mb-4 shadow-lg">
            🎁 FREE for Everyone
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ready to Try? Upload Your Chart
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Get your first analysis free - no signup, no credit card required
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div
            {...getRootProps()}
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              "rounded-2xl border-2",
              isUploading
                ? "cursor-not-allowed opacity-50 border-gray-300 dark:border-gray-700"
                : "cursor-pointer",
              !isUploading && isDragActive
                ? "border-purple-400 dark:border-purple-500 scale-[1.01]"
                : !isUploading &&
                    "border-purple-200/50 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700/50"
            )}
          >
            <input {...getInputProps()} disabled={isUploading} />

            {/* Gradient Background */}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                isDragActive
                  ? "bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 dark:from-purple-950/40 dark:via-pink-950/20 dark:to-purple-950/40"
                  : "bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 dark:from-purple-950/20 dark:via-gray-900 dark:to-pink-950/20"
              )}
            />

            {/* Content */}
            <div className="relative py-6 md:py-8 px-4 md:px-6">
              <div className="text-center space-y-3 md:space-y-4">
                {/* Upload Icon with Glow */}
                <div className="relative inline-block">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full blur-xl transition-opacity",
                      isDragActive
                        ? "bg-purple-400/40 opacity-100"
                        : "bg-purple-300/20 opacity-0 group-hover:opacity-100"
                    )}
                  />
                  <div
                    className={cn(
                      "relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all",
                      isUploading
                        ? "bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg"
                        : isDragActive
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                        : "bg-gradient-to-br from-purple-400/80 to-pink-400/80 shadow-md"
                    )}
                  >
                    {isUploading ? (
                      <Loader2
                        className="w-5 h-5 md:w-6 md:h-6 text-white animate-spin"
                        strokeWidth={2}
                      />
                    ) : (
                      <Upload
                        className="w-5 h-5 md:w-6 md:h-6 text-white"
                        strokeWidth={2}
                      />
                    )}
                  </div>
                </div>

                {/* Main Text */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {isUploading
                      ? "Uploading..."
                      : isDragActive
                      ? "Drop your chart here"
                      : "Upload Your Chart"}
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
                    {isUploading
                      ? "Processing your chart..."
                      : "Tap to browse or drag & drop"}
                  </p>
                </div>

                {/* Simple Instructions */}
                <div className="max-w-lg mx-auto pt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Upload any trading chart - our AI will analyze it instantly
                  </p>
                  <details className="mt-3 text-center">
                    <summary className="text-xs text-purple-600 dark:text-purple-400 cursor-pointer hover:text-purple-700 dark:hover:text-purple-300 font-medium inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Best results? See recommended setup
                    </summary>
                    <div className="mt-3 space-y-3">
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-purple-200/50 dark:border-purple-700/50">
                          1-5min timeframe
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-purple-200/50 dark:border-purple-700/50">
                          MACD
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-purple-200/50 dark:border-purple-700/50">
                          EMA 9, 20, 200
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-purple-200/50 dark:border-purple-700/50">
                          Volume bars
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-gray-500 dark:text-gray-500">
                        {STOCK_SELECTION_CHECKLIST.map((requirement, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5"
                          >
                            <div className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 flex-shrink-0" />
                            <span>{requirement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            {/* Animated border gradient */}
            <div
              className={cn(
                "absolute inset-0 rounded-2xl transition-opacity pointer-events-none",
                isDragActive ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-20 blur-xl" />
            </div>
          </div>

          {/* Helpful Tips - Below Upload Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-3"
          >
            {/* Axis Visibility Warning */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 md:p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs md:text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
                    ⚠️ Important: Axis Visibility
                  </h4>
                  <p className="text-[10px] md:text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    Ensure both <strong>X-axis (time)</strong> and <strong>Y-axis (price)</strong> are clearly visible in your chart for accurate AI analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 md:p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs md:text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                    💡 Pro Tip
                  </h4>
                  <p className="text-[10px] md:text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    For best results, upload <strong>live charts</strong> from your trading platform.
                    Our AI is optimized for real-time trading decisions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
