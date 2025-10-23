'use client'

import { usePageTracking } from '@/lib/hooks/usePageTracking'

interface PageTrackerProps {
  eventType: string
}

export function PageTracker({ eventType }: PageTrackerProps) {
  usePageTracking({ eventType })
  return null
}
