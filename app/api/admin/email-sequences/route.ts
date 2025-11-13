import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/utils/security";
import { ApiResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { db } from "@/lib/db";
import { scheduledEmails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  scheduleEmailSequence,
  getAllSequences,
  getSequencePreview,
} from "@/lib/services/email-sequence.service";
import { scheduleEmail as enqueueScheduledEmail } from "@/lib/services/qstash.service";

export const dynamic = "force-dynamic";

// GET - List all available email sequences
export async function GET() {
  try {
    await requireAdmin();

    const sequences = getAllSequences();

    return ApiResponse.success({ sequences });
  } catch (error) {
    logger.error("Error fetching email sequences", error);

    if (
      error instanceof Error &&
      error.message.includes("Admin access required")
    ) {
      return ApiResponse.forbidden(error.message);
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return ApiResponse.unauthorized(error.message);
    }

    return ApiResponse.serverError("Failed to fetch email sequences");
  }
}

// POST - Schedule an email sequence for selected users
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { sequenceId, userIds, customizations } = body;

    if (
      !sequenceId ||
      !userIds ||
      !Array.isArray(userIds) ||
      userIds.length === 0
    ) {
      return ApiResponse.badRequest("sequenceId and userIds are required");
    }

    // Get sequence preview
    const sequence = getSequencePreview(sequenceId);
    if (!sequence) {
      return ApiResponse.notFound(`Sequence ${sequenceId} not found`);
    }

    logger.info("Starting email sequence scheduling", {
      sequenceId,
      userCount: userIds.length,
    });

    // Schedule the sequence in the database
    const result = await scheduleEmailSequence({
      sequenceId,
      userIds,
      customizations,
    });

    let qstashScheduledCount = 0;
    let deferredCount = 0;
    const qstashErrors: string[] = [];

    // Process emails with 2-second delay between each to avoid rate limits
    for (let i = 0; i < result.emailRecords.length; i++) {
      const email = result.emailRecords[i];

      try {
        const now = new Date();
        const scheduledFor = new Date(email.scheduledFor);
        const delaySeconds = Math.max(
          0,
          Math.floor((scheduledFor.getTime() - now.getTime()) / 1000)
        );

        const qstashResult = await enqueueScheduledEmail({
          emailId: email.id,
          delaySeconds,
        });

        if (qstashResult === null) {
          // Email delay exceeds QStash max delay, will be scheduled later
          deferredCount++;
          logger.info("Email deferred (exceeds QStash max delay)", {
            emailId: email.id,
            delaySeconds,
            scheduledFor: scheduledFor.toISOString(),
          });
        } else {
          // Save the QStash message ID to the database for cancellation
          await db
            .update(scheduledEmails)
            .set({
              qstashMessageId: qstashResult.messageId,
            })
            .where(eq(scheduledEmails.id, email.id));

          qstashScheduledCount++;
          logger.info("Saved QStash message ID to database", {
            emailId: email.id,
            messageId: qstashResult.messageId,
          });
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        qstashErrors.push(`Email ${email.id}: ${errorMsg}`);
        logger.error("Failed to schedule email with QStash", {
          emailId: email.id,
          error: errorMsg,
        });

        // Mark the email as failed in the database
        try {
          await db
            .update(scheduledEmails)
            .set({
              status: "failed",
              error: `QStash scheduling failed: ${errorMsg}`,
            })
            .where(eq(scheduledEmails.id, email.id));
        } catch (dbError) {
          logger.error("Failed to update email status to failed", {
            emailId: email.id,
            error: dbError,
          });
        }
      }

      // Add 2-second delay between emails (except for the last one)
      if (i < result.emailRecords.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        logger.info("Waiting 2 seconds before scheduling next email", {
          current: i + 1,
          total: result.emailRecords.length,
        });
      }
    }

    logger.info("Email sequence scheduling completed", {
      sequenceId,
      dbScheduledCount: result.scheduledCount,
      qstashScheduledCount,
      deferredCount,
      errors: [...result.errors, ...qstashErrors],
    });

    const message =
      deferredCount > 0
        ? `Sequence scheduled for ${result.scheduledCount} users. ${qstashScheduledCount} emails scheduled immediately, ${deferredCount} will be scheduled automatically when within 7 days.`
        : `Sequence scheduled for ${result.scheduledCount} users`;

    return ApiResponse.success({
      message,
      scheduledCount: result.scheduledCount,
      qstashScheduledCount,
      deferredCount,
      errors: [...result.errors.map((e) => e.error), ...qstashErrors],
    });
  } catch (error) {
    logger.error("Error scheduling email sequence", error);

    if (
      error instanceof Error &&
      error.message.includes("Admin access required")
    ) {
      return ApiResponse.forbidden(error.message);
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return ApiResponse.unauthorized(error.message);
    }

    return ApiResponse.serverError("Failed to schedule email sequence");
  }
}
