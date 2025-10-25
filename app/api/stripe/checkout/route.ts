import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'
import { withRateLimit, RATE_LIMITS } from '@/lib/utils/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user?.id || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Apply rate limiting: 5 checkout sessions per hour per user
    const rateLimitResult = await withRateLimit(request, RATE_LIMITS.checkout, session.user.id)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many checkout requests. Please try again later.',
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      )
    }

    // Validate request body
    const { parseRequestBody, checkoutRequestSchema } = await import('@/lib/validations/schemas')
    const validation = await parseRequestBody(request, checkoutRequestSchema)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { tier } = validation.data

    const checkoutSession = await createCheckoutSession(
      session.user.id,
      session.user.email,
      tier
    )

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}