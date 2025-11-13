import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/utils/security'
import { ApiResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { db } from '@/lib/db'
import { scheduledEmails, users } from '@/lib/db/schema'
import { eq, desc, and, or, like, gte, lte, count, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// GET - List scheduled emails with filters
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'pending' | 'sent' | 'failed' | 'cancelled' | 'all'
    const sequenceId = searchParams.get('sequenceId')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where conditions
    const conditions = []

    if (status && status !== 'all') {
      conditions.push(eq(scheduledEmails.status, status as any))
    }

    if (sequenceId) {
      conditions.push(like(scheduledEmails.emailType, `sequence_${sequenceId}_%`))
    }

    if (userId) {
      conditions.push(eq(scheduledEmails.userId, userId))
    }

    // Fetch scheduled emails with user info
    const emails = await db
      .select({
        id: scheduledEmails.id,
        userId: scheduledEmails.userId,
        userEmail: users.email,
        userName: users.name,
        emailType: scheduledEmails.emailType,
        recipientEmail: scheduledEmails.recipientEmail,
        subject: scheduledEmails.subject,
        promoCode: scheduledEmails.promoCode,
        scheduledFor: scheduledEmails.scheduledFor,
        status: scheduledEmails.status,
        sentAt: scheduledEmails.sentAt,
        cancelledAt: scheduledEmails.cancelledAt,
        cancellationReason: scheduledEmails.cancellationReason,
        error: scheduledEmails.error,
        metadata: scheduledEmails.metadata,
        createdAt: scheduledEmails.createdAt,
      })
      .from(scheduledEmails)
      .leftJoin(users, eq(scheduledEmails.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(scheduledEmails.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(scheduledEmails)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    const total = totalResult[0]?.count || 0

    // Get summary stats
    const statsResult = await db
      .select({
        status: scheduledEmails.status,
        count: count(),
      })
      .from(scheduledEmails)
      .groupBy(scheduledEmails.status)

    const stats = {
      pending: 0,
      sent: 0,
      failed: 0,
      cancelled: 0,
    }

    for (const row of statsResult) {
      if (row.status in stats) {
        stats[row.status as keyof typeof stats] = row.count
      }
    }

    return ApiResponse.success({
      emails,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      stats,
    })
  } catch (error) {
    logger.error('Error fetching scheduled emails', error)

    if (error instanceof Error && error.message.includes('Admin access required')) {
      return ApiResponse.forbidden(error.message)
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return ApiResponse.unauthorized(error.message)
    }

    return ApiResponse.serverError('Failed to fetch scheduled emails')
  }
}

