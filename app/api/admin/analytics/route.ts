import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, chartAnalyses, analyticsEvents } from '@/lib/db/schema'
import { count, sql, eq, and, gte, lte, desc, isNull } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Calculate date ranges
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // 1. USER LIFECYCLE SEGMENTS

    // Total users
    const totalUsersResult = await db
      .select({ count: count() })
      .from(users)
    const totalUsers = totalUsersResult[0]?.count || 0

    // Users with 0 generations (signed up but never used)
    const usersWithAnalyses = await db
      .select({
        userId: chartAnalyses.userId,
        totalAnalyses: count(),
      })
      .from(chartAnalyses)
      .groupBy(chartAnalyses.userId)

    const usersWithAnalysesSet = new Set(usersWithAnalyses.map(u => u.userId))
    const usersWithZeroGenerations = totalUsers - usersWithAnalysesSet.size

    // Users with exactly 1 generation (used free tier, didn't upgrade)
    const usersWithOneGeneration = usersWithAnalyses.filter(u => u.totalAnalyses === 1).length

    // Free users who exhausted their free tier
    const freeUsersExhausted = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.freeAnalysesUsed, users.freeAnalysesLimit),
          sql`(${users.subscriptionStatus} IS NULL OR ${users.subscriptionStatus} = 'inactive')`
        )
      )
    const freeUsersExhaustedCount = freeUsersExhausted[0]?.count || 0

    // Paid users (active subscriptions)
    const paidUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.subscriptionStatus, 'active'))
    const paidUsers = paidUsersResult[0]?.count || 0

    // 2. FUNNEL METRICS

    // Pricing page visits (unique users)
    const pricingVisitsResult = await db
      .select({ userId: analyticsEvents.userId })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'pricing_page_visit'),
          sql`${analyticsEvents.userId} IS NOT NULL`
        )
      )
      .groupBy(analyticsEvents.userId)
    const uniquePricingVisitors = pricingVisitsResult.length

    // Users who viewed pricing but didn't pay
    const pricingVisitorsUserIds = new Set(
      pricingVisitsResult
        .map(r => r.userId)
        .filter((id): id is string => id !== null)
    )
    const paidUsersList = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.subscriptionStatus, 'active'))
    const paidUsersSet = new Set(paidUsersList.map(u => u.id))

    const viewedPricingNoPurchase = Array.from(pricingVisitorsUserIds).filter(
      userId => !paidUsersSet.has(userId)
    ).length

    // Checkout initiated (payment page visits)
    const checkoutInitiatedResult = await db
      .select({ userId: analyticsEvents.userId })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'payment_page_visit'),
          sql`${analyticsEvents.userId} IS NOT NULL`
        )
      )
      .groupBy(analyticsEvents.userId)
    const checkoutInitiated = checkoutInitiatedResult.length

    // Checkout abandonment (started checkout but didn't complete)
    const checkoutUserIds = new Set(
      checkoutInitiatedResult
        .map(r => r.userId)
        .filter((id): id is string => id !== null)
    )
    const checkoutAbandoned = Array.from(checkoutUserIds).filter(
      userId => !paidUsersSet.has(userId)
    ).length

    // 3. CONVERSION RATES

    const signupToFirstGenRate = totalUsers > 0
      ? ((totalUsers - usersWithZeroGenerations) / totalUsers * 100)
      : 0

    const firstGenToPaymentRate = (totalUsers - usersWithZeroGenerations) > 0
      ? (paidUsers / (totalUsers - usersWithZeroGenerations) * 100)
      : 0

    const pricingToCheckoutRate = uniquePricingVisitors > 0
      ? (checkoutInitiated / uniquePricingVisitors * 100)
      : 0

    const checkoutToPaymentRate = checkoutInitiated > 0
      ? ((checkoutInitiated - checkoutAbandoned) / checkoutInitiated * 100)
      : 0

    const overallConversionRate = totalUsers > 0
      ? (paidUsers / totalUsers * 100)
      : 0

    // 4. TIME-BASED METRICS

    // Get users with their first analysis timestamp
    const firstAnalyses = await db
      .select({
        userId: chartAnalyses.userId,
        firstAnalysis: sql<Date>`MIN(${chartAnalyses.createdAt})`.as('first_analysis'),
      })
      .from(chartAnalyses)
      .groupBy(chartAnalyses.userId)

    // Calculate average time from signup to first generation
    const userCreationDates = await db
      .select({
        id: users.id,
        createdAt: users.createdAt,
      })
      .from(users)

    const userCreationMap = new Map(
      userCreationDates.map(u => [u.id, u.createdAt])
    )

    let totalTimeToFirstGen = 0
    let usersWithFirstGen = 0

    for (const analysis of firstAnalyses) {
      const signupDate = userCreationMap.get(analysis.userId)
      if (signupDate && analysis.firstAnalysis) {
        const timeDiff = analysis.firstAnalysis.getTime() - new Date(signupDate).getTime()
        totalTimeToFirstGen += timeDiff
        usersWithFirstGen++
      }
    }

    const avgTimeToFirstGenHours = usersWithFirstGen > 0
      ? totalTimeToFirstGen / usersWithFirstGen / (1000 * 60 * 60)
      : 0

    // Active users (generated in last 7 and 30 days)
    const activeUsers7DaysResult = await db
      .select({ userId: chartAnalyses.userId })
      .from(chartAnalyses)
      .where(gte(chartAnalyses.createdAt, last7Days))
      .groupBy(chartAnalyses.userId)
    const activeUsers7Days = activeUsers7DaysResult.length

    const activeUsers30DaysResult = await db
      .select({ userId: chartAnalyses.userId })
      .from(chartAnalyses)
      .where(gte(chartAnalyses.createdAt, last30Days))
      .groupBy(chartAnalyses.userId)
    const activeUsers30Days = activeUsers30DaysResult.length

    // 5. DETAILED USER SEGMENTS FOR TABLE VIEW

    // Get all users with their detailed info
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        subscriptionStatus: users.subscriptionStatus,
        subscriptionTier: users.subscriptionTier,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    // Create analysis count map
    const analysisCountMap = new Map(
      usersWithAnalyses.map(u => [u.userId, u.totalAnalyses])
    )

    // Get last activity for each user
    const lastActivities = await db
      .select({
        userId: chartAnalyses.userId,
        lastActivity: sql<Date>`MAX(${chartAnalyses.createdAt})`.as('last_activity'),
      })
      .from(chartAnalyses)
      .groupBy(chartAnalyses.userId)

    const lastActivityMap = new Map(
      lastActivities.map(a => [a.userId, a.lastActivity])
    )

    // Categorize users by segment
    const dropoffSegments = allUsers.map(user => {
      const analysisCount = analysisCountMap.get(user.id) || 0
      const isPaid = user.subscriptionStatus === 'active'
      const lastActivity = lastActivityMap.get(user.id)

      let segment = 'Unknown'
      let priority = 0

      if (analysisCount === 0) {
        segment = 'Signed up, never generated'
        priority = 1
      } else if (analysisCount === 1 && !isPaid) {
        segment = 'Used free tier, didn\'t upgrade'
        priority = 2
      } else if (analysisCount > 1 && !isPaid) {
        segment = 'Multiple generations, not paid (anomaly)'
        priority = 3
      } else if (isPaid) {
        segment = 'Paid customer'
        priority = 5
      }

      // Check if viewed pricing
      const viewedPricing = pricingVisitorsUserIds.has(user.id)
      if (viewedPricing && !isPaid && analysisCount > 0) {
        segment = 'Viewed pricing, didn\'t purchase'
        priority = 3
      }

      // Check if started checkout
      const startedCheckout = checkoutUserIds.has(user.id)
      if (startedCheckout && !isPaid) {
        segment = 'Started checkout, abandoned'
        priority = 4
      }

      const daysSinceSignup = Math.floor(
        (now.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      )

      const daysSinceLastActivity = lastActivity
        ? Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
        : null

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        segment,
        priority,
        analysisCount,
        isPaid,
        subscriptionTier: user.subscriptionTier,
        daysSinceSignup,
        daysSinceLastActivity,
        createdAt: user.createdAt,
      }
    })

    // Sort by priority (highest priority = biggest drop-off concern)
    dropoffSegments.sort((a, b) => a.priority - b.priority)

    // 6. RECENT SIGNUPS (last 7 days) - for early intervention
    const recentSignups = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(gte(users.createdAt, last7Days))
      .orderBy(desc(users.createdAt))

    const recentSignupsWithActivity = recentSignups.map(user => ({
      ...user,
      analysisCount: analysisCountMap.get(user.id) || 0,
      isPaid: paidUsersSet.has(user.id),
      needsAttention: (analysisCountMap.get(user.id) || 0) === 0,
    }))

    // Return comprehensive analytics
    return NextResponse.json({
      summary: {
        totalUsers,
        paidUsers,
        usersWithZeroGenerations,
        usersWithOneGeneration,
        freeUsersExhausted,
        uniquePricingVisitors,
        viewedPricingNoPurchase,
        checkoutInitiated,
        checkoutAbandoned,
        activeUsers7Days,
        activeUsers30Days,
      },
      conversionRates: {
        signupToFirstGenRate: signupToFirstGenRate.toFixed(2),
        firstGenToPaymentRate: firstGenToPaymentRate.toFixed(2),
        pricingToCheckoutRate: pricingToCheckoutRate.toFixed(2),
        checkoutToPaymentRate: checkoutToPaymentRate.toFixed(2),
        overallConversionRate: overallConversionRate.toFixed(2),
      },
      timing: {
        avgTimeToFirstGenHours: avgTimeToFirstGenHours.toFixed(2),
      },
      dropoffSegments: dropoffSegments.slice(0, 100), // Limit to top 100 for performance
      recentSignups: recentSignupsWithActivity,
    })
  } catch (error) {
    console.error('Error fetching admin analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
