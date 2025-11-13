import Stripe from 'stripe'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { analyticsService } from '@/lib/services/analytics.service'
import { referralService } from '@/lib/services/referral.service'
import { discordService } from '@/lib/services/discord.service'

/**
 * Handle checkout.session.completed event
 * This fires when a customer completes checkout
 */
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log(`[Checkout] Processing session: ${session.id}`)

  if (!session.metadata?.userId) {
    console.warn('[Checkout] No userId in metadata')
    return
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.metadata.userId))
    .limit(1)

  if (user.length === 0) {
    console.error(`[Checkout] User not found: ${session.metadata.userId}`)
    return
  }

  const currentUser = user[0]
  const isNewSubscription = !currentUser.stripeCustomerId

  // Update user subscription status
  await db
    .update(users)
    .set({
      stripeCustomerId: session.customer as string,
      subscriptionStatus: 'active',
      subscriptionTier: session.metadata.tier as 'monthly' | 'yearly' | 'lifetime',
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.metadata.userId))

  // Track conversion
  await analyticsService.trackConversion(
    session.metadata.userId,
    session.metadata.tier,
    (session.amount_total || 0) / 100
  )

  // Mark referral as converted if user was referred
  if (currentUser.referredBy) {
    await referralService.markAsConverted(session.metadata.userId)
  }

  // Cancel any pending trial promo emails
  try {
    const { cancelScheduledEmailsForUser } = await import(
      '@/lib/services/scheduled-email.service'
    )

    const cancelResult = await cancelScheduledEmailsForUser(
      session.metadata.userId,
      'trial_promo',
      'user_subscribed'
    )

    if (cancelResult.success && cancelResult.cancelledCount > 0) {
      console.log(`[Checkout] Cancelled ${cancelResult.cancelledCount} trial promo emails for user: ${session.metadata.userId}`)
    }
  } catch (error) {
    console.error('[Checkout] Error cancelling scheduled emails:', error)
    // Don't fail the webhook if email cancellation fails
  }

  // Send Discord notification
  await discordService.notifyPayment({
    userId: session.metadata.userId,
    email: currentUser.email,
    tier: session.metadata.tier,
    amount: (session.amount_total || 0) / 100,
    isNew: isNewSubscription,
  })

  console.log(`[Checkout] Successfully processed for user: ${session.metadata.userId}`)
}
