import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/utils/security";
import { ApiResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { db } from "@/lib/db";
import { scheduledEmails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cancelQStashMessage } from "@/lib/services/qstash.service";

export const dynamic = "force-dynamic";

// POST - Cancel a scheduled email
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const emailId = params.id;

    if (!emailId) {
      return ApiResponse.badRequest("Email ID is required");
    }

    // Fetch the email
    const [email] = await db
      .select()
      .from(scheduledEmails)
      .where(eq(scheduledEmails.id, emailId))
      .limit(1);

    if (!email) {
      return ApiResponse.notFound("Email not found");
    }

    // Check if already cancelled or sent
    if (email.status === "cancelled") {
      return ApiResponse.badRequest("Email is already cancelled");
    }

    if (email.status === "sent") {
      return ApiResponse.badRequest("Cannot cancel an already sent email");
    }

    // Cancel in QStash if message ID exists
    if (email.qstashMessageId) {
      try {
        const qstashResult = await cancelQStashMessage(email.qstashMessageId);
        if (!qstashResult.success) {
          logger.warn("Failed to cancel QStash message, continuing with DB update", {
            emailId,
            messageId: email.qstashMessageId,
            error: qstashResult.error,
          });
        } else {
          logger.info("Cancelled QStash message", {
            emailId,
            messageId: email.qstashMessageId,
          });
        }
      } catch (error) {
        logger.warn("Error cancelling QStash message, continuing with DB update", {
          emailId,
          messageId: email.qstashMessageId,
          error,
        });
      }
    }

    // Update database status
    await db
      .update(scheduledEmails)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: "manual_admin",
      })
      .where(eq(scheduledEmails.id, emailId));

    logger.info("Email cancelled successfully", {
      emailId,
      recipientEmail: email.recipientEmail,
    });

    return ApiResponse.success({
      message: "Email cancelled successfully",
      emailId,
    });
  } catch (error) {
    logger.error("Error cancelling email", error);

    if (error instanceof Error && error.message.includes("Admin access required")) {
      return ApiResponse.forbidden(error.message);
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return ApiResponse.unauthorized(error.message);
    }

    return ApiResponse.serverError("Failed to cancel email");
  }
}

