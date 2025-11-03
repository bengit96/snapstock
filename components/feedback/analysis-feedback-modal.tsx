'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, ChevronDown, Upload, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ChartAnalysis } from '@/lib/types'

interface AnalysisFeedbackModalProps {
  analysis: ChartAnalysis
  isOpen: boolean
  onClose: () => void
  onSubmit: (feedback: FeedbackData) => Promise<void>
  existingFeedback?: FeedbackData | null
}

export interface FeedbackData {
  wasCorrect: boolean
  notes?: string
  actualHighPrice?: number
  actualLowPrice?: number
  screenshotUrl?: string
  additionalNotes?: string
}

export function AnalysisFeedbackModal({
  analysis,
  isOpen,
  onClose,
  onSubmit,
  existingFeedback
}: AnalysisFeedbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMoreDetails, setShowMoreDetails] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [formData, setFormData] = useState<FeedbackData>({
    wasCorrect: existingFeedback?.wasCorrect ?? true,
    notes: existingFeedback?.notes || '',
    actualHighPrice: existingFeedback?.actualHighPrice,
    actualLowPrice: existingFeedback?.actualLowPrice,
    screenshotUrl: existingFeedback?.screenshotUrl,
    additionalNotes: existingFeedback?.additionalNotes || '',
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        setFormData({ ...formData, screenshotUrl: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Analysis Feedback</h2>
                <p className="text-sm text-purple-100 mt-1">
                  Track accuracy and learn from this analysis
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Main Question: Was it accurate? */}
            <div>
              <label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
                Was the analysis accurate?
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setFormData({ ...formData, wasCorrect: true })}
                  className={`flex-1 p-6 rounded-xl border-2 transition-all ${
                    formData.wasCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <CheckCircle className={`w-10 h-10 mx-auto mb-3 ${formData.wasCorrect ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-lg font-semibold block">Yes</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">It played out as predicted</span>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, wasCorrect: false })}
                  className={`flex-1 p-6 rounded-xl border-2 transition-all ${
                    !formData.wasCorrect
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <XCircle className={`w-10 h-10 mx-auto mb-3 ${!formData.wasCorrect ? 'text-red-600' : 'text-gray-400'}`} />
                  <span className="text-lg font-semibold block">No</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">It didn't play out</span>
                </button>
              </div>
            </div>

            {/* Quick Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Quick summary of what happened..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* More Details Accordion */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => setShowMoreDetails(!showMoreDetails)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
              >
                <span className="font-semibold text-gray-900 dark:text-white">More Details (Optional)</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    showMoreDetails ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showMoreDetails && (
                <div className="p-4 pt-0 space-y-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Price Tracking */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                        Highest Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.actualHighPrice || ''}
                        onChange={(e) => setFormData({ ...formData, actualHighPrice: parseFloat(e.target.value) || undefined })}
                        placeholder="e.g., 155.50"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        <TrendingDown className="w-4 h-4 inline mr-1" />
                        Lowest Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.actualLowPrice || ''}
                        onChange={(e) => setFormData({ ...formData, actualLowPrice: parseFloat(e.target.value) || undefined })}
                        placeholder="e.g., 148.20"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  {/* Upload Screenshot */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Upload New Screenshot
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <label
                        htmlFor="screenshot-upload"
                        className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-all"
                      >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {uploadedImage ? 'Change screenshot' : 'Click to upload screenshot'}
                        </span>
                      </label>
                    </div>
                    {uploadedImage && (
                      <div className="mt-3">
                        <img
                          src={uploadedImage}
                          alt="Uploaded screenshot"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="Detailed observations, lessons learned, what you would do differently next time..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 p-6 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
