import { db } from '@/lib/db'
import { pricingPlans } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { cache } from 'react'

export interface PricingPlan {
  id: string
  stripePriceId: string
  stripeProductId: string | null
  name: string
  displayName: string
  description: string
  tier: 'monthly' | 'yearly' | 'lifetime'
  price: string
  currency: string
  badge: string | null
  highlighted: boolean
  features: string[]
  analysisLimit: number | null
  billingPeriod: string | null
  sortOrder: number
}

// Cache the pricing plans for better performance
export const getPricingPlans = cache(async (): Promise<PricingPlan[]> => {
  const plans = await db
    .select()
    .from(pricingPlans)
    .where(eq(pricingPlans.active, true))
    .orderBy(pricingPlans.sortOrder)

  return plans as PricingPlan[]
})

export const getPricingPlanByTier = cache(async (tier: 'monthly' | 'yearly' | 'lifetime'): Promise<PricingPlan | null> => {
  const plans = await db
    .select()
    .from(pricingPlans)
    .where(
      and(
        eq(pricingPlans.tier, tier),
        eq(pricingPlans.active, true),
        eq(pricingPlans.name, tier) // Ensure we get the main plan, not supporter
      )
    )
    .limit(1)

  return plans[0] as PricingPlan || null
})

export const getPricingPlanByName = cache(async (name: string): Promise<PricingPlan | null> => {
  const plans = await db
    .select()
    .from(pricingPlans)
    .where(
      and(
        eq(pricingPlans.name, name),
        eq(pricingPlans.active, true)
      )
    )
    .limit(1)

  return plans[0] as PricingPlan || null
})

export const getPricingPlanByPriceId = cache(async (stripePriceId: string): Promise<PricingPlan | null> => {
  const plans = await db
    .select()
    .from(pricingPlans)
    .where(eq(pricingPlans.stripePriceId, stripePriceId))
    .limit(1)

  return plans[0] as PricingPlan || null
})

// Get all plans including the supporter plan
export const getAllPricingPlans = cache(async (): Promise<PricingPlan[]> => {
  const plans = await db
    .select()
    .from(pricingPlans)
    .where(eq(pricingPlans.active, true))
    .orderBy(pricingPlans.sortOrder)

  return plans as PricingPlan[]
})

// For backward compatibility with existing code
export async function getLegacyPricingTiers() {
  const monthlyPlan = await getPricingPlanByTier('monthly')
  const yearlyPlan = await getPricingPlanByTier('yearly')
  const lifetimePlan = await getPricingPlanByTier('lifetime')

  return {
    monthly: monthlyPlan ? {
      price: parseFloat(monthlyPlan.price),
      priceId: monthlyPlan.stripePriceId,
      name: monthlyPlan.displayName,
      description: monthlyPlan.description,
    } : null,
    yearly: yearlyPlan ? {
      price: parseFloat(yearlyPlan.price),
      priceId: yearlyPlan.stripePriceId,
      name: yearlyPlan.displayName,
      description: yearlyPlan.description,
    } : null,
    lifetime: lifetimePlan ? {
      price: parseFloat(lifetimePlan.price),
      priceId: lifetimePlan.stripePriceId,
      name: lifetimePlan.displayName,
      description: lifetimePlan.description,
    } : null,
  }
}