import { useQuery } from '@tanstack/react-query'
import apiClient from '../client'

interface ScheduledEmail {
  id: string
  userId: string
  userEmail: string | null
  userName: string | null
  emailType: string
  recipientEmail: string
  subject: string
  promoCode: string | null
  scheduledFor: string
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  sentAt: string | null
  cancelledAt: string | null
  cancellationReason: string | null
  error: string | null
  metadata: any
  createdAt: string
}

interface ScheduledEmailsResponse {
  emails: ScheduledEmail[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  stats: {
    pending: number
    sent: number
    failed: number
    cancelled: number
  }
}

interface UseScheduledEmailsParams {
  status?: 'pending' | 'sent' | 'failed' | 'cancelled' | 'all'
  sequenceId?: string
  userId?: string
  limit?: number
  offset?: number
}

export const useScheduledEmails = (params: UseScheduledEmailsParams = {}) => {
  return useQuery<ScheduledEmailsResponse>({
    queryKey: ['admin', 'scheduled-emails', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      
      if (params.status) searchParams.set('status', params.status)
      if (params.sequenceId) searchParams.set('sequenceId', params.sequenceId)
      if (params.userId) searchParams.set('userId', params.userId)
      if (params.limit) searchParams.set('limit', params.limit.toString())
      if (params.offset) searchParams.set('offset', params.offset.toString())

      const { data } = await apiClient.get(`/api/admin/scheduled-emails?${searchParams.toString()}`)
      
      // Extract data from ApiResponse wrapper
      if (data && data.success && data.data) {
        return data.data
      }
      
      throw new Error('Invalid response structure from server')
    },
  })
}

