import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { db } from '@/lib/db/client'
import { users, stripeEvents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { discordService } from '@/lib/services/discord.service'
import { analyticsService } from '@/lib/services/analytics.service'
import { referralService } from '@/lib/services/referral.service'
import { emailNotificationService } from '@/lib/services/email-notification.service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      await emailNotificationService.sendErrorNotification({
        error: 'Stripe webhook signature verification failed',
        context: 'Webhook endpoint',
        stackTrace: err.stack,
      })
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Use db directly

    // Log the event
    await db.insert(stripeEvents).values({
      stripeEventId: event.id,
      type: event.type,
      data: event.data as any,
      processed: false,
    })

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.metadata?.userId) {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.id, session.metadata.userId))
            .limit(1)

          if (user.length > 0) {
            const isNewSubscription = !user[0].stripeCustomerId

            // Update user subscription status
            await db
              .update(users)
              .set({
                stripeCustomerId: session.customer as string,
                subscriptionStatus: 'active',
                subscriptionTier: session.metadata.tier as any,
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
            if (user[0].referredBy) {
              await referralService.markAsConverted(session.metadata.userId)
            }

            // Send Discord notification
            await discordService.notifyPayment({
              userId: session.metadata.userId,
              email: user[0].email,
              tier: session.metadata.tier,
              amount: (session.amount_total || 0) / 100,
              isNew: isNewSubscription,
            })
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by Stripe customer ID
        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, subscription.customer as string))
          .limit(1)

        if (userResults.length > 0) {
          const user = userResults[0]

          // Determine tier from subscription items
          let tier: 'monthly' | 'yearly' | null = null
          const priceId = subscription.items.data[0]?.price.id

          if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
            tier = 'monthly'
          } else if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
            tier = 'yearly'
          }

          const wasInactive = user.subscriptionStatus !== 'active'

          await db
            .update(users)
            .set({
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive',
              subscriptionTier: tier,
              subscriptionEndDate: new Date(subscription.current_period_end * 1000),
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))

          // If subscription became active, track conversion and check referrals
          if (wasInactive && subscription.status === 'active') {
            await referralService.markAsConverted(user.id)

            await discordService.notifyPayment({
              userId: user.id,
              email: user.email,
              tier: tier || 'unknown',
              amount: (subscription.items.data[0]?.price.unit_amount || 0) / 100,
              isNew: true,
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Find user by Stripe customer ID
        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, subscription.customer as string))
          .limit(1)

        if (userResults.length > 0) {
          const user = userResults[0]

          await db
            .update(users)
            .set({
              subscriptionStatus: 'cancelled',
              stripeSubscriptionId: null,
              subscriptionEndDate: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))

          // Send cancellation notification
          await discordService.notifyCancellation({
            userId: user.id,
            email: user.email,
            tier: user.subscriptionTier || 'unknown',
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        // Find user
        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, invoice.customer as string))
          .limit(1)

        if (userResults.length > 0) {
          const user = userResults[0]

          // Check if user has pending referral rewards
          const discount = await referralService.getAvailableDiscount(user.id)

          // If discount available, create a coupon for next billing cycle
          if (discount > 0 && user.stripeSubscriptionId) {
            try {
              // Create a one-time coupon
              const coupon = await stripe.coupons.create({
                percent_off: discount,
                duration: 'once',
                name: 'Referral Reward',
              })

              // Apply coupon to subscription
              await stripe.subscriptions.update(user.stripeSubscriptionId, {
                coupon: coupon.id,
              })

              // Mark reward as claimed
              await referralService.claimReward(user.id)

              console.log(`Applied ${discount}% discount to user ${user.id}`)
            } catch (error) {
              console.error('Failed to apply referral discount:', error)
              await emailNotificationService.sendErrorNotification({
                error: 'Failed to apply referral discount',
                context: `User ID: ${user.id}`,
                userId: user.id,
              })
            }
          }
        }

        console.log('Payment succeeded for invoice:', invoice.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        // Find user and update subscription status
        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, invoice.customer as string))
          .limit(1)

        if (userResults.length > 0) {
          const user = userResults[0]

          await db
            .update(users)
            .set({
              subscriptionStatus: 'past_due',
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))

          // Send email notification for critical payment failure
          await emailNotificationService.sendCriticalAlert({
            title: 'Payment Failed',
            message: `Payment failed for user ${user.email}`,
            details: {
              userId: user.id,
              email: user.email,
              invoiceId: invoice.id,
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark event as processed
    await db
      .update(stripeEvents)
      .set({ processed: true })
      .where(eq(stripeEvents.stripeEventId, event.id))

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)

    // Send email notification for webhook processing errors
    await emailNotificationService.sendErrorNotification({
      error: 'Stripe webhook processing failed',
      context: 'Webhook endpoint',
      stackTrace: error.stack,
    })

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
