import { pgTable, text, decimal, integer, boolean, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

// Pricing plans table
export const pricingPlans = pgTable('pricing_plans', {
  id: text('id').primaryKey().$defaultFn(() => createId()),

  // Stripe details
  stripePriceId: text('stripe_price_id').unique().notNull(),
  stripeProductId: text('stripe_product_id'),

  // Plan details
  name: text('name').notNull(),
  displayName: text('display_name').notNull(),
  description: text('description').notNull(),
  tier: text('tier').$type<'monthly' | 'yearly' | 'lifetime'>().notNull(),

  // Pricing
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('usd').notNull(),

  // Display properties
  badge: text('badge'), // e.g., "BEST VALUE", "MOST POPULAR", "LIMITED TIME"
  sortOrder: integer('sort_order').default(0).notNull(),
  highlighted: boolean('highlighted').default(false).notNull(), // for UI emphasis

  // Features and limits
  features: jsonb('features').$type<string[]>().default([]).notNull(),
  analysisLimit: integer('analysis_limit'), // null = unlimited

  // Billing
  billingPeriod: text('billing_period'), // 'month', 'year', 'once'
  trialDays: integer('trial_days').default(0),

  // Status
  active: boolean('active').default(true).notNull(),
  availableFrom: timestamp('available_from'),
  availableUntil: timestamp('available_until'),

  // Metadata
  metadata: jsonb('metadata').$type<Record<string, any>>(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tierIdx: index('pricing_tier_idx').on(table.tier),
  activeIdx: index('pricing_active_idx').on(table.active),
  sortOrderIdx: index('pricing_sort_order_idx').on(table.sortOrder),
}))

// Special offers/discounts
export const discountCodes = pgTable('discount_codes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),

  code: text('code').unique().notNull(),
  description: text('description'),

  // Discount details
  discountType: text('discount_type').$type<'percentage' | 'fixed'>().notNull(),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),

  // Restrictions
  applicablePlans: jsonb('applicable_plans').$type<string[]>(), // null = all plans
  minimumPurchase: decimal('minimum_purchase', { precision: 10, scale: 2 }),
  maxUses: integer('max_uses'),
  usedCount: integer('used_count').default(0).notNull(),

  // Validity
  validFrom: timestamp('valid_from').defaultNow().notNull(),
  validUntil: timestamp('valid_until'),

  active: boolean('active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  codeIdx: index('discount_code_idx').on(table.code),
  activeIdx: index('discount_active_idx').on(table.active),
}))