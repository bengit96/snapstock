import { MAX_FILE_SIZE } from '@/lib/constants'

/**
 * Allowed MIME types for image uploads
 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
] as const

/**
 * Magic bytes (file signatures) for common image formats
 */
const IMAGE_SIGNATURES = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  gif: [0x47, 0x49, 0x46],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF header for WebP
} as const

interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate image file type by checking MIME type
 */
export function validateMimeType(file: File): ValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: `Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed. Got: ${file.type}`,
    }
  }

  return { valid: true }
}

/**
 * Validate file size
 */
export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB, got ${fileSizeMB}MB.`,
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty.',
    }
  }

  return { valid: true }
}

/**
 * Validate image by checking magic bytes (file signature)
 */
export async function validateImageSignature(file: File): Promise<ValidationResult> {
  try {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    // Check if file has enough bytes
    if (bytes.length < 4) {
      return {
        valid: false,
        error: 'File is too small to be a valid image.',
      }
    }

    // Check for JPEG signature
    if (
      bytes[0] === IMAGE_SIGNATURES.jpeg[0] &&
      bytes[1] === IMAGE_SIGNATURES.jpeg[1] &&
      bytes[2] === IMAGE_SIGNATURES.jpeg[2]
    ) {
      return { valid: true }
    }

    // Check for PNG signature
    if (
      bytes[0] === IMAGE_SIGNATURES.png[0] &&
      bytes[1] === IMAGE_SIGNATURES.png[1] &&
      bytes[2] === IMAGE_SIGNATURES.png[2] &&
      bytes[3] === IMAGE_SIGNATURES.png[3]
    ) {
      return { valid: true }
    }

    // Check for GIF signature
    if (
      bytes[0] === IMAGE_SIGNATURES.gif[0] &&
      bytes[1] === IMAGE_SIGNATURES.gif[1] &&
      bytes[2] === IMAGE_SIGNATURES.gif[2]
    ) {
      return { valid: true }
    }

    // Check for WebP signature (RIFF)
    if (
      bytes[0] === IMAGE_SIGNATURES.webp[0] &&
      bytes[1] === IMAGE_SIGNATURES.webp[1] &&
      bytes[2] === IMAGE_SIGNATURES.webp[2] &&
      bytes[3] === IMAGE_SIGNATURES.webp[3]
    ) {
      // WebP also needs to check for "WEBP" at bytes 8-11
      if (
        bytes[8] === 0x57 && // W
        bytes[9] === 0x45 && // E
        bytes[10] === 0x42 && // B
        bytes[11] === 0x50 // P
      ) {
        return { valid: true }
      }
    }

    return {
      valid: false,
      error: 'File does not appear to be a valid image. The file signature does not match any supported format.',
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to read file signature.',
    }
  }
}

/**
 * Sanitize filename to prevent path traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path separators
  let sanitized = filename.replace(/[/\\]/g, '')

  // Remove any non-alphanumeric characters except dots, hyphens, and underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_')

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop() || ''
    const nameWithoutExt = sanitized.slice(0, 255 - ext.length - 1)
    sanitized = `${nameWithoutExt}.${ext}`
  }

  // Ensure filename isn't empty
  if (!sanitized || sanitized === '.') {
    sanitized = 'upload.jpg'
  }

  return sanitized
}

/**
 * Comprehensive file validation
 */
export async function validateImageFile(file: File): Promise<ValidationResult> {
  // Check MIME type
  const mimeResult = validateMimeType(file)
  if (!mimeResult.valid) {
    return mimeResult
  }

  // Check file size
  const sizeResult = validateFileSize(file)
  if (!sizeResult.valid) {
    return sizeResult
  }

  // Check file signature (magic bytes)
  const signatureResult = await validateImageSignature(file)
  if (!signatureResult.valid) {
    return signatureResult
  }

  return { valid: true }
}

/**
 * Generate secure filename for blob storage
 */
export function generateSecureFilename(userId: string, originalFilename: string): string {
  const sanitized = sanitizeFilename(originalFilename)
  const timestamp = Date.now()

  // Use cryptographically secure random string
  // Using require here since this is a synchronous function
  // and we're in a Node.js environment
  const { randomBytes } = require('crypto')
  const randomString = randomBytes(8).toString('hex')

  const ext = sanitized.split('.').pop() || 'jpg'

  return `charts/${userId}/${timestamp}_${randomString}.${ext}`
}