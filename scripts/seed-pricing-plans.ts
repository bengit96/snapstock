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

interface PricingPlan {
  name: string
  displayName: string
  description: string
  tier: 'monthly' | 'yearly' | 'lifetime'
  price: number
  currency: string
  features: string[]
  analysisLimit: number | null
  billingPeriod: 'month' | 'year' | 'once'
  badge?: string
  sortOrder: number
  highlighted?: boolean
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'monthly',
    displayName: 'Monthly',
    description: 'Perfect for active traders',
    tier: 'monthly',
    price: 19.99,
    currency: 'usd',
    features: [
      'Unlimited chart analysis',
      'Real-time AI grading',
      'Entry/Exit recommendations',
      'Risk/Reward calculations',
      'Trade history tracking',
      'Email support',
    ],
    analysisLimit: null, // unlimited
    billingPeriod: 'month',
    sortOrder: 1,
  },
  {
    name: 'yearly',
    displayName: 'Yearly',
    description: 'Best value for serious traders',
    tier: 'yearly',
    price: 199.99,
    currency: 'usd',
    features: [
      'Everything in Monthly',
      'Save 17% compared to monthly',
      'Priority support',
      'Early access to new features',
      'Quarterly strategy reports',
      'Exclusive trading webinars',
    ],
    analysisLimit: null, // unlimited
    billingPeriod: 'year',
    badge: 'BEST VALUE',
    sortOrder: 2,
    highlighted: true,
  },
  {
    name: 'lifetime',
    displayName: 'Lifetime Access',
    description: 'One payment, lifetime access',
    tier: 'lifetime',
    price: 599.00,
    currency: 'usd',
    features: [
      'Everything in Yearly',
      'Lifetime access',
      'Never pay again',
      'All future updates',
      'VIP support',
      'Personal onboarding session',
    ],
    analysisLimit: null, // unlimited
    billingPeriod: 'once',
    badge: 'ONE TIME',
    sortOrder: 3,
  },
  {
    name: 'lifetime_supporter',
    displayName: 'Lifetime Supporter',
    description: 'For those who want to support our mission ❤️',
    tier: 'lifetime',
    price: 9999.00,
    currency: 'usd',
    features: [
      'Everything in Lifetime',
      'Your name in our Hall of Fame',
      'Direct access to founders',
      'Shape product roadmap',
      'Exclusive supporter badge',
      'Monthly 1-on-1 trading sessions',
      'Custom feature requests',
      'Eternal gratitude 🙏',
    ],
    analysisLimit: null, // unlimited
    billingPeriod: 'once',
    badge: 'SUPPORTER ❤️',
    sortOrder: 4,
  }
]

async function createStripeProduct(plan: PricingPlan) {
  try {
    console.log(`Creating Stripe product for ${plan.displayName}...`)

    // Create product
    const product = await stripe.products.create({
      name: plan.displayName,
      description: plan.description,
      metadata: {
        tier: plan.tier,
        plan_name: plan.name,
      },
    })

    console.log(`Created product: ${product.id}`)

    // Create price
    const priceData: Stripe.PriceCreateParams = {
      product: product.id,
      currency: plan.currency,
      metadata: {
        tier: plan.tier,
        plan_name: plan.name,
      },
    }

    if (plan.billingPeriod === 'once') {
      // One-time payment
      priceData.unit_amount = Math.round(plan.price * 100) // Convert to cents
    } else {
      // Recurring payment
      priceData.unit_amount = Math.round(plan.price * 100)
      priceData.recurring = {
        interval: plan.billingPeriod as 'month' | 'year',
      }
    }

    const price = await stripe.prices.create(priceData)
    console.log(`Created price: ${price.id} (${plan.currency.toUpperCase()} ${plan.price})`)

    return {
      productId: product.id,
      priceId: price.id,
    }
  } catch (error) {
    console.error(`Error creating Stripe product for ${plan.name}:`, error)
    throw error
  }
}

async function seedPricingPlans() {
  console.log('🚀 Starting pricing plan seeding...\n')
  console.log('This will create Stripe products and prices, then store them in your database.\n')

  // Import DB after env is loaded
  const { db } = await import('@/lib/db')
  const { pricingPlans } = await import('@/lib/db/schema')

  for (const plan of PRICING_PLANS) {
    try {
      // Check if plan already exists
      const existingPlan = await db
        .select()
        .from(pricingPlans)
        .where(eq(pricingPlans.name, plan.name))
        .limit(1)

      if (existingPlan.length > 0) {
        console.log(`✓ Plan "${plan.displayName}" already exists in database`)
        console.log(`  - Stripe Product ID: ${existingPlan[0].stripeProductId}`)
        console.log(`  - Stripe Price ID: ${existingPlan[0].stripePriceId}`)
        console.log(`  - Price: ${existingPlan[0].currency.toUpperCase()} ${existingPlan[0].price}\n`)
        continue
      }

      // Create Stripe product and price
      console.log(`Creating new plan: ${plan.displayName}...`)
      const { productId, priceId } = await createStripeProduct(plan)

      // Insert into database
      await db.insert(pricingPlans).values({
        stripePriceId: priceId,
        stripeProductId: productId,
        name: plan.name,
        displayName: plan.displayName,
        description: plan.description,
        tier: plan.tier,
        price: plan.price.toString(),
        currency: plan.currency,
        features: plan.features,
        analysisLimit: plan.analysisLimit,
        billingPeriod: plan.billingPeriod,
        badge: plan.badge,
        sortOrder: plan.sortOrder,
        highlighted: plan.highlighted || false,
        active: true,
      })

      console.log(`✅ Successfully created plan: ${plan.displayName}`)
      console.log(`  - Stripe Product ID: ${productId}`)
      console.log(`  - Stripe Price ID: ${priceId}`)
      console.log(`  - Price: ${plan.currency.toUpperCase()} ${plan.price}\n`)
    } catch (error) {
      console.error(`❌ Failed to create plan: ${plan.displayName}`, error)
      if (error instanceof Error) {
        console.error(`Error details: ${error.message}`)
      }
      process.exit(1)
    }
  }

  console.log('\n🎉 Pricing plan seeding completed successfully!')

  // Fetch the created plans to display summary
  const plans = await db.select().from(pricingPlans)

  console.log('\n📊 Summary of all plans in database:')
  console.log('─'.repeat(80))

  for (const plan of plans) {
    console.log(`\n${plan.displayName} (${plan.name})`)
    console.log(`  Tier: ${plan.tier}`)
    console.log(`  Price: ${plan.currency.toUpperCase()} ${plan.price}`)
    console.log(`  Billing: ${plan.billingPeriod}`)
    console.log(`  Stripe Price ID: ${plan.stripePriceId}`)
    console.log(`  Stripe Product ID: ${plan.stripeProductId}`)
  }

  console.log('\n' + '─'.repeat(80))
  console.log('\n✅ All pricing is now managed from the database!')
  console.log('   No need to set STRIPE_*_PRICE_ID environment variables.\n')

  process.exit(0)
}

// Run the seeding
seedPricingPlans().catch(console.error)
