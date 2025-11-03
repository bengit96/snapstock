import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Portal API: Starting portal session creation')

    const session = await auth()
    console.log('Portal API: Auth session', { userId: session?.user?.id })

    if (!session || !session.user?.id) {
      console.log('❌ Portal API: No authenticated session')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's Stripe customer ID
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    console.log('Portal API: User query result', {
      found: userResult.length > 0,
      hasCustomerId: !!userResult[0]?.stripeCustomerId
    })

    if (userResult.length === 0 || !userResult[0].stripeCustomerId) {
      console.log('❌ Portal API: No Stripe customer found for user', session.user.id)
      return NextResponse.json(
        { error: 'No Stripe customer found. Please contact support.' },
        { status: 404 }
      )
    }

    const customerId = userResult[0].stripeCustomerId
    console.log('Portal API: Found customer ID', customerId)

    // Create Stripe Customer Portal session
    const portalConfig: Stripe.BillingPortal.SessionCreateParams = {
      customer: customerId,
      return_url: `${process.env.APP_URL || 'http://localhost:3000'}/billing`,
    }

    // Check for portal configuration
    const hasPortalConfig = !!process.env.STRIPE_PORTAL_CONFIGURATION_ID
    console.log('Portal API: Portal configuration', {
      hasConfig: hasPortalConfig,
      configId: process.env.STRIPE_PORTAL_CONFIGURATION_ID?.substring(0, 10) + '...'
    })

    // Optionally use a specific portal configuration if provided
    if (process.env.STRIPE_PORTAL_CONFIGURATION_ID) {
      portalConfig.configuration = process.env.STRIPE_PORTAL_CONFIGURATION_ID
    }

    console.log('Portal API: Creating portal session with config', portalConfig)
    const portalSession = await stripe.billingPortal.sessions.create(portalConfig)
    console.log('✅ Portal API: Portal session created successfully', { url: portalSession.url.substring(0, 50) + '...' })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error('❌ Portal API: Error creating portal session:', error)

    // Provide helpful error message for missing configuration
    if (error?.type === 'StripeInvalidRequestError' &&
        error?.message?.includes('configuration')) {
      console.log('🛠️ Portal API: Customer Portal not configured in Stripe')
      return NextResponse.json(
        {
          error: 'Billing Portal Not Configured',
          details: 'The Stripe Customer Portal needs to be set up first. Please configure it in your Stripe Dashboard.',
          instructions: 'Go to https://dashboard.stripe.com/test/settings/billing/portal and click "Activate test link" to create a default portal configuration.',
          code: 'PORTAL_NOT_CONFIGURED'
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create billing portal session',
        details: error.message,
        code: 'PORTAL_ERROR'
      },
      { status: 500 }
    )
  }
}
