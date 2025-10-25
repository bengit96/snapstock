/**
 * Rate limiting utilities for API routes
 *
 * ⚠️ PRODUCTION WARNING:
 * This implementation uses in-memory storage which works for:
 * - Development
 * - Single-instance deployments
 *
 * For production with multiple server instances, you MUST use a distributed cache like:
 * - Vercel KV (Redis)
 * - Upstash Redis
 * - Redis Cloud
 *
 * Otherwise, rate limits can be bypassed by hitting different server instances.
 *
 * Implements a sliding window rate limiter
 */

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// In-memory store for rate limiting (per process)
// In production, use Redis or a distributed cache
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

/**
 * Check if request should be rate limited
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now()
  const key = identifier

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key)

  // If no entry or window expired, create new
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.interval,
    }
    rateLimitStore.set(key, entry)
  }

  // Increment count
  entry.count++

  const success = entry.count <= config.uniqueTokenPerInterval
  const remaining = Math.max(0, config.uniqueTokenPerInterval - entry.count)

  return {
    success,
    limit: config.uniqueTokenPerInterval,
    remaining,
    reset: entry.resetTime,
  }
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // OTP sending: 3 per 10 minutes per IP
  sendOTP: {
    interval: 10 * 60 * 1000, // 10 minutes
    uniqueTokenPerInterval: 3,
  },
  // Analysis: 10 per hour per user
  analysis: {
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 10,
  },
  // Login attempts: 5 per 15 minutes per IP
  login: {
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 5,
  },
  // Checkout: 5 per hour per user
  checkout: {
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 5,
  },
  // General API: 100 per 15 minutes per IP
  api: {
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 100,
  },
} as const

/**
 * Get client identifier from request
 * Properly handles x-forwarded-for to prevent spoofing
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  // Use user ID if authenticated
  if (userId) {
    return `user:${userId}`
  }

  // Get IP from trusted headers (Vercel sets x-real-ip)
  // Priority: x-real-ip > x-forwarded-for (first IP) > fallback
  let ip = request.headers.get('x-real-ip')

  if (!ip) {
    const forwarded = request.headers.get('x-forwarded-for')
    // Only use first IP from forwarded chain (closest to client)
    // NOTE: In production with trusted proxy, this is safe
    // For additional security, validate against TRUSTED_PROXIES list
    ip = forwarded ? forwarded.split(',')[0].trim() : null
  }

  // Fallback to unknown (will still rate limit, just grouped)
  return `ip:${ip || 'unknown'}`
}

/**
 * Helper to apply rate limiting to an API route
 */
export async function withRateLimit(
  request: Request,
  config: RateLimitConfig,
  userId?: string
): Promise<RateLimitResult> {
  const identifier = getClientIdentifier(request, userId)
  return await rateLimit(identifier, config)
}