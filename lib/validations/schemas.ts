import { z } from 'zod'

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must be less than 255 characters')
  .toLowerCase()
  .trim()

/**
 * OTP code validation schema
 */
export const otpCodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'OTP must be exactly 6 digits')
  .length(6, 'OTP must be exactly 6 digits')

/**
 * User ID validation (CUID2 format)
 */
export const userIdSchema = z
  .string()
  .min(20, 'Invalid user ID')
  .max(32, 'Invalid user ID')
  .regex(/^[a-z0-9]+$/, 'Invalid user ID format')

/**
 * Subscription tier validation
 */
export const subscriptionTierSchema = z.enum(['monthly', 'yearly', 'lifetime'], {
  errorMap: () => ({ message: 'Invalid subscription tier' }),
})

/**
 * Analysis ID validation
 */
export const analysisIdSchema = z
  .string()
  .min(20, 'Invalid analysis ID')
  .max(32, 'Invalid analysis ID')

/**
 * Stock symbol validation
 */
export const stockSymbolSchema = z
  .string()
  .min(1, 'Stock symbol is required')
  .max(10, 'Stock symbol must be less than 10 characters')
  .regex(/^[A-Z]+$/, 'Stock symbol must contain only uppercase letters')
  .trim()

/**
 * Request body schemas
 */

// Send OTP request
export const sendOTPRequestSchema = z.object({
  email: emailSchema,
})

// Verify OTP request
export const verifyOTPRequestSchema = z.object({
  email: emailSchema,
  code: otpCodeSchema,
})

// Checkout request
export const checkoutRequestSchema = z.object({
  tier: subscriptionTierSchema,
})

// Analysis metadata (for additional validation if needed)
export const analysisMetadataSchema = z.object({
  stockSymbol: stockSymbolSchema.optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
})

/**
 * Helper function to validate and parse data with Zod
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format Zod errors into a readable message
      const messages = error.errors.map((err) => {
        const path = err.path.join('.')
        return path ? `${path}: ${err.message}` : err.message
      })
      return { success: false, error: messages.join(', ') }
    }
    return { success: false, error: 'Validation failed' }
  }
}

/**
 * Helper to safely parse JSON request body
 */
export async function parseRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json()
    return validateData(schema, body)
  } catch (error) {
    return { success: false, error: 'Invalid JSON in request body' }
  }
}