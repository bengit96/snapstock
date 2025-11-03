import Stripe from 'stripe'
import { getPricingPlanByTier, getPricingPlanByName, getPricingPlanByPriceId, getAllPricingPlans } from '@/lib/pricing'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

/**
 * Create a Stripe checkout session with pricing from database
 */
export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  tier: 'monthly' | 'yearly' | 'lifetime' | string
) {
  // Import here to avoid circular dependency
  const { db } = await import('@/lib/db')
  const { users } = await import('@/lib/db/schema')
  const { eq } = await import('drizzle-orm')

  // Support both tier-based and name-based lookups
  let plan = null

  // First try to get by tier (for backward compatibility)
  if (tier === 'monthly' || tier === 'yearly' || tier === 'lifetime') {
    plan = await getPricingPlanByTier(tier)
  }

  // If not found by tier, try by name (for supporter plan)
  if (!plan) {
    plan = await getPricingPlanByName(tier)
  }

  if (!plan) {
    throw new Error(`Pricing plan not found for: ${tier}`)
  }

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
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: plan.billingPeriod === 'once' ? 'payment' : 'subscription',
      success_url: `${process.env.APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/pricing?cancelled=true`,
      metadata: {
        userId,
        tier: plan.tier,
        planName: plan.name,
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

/**
 * Create a customer portal session for managing subscriptions
 */
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

/**
 * Get subscription details from Stripe
 */
export async function getSubscriptionDetails(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    })

    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    return null
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string, immediately = false) {
  try {
    if (immediately) {
      // Cancel immediately
      const subscription = await stripe.subscriptions.cancel(subscriptionId)
      return subscription
    } else {
      // Cancel at period end
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })
      return subscription
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    throw error
  }
}

/**
 * Reactivate a cancelled subscription (if still in period)
 */
export async function reactivateSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })
    return subscription
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    throw error
  }
}

/**
 * Change subscription plan (upgrade/downgrade)
 */
export async function changeSubscriptionPlan(
  subscriptionId: string,
  newTier: 'monthly' | 'yearly'
) {
  const newPlan = await getPricingPlanByTier(newTier)

  if (!newPlan) {
    throw new Error(`Pricing plan not found for tier: ${newTier}`)
  }

  try {
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Update subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPlan.stripePriceId,
        },
      ],
      proration_behavior: 'create_prorations', // Credit for unused time
    })

    return updatedSubscription
  } catch (error) {
    console.error('Error changing subscription plan:', error)
    throw error
  }
}

/**
 * Apply a coupon to a subscription
 */
export async function applyCouponToSubscription(
  subscriptionId: string,
  couponCode: string
) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      coupon: couponCode,
    })
    return subscription
  } catch (error) {
    console.error('Error applying coupon:', error)
    throw error
  }
}

/**
 * Get upcoming invoice for a subscription
 */
export async function getUpcomingInvoice(customerId: string) {
  try {
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: customerId,
    })
    return invoice
  } catch (error) {
    console.error('Error retrieving upcoming invoice:', error)
    return null
  }
}

/**
 * Create a setup intent for saving payment methods
 */
export async function createSetupIntent(customerId: string) {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    })
    return setupIntent
  } catch (error) {
    console.error('Error creating setup intent:', error)
    throw error
  }
}

/**
 * List payment methods for a customer
 */
export async function listPaymentMethods(customerId: string) {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    })
    return paymentMethods.data
  } catch (error) {
    console.error('Error listing payment methods:', error)
    return []
  }
}

/**
 * Set default payment method
 */
export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
) {
  try {
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })
    return true
  } catch (error) {
    console.error('Error setting default payment method:', error)
    return false
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getPricingPlans from @/lib/pricing instead
 */
export async function getSubscriptionTiers() {
  const plans = await getAllPricingPlans()

  const tiers: Record<string, any> = {}

  for (const plan of plans) {
    if (plan.name === 'monthly' || plan.name === 'yearly' || plan.name === 'lifetime') {
      tiers[plan.name] = {
        price: parseFloat(plan.price),
        priceId: plan.stripePriceId,
        name: plan.displayName,
        description: plan.description,
      }
    }
  }

  return tiers
}