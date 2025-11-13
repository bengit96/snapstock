import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/utils/security'
import { ApiResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import {
  scheduleEmailSequence,
  getAllSequences,
  getSequencePreview,
} from '@/lib/services/email-sequence.service'
import { db } from '@/lib/db'
import { scheduledEmails } from '@/lib/db/schema'
import { scheduleEmail } from '@/lib/services/qstash.service'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// GET - List all available email sequences
export async function GET() {
  try {
    await requireAdmin()

    const sequences = getAllSequences()

    return ApiResponse.success({ sequences })
  } catch (error) {
    logger.error('Error fetching email sequences', error)

    if (error instanceof Error && error.message.includes('Admin access required')) {
      return ApiResponse.forbidden(error.message)
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return ApiResponse.unauthorized(error.message)
    }

    return ApiResponse.serverError('Failed to fetch email sequences')
  }
}

// POST - Schedule an email sequence for selected users
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { sequenceId, userIds, customizations } = body

    if (!sequenceId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return ApiResponse.badRequest('sequenceId and userIds are required')
    }

    // Get sequence preview
    const sequence = getSequencePreview(sequenceId)
    if (!sequence) {
      return ApiResponse.notFound(`Sequence ${sequenceId} not found`)
    }

    logger.info('Starting email sequence scheduling', {
      sequenceId,
      userCount: userIds.length,
    })

    // Schedule the sequence in the database
    const result = await scheduleEmailSequence({
      sequenceId,
      userIds,
      customizations,
    })

    // Now schedule each email with QStash
    const scheduledEmailsFromDb = await db
      .select()
      .from(scheduledEmails)
      .where(eq(scheduledEmails.status, 'pending'))

    let qstashScheduledCount = 0
    const qstashErrors: string[] = []

    for (const email of scheduledEmailsFromDb) {
      try {
        const now = new Date()
        const scheduledFor = new Date(email.scheduledFor)
        const delaySeconds = Math.max(
          0,
          Math.floor((scheduledFor.getTime() - now.getTime()) / 1000)
        )

        await scheduleEmail({
          emailId: email.id,
          delaySeconds,
        })

        qstashScheduledCount++
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        qstashErrors.push(`Email ${email.id}: ${errorMsg}`)
        logger.error('Failed to schedule email with QStash', {
          emailId: email.id,
          error: errorMsg,
        })
      }
    }

    logger.info('Email sequence scheduling completed', {
      sequenceId,
      dbScheduledCount: result.scheduledCount,
      qstashScheduledCount,
      errors: [...result.errors, ...qstashErrors],
    })

    return ApiResponse.success({
      message: `Sequence scheduled for ${result.scheduledCount} users`,
      scheduledCount: result.scheduledCount,
      qstashScheduledCount,
      errors: [...result.errors.map(e => e.error), ...qstashErrors],
    })
  } catch (error) {
    logger.error('Error scheduling email sequence', error)

    if (error instanceof Error && error.message.includes('Admin access required')) {
      return ApiResponse.forbidden(error.message)
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return ApiResponse.unauthorized(error.message)
    }

    return ApiResponse.serverError('Failed to schedule email sequence')
  }
}

