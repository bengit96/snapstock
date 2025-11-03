'use client'

import { CheckCircle, XCircle, TrendingUp, TrendingDown, MessageSquare, Edit, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface FeedbackDisplayProps {
  feedback: {
    wasCorrect: boolean
    notes?: string | null
    actualHighPrice?: string | null
    actualLowPrice?: string | null
    screenshotUrl?: string | null
    additionalNotes?: string | null
    createdAt: Date
  }
  onEdit?: () => void
}

export function FeedbackDisplay({ feedback, onEdit }: FeedbackDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          Your Feedback
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors group"
            title="Edit feedback"
          >
            <Edit className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Edit</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Main Result */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          {feedback.wasCorrect ? (
            <>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-bold text-green-700 dark:text-green-400 text-lg">Analysis was Accurate</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">The prediction played out as expected</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-bold text-red-700 dark:text-red-400 text-lg">Analysis was Inaccurate</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">The prediction didn't play out</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Notes */}
        {feedback.notes && (
          <div className="p-4 rounded-lg bg-white dark:bg-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Quick Notes</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{feedback.notes}</p>
          </div>
        )}

        {/* Additional Details */}
        {(feedback.actualHighPrice || feedback.actualLowPrice || feedback.screenshotUrl || feedback.additionalNotes) && (
          <div className="border-t border-purple-200 dark:border-purple-700 pt-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Additional Details</p>

            {/* Price Movement */}
            {(feedback.actualHighPrice || feedback.actualLowPrice) && (
              <div className="grid grid-cols-2 gap-3">
                {feedback.actualHighPrice && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 mb-1">
                      <TrendingUp className="w-3 h-3" />
                      Highest Price
                    </div>
                    <p className="font-bold text-lg text-green-900 dark:text-green-200">${parseFloat(feedback.actualHighPrice).toFixed(2)}</p>
                  </div>
                )}
                {feedback.actualLowPrice && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-1 text-xs text-red-700 dark:text-red-400 mb-1">
                      <TrendingDown className="w-3 h-3" />
                      Lowest Price
                    </div>
                    <p className="font-bold text-lg text-red-900 dark:text-red-200">${parseFloat(feedback.actualLowPrice).toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Screenshot */}
            {feedback.screenshotUrl && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileImage className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Updated Screenshot</p>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={feedback.screenshotUrl}
                    alt="Updated chart screenshot"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {feedback.additionalNotes && (
              <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-2 uppercase tracking-wide">Detailed Notes</p>
                <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed whitespace-pre-wrap">{feedback.additionalNotes}</p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 text-right pt-2">
          Feedback recorded on {new Date(feedback.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
