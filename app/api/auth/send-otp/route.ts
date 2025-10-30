import { NextRequest, NextResponse } from 'next/server'
import { sendOTP } from '@/lib/auth/otp'
import { withRateLimit, RATE_LIMITS } from '@/lib/utils/rate-limit'
import { ApiResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

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
      return ApiResponse.badRequest(validation.error || 'Invalid request')
    }

    const { email } = validation.data

    const result = await sendOTP(email)

    if (!result.success) {
      logger.warn('Failed to send OTP', { email, error: result.error })
      return ApiResponse.serverError(result.error || 'Failed to send OTP')
    }

    return ApiResponse.success(
      { message: 'OTP sent successfully' },
      'OTP sent successfully'
    )
  } catch (error) {
    logger.error('Error in send-otp route', error)
    return ApiResponse.serverError('Internal server error')
  }
}