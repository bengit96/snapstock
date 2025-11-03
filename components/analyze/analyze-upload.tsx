'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, Check, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, STOCK_SELECTION_CHECKLIST } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface AnalyzeUploadProps {
  onImageUpload: (image: string) => void
  onImageClear?: () => void
  uploadedImage?: string | null
  showLogin?: boolean
}

export function AnalyzeUpload({
  onImageUpload,
  onImageClear,
  uploadedImage,
  showLogin = false
}: AnalyzeUploadProps) {
  const [localImage, setLocalImage] = useState<string | null>(uploadedImage || null)

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLocalImage(result)
        onImageUpload(result)
      }
      reader.readAsDataURL(acceptedFiles[0])
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  })

  const handleClearImage = () => {
    setLocalImage(null)
    onImageClear?.()
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!localImage ? (
          <motion.div
            key="upload-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Hero Section - Compact */}
            <div className="mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-3"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  AI-Powered Analysis in Seconds
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight"
              >
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Analyze Your Chart
                </span>
                {' '}
                <span className="text-gray-900 dark:text-white">& Get Instant Insights</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4"
              >
                Upload your stock chart and receive professional-grade analysis instantly
              </motion.p>
            </div>

            {/* Upload Zone - Attractive with Integrated Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-6 max-w-3xl mx-auto px-4"
            >
              <div
                {...getRootProps()}
                className={cn(
                  'relative overflow-hidden cursor-pointer transition-all duration-300',
                  'rounded-2xl border-2',
                  isDragActive
                    ? 'border-purple-400 dark:border-purple-500 scale-[1.01]'
                    : 'border-purple-200/50 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700/50'
                )}
              >
                <input {...getInputProps()} />

                {/* Gradient Background */}
                <div className={cn(
                  'absolute inset-0 transition-opacity duration-300',
                  isDragActive
                    ? 'bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 dark:from-purple-950/40 dark:via-pink-950/20 dark:to-purple-950/40'
                    : 'bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 dark:from-purple-950/20 dark:via-gray-900 dark:to-pink-950/20'
                )} />

                {/* Content */}
                <div className="relative py-8 px-6">
                  <div className="text-center space-y-4">
                    {/* Upload Icon with Glow */}
                    <div className="relative inline-block">
                      <div className={cn(
                        "absolute inset-0 rounded-full blur-xl transition-opacity",
                        isDragActive
                          ? "bg-purple-400/40 opacity-100"
                          : "bg-purple-300/20 opacity-0 group-hover:opacity-100"
                      )} />
                      <div className={cn(
                        "relative w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isDragActive
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                          : "bg-gradient-to-br from-purple-400/80 to-pink-400/80 shadow-md"
                      )}>
                        <Upload className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Main Text */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {isDragActive ? 'Drop your chart here' : 'Upload Your Chart'}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Drag and drop or click to browse
                      </p>
                    </div>

                    {/* Integrated Recommendations */}
                    <div className="max-w-lg mx-auto pt-2">
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                        <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                          Recommended Setup
                        </span>
                      </div>

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
                    </div>

                    {/* Stock Selection Requirements - Compact */}
                    <div className="max-w-lg mx-auto pt-2 border-t border-purple-200/30 dark:border-purple-700/30 mt-2">
                      <div className="flex items-center justify-center gap-1.5 mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                          Recommended Stock Criteria
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                        {STOCK_SELECTION_CHECKLIST.map((requirement, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-gray-400"
                          >
                            <div className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 flex-shrink-0" />
                            <span className="font-medium">{requirement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated border gradient */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl transition-opacity pointer-events-none",
                  isDragActive ? "opacity-100" : "opacity-0"
                )}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-20 blur-xl" />
                </div>
              </div>
            </motion.div>

            {/* Live Chart Warning - Below Upload Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-3xl mx-auto px-4"
            >
              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
                      ⚠️ LIVE CHARTS ONLY
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                      <strong>Do not upload old/historical charts.</strong> Only upload <strong>live, current charts</strong> from your trading platform. The analysis is designed for real-time trading decisions, not historical review.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="uploaded-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-center px-4"
          >
            {/* Success State */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Chart Uploaded Successfully!
              </h2>

              <img
                src={localImage}
                alt="Uploaded chart"
                className="max-w-full max-h-96 mx-auto rounded-xl shadow-lg mb-6"
              />

              {showLogin ? (
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Sign in to get your instant AI analysis
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Analyzing your chart...
                </p>
              )}

              <button
                onClick={handleClearImage}
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Upload a different chart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}