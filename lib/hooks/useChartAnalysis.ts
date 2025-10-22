import { useState, useCallback } from 'react'
import { useAnalyzeChart } from '@/lib/hooks/useApi'
import type { DetailedAnalysisResult } from '@/lib/types'
import { ERROR_MESSAGES } from '@/lib/constants'

interface UseChartAnalysisOptions {
  onSuccess?: (result: DetailedAnalysisResult) => void
  onError?: (error: string) => void
}

/**
 * Custom hook for chart analysis functionality
 */
export function useChartAnalysis(options?: UseChartAnalysisOptions) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<DetailedAnalysisResult | null>(null)

  const mutation = useAnalyzeChart({
    onSuccess: (data) => {
      setAnalysisResult(data)
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Chart analysis failed:', error)
      options?.onError?.(error.message)
    },
  })

  const analyzeChart = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        options?.onError?.(ERROR_MESSAGES.invalidChart)
        return
      }

      // Convert to base64 for preview
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })

      const base64 = await base64Promise
      setUploadedImage(base64)

      // Analyze the chart
      mutation.mutate(file)
    },
    [mutation, options]
  )

  const reset = useCallback(() => {
    setUploadedImage(null)
    setAnalysisResult(null)
    mutation.reset()
  }, [mutation])

  return {
    // State
    uploadedImage,
    analysisResult,
    isAnalyzing: mutation.isPending,
    error: mutation.error?.message,

    // Actions
    analyzeChart,
    reset,
  }
}