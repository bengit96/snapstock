import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, chartAnalyses } from '@/lib/db/schema'
import { eq, and, gte } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user details
    const user = await db
      .select({
        subscriptionTier: users.subscriptionTier,
        subscriptionStatus: users.subscriptionStatus,
        subscriptionEndDate: users.subscriptionEndDate,
        freeAnalysesUsed: users.freeAnalysesUsed,
        freeAnalysesLimit: users.freeAnalysesLimit,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = user[0]

    // Calculate period start based on subscription
    let periodStart = new Date()
    if (userData.subscriptionTier === 'monthly') {
      periodStart = new Date(periodStart.getFullYear(), periodStart.getMonth(), 1)
    } else if (userData.subscriptionTier === 'yearly') {
      periodStart = new Date(periodStart.getFullYear(), 0, 1)
    } else {
      // For free tier, count all time
      periodStart = new Date(0)
    }

    // Count analyses in current period
    const analysisCount = await db
      .select({ count: chartAnalyses.id })
      .from(chartAnalyses)
      .where(
        and(
          eq(chartAnalyses.userId, session.user.id),
          gte(chartAnalyses.createdAt, periodStart)
        )
      )

    const analysesUsed = analysisCount.length

    // Determine limit based on subscription
    let analysesLimit = null
    if (!userData.subscriptionTier) {
      analysesLimit = userData.freeAnalysesLimit || 1
    }
    // For paid plans, analysesLimit remains null (unlimited)

    return NextResponse.json({
      analysesUsed: userData.subscriptionTier ? analysesUsed : userData.freeAnalysesUsed || 0,
      analysesLimit,
      currentPeriodEnd: userData.subscriptionEndDate,
      subscriptionTier: userData.subscriptionTier || null,
      subscriptionStatus: userData.subscriptionStatus,
    })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    )
  }
}