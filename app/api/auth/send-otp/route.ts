import { NextRequest, NextResponse } from 'next/server'
import { sendOTP } from '@/lib/auth/otp'
import { withRateLimit, RATE_LIMITS } from '@/lib/utils/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 3 OTP requests per 10 minutes per IP
    const rateLimitResult = await withRateLimit(request, RATE_LIMITS.sendOTP)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many OTP requests. Please try again later.',
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
    const { parseRequestBody, sendOTPRequestSchema } = await import('@/lib/validations/schemas')
    const validation = await parseRequestBody(request, sendOTPRequestSchema)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { email } = validation.data

    const result = await sendOTP(email)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send OTP' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in send-otp route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}