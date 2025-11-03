import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { chartAnalyses, analysisFeedback } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getSecureImageUrl } from '@/lib/utils/image-security'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's analysis history with feedback
    const analysesData = await db
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
        feedbackWasCorrect: analysisFeedback.wasCorrect,
      })
      .from(chartAnalyses)
      .leftJoin(
        analysisFeedback,
        eq(chartAnalyses.id, analysisFeedback.analysisId)
      )
      .where(eq(chartAnalyses.userId, session.user.id))
      .orderBy(desc(chartAnalyses.createdAt))
      .limit(100)

    // Replace blob URLs with secure URLs
    const secureAnalyses = analysesData.map(analysis => ({
      ...analysis,
      imageUrl: getSecureImageUrl(analysis.id)
    }))

    return NextResponse.json({ analyses: secureAnalyses })
  } catch (error) {
    console.error('Error fetching analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}