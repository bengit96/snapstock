import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { chartAnalyses } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { ApiResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session) {
      return ApiResponse.unauthorized('You must be logged in to update analysis')
    }

    const { stockSymbol } = await request.json()

    // Validate stock symbol format (basic validation)
    if (stockSymbol && typeof stockSymbol !== 'string') {
      return ApiResponse.badRequest('Invalid stock symbol format')
    }

    // Validate stock symbol (alphanumeric, 1-5 characters, uppercase)
    const cleanedSymbol = stockSymbol?.trim().toUpperCase() || null
    if (cleanedSymbol && !/^[A-Z]{1,5}$/.test(cleanedSymbol)) {
      return ApiResponse.badRequest('Stock symbol must be 1-5 uppercase letters')
    }

    // Update the analysis
    const [updatedAnalysis] = await db
      .update(chartAnalyses)
      .set({
        stockSymbol: cleanedSymbol,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(chartAnalyses.id, params.id),
          eq(chartAnalyses.userId, session.user.id)
        )
      )
      .returning()

    if (!updatedAnalysis) {
      return ApiResponse.notFound('Analysis not found or you do not have permission to update it')
    }

    logger.info('Stock symbol updated', {
      userId: session.user.id,
      analysisId: params.id,
      stockSymbol: cleanedSymbol,
    })

    return ApiResponse.success({
      stockSymbol: updatedAnalysis.stockSymbol,
      message: 'Stock symbol updated successfully',
    })
  } catch (error) {
    logger.error('Error updating stock symbol', error)
    return ApiResponse.serverError('Failed to update stock symbol')
  }
}
