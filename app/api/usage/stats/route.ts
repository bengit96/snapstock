import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { chartAnalyses, users } from '@/lib/db/schema'
import { getUserBillingPeriod, countAnalysesInPeriod } from '@/lib/utils/billing'
import { eq, and, gte, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use db directly

    // Get user info for free trial stats
    const userResult = await db
      .select({
        freeAnalysesUsed: users.freeAnalysesUsed,
        freeAnalysesLimit: users.freeAnalysesLimit,
        subscriptionStatus: users.subscriptionStatus,
        subscriptionTier: users.subscriptionTier,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    const user = userResult[0]

    // Get total analyses
    const totalAnalyses = await db
      .select()
      .from(chartAnalyses)
      .where(eq(chartAnalyses.userId, session.user.id))

    // Get billing period info for current period analyses
    const billingInfo = await getUserBillingPeriod(session.user.id)
    const thisMonth = await countAnalysesInPeriod(session.user.id, billingInfo.periodStart)

    // Get this week's analyses
    const thisWeekStart = new Date()
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())
    thisWeekStart.setHours(0, 0, 0, 0)

    const thisWeek = await db
      .select()
      .from(chartAnalyses)
      .where(
        and(
          eq(chartAnalyses.userId, session.user.id),
          gte(chartAnalyses.createdAt, thisWeekStart)
        )
      )

    // Get recent analyses (last 10)
    const recentAnalyses = await db
      .select({
        id: chartAnalyses.id,
        stockSymbol: chartAnalyses.stockSymbol,
        grade: chartAnalyses.grade,
        createdAt: chartAnalyses.createdAt,
      })
      .from(chartAnalyses)
      .where(eq(chartAnalyses.userId, session.user.id))
      .orderBy(desc(chartAnalyses.createdAt))
      .limit(10)

    const isFreeUser = !user.subscriptionStatus || user.subscriptionStatus !== 'active'

    return NextResponse.json({
      totalAnalyses: totalAnalyses.length,
      thisMonth: thisMonth,
      thisWeek: thisWeek.length,
      recentAnalyses: recentAnalyses.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      })),
      // Include free trial stats if user is on free plan
      ...(isFreeUser && {
        freeAnalysesUsed: user.freeAnalysesUsed,
        freeAnalysesLimit: user.freeAnalysesLimit,
      }),
      // Include monthly limit info for paid users
      ...(!isFreeUser && {
        subscriptionTier: billingInfo.tier,
        monthlyLimit: billingInfo.analysesLimit,
        monthlyUsed: thisMonth,
        monthlyRemaining: billingInfo.analysesLimit === null ? null : Math.max(0, billingInfo.analysesLimit - thisMonth),
      }),
    })
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    )
  }
}
