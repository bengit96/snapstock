import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/services/analytics.service'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()

    const { eventType, metadata } = body

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    // Track the event - handle special cases
    if (eventType === 'landing_page_visit') {
      await analyticsService.trackLandingPageVisit(
        request,
        session?.user?.id
      )
    } else {
      await analyticsService.trackEvent(
        {
          eventType,
          userId: session?.user?.id,
          metadata,
        },
        request
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
