import { NextResponse } from 'next/server'

export type ApiError = {
  error: string
  message?: string
  details?: unknown
}

export type ApiSuccess<T = unknown> = {
  success: true
  data: T
  message?: string
}

/**
 * Standard API response utilities
 */
export class ApiResponse {
  /**
   * Success response
   */
  static success<T = unknown>(
    data: T,
    message?: string,
    status: number = 200
  ): NextResponse<ApiSuccess<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        message
      },
      { status }
    )
  }

  /**
   * Error response
   */
  static error(
    error: string,
    status: number = 500,
    details?: unknown
  ): NextResponse<ApiError> {
    return NextResponse.json(
      {
        error,
        message: error,
        details
      },
      { status }
    )
  }

  /**
   * Unauthorized response
   */
  static unauthorized(
    message: string = 'Unauthorized'
  ): NextResponse<ApiError> {
    return this.error(message, 401)
  }

  /**
   * Forbidden response
   */
  static forbidden(
    message: string = 'Forbidden'
  ): NextResponse<ApiError> {
    return this.error(message, 403)
  }

  /**
   * Bad request response
   */
  static badRequest(
    message: string = 'Bad request',
    details?: unknown
  ): NextResponse<ApiError> {
    return this.error(message, 400, details)
  }

  /**
   * Not found response
   */
  static notFound(
    message: string = 'Resource not found'
  ): NextResponse<ApiError> {
    return this.error(message, 404)
  }

  /**
   * Payment required response
   */
  static paymentRequired(
    message: string = 'Payment required'
  ): NextResponse<ApiError> {
    return this.error(message, 402)
  }

  /**
   * Internal server error response
   */
  static serverError(
    message: string = 'Internal server error',
    details?: unknown
  ): NextResponse<ApiError> {
    return this.error(message, 500, details)
  }

  /**
   * Handle common API errors
   */
  static handleError(error: unknown): NextResponse<ApiError> {
    // Use logger instead of console
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { logger } = require('@/lib/utils/logger')
    logger.error('API Error', error)

    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('Unauthorized')) {
        return this.unauthorized()
      }

      if (error.message.includes('API key')) {
        return this.serverError(
          'External API configuration error',
          { hint: 'Check API keys in environment variables' }
        )
      }

      if (error.message.includes('rate limit')) {
        return this.error('Rate limit exceeded', 429)
      }

      // Generic error with message
      return this.serverError(error.message)
    }

    // Unknown error
    return this.serverError()
  }
}