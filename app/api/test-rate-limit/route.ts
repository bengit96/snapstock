import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { withRateLimit, RATE_LIMITS } from '@/lib/utils/rate-limit'

/**
 * Test endpoint to demonstrate 10 requests per 10 seconds rate limiting
 * This endpoint can be used to test the rate limiting functionality
 */
export async function GET(request: NextRequest) {
  try {
    // Get session (optional - rate limit can work with or without auth)
    const session = await auth()
    const userId = session?.user?.id

    // Apply the new "quick" rate limit: 10 requests per 10 seconds
    const rateLimitResult = await withRateLimit(request, RATE_LIMITS.quick, userId)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Maximum 10 requests per 10 seconds.',
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          resetTime: new Date(rateLimitResult.reset).toISOString(),
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000) + ' seconds'
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString()
          }
        }
      )
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: 'Request successful',
      rateLimitInfo: {
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        resetTime: new Date(rateLimitResult.reset).toISOString()
      },
      timestamp: new Date().toISOString(),
      identifier: userId ? `user:${userId}` : 'anonymous'
    })
  } catch (error) {
    console.error('Error in test-rate-limit endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}