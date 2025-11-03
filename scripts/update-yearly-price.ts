#!/usr/bin/env tsx

import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in environment variables')
  console.error('Please add DATABASE_URL to your .env file')
  process.exit(1)
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY not found in environment variables')
  console.error('Please add STRIPE_SECRET_KEY to your .env file')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
})

async function updateYearlyPrice() {
  console.log('🚀 Updating yearly subscription price to $199.99...\n')

  // Import DB after env is loaded
  const { db } = await import('@/lib/db')
  const { pricingPlans } = await import('@/lib/db/schema')

  // 1. Get the current yearly plan from database
  const yearlyPlan = await db
    .select()
    .from(pricingPlans)
    .where(eq(pricingPlans.name, 'yearly'))
    .limit(1)

  if (!yearlyPlan || yearlyPlan.length === 0) {
    console.error('❌ Yearly plan not found in database')
    console.log('Please run: npm run seed:pricing first')
    process.exit(1)
  }

  const currentPlan = yearlyPlan[0]
  console.log(`Current yearly price: $${currentPlan.price}`)
  console.log(`Current Stripe Price ID: ${currentPlan.stripePriceId}`)
  console.log(`Current Stripe Product ID: ${currentPlan.stripeProductId}`)

  // 2. Create a new price in Stripe (we can't update existing prices)
  console.log('\nCreating new Stripe price for $199.99...')

  try {
    if (!currentPlan.stripeProductId) {
      throw new Error('No Stripe Product ID found for yearly plan')
    }

    const newPrice = await stripe.prices.create({
      product: currentPlan.stripeProductId,
      currency: 'usd',
      unit_amount: 19999, // $199.99 in cents
      recurring: {
        interval: 'year',
      },
      metadata: {
        tier: 'yearly',
        plan_name: 'yearly',
      },
    })

    console.log(`✅ Created new Stripe price: ${newPrice.id}`)

    // 3. Archive the old price in Stripe (optional but recommended)
    if (currentPlan.stripePriceId) {
      await stripe.prices.update(currentPlan.stripePriceId, {
        active: false,
      })
      console.log(`✅ Archived old Stripe price: ${currentPlan.stripePriceId}`)
    }

    // 4. Update the database with new price and Stripe price ID
    await db
      .update(pricingPlans)
      .set({
        price: '199.99',
        stripePriceId: newPrice.id,
        updatedAt: new Date(),
      })
      .where(eq(pricingPlans.name, 'yearly'))

    console.log('✅ Updated database with new price')

    // 5. Also update the feature text to reflect the new savings
    const updatedFeatures = [
      'Everything in Monthly',
      'Save 17% compared to monthly',
      'Priority support',
      'Early access to new features',
      'Quarterly strategy reports',
      'Exclusive trading webinars',
    ]

    await db
      .update(pricingPlans)
      .set({
        features: updatedFeatures,
        updatedAt: new Date(),
      })
      .where(eq(pricingPlans.name, 'yearly'))

    console.log('✅ Updated features to reflect new savings percentage')

    // 6. Display summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ Successfully updated yearly pricing!')
    console.log('='.repeat(60))
    console.log('\n📊 New Pricing Structure:')
    console.log('  Monthly: $19.99/month')
    console.log('  Yearly:  $199.99/year (Save 17%)')
    console.log('  Lifetime: $599.00 (one-time)')
    console.log('\n🎯 Next Steps:')
    console.log('1. The new price is now active for new subscriptions')
    console.log('2. Existing subscriptions will continue at their current price')
    console.log('3. To update existing subscriptions, use the Stripe Dashboard')
    console.log(`4. New Stripe Price ID: ${newPrice.id}`)
    console.log('\n✨ All done!')

  } catch (error) {
    console.error('❌ Error updating price:', error)
    if (error instanceof Error) {
      console.error('Details:', error.message)
    }
    process.exit(1)
  }

  process.exit(0)
}

// Run the update
updateYearlyPrice().catch(console.error)