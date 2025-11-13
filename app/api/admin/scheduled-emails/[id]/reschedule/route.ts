import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/utils/security";
import { ApiResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { db } from "@/lib/db";
import { scheduledEmails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { scheduleEmail as enqueueScheduledEmail } from "@/lib/services/qstash.service";

export const dynamic = "force-dynamic";

/**
 * POST - Reschedule an email to send now (or at a specific time)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const emailId = params.id;
    const body = await request.json();
    const { sendAt } = body; // Optional: ISO string for custom time, defaults to "now"

    // Fetch the email
    const [email] = await db
      .select()
      .from(scheduledEmails)
      .where(eq(scheduledEmails.id, emailId))
      .limit(1);

    if (!email) {
      return ApiResponse.notFound("Email not found");
    }

    // Only allow rescheduling pending or failed emails
    if (email.status !== "pending" && email.status !== "failed") {
      return ApiResponse.badRequest(
        `Cannot reschedule ${email.status} emails. Only pending or failed emails can be rescheduled.`
      );
    }

    const now = new Date();
    const scheduledFor = sendAt ? new Date(sendAt) : now;
    
    // Calculate delay in seconds
    const delaySeconds = Math.max(
      0,
      Math.floor((scheduledFor.getTime() - now.getTime()) / 1000)
    );

    logger.info("Rescheduling email", {
      emailId,
      originalScheduledFor: email.scheduledFor,
      newScheduledFor: scheduledFor.toISOString(),
      delaySeconds,
    });

    // Schedule with QStash
    const qstashResult = await enqueueScheduledEmail({
      emailId: email.id,
      delaySeconds,
    });

    if (qstashResult === null) {
      return ApiResponse.badRequest(
        "Email delay exceeds QStash max delay (7 days). Please choose a sooner time."
      );
    }

    // Update the email in database
    await db
      .update(scheduledEmails)
      .set({
        scheduledFor,
        status: "pending",
        qstashMessageId: qstashResult.messageId,
        error: null, // Clear any previous errors
        updatedAt: now,
      })
      .where(eq(scheduledEmails.id, emailId));

    logger.info("Email rescheduled successfully", {
      emailId,
      messageId: qstashResult.messageId,
      scheduledFor: scheduledFor.toISOString(),
    });

    return ApiResponse.success({
      message: delaySeconds === 0 
        ? "Email scheduled to send immediately" 
        : `Email rescheduled for ${scheduledFor.toLocaleString()}`,
      emailId,
      scheduledFor: scheduledFor.toISOString(),
      messageId: qstashResult.messageId,
    });
  } catch (error) {
    logger.error("Error rescheduling email", error);

    if (
      error instanceof Error &&
      error.message.includes("Admin access required")
    ) {
      return ApiResponse.forbidden(error.message);
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return ApiResponse.unauthorized(error.message);
    }

    return ApiResponse.serverError("Failed to reschedule email");
  }
}

