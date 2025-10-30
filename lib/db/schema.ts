import { pgTable, text, timestamp, integer, boolean, decimal, jsonb, index, primaryKey } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  name: text('name'),
  image: text('image'),
  role: text('role').$type<'user' | 'admin'>().default('user').notNull(),

  // Subscription details
  subscriptionStatus: text('subscription_status').$type<'active' | 'inactive' | 'cancelled' | 'past_due'>().default('inactive'),
  subscriptionTier: text('subscription_tier').$type<'monthly' | 'yearly' | 'lifetime' | null>(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  subscriptionEndDate: timestamp('subscription_end_date'),

  // Referral tracking
  referredBy: text('referred_by'), // User ID who referred this user
  referralCode: text('referral_code'), // The code they used to sign up

  // Usage limits (for free tier)
  freeAnalysesUsed: integer('free_analyses_used').default(0),
  freeAnalysesLimit: integer('free_analyses_limit').default(1), // 1 free analysis

  // Legal acceptance
  acceptedTerms: boolean('accepted_terms').default(false),
  acceptedTermsAt: timestamp('accepted_terms_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// OTP Verification codes
export const otpCodes = pgTable('otp_codes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  attempts: integer('attempts').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Sessions for NextAuth
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
})

// Accounts for NextAuth
export const accounts = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}))

// Trading Conditions/Signals
export const tradingConditions = pgTable('trading_conditions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull(),
  points: integer('points').notNull(),
  category: text('category').$type<'bullish' | 'bearish'>().notNull(),
  confluenceCategory: text('confluence_category'),
  conflictsWith: jsonb('conflicts_with').$type<string[]>().default([]),
  definition: text('definition'),
  disqualifiesA: boolean('disqualifies_a').default(false),
  key: text('key').notNull().unique(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// No-Go Conditions
export const noGoConditions = pgTable('no_go_conditions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Chart Analyses
export const chartAnalyses = pgTable('chart_analyses', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Chart data
  imageUrl: text('image_url').notNull(),
  stockSymbol: text('stock_symbol'),

  // Analysis results
  isValidChart: boolean('is_valid_chart').notNull(),
  grade: text('grade').$type<'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'>(),
  gradeLabel: text('grade_label'),
  gradeColor: text('grade_color'),
  totalScore: integer('total_score'),

  // Trade recommendation
  shouldEnter: boolean('should_enter'),
  entryPrice: decimal('entry_price', { precision: 10, scale: 2 }),
  stopLoss: decimal('stop_loss', { precision: 10, scale: 2 }),
  takeProfit: decimal('take_profit', { precision: 10, scale: 2 }),
  riskRewardRatio: decimal('risk_reward_ratio', { precision: 5, scale: 2 }),

  // Detailed analysis
  activeBullishSignals: jsonb('active_bullish_signals').$type<Array<{
    id: string
    name: string
    shortName: string
    points: number
    explanation?: string
  }>>().default([]),
  activeBearishSignals: jsonb('active_bearish_signals').$type<Array<{
    id: string
    name: string
    shortName: string
    points: number
    explanation?: string
  }>>().default([]),
  activeNoGoConditions: jsonb('active_no_go_conditions').$type<Array<{
    id: string
    name: string
    description: string
  }>>().default([]),
  confluenceCount: integer('confluence_count'),
  confluenceCategories: jsonb('confluence_categories').$type<string[]>().default([]),

  // Reasoning
  analysisReason: text('analysis_reason'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}))

// Saved Trades (when user actually enters a position)
export const trades = pgTable('trades', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  analysisId: text('analysis_id').references(() => chartAnalyses.id, { onDelete: 'set null' }),

  stockSymbol: text('stock_symbol').notNull(),

  // Entry details
  entryDate: timestamp('entry_date').notNull(),
  entryPrice: decimal('entry_price', { precision: 10, scale: 2 }).notNull(),
  position: text('position').$type<'long' | 'short'>().default('long'),
  quantity: integer('quantity').notNull(),

  // Risk management
  stopLoss: decimal('stop_loss', { precision: 10, scale: 2 }),
  takeProfit: decimal('take_profit', { precision: 10, scale: 2 }),

  // Exit details
  exitDate: timestamp('exit_date'),
  exitPrice: decimal('exit_price', { precision: 10, scale: 2 }),

  // Results
  profitLoss: decimal('profit_loss', { precision: 10, scale: 2 }),
  profitLossPercent: decimal('profit_loss_percent', { precision: 5, scale: 2 }),
  status: text('status').$type<'open' | 'closed' | 'stopped_out'>().default('open'),

  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('trades_user_id_idx').on(table.userId),
  statusIdx: index('trades_status_idx').on(table.status),
}))

// Stripe payments/webhooks log
export const stripeEvents = pgTable('stripe_events', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  stripeEventId: text('stripe_event_id').unique().notNull(),
  type: text('type').notNull(),
  data: jsonb('data').notNull(),
  processed: boolean('processed').default(false),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// User activity/usage tracking
export const userActivity = pgTable('user_activity', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // 'chart_upload', 'analysis_created', 'trade_entered', etc.
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdActionIdx: index('user_activity_idx').on(table.userId, table.action),
}))

// Analytics events for tracking visits and conversions
export const analyticsEvents = pgTable('analytics_events', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  eventType: text('event_type').notNull(), // 'landing_page_visit', 'payment_page_visit', 'signup', 'conversion', etc.
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  sessionId: text('session_id'),

  // Request info
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),

  // Additional metadata
  metadata: jsonb('metadata'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  eventTypeIdx: index('event_type_idx').on(table.eventType),
  userIdIdx: index('analytics_user_id_idx').on(table.userId),
  createdAtIdx: index('analytics_created_at_idx').on(table.createdAt),
}))

// Referral codes
export const referralCodes = pgTable('referral_codes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  code: text('code').notNull().unique(),

  // Stats
  totalReferrals: integer('total_referrals').default(0),
  successfulReferrals: integer('successful_referrals').default(0), // Referrals that converted

  // Status
  active: boolean('active').default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  codeIdx: index('referral_code_idx').on(table.code),
}))

// Referrals tracking
export const referrals = pgTable('referrals', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  referrerId: text('referrer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  referredUserId: text('referred_user_id').references(() => users.id, { onDelete: 'set null' }),
  referralCode: text('referral_code').notNull().references(() => referralCodes.code),

  // Status
  status: text('status').$type<'pending' | 'signed_up' | 'converted' | 'expired'>().default('pending'),

  // Reward tracking
  rewardClaimed: boolean('reward_claimed').default(false),
  rewardType: text('reward_type'), // 'discount', 'credit', etc.
  rewardValue: decimal('reward_value', { precision: 10, scale: 2 }),
  rewardAppliedAt: timestamp('reward_applied_at'),

  // Conversion tracking
  convertedAt: timestamp('converted_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  referrerIdx: index('referrer_id_idx').on(table.referrerId),
  referredUserIdx: index('referred_user_id_idx').on(table.referredUserId),
  statusIdx: index('referral_status_idx').on(table.status),
}))