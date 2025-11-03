import Stripe from 'stripe'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { discordService } from '@/lib/services/discord.service'
import { emailNotificationService } from '@/lib/services/email-notification.service'

/**
 * Handle payment_intent.succeeded event
 * This is for one-time payments (e.g., lifetime access)
 */
export async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  console.log(`[Payment] Payment succeeded: ${paymentIntent.id}`)

  // One-time payments for lifetime access
  if (paymentIntent.metadata?.userId && paymentIntent.metadata?.tier === 'lifetime') {
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, paymentIntent.metadata.userId))
      .limit(1)

    if (userResults.length === 0) {
      console.error(`[Payment] User not found: ${paymentIntent.metadata.userId}`)
      return
    }

    const user = userResults[0]

    // Grant lifetime access
    await db
      .update(users)
      .set({
        subscriptionStatus: 'active',
        subscriptionTier: 'lifetime',
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    // Send notification
    await discordService.notifyPayment({
      userId: user.id,
      email: user.email,
      tier: 'lifetime',
      amount: (paymentIntent.amount || 0) / 100,
      isNew: true,
    })

    console.log(`[Payment] Lifetime access granted to user: ${user.id}`)
  }
}

/**
 * Handle payment_intent.payment_failed event
 * This fires when a payment fails
 */
export async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  console.log(`[Payment] Payment failed: ${paymentIntent.id}`)

  if (paymentIntent.metadata?.userId) {
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, paymentIntent.metadata.userId))
      .limit(1)

    if (userResults.length > 0) {
      const user = userResults[0]

      // Notify about failure
      await emailNotificationService.sendErrorNotification({
        error: `Payment failed for user ${user.email}. Payment Intent: ${paymentIntent.id}, Amount: ${(paymentIntent.amount || 0) / 100}, Error: ${paymentIntent.last_payment_error?.message || 'Unknown'}`,
        context: 'Payment Intent',
      })

      console.log(`[Payment] Failure notification sent for user: ${user.id}`)
    }
  }
}
