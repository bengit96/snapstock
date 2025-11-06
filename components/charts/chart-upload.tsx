'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { Upload, Brain, Sparkles } from 'lucide-react'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ChartUploadProps {
  onDrop: (files: File[]) => void
  uploadedImage?: string | null
  isUploading?: boolean
  error?: string | null
  onErrorDismiss?: () => void
  className?: string
}

export function ChartUpload({
  onDrop,
  uploadedImage,
  isUploading = false,
  error,
  onErrorDismiss,
  className
}: ChartUploadProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onDrop(acceptedFiles)
      }
    },
    [onDrop]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: isUploading
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI-Powered Chart Analysis
        </CardTitle>
        <CardDescription>
          Upload a stock chart screenshot for instant AI analysis
        </CardDescription>
        <div className="mt-3 space-y-3">
          {/* Axis Visibility Warning */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              X & Y Axis Must Be Visible
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Ensure both axes (time and price) are clearly visible for accurate analysis
            </p>
          </div>

          {/* Recommended Setup */}
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Recommended Indicators:
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-purple-800 dark:text-purple-200">
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                MACD
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                EMA 9
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                Volume Chart
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                EMA 20
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                VWAP
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                EMA 200
              </div>
            </div>
            <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mt-3 mb-1">
              Recommended Time Frame:
            </p>
            <p className="text-xs text-purple-800 dark:text-purple-200">
              1min or 5min charts for best results
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
            isDragActive && 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
            !isDragActive && 'border-gray-300 dark:border-gray-700 hover:border-purple-400',
            isUploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />

          <AnimatePresence mode="wait">
            {uploadedImage ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <UploadedImagePreview
                  image={uploadedImage}
                  isAnalyzing={isUploading}
                />
              </motion.div>
            ) : (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <UploadPrompt isDragActive={isDragActive} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onDismiss={onErrorDismiss}
            className="mt-4"
          />
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Upload prompt component
 */
function UploadPrompt({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="space-y-3">
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <div>
        <p className="text-lg font-medium">
          {isDragActive ? 'Drop the chart here' : 'Drag & drop a stock chart'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          or click to select from your computer
        </p>
      </div>
    </div>
  )
}

/**
 * Uploaded image preview component
 */
function UploadedImagePreview({
  image,
  isAnalyzing
}: {
  image: string
  isAnalyzing: boolean
}) {
  return (
    <div className="space-y-4">
      <img
        src={image}
        alt="Uploaded chart"
        className="max-h-64 mx-auto rounded-lg shadow-md"
      />
      {isAnalyzing ? (
        <LoadingSpinner
          size="sm"
          message="Analyzing chart with AI..."
          className="mt-4"
        />
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click or drag to upload a new chart
        </p>
      )}
    </div>
  )
}