import { db } from "@/lib/db";
import { scheduledEmails, users } from "@/lib/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { sendTrialPromoEmail } from "./email-templates.service";

export interface ScheduleEmailOptions {
  userId: string;
  emailType: string;
  recipientEmail: string;
  subject: string;
  promoCode?: string;
  scheduledFor: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Schedule an email to be sent in the future
 */
export async function scheduleEmail(
  options: ScheduleEmailOptions
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  try {
    const result = await db
      .insert(scheduledEmails)
      .values({
        userId: options.userId,
        emailType: options.emailType,
        recipientEmail: options.recipientEmail,
        subject: options.subject,
        promoCode: options.promoCode,
        scheduledFor: options.scheduledFor,
        status: "pending",
        metadata: options.metadata,
      })
      .returning();

    const scheduledEmail = result[0];

    console.log("[ScheduledEmail] Email scheduled:", {
      emailId: scheduledEmail.id,
      userId: options.userId,
      emailType: options.emailType,
      scheduledFor: options.scheduledFor,
      recipientEmail: options.recipientEmail,
    });

    return {
      success: true,
      emailId: scheduledEmail.id,
    };
  } catch (error) {
    console.error("[ScheduledEmail] Failed to schedule email:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to schedule email",
    };
  }
}

/**
 * Schedule a trial promo email 1 day after trial usage
 */
export async function scheduleTrialPromoEmail(
  userId: string,
  userEmail: string,
  userName: string | null,
  promoCode: string
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  // Schedule for 24 hours from now
  const scheduledFor = new Date();
  scheduledFor.setHours(scheduledFor.getHours() + 24);

  return scheduleEmail({
    userId,
    emailType: "trial_promo",
    recipientEmail: userEmail,
    subject: "Special offer: Get 25% off your SnapPChart subscription",
    promoCode,
    scheduledFor,
    metadata: {
      triggeredBy: "trial_usage",
      userName,
    },
  });
}

/**
 * Cancel scheduled emails for a user (e.g., when they subscribe)
 */
export async function cancelScheduledEmailsForUser(
  userId: string,
  emailType?: string,
  cancellationReason: string = "user_subscribed"
): Promise<{ success: boolean; cancelledCount: number; error?: string }> {
  try {
    const whereConditions = [
      eq(scheduledEmails.userId, userId),
      eq(scheduledEmails.status, "pending"),
    ];

    if (emailType) {
      whereConditions.push(eq(scheduledEmails.emailType, emailType));
    }

    const result = await db
      .update(scheduledEmails)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason,
        updatedAt: new Date(),
      })
      .where(and(...whereConditions))
      .returning();

    console.log("[ScheduledEmail] Emails cancelled:", {
      userId,
      emailType,
      cancelledCount: result.length,
      cancellationReason,
      emailIds: result.map((e) => e.id),
    });

    return {
      success: true,
      cancelledCount: result.length,
    };
  } catch (error) {
    console.error("[ScheduledEmail] Failed to cancel emails:", error);
    return {
      success: false,
      cancelledCount: 0,
      error: error instanceof Error ? error.message : "Failed to cancel emails",
    };
  }
}

/**
 * Process pending scheduled emails that are due to be sent
 */
export async function processPendingEmails(): Promise<{
  success: boolean;
  processed: number;
  sent: number;
  failed: number;
  errors: Array<{ emailId: string; error: string }>;
}> {
  const results = {
    success: true,
    processed: 0,
    sent: 0,
    failed: 0,
    errors: [] as Array<{ emailId: string; error: string }>,
  };

  try {
    // Get all pending emails that are due to be sent
    const now = new Date();
    const pendingEmails = await db
      .select()
      .from(scheduledEmails)
      .where(
        and(
          eq(scheduledEmails.status, "pending"),
          lte(scheduledEmails.scheduledFor, now)
        )
      )
      .limit(100); // Process in batches

    results.processed = pendingEmails.length;

    console.log("[ScheduledEmail] Processing pending emails:", {
      count: pendingEmails.length,
      timestamp: now.toISOString(),
    });

    // Process each email
    for (const email of pendingEmails) {
      try {
        let sendResult: {
          success: boolean;
          error?: string;
          messageId?: string;
        };

        // Get user info for personalization
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.id, email.userId))
          .limit(1);

        const user = userResult[0];

        if (!user) {
          throw new Error(`User not found: ${email.userId}`);
        }

        // Check if user has subscribed before sending
        if (user.subscriptionStatus === "active") {
          console.log(
            "[ScheduledEmail] User already subscribed, cancelling email:",
            {
              emailId: email.id,
              userId: user.id,
            }
          );

          await db
            .update(scheduledEmails)
            .set({
              status: "cancelled",
              cancelledAt: new Date(),
              cancellationReason: "user_subscribed_before_send",
              updatedAt: new Date(),
            })
            .where(eq(scheduledEmails.id, email.id));

          continue;
        }

        // Send email based on type
        if (email.emailType === "trial_promo") {
          if (!email.promoCode) {
            throw new Error("Promo code is required for trial_promo emails");
          }

          sendResult = await sendTrialPromoEmail(
            email.recipientEmail,
            user.name,
            email.promoCode
          );
        } else {
          throw new Error(`Unknown email type: ${email.emailType}`);
        }

        // Update status based on send result
        if (sendResult.success) {
          await db
            .update(scheduledEmails)
            .set({
              status: "sent",
              sentAt: new Date(),
              updatedAt: new Date(),
              metadata: {
                ...(email.metadata as Record<string, unknown>),
                messageId: sendResult.messageId,
              },
            })
            .where(eq(scheduledEmails.id, email.id));

          results.sent++;

          console.log("[ScheduledEmail] Email sent successfully:", {
            emailId: email.id,
            userId: email.userId,
            emailType: email.emailType,
            messageId: sendResult.messageId,
          });
        } else {
          throw new Error(sendResult.error || "Failed to send email");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        // Mark as failed
        await db
          .update(scheduledEmails)
          .set({
            status: "failed",
            error: errorMessage,
            updatedAt: new Date(),
          })
          .where(eq(scheduledEmails.id, email.id));

        results.failed++;
        results.errors.push({
          emailId: email.id,
          error: errorMessage,
        });

        console.error("[ScheduledEmail] Failed to send email:", {
          emailId: email.id,
          userId: email.userId,
          emailType: email.emailType,
          error: errorMessage,
        });
      }
    }

    console.log("[ScheduledEmail] Processing complete:", {
      processed: results.processed,
      sent: results.sent,
      failed: results.failed,
    });

    return results;
  } catch (error) {
    console.error("[ScheduledEmail] Error processing pending emails:", error);
    return {
      ...results,
      success: false,
      errors: [
        ...results.errors,
        {
          emailId: "batch",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ],
    };
  }
}

/**
 * Get scheduled email statistics for a user
 */
export async function getUserEmailStats(userId: string): Promise<{
  pending: number;
  sent: number;
  cancelled: number;
  failed: number;
}> {
  try {
    const allEmails = await db
      .select()
      .from(scheduledEmails)
      .where(eq(scheduledEmails.userId, userId));

    return {
      pending: allEmails.filter((e) => e.status === "pending").length,
      sent: allEmails.filter((e) => e.status === "sent").length,
      cancelled: allEmails.filter((e) => e.status === "cancelled").length,
      failed: allEmails.filter((e) => e.status === "failed").length,
    };
  } catch (error) {
    console.error("[ScheduledEmail] Error getting user email stats:", error);
    return {
      pending: 0,
      sent: 0,
      cancelled: 0,
      failed: 0,
    };
  }
}
