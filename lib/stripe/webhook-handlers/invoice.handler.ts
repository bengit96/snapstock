import Stripe from 'stripe'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { emailNotificationService } from '@/lib/services/email-notification.service'
import { discordService } from '@/lib/services/discord.service'

/**
 * Handle invoice.payment_succeeded event
 * This fires when a recurring payment succeeds
 */
export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log(`[Invoice] Payment succeeded: ${invoice.id}`)

  if (!invoice.customer) {
    console.warn('[Invoice] No customer on invoice')
    return
  }

  const userResults = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, invoice.customer as string))
    .limit(1)

  if (userResults.length === 0) {
    console.error(`[Invoice] User not found for customer: ${invoice.customer}`)
    return
  }

  const user = userResults[0]

  // Update subscription end date
  if (invoice.subscription && invoice.lines.data[0]?.period?.end) {
    await db
      .update(users)
      .set({
        subscriptionEndDate: new Date(invoice.lines.data[0].period.end * 1000),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
  }

  // Send success notification
  // TODO: Implement sendPaymentSuccessEmail method
  // await emailNotificationService.sendPaymentSuccessEmail({
  //   email: user.email,
  //   amount: (invoice.amount_paid || 0) / 100,
  //   invoiceUrl: invoice.hosted_invoice_url || undefined,
  // })

  console.log(`[Invoice] Successfully processed payment for user: ${user.id}`)
}

/**
 * Handle invoice.payment_failed event
 * This fires when a recurring payment fails
 */
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log(`[Invoice] Payment failed: ${invoice.id}`)

  if (!invoice.customer) {
    console.warn('[Invoice] No customer on invoice')
    return
  }

  const userResults = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, invoice.customer as string))
    .limit(1)

  if (userResults.length === 0) {
    console.error(`[Invoice] User not found for customer: ${invoice.customer}`)
    return
  }

  const user = userResults[0]

  // Mark subscription as past_due
  await db
    .update(users)
    .set({
      subscriptionStatus: 'past_due',
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))

  // Send failure notification
  // TODO: Implement sendPaymentFailedEmail method
  // await emailNotificationService.sendPaymentFailedEmail({
  //   email: user.email,
  //   amount: (invoice.amount_due || 0) / 100,
  //   invoiceUrl: invoice.hosted_invoice_url || undefined,
  // })

  // Alert via Discord
  // TODO: Implement notifyPaymentFailed method
  // await discordService.notifyPaymentFailed({
  //   userId: user.id,
  //   email: user.email,
  //   amount: (invoice.amount_due || 0) / 100,
  //   reason: invoice.last_finalization_error?.message,
  // })

  console.log(`[Invoice] Payment failure processed for user: ${user.id}`)
}
