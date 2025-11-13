/**
 * Billing period utilities
 * Centralized logic for calculating billing periods and analysis limits
 */

import { db } from "@/lib/db";
import { users, chartAnalyses } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { SUBSCRIPTION_LIMITS } from "@/lib/constants";

export interface BillingPeriodInfo {
  periodStart: Date;
  periodEnd: Date | null;
  tier: "monthly" | "yearly" | "lifetime" | null;
  analysesLimit: number | null;
}

/**
 * Gets the billing period start date for a user
 * For paid users: uses their actual billing cycle start from Stripe
 * For free users: returns epoch (counts all time)
 */
export function getBillingPeriodStart(user: {
  subscriptionTier?: string | null;
  currentPeriodStart?: Date | null;
  subscriptionStatus?: string | null;
}): Date {
  const hasPaidSubscription =
    user.subscriptionTier && user.subscriptionStatus === "active";

  if (hasPaidSubscription && user.currentPeriodStart) {
    // Use actual billing period from Stripe
    return user.currentPeriodStart;
  } else if (hasPaidSubscription && !user.currentPeriodStart) {
    // Fallback: 1st of current month (for legacy subscriptions)
    // This shouldn't happen for new subscriptions
    const fallback = new Date();
    fallback.setDate(1);
    fallback.setHours(0, 0, 0, 0);
    return fallback;
  } else {
    // Free tier: count all time (epoch)
    return new Date(0);
  }
}

/**
 * Gets complete billing period information for a user
 */
export async function getUserBillingPeriod(
  userId: string
): Promise<BillingPeriodInfo> {
  const userResult = await db
    .select({
      subscriptionTier: users.subscriptionTier,
      subscriptionStatus: users.subscriptionStatus,
      currentPeriodStart: users.currentPeriodStart,
      subscriptionEndDate: users.subscriptionEndDate,
      freeAnalysesLimit: users.freeAnalysesLimit,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!userResult || userResult.length === 0) {
    throw new Error("User not found");
  }

  const user = userResult[0];
  const tier = user.subscriptionTier as
    | "monthly"
    | "yearly"
    | "lifetime"
    | null;
  const periodStart = getBillingPeriodStart(user);
  
  // Get limit based on subscription tier or free limit
  const analysesLimit = tier
    ? SUBSCRIPTION_LIMITS[tier]?.monthlyAnalyses ?? null
    : user.freeAnalysesLimit || 1; // Free users get their freeAnalysesLimit (default 1)

  return {
    periodStart,
    periodEnd: user.subscriptionEndDate,
    tier,
    analysesLimit,
  };
}

/**
 * Counts analyses for a user in their current billing period
 */
export async function countAnalysesInPeriod(
  userId: string,
  periodStart?: Date
): Promise<number> {
  // If periodStart not provided, fetch it
  if (!periodStart) {
    const billingInfo = await getUserBillingPeriod(userId);
    periodStart = billingInfo.periodStart;
  }

  const analyses = await db
    .select({ id: chartAnalyses.id })
    .from(chartAnalyses)
    .where(
      and(
        eq(chartAnalyses.userId, userId),
        gte(chartAnalyses.createdAt, periodStart)
      )
    );
  console.log(analyses, periodStart);

  return analyses.length;
}

/**
 * Checks if user has reached their analysis limit
 * Returns { allowed: boolean, used: number, limit: number | null }
 */
export async function checkAnalysisLimit(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number | null;
  periodStart: Date;
  periodEnd: Date | null;
}> {
  const billingInfo = await getUserBillingPeriod(userId);
  const used = await countAnalysesInPeriod(userId, billingInfo.periodStart);

  // Null limit = unlimited (lifetime plan)
  const allowed =
    billingInfo.analysesLimit === null || used < billingInfo.analysesLimit;

  return {
    allowed,
    used,
    limit: billingInfo.analysesLimit,
    periodStart: billingInfo.periodStart,
    periodEnd: billingInfo.periodEnd,
  };
}
