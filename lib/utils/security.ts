import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * Security utility functions for authorization and validation
 */

export async function requireAuth() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  return session
}

export async function requireAdmin() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return session
}

export function validateUserId(userId: string | undefined | null): userId is string {
  if (!userId || typeof userId !== 'string') {
    return false
  }

  // CUID2 pattern validation
  const cuid2Pattern = /^[a-z0-9]{24,}$/
  return cuid2Pattern.test(userId)
}

export function sanitizeInput(input: string): string {
  // Remove any HTML tags and trim whitespace
  return input.replace(/<[^>]*>/g, '').trim()
}

export function validateImageData(imageData: string): boolean {
  // Check if it's a valid base64 image
  const base64Pattern = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/
  return base64Pattern.test(imageData)
}

export function createSecureResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'",
    },
  })
}

export function rateLimitKey(identifier: string, action: string): string {
  return `rate_limit:${action}:${identifier}`
}

export function generateSecureFilename(originalName: string, userId: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop() || 'jpg'

  return `${userId}/${timestamp}_${randomString}.${extension}`
}