import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, chartAnalyses, scheduledEmails } from '@/lib/db/schema'
import { ApiResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { verifyQStashSignature } from '@/lib/services/qstash.service'
import { scheduleEmailSequence } from '@/lib/services/email-sequence.service'
import { scheduleEmail as enqueueScheduledEmail } from '@/lib/services/qstash.service'
import {
  and,
  eq,
  inArray,
  like,
  sql,
} from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const SEQUENCE_KEY = 'one_analysis_recovery'

const toDate = (value: Date | string | null | undefined) => {
  if (!value) return null
  if (value instanceof Date) return value
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('upstash-signature')
    const rawBody = await request.text()

    if (!signature) {
      if (process.env.NODE_ENV !== 'development') {
        logger.warn('Missing QStash signature for auto sequence trigger')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    } else {
      const valid = verifyQStashSignature(signature, rawBody)
      if (!valid) {
        logger.warn('Invalid QStash signature for auto sequence trigger')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const url = new URL(request.url)
    const dryRun = url.searchParams.get('dryRun') === '1'

    const now = new Date()
    const cutoff = new Date(now.getTime() - ONE_DAY_MS)

    // Find users with exactly one analysis whose first analysis was >= 24h ago
    const candidateUsers = await db
      .select({
        userId: users.id,
        email: users.email,
        name: users.name,
        subscriptionStatus: users.subscriptionStatus,
        firstAnalysisAt: sql<Date>`MIN(${chartAnalyses.createdAt})`,
        analysisCount: sql<number>`COUNT(${chartAnalyses.id})`,
      })
      .from(chartAnalyses)
      .innerJoin(users, eq(chartAnalyses.userId, users.id))
      .groupBy(users.id, users.email, users.name, users.subscriptionStatus)
      .having(sql`COUNT(${chartAnalyses.id}) = 1`)

    const eligibleUsers = candidateUsers.filter((candidate) => {
      const firstAnalysisAt = toDate(candidate.firstAnalysisAt)
      const count = Number(candidate.analysisCount ?? 0)
      const subscriptionStatus = candidate.subscriptionStatus ?? 'inactive'

      return (
        firstAnalysisAt !== null &&
        firstAnalysisAt <= cutoff &&
        count === 1 &&
        subscriptionStatus !== 'active'
      )
    })

    if (eligibleUsers.length === 0) {
      logger.info('Auto sequence check: no eligible users found', { cutoff: cutoff.toISOString() })
      return ApiResponse.success({
        message: 'No eligible users found',
        matchedUsers: 0,
        scheduledUsers: 0,
      })
    }

    const eligibleUserIds = eligibleUsers.map((user) => user.userId)

    // Check for users who already have this sequence scheduled (pending or sent)
    const sequencePrefix = `sequence_${SEQUENCE_KEY}_`
    const alreadyScheduled = await db
      .select({
        userId: scheduledEmails.userId,
      })
      .from(scheduledEmails)
      .where(
        and(
          inArray(scheduledEmails.userId, eligibleUserIds),
          like(scheduledEmails.emailType, `${sequencePrefix}%`),
          inArray(scheduledEmails.status, ['pending', 'sent'])
        )
      )

    const alreadyScheduledSet = new Set(alreadyScheduled.map((row) => row.userId))
    const userIdsToSchedule = eligibleUsers
      .filter((user) => !alreadyScheduledSet.has(user.userId))
      .map((user) => user.userId)

    if (dryRun) {
      return ApiResponse.success({
        message: 'Dry run - no users scheduled',
        matchedUsers: eligibleUsers.length,
        alreadyScheduledUsers: alreadyScheduledSet.size,
        usersToSchedule: userIdsToSchedule.length,
      })
    }

    if (userIdsToSchedule.length === 0) {
      logger.info('Auto sequence check: all eligible users already scheduled', {
        matchedUsers: eligibleUsers.length,
      })

      return ApiResponse.success({
        message: 'All eligible users already scheduled',
        matchedUsers: eligibleUsers.length,
        scheduledUsers: 0,
        alreadyScheduledUsers: alreadyScheduledSet.size,
      })
    }

    const sequenceResult = await scheduleEmailSequence({
      sequenceId: SEQUENCE_KEY,
      userIds: userIdsToSchedule,
      triggeredBy: 'auto',
      metadata: {
        autoTriggered: true,
        triggeredAt: now.toISOString(),
      },
    })

    let qstashScheduledCount = 0
    const qstashErrors: Array<{ emailId: string; error: string }> = []

    for (const email of sequenceResult.emailRecords) {
      try {
        const delaySeconds = Math.max(
          0,
          Math.floor((email.scheduledFor.getTime() - now.getTime()) / 1000)
        )

        await enqueueScheduledEmail({
          emailId: email.id,
          delaySeconds,
        })

        qstashScheduledCount++
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error'
        qstashErrors.push({ emailId: email.id, error: msg })
        logger.error('Auto sequence: failed to enqueue email', {
          emailId: email.id,
          userId: email.userId,
          error: msg,
        })
      }
    }

    logger.info('Auto sequence scheduling completed', {
      sequenceId: SEQUENCE_KEY,
      matchedUsers: eligibleUsers.length,
      scheduledUsers: sequenceResult.scheduledCount,
      qstashScheduledCount,
      qstashErrors,
      errors: sequenceResult.errors,
    })

    return ApiResponse.success({
      message: `Auto sequence scheduled for ${sequenceResult.scheduledCount} users`,
      matchedUsers: eligibleUsers.length,
      scheduledUsers: sequenceResult.scheduledCount,
      alreadyScheduledUsers: alreadyScheduledSet.size,
      qstashScheduledCount,
      qstashErrors,
      sequenceErrors: sequenceResult.errors,
    })
  } catch (error) {
    logger.error('Error in auto sequence trigger', error)
    return ApiResponse.serverError('Failed to run auto email sequence trigger')
  }
}

