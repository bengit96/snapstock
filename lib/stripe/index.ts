import Stripe from 'stripe'
import { getLegacyPricingTiers } from '@/lib/pricing'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

/**
 * Get subscription tiers from database
 * All pricing now comes from the database only - no environment variables needed
 *
 * For new code, use: import { getPricingPlans } from '@/lib/pricing'
 */
export async function getSubscriptionTiers() {
  const dbTiers = await getLegacyPricingTiers()

  if (!dbTiers.monthly || !dbTiers.yearly || !dbTiers.lifetime) {
    throw new Error(
      'Pricing plans not found in database. Please run: npm run pricing:seed'
    )
  }

  return {
    monthly: dbTiers.monthly,
    yearly: dbTiers.yearly,
    lifetime: dbTiers.lifetime,
  }
}

/**
 * Create checkout session
 *
 * @deprecated Use createCheckoutSession from '@/lib/stripe/pricing' instead
 * This version is kept for backward compatibility
 */
export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  tier: 'monthly' | 'yearly' | 'lifetime'
) {
  // Import here to avoid circular dependency
  const { db } = await import('@/lib/db')
  const { users } = await import('@/lib/db/schema')
  const { eq } = await import('drizzle-orm')

  // Try to get from database first
  const tiers = await getSubscriptionTiers()
  const subscription = tiers[tier]

  // Check if user already has a Stripe customer ID
  const userResult = await db
    .select({ stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  const existingCustomerId = userResult[0]?.stripeCustomerId

  try {
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: subscription.priceId,
          quantity: 1,
        },
      ],
      mode: tier === 'lifetime' ? 'payment' : 'subscription',
      success_url: `${process.env.APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/pricing?cancelled=true`,
      metadata: {
        userId,
        tier,
      },
      allow_promotion_codes: true,
    }

    // Use existing customer if available, otherwise create new one
    if (existingCustomerId) {
      sessionConfig.customer = existingCustomerId
      console.log(`🔄 Reusing existing Stripe customer: ${existingCustomerId}`)
    } else {
      sessionConfig.customer_email = userEmail
      console.log(`🆕 Creating new Stripe customer for email: ${userEmail}`)
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string) {
  try {
    const portalConfig: Stripe.BillingPortal.SessionCreateParams = {
      customer: customerId,
      return_url: `${process.env.APP_URL}/dashboard`,
    }

    // Optionally use a specific portal configuration if provided
    if (process.env.STRIPE_PORTAL_CONFIGURATION_ID) {
      portalConfig.configuration = process.env.STRIPE_PORTAL_CONFIGURATION_ID
    }

    const session = await stripe.billingPortal.sessions.create(portalConfig)

    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw error
  }
}

// Re-export functions from pricing module
export {
  createCheckoutSession as createCheckoutSessionNew,
  createCustomerPortalSession as createCustomerPortalSessionNew,
  getSubscriptionDetails,
  cancelSubscription,
  reactivateSubscription,
  changeSubscriptionPlan,
} from './pricing'