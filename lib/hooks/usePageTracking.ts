/**
 * Hook for tracking page visits client-side
 */

import { useEffect, useRef } from 'react'
import { analyticsTrackingService } from '@/lib/services/api.service'

interface UsePageTrackingOptions {
  eventType: string
  metadata?: Record<string, any>
  enabled?: boolean
}

export function usePageTracking({
  eventType,
  metadata,
  enabled = true,
}: UsePageTrackingOptions) {
  const tracked = useRef(false)

  useEffect(() => {
    if (!enabled || tracked.current) {
      return
    }

    // Mark as tracked to prevent duplicate calls
    tracked.current = true

    // Track the page visit
    analyticsTrackingService.trackEvent(eventType, metadata).catch((error) => {
      console.error('Failed to track page visit:', error)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, enabled])
}
