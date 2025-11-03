#!/usr/bin/env tsx

import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import path from 'path'
import type { Database } from '@/lib/db/client'

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in environment variables')
  console.error('Please add DATABASE_URL to your .env file')
  process.exit(1)
}

const command = process.argv[2]
const args = process.argv.slice(3)

// Initialize Stripe (optional for some commands)
let stripe: Stripe | null = null
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
    typescript: true,
  })
}

async function listPlans(db: any, pricingPlans: any) {
  const plans = await db
    .select()
    .from(pricingPlans)
    .orderBy(pricingPlans.sortOrder)

  console.log('\n📊 Current Pricing Plans:\n')
  console.log('=' .repeat(80))

  for (const plan of plans) {
    console.log(`
ID: ${plan.id}
Name: ${plan.displayName} (${plan.name})
Tier: ${plan.tier}
Price: ${plan.currency.toUpperCase()} ${plan.price}
Stripe Price ID: ${plan.stripePriceId}
Badge: ${plan.badge || 'None'}
Active: ${plan.active ? '✅' : '❌'}
Features: ${plan.features.length} features
`)
    console.log('-'.repeat(80))
  }
}

async function activatePlan(db: any, pricingPlans: any, planName: string) {
  const result = await db
    .update(pricingPlans)
    .set({ active: true, updatedAt: new Date() })
    .where(eq(pricingPlans.name, planName))
    .returning()

  if (result.length > 0) {
    console.log(`✅ Activated plan: ${result[0].displayName}`)
  } else {
    console.log(`❌ Plan not found: ${planName}`)
  }
}

async function deactivatePlan(db: any, pricingPlans: any, planName: string) {
  const result = await db
    .update(pricingPlans)
    .set({ active: false, updatedAt: new Date() })
    .where(eq(pricingPlans.name, planName))
    .returning()

  if (result.length > 0) {
    console.log(`✅ Deactivated plan: ${result[0].displayName}`)
  } else {
    console.log(`❌ Plan not found: ${planName}`)
  }
}

async function updatePrice(db: any, pricingPlans: any, planName: string, newPrice: string) {
  const result = await db
    .update(pricingPlans)
    .set({ price: newPrice, updatedAt: new Date() })
    .where(eq(pricingPlans.name, planName))
    .returning()

  if (result.length > 0) {
    console.log(`✅ Updated price for ${result[0].displayName} to ${result[0].currency.toUpperCase()} ${newPrice}`)
    console.log(`⚠️  Remember to update the price in Stripe Dashboard as well!`)
  } else {
    console.log(`❌ Plan not found: ${planName}`)
  }
}

async function syncFromStripe(db: any, pricingPlans: any) {
  if (!stripe) {
    console.log('❌ Error: STRIPE_SECRET_KEY not found in environment variables')
    console.log('Please add STRIPE_SECRET_KEY to your .env file')
    process.exit(1)
  }

  console.log('🔄 Syncing pricing plans from Stripe to database...\n')

  const dbPlans = await db.select().from(pricingPlans)

  for (const dbPlan of dbPlans) {
    try {
      console.log(`Checking ${dbPlan.displayName}...`)

      // Fetch from Stripe
      const stripePrice = await stripe.prices.retrieve(dbPlan.stripePriceId, {
        expand: ['product'],
      })

      const stripeProduct = stripePrice.product as Stripe.Product

      // Check if anything needs updating
      const updates: any = {}
      const stripePriceAmount = stripePrice.unit_amount ? (stripePrice.unit_amount / 100).toString() : '0'

      if (stripePriceAmount !== dbPlan.price) {
        updates.price = stripePriceAmount
        console.log(`  ⚠️  Price mismatch: DB=${dbPlan.price}, Stripe=${stripePriceAmount}`)
      }

      if (stripeProduct.name !== dbPlan.displayName) {
        console.log(`  ℹ️  Product name differs: DB="${dbPlan.displayName}", Stripe="${stripeProduct.name}"`)
      }

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date()
        await db
          .update(pricingPlans)
          .set(updates)
          .where(eq(pricingPlans.id, dbPlan.id))

        console.log(`  ✅ Updated database with Stripe values`)
      } else {
        console.log(`  ✓ In sync`)
      }

      console.log()
    } catch (error) {
      console.error(`  ❌ Error syncing ${dbPlan.displayName}:`, error)
    }
  }

  console.log('🎉 Sync completed!')
}

