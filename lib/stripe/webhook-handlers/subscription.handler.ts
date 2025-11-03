import Stripe from 'stripe'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { analyticsService } from '@/lib/services/analytics.service'
import { referralService } from '@/lib/services/referral.service'
import { discordService } from '@/lib/services/discord.service'
import { getPricingPlanByPriceId } from '@/lib/pricing'

/**
 * Handle subscription.created and subscription.updated events
 */
export async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  eventType: 'created' | 'updated'
): Promise<void> {
  console.log(`[Subscription] Processing ${eventType}: ${subscription.id}`)

  // Find user by Stripe customer ID
  const userResults = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, subscription.customer as string))
    .limit(1)

  if (userResults.length === 0) {
    console.error(`[Subscription] User not found for customer: ${subscription.customer}`)
    return
  }

  const user = userResults[0]

  // Get tier from price ID (database-driven)
  const priceId = subscription.items.data[0]?.price.id
  const plan = await getPricingPlanByPriceId(priceId)

  let tier: 'monthly' | 'yearly' | null = null
  if (plan && (plan.tier === 'monthly' || plan.tier === 'yearly')) {
    tier = plan.tier
  }

  const wasInactive = user.subscriptionStatus !== 'active'

  // Update user subscription
  await db
    .update(users)
    .set({
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive',
      subscriptionTier: tier,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      subscriptionEndDate: new Date(subscription.current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))

  // If subscription became active, track conversion and check referrals
  if (wasInactive && subscription.status === 'active' && tier) {
    await analyticsService.trackConversion(
      user.id,
      tier,
      (subscription.items.data[0]?.price.unit_amount || 0) / 100
    )

    if (user.referredBy) {
      await referralService.markAsConverted(user.id)
    }
  }

  console.log(`[Subscription] Successfully ${eventType} for user: ${user.id}`)
}

/**
 * Handle subscription.deleted event
 * This fires when a subscription is cancelled
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log(`[Subscription] Processing deletion: ${subscription.id}`)

  const userResults = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, subscription.customer as string))
    .limit(1)

  if (userResults.length === 0) {
    console.error(`[Subscription] User not found for customer: ${subscription.customer}`)
    return
  }

  const user = userResults[0]

  // Mark subscription as cancelled
  await db
    .update(users)
    .set({
      subscriptionStatus: 'cancelled',
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))

  // Notify via Discord
  // TODO: Implement notifySubscriptionCancelled method
  // await discordService.notifySubscriptionCancelled({
  //   userId: user.id,
  //   email: user.email,
  //   tier: user.subscriptionTier || 'unknown',
  // })

  console.log(`[Subscription] Successfully cancelled for user: ${user.id}`)
}
