/**
 * Common validation utilities
 */

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * OTP validation
 */
export function isValidOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp)
}

/**
 * Stock symbol validation
 */
export function isValidStockSymbol(symbol: string): boolean {
  // Valid stock symbols are 1-5 uppercase letters
  return /^[A-Z]{1,5}$/.test(symbol)
}

/**
 * Price validation
 */
export function isValidPrice(price: number): boolean {
  return price > 0 && price < 1000000
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * File size validation (in bytes)
 */
export function isValidFileSize(
  size: number,
  maxSizeMB: number = 10
): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return size > 0 && size <= maxSizeBytes
}

/**
 * Image file validation
 */
export function isValidImageFile(file: File): {
  valid: boolean
  error?: string
} {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Please upload an image smaller than 10MB.'
    }
  }

  return { valid: true }
}

/**
 * Subscription tier validation
 */
export function isValidSubscriptionTier(
  tier: string
): tier is 'monthly' | 'yearly' | 'lifetime' {
  return ['monthly', 'yearly', 'lifetime'].includes(tier)
}

/**
 * Trading grade validation
 */
export function isValidTradeGrade(
  grade: string
): grade is 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
  return ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].includes(grade)
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

/**
 * Validate required fields
 */
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: Array<keyof T>
): {
  valid: boolean
  missingFields: Array<keyof T>
} {
  const missingFields = requiredFields.filter(
    field => !data[field] || data[field] === ''
  )

  return {
    valid: missingFields.length === 0,
    missingFields
  }
}

/**
 * Rate limit validation
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(
      time => now - time < this.windowMs
    )

    if (recentAttempts.length >= this.maxAttempts) {
      return false
    }

    // Add current attempt
    recentAttempts.push(now)
    this.attempts.set(identifier, recentAttempts)

    return true
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}