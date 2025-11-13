import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { scheduledEmails, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { sendMarketingEmail } from '@/lib/services/admin-email.service'
import { logger } from '@/lib/utils/logger'
import { verifyQStashSignature } from '@/lib/services/qstash.service'
import { cancelSequenceForUser } from '@/lib/services/email-sequence.service'

export const dynamic = 'force-dynamic'

/**
 * QStash webhook endpoint to send scheduled emails
 */
export async function POST(request: NextRequest) {
  try {
    // Verify QStash signature
    const signature = request.headers.get('upstash-signature')
    if (!signature) {
      logger.warn('Missing QStash signature')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.text()
    const isValid = verifyQStashSignature(signature, body)

    if (!isValid) {
      logger.warn('Invalid QStash signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const { emailId } = JSON.parse(body)

    if (!emailId) {
      return NextResponse.json({ error: 'emailId is required' }, { status: 400 })
    }

    // Fetch the scheduled email
    const [scheduledEmail] = await db
      .select()
      .from(scheduledEmails)
      .where(eq(scheduledEmails.id, emailId))
      .limit(1)

    if (!scheduledEmail) {
      logger.error('Scheduled email not found', { emailId })
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    // Check if already sent or cancelled
    if (scheduledEmail.status === 'sent') {
      logger.info('Email already sent', { emailId })
      return NextResponse.json({ message: 'Email already sent' })
    }

    if (scheduledEmail.status === 'cancelled') {
      logger.info('Email was cancelled', { emailId })
      return NextResponse.json({ message: 'Email was cancelled' })
    }

    // Fetch user to check subscription status
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, scheduledEmail.userId))
      .limit(1)

    if (!user) {
      logger.error('User not found', { userId: scheduledEmail.userId })
      await db
        .update(scheduledEmails)
        .set({
          status: 'failed',
          error: 'User not found',
        })
        .where(eq(scheduledEmails.id, emailId))
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Cancel sequence if user has subscribed
    if (user.subscriptionStatus === 'active') {
      logger.info('User subscribed - cancelling sequence', {
        userId: user.id,
        emailId,
      })

      const metadata = scheduledEmail.metadata as any
      if (metadata?.sequenceId) {
        await cancelSequenceForUser(user.id, metadata.sequenceId, 'user_subscribed')
      }

      return NextResponse.json({ message: 'User subscribed - sequence cancelled' })
    }

    // Send the email
    const metadata = scheduledEmail.metadata as any
    const message = metadata?.message || ''
    const discountPercent = metadata?.discountPercent || 0

    // Replace template variables
    const firstName = user.name?.split(' ')[0] || 'there'
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analyze`
    const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pricing`

    const personalizedMessage = message
      .replace(/\{\{firstName\}\}/g, firstName)
      .replace(/\{\{dashboardUrl\}\}/g, dashboardUrl)
      .replace(/\{\{checkoutUrl\}\}/g, checkoutUrl)

    const result = await sendMarketingEmail({
      to: scheduledEmail.recipientEmail,
      userName: user.name,
      subject: scheduledEmail.subject.replace(/\{\{firstName\}\}/g, firstName),
      message: personalizedMessage,
      promoCode: scheduledEmail.promoCode || undefined,
      discountPercent,
    })

    if (result.success) {
      // Mark as sent
      await db
        .update(scheduledEmails)
        .set({
          status: 'sent',
          sentAt: new Date(),
        })
        .where(eq(scheduledEmails.id, emailId))

      logger.info('Scheduled email sent successfully', {
        emailId,
        userId: user.id,
        messageId: result.messageId,
      })

      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      })
    } else {
      // Mark as failed
      await db
        .update(scheduledEmails)
        .set({
          status: 'failed',
          error: result.error,
        })
        .where(eq(scheduledEmails.id, emailId))

      logger.error('Failed to send scheduled email', {
        emailId,
        error: result.error,
      })

      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }
  } catch (error) {
    logger.error('Error in send-scheduled-email endpoint', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

