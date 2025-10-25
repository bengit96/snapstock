import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { chartAnalyses } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's analysis history
    const analyses = await db
      .select({
        id: chartAnalyses.id,
        stockSymbol: chartAnalyses.stockSymbol,
        grade: chartAnalyses.grade,
        gradeColor: chartAnalyses.gradeColor,
        gradeLabel: chartAnalyses.gradeLabel,
        shouldEnter: chartAnalyses.shouldEnter,
        entryPrice: chartAnalyses.entryPrice,
        stopLoss: chartAnalyses.stopLoss,
        takeProfit: chartAnalyses.takeProfit,
        riskRewardRatio: chartAnalyses.riskRewardRatio,
        createdAt: chartAnalyses.createdAt,
        imageUrl: chartAnalyses.imageUrl,
      })
      .from(chartAnalyses)
      .where(eq(chartAnalyses.userId, session.user.id))
      .orderBy(desc(chartAnalyses.createdAt))
      .limit(100)

    return NextResponse.json({ analyses })
  } catch (error) {
    console.error('Error fetching analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}