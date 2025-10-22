import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const SUBSCRIPTION_TIERS = {
  monthly: {
    price: 19.99,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
    name: 'Monthly',
    description: 'Full access for 30 days',
  },
  yearly: {
    price: 99.99,
    priceId: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly',
    name: 'Yearly',
    description: 'Full access for 365 days - Save 83%',
  },
  lifetime: {
    price: 599,
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID || 'price_lifetime',
    name: 'Lifetime',
    description: 'One-time payment, lifetime access',
  },
}

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  tier: 'monthly' | 'yearly' | 'lifetime'
) {
  const subscription = SUBSCRIPTION_TIERS[tier]

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
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
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL}/dashboard`,
    })

    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw error
  }
}