async function verifyStripeConnection(db: any, pricingPlans: any) {
  if (!stripe) {
    console.log('❌ STRIPE_SECRET_KEY not found')
    return
  }

  console.log('🔍 Verifying Stripe connection...\n')

  const dbPlans = await db.select().from(pricingPlans)

  console.log('📊 Database Plans vs Stripe:')
  console.log('─'.repeat(80))

  for (const plan of dbPlans) {
    try {
      const stripePrice = await stripe.prices.retrieve(plan.stripePriceId, {
        expand: ['product'],
      })

      const stripeProduct = stripePrice.product as Stripe.Product
      const stripePriceAmount = stripePrice.unit_amount ? (stripePrice.unit_amount / 100) : 0

      console.log(`\n${plan.displayName} (${plan.name})`)
      console.log(`  Database:`)
      console.log(`    - Price: ${plan.currency.toUpperCase()} ${plan.price}`)
      console.log(`    - Price ID: ${plan.stripePriceId}`)
      console.log(`    - Product ID: ${plan.stripeProductId}`)
      console.log(`  Stripe:`)
      console.log(`    - Price: ${stripePrice.currency.toUpperCase()} ${stripePriceAmount}`)
      console.log(`    - Product Name: ${stripeProduct.name}`)
      console.log(`    - Active: ${stripePrice.active ? '✅' : '❌'}`)

      if (stripePriceAmount.toString() !== plan.price) {
        console.log(`  ⚠️  WARNING: Price mismatch!`)
      } else {
        console.log(`  ✓ Prices match`)
      }
    } catch (error) {
      console.log(`\n${plan.displayName} (${plan.name})`)
      console.log(`  ❌ Error: Could not fetch from Stripe`)
      if (error instanceof Error) {
        console.log(`  ${error.message}`)
      }
    }
  }

  console.log('\n' + '─'.repeat(80))
}

async function exportEnvVars(db: any, pricingPlans: any) {
  const plans = await db.select().from(pricingPlans)

  console.log('\n⚠️  NOTE: Environment variables are NO LONGER NEEDED!')
  console.log('All pricing is now managed from the database.\n')
  console.log('However, if you need them for backward compatibility:\n')
  console.log('─'.repeat(80))

  const monthlyPlan = plans.find((p: any) => p.tier === 'monthly' && p.name === 'monthly')
  const yearlyPlan = plans.find((p: any) => p.tier === 'yearly')
  const lifetimePlan = plans.find((p: any) => p.tier === 'lifetime' && p.name === 'lifetime')
  const supporterPlan = plans.find((p: any) => p.name === 'lifetime_supporter')

  console.log('\n# (Optional) Stripe Price IDs - Not required')
  if (monthlyPlan) console.log(`STRIPE_MONTHLY_PRICE_ID="${monthlyPlan.stripePriceId}"`)
  if (yearlyPlan) console.log(`STRIPE_YEARLY_PRICE_ID="${yearlyPlan.stripePriceId}"`)
  if (lifetimePlan) console.log(`STRIPE_LIFETIME_PRICE_ID="${lifetimePlan.stripePriceId}"`)
  if (supporterPlan) console.log(`STRIPE_SUPPORTER_PRICE_ID="${supporterPlan.stripePriceId}"`)
  console.log()
}

async function main() {
  console.log('\n🎯 Pricing Plan Manager\n')

  // Import DB dynamically after env is loaded
  const { db } = await import('@/lib/db')
  const { pricingPlans } = await import('@/lib/db/schema')

  switch (command) {
    case 'list':
      await listPlans(db, pricingPlans)
      break

    case 'activate':
      if (!args[0]) {
        console.log('Usage: npm run pricing:activate <plan-name>')
        process.exit(1)
      }
      await activatePlan(db, pricingPlans, args[0])
      break

    case 'deactivate':
      if (!args[0]) {
        console.log('Usage: npm run pricing:deactivate <plan-name>')
        process.exit(1)
      }
      await deactivatePlan(db, pricingPlans, args[0])
      break

    case 'update-price':
      if (!args[0] || !args[1]) {
        console.log('Usage: npm run pricing:update-price <plan-name> <new-price>')
        process.exit(1)
      }
      await updatePrice(db, pricingPlans, args[0], args[1])
      break

    case 'sync':
      await syncFromStripe(db, pricingPlans)
      break

    case 'verify':
      await verifyStripeConnection(db, pricingPlans)
      break

    case 'export-env':
      await exportEnvVars(db, pricingPlans)
      break

    default:
      console.log(`
📚 Available commands:

  list                    - List all pricing plans in database
  verify                  - Verify database pricing matches Stripe
  sync                    - Sync pricing from Stripe to database
  activate <name>         - Activate a pricing plan
  deactivate <name>       - Deactivate a pricing plan
  update-price <name> <price> - Update plan price (DB only, requires manual Stripe update)
  export-env              - Export price IDs as env vars (for backward compatibility)

📖 Examples:
  npm run pricing:list
  npm run pricing:verify
  npm run pricing:sync
  npm run pricing:activate lifetime_supporter
  npm run pricing:deactivate lifetime_supporter
  npm run pricing:update-price monthly 24.99
  npm run pricing:export-env

💡 Workflow:
  1. Run 'npm run pricing:seed' to create plans (one time)
  2. Run 'npm run pricing:verify' to check sync status
  3. Run 'npm run pricing:sync' if prices differ
  4. Use 'activate/deactivate' to control plan availability
`)
  }

  process.exit(0)
}

main().catch(console.error)
