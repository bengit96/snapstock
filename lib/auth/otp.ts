import { db } from '@/lib/db'
import { otpCodes } from '@/lib/db/schema'
import { eq, and, gte } from 'drizzle-orm'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export function generateOTP(): string {
  // Generate 6 digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOTP(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate OTP
    const code = generateOTP()

    // Set expiry to 10 minutes from now
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Delete any existing OTPs for this email
    await db.delete(otpCodes).where(eq(otpCodes.email, email))

    // Save OTP to database
    await db.insert(otpCodes).values({
      email,
      code,
      expiresAt,
      attempts: 0,
    })

    // Send email with OTP
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@snappchart.app',
      to: email,
      subject: 'Your SnapPChart verification code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>SnapPChart Verification Code</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SnapPChart</h1>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e1e1e1; border-top: none;">
              <h2 style="margin-top: 0; color: #333;">Your Verification Code</h2>
              <p style="font-size: 16px; color: #555;">
                Use the following code to complete your login:
              </p>
              <div style="background: #f4f4f4; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea;">
                  ${code}
                </span>
              </div>
              <p style="font-size: 14px; color: #888;">
                This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 30px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">
                © ${new Date().getFullYear()} SnapPChart. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send OTP email:', error)
      return { success: false, error: 'Failed to send verification email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in sendOTP:', error)
    return { success: false, error: 'An error occurred while sending OTP' }
  }
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  try {
    // Find the OTP record
    const otpRecords = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.code, code),
          gte(otpCodes.expiresAt, new Date())
        )
      )
      .limit(1)

    if (otpRecords.length === 0) {
      return false
    }

    const otp = otpRecords[0]

    // Check attempts
    if ((otp.attempts ?? 0) >= 3) {
      // Delete the OTP if max attempts reached
      await db.delete(otpCodes).where(eq(otpCodes.id, otp.id))
      return false
    }

    // Delete the OTP after successful verification
    await db.delete(otpCodes).where(eq(otpCodes.id, otp.id))

    return true
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return false
  }
}

export async function incrementOTPAttempts(email: string): Promise<void> {
  try {
    const otpRecords = await db
      .select()
      .from(otpCodes)
      .where(eq(otpCodes.email, email))
      .limit(1)

    if (otpRecords.length > 0) {
      const otp = otpRecords[0]
      await db
        .update(otpCodes)
        .set({ attempts: (otp.attempts ?? 0) + 1 })
        .where(eq(otpCodes.id, otp.id))
    }
  } catch (error) {
    console.error('Error incrementing OTP attempts:', error)
  }
}