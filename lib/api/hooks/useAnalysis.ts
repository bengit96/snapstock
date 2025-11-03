import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../client'
import { toast } from 'sonner'

interface Analysis {
  id: string
  stockSymbol: string | null
  grade: string | null
  gradeColor: string | null
  gradeLabel: string | null
  shouldEnter: boolean | null
  entryPrice: string | null
  stopLoss: string | null
  takeProfit: string | null
  riskRewardRatio: string | null
  createdAt: string
  imageUrl: string
  feedbackWasCorrect: boolean | null
}

interface AnalysisResponse {
  id: string
  imageUrl: string
  grade: string
  analysis: unknown
}

interface AnalysesHistoryResponse {
  analyses: Analysis[]
}

// Fetch user's analysis history
export const useAnalyses = () => {
  return useQuery<Analysis[]>({
    queryKey: ['analyses'],
    queryFn: async () => {
      const { data } = await apiClient.get<AnalysesHistoryResponse>('/api/analyses/history')
      return data.analyses || []
    },
  })
}

// Create a new chart analysis
export const useCreateAnalysis = () => {
  const queryClient = useQueryClient()

  return useMutation<AnalysisResponse, Error, FormData>({
    mutationFn: async (formData) => {
      const { data } = await apiClient.post('/api/analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch analyses list
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
      // Also invalidate billing usage as it affects analysis count
      queryClient.invalidateQueries({ queryKey: ['billing', 'usage'] })
      toast.success('Chart analyzed successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to analyze chart')
    },
  })
}
