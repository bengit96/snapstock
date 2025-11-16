/**
 * Email Sequence Service
 * Manages multi-step email campaigns with QStash scheduling
 */

import { db } from "@/lib/db";
import { users, scheduledEmails } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { logger } from "@/lib/utils/logger";

export interface EmailSequenceStep {
  id: string;
  delayDays: number;
  subject: string;
  message: string;
  promoCode?: string;
  discountPercent?: number;
}

export interface EmailSequence {
  id: string;
  name: string;
  description: string;
  steps: EmailSequenceStep[];
  targetSegment: "one_time_users" | "never_used" | "exhausted_free" | "custom";
}

// Predefined sequences
export const EMAIL_SEQUENCES: Record<string, EmailSequence> = {
  one_analysis_recovery: {
    id: "one_analysis_recovery",
    name: "Free Trial Recovery",
    description: "Re-engage users who used some/all of their 5 free analyses but didn't convert",
    targetSegment: "one_time_users",
    steps: [
      {
        id: "day_0_discount_offer",
        delayDays: 0,
        subject: "{{firstName}}, you've used your 5 free analyses - here's 30% off",
        message: `Hi {{firstName}},

I noticed you've gone through your 5 free chart analyses with Snapstock.

**Here's my question:** Did they help you make better trading decisions?

If the answer is yes, I have good news:

**→ Get 30% off your first month with code SNAP30**

Most traders who upgrade tell us Snapstock pays for itself after avoiding just ONE bad trade. At $13.99/month with your discount (normally $19.99), you get:

✓ **100 analyses per month** - never run out when the market lines up
✓ **Advanced momentum & pullback models** - spot A-grade setups faster
✓ **Trade history tracking** - review what worked and what didn't
✓ **Priority support** - get help when you need it

👉 **[Upgrade with SNAP30 (30% off)]({{checkoutUrl}}?promo=SNAP30)**

**Why traders who upgraded say it's worth it:**
- "Saved me from a $800 loss on a fake breakout" — Mike T.
- "Cut my chart review time from 20 min to under 2 min" — Sarah K.
- "Finally stopped second-guessing my entries" — James L.

This code expires in 72 hours, so don't miss out.

See you in the terminal,
Ben
Founder, Snapstock

_P.S. Hit reply if you have questions about pricing or want me to personally review one of your charts—I read every email._`,
        promoCode: "SNAP30",
        discountPercent: 30,
      },
      {
        id: "day_2_check_in",
        delayDays: 2,
        subject: "Your SNAP30 code expires in 24 hours",
        message: `Hi {{firstName}},

Quick reminder: your **30% off code (SNAP30)** expires tomorrow.

I know the market's been moving fast lately, and I didn't want you to miss out on having Snapstock in your corner for your next setup.

**What you get with the upgrade:**
✓ AI-powered momentum & pullback signals (unlimited)
✓ Exact entry/exit zones with risk/reward ratios
✓ Side-by-side strength/weakness breakdowns
✓ Trade history to track your performance

Just $13.99/month with SNAP30 (normally $19.99).

👉 **[Claim your 30% discount now]({{checkoutUrl}}?promo=SNAP30)**

Once this code expires, it's gone for good.

Questions? Just hit reply—I'm here to help.

Ben
Founder, Snapstock`,
        promoCode: "SNAP30",
        discountPercent: 30,
      },
      {
        id: "day_5_urgency",
        delayDays: 5,
        subject: "Your SNAP30 code expires soon",
        message: `Hi {{firstName}},

Quick heads up—your **SNAP30** discount code (30% off) expires in 2 days.

If you've been on the fence about upgrading to Snapstock Pro, now's the time to lock in the savings.

**What you'll unlock:**
• Unlimited chart analyses (no throttling when the market lines up)
• Advanced momentum & pullback models
• Priority support from our trading team

👉 **[Activate SNAP30 now]({{checkoutUrl}}?promo=SNAP30)**

After that, this code disappears and the price goes back to full rate.

See you in the terminal,
Ben
Founder, Snapstock

_P.S. Still have questions? Reply to this email—I'll get back to you within the hour._`,
        promoCode: "SNAP30",
        discountPercent: 30,
      },
      {
        id: "day_7_final_offer",
        delayDays: 7,
        subject: "One last thing before we say goodbye...",
        message: `Hi {{firstName}},

I wanted to reach out one last time before I stop sending these emails.

I get it—Snapstock might not be the right fit for you right now, and that's totally okay.

But before we part ways, I'd love to know: **What held you back?**

Was it:
• Price?
• Not enough features you needed?
• Didn't see the value after your first analysis?
• Something else?

Hit reply and let me know. Your feedback helps me build a better product for traders like you.

And if you change your mind down the road, you know where to find us.

Thanks for giving Snapstock a shot,
Ben
Founder, Snapstock

_P.S. If you do want to give it another try, I'll personally set you up with a custom plan that fits your needs. Just reply and we'll figure it out together._`,
      },
    ],
  },
};

interface ScheduleSequenceParams {
  sequenceId: string;
  userIds: string[];
  customizations?: {
    promoCode?: string;
    discountPercent?: number;
  };
  triggeredBy?: "manual" | "auto";
  metadata?: Record<string, unknown>;
  startDelayHours?: number;
}

export interface ScheduledEmailRecord {
  id: string;
  userId: string;
  scheduledFor: Date;
  stepId: string;
}

interface ScheduleSequenceResult {
  success: boolean;
  scheduledCount: number;
  errors: Array<{ userId: string; error: string }>;
  emailRecords: ScheduledEmailRecord[];
}

/**
 * Schedule an email sequence for multiple users
 */
export async function scheduleEmailSequence({
  sequenceId,
  userIds,
  customizations,
  triggeredBy = "manual",
  metadata,
  startDelayHours = 0,
}: ScheduleSequenceParams): Promise<ScheduleSequenceResult> {
  const sequence = EMAIL_SEQUENCES[sequenceId];
  if (!sequence) {
    throw new Error(`Sequence ${sequenceId} not found`);
  }

  const result: ScheduleSequenceResult = {
    success: true,
    scheduledCount: 0,
    errors: [],
    emailRecords: [],
  };

  // Fetch users
  const targetUsers = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      subscriptionStatus: users.subscriptionStatus,
    })
    .from(users)
    .where(inArray(users.id, userIds));

  logger.info("Scheduling email sequence", {
    sequenceId,
    totalUsers: targetUsers.length,
    steps: sequence.steps.length,
  });

  const now = new Date();
  const startDelayMs = startDelayHours * 60 * 60 * 1000;

  for (const user of targetUsers) {
    try {
      // Skip if user is already subscribed
      if (user.subscriptionStatus === "active") {
        logger.info("Skipping user - already subscribed", { userId: user.id });
        continue;
      }

      // Schedule each step in the sequence
      for (const step of sequence.steps) {
        const stepDelayMs = step.delayDays * 24 * 60 * 60 * 1000;
        const scheduledFor = new Date(
          now.getTime() + startDelayMs + stepDelayMs
        );

        // Apply customizations or use defaults
        const promoCode = customizations?.promoCode || step.promoCode;
        const discountPercent =
          customizations?.discountPercent || step.discountPercent;

        const inserted = await db
          .insert(scheduledEmails)
          .values({
            userId: user.id,
            emailType: `sequence_${sequenceId}_${step.id}`,
            recipientEmail: user.email,
            subject: step.subject,
            scheduledFor,
            status: "pending",
            promoCode,
            metadata: {
              sequenceId,
              stepId: step.id,
              stepDelayDays: step.delayDays,
              userName: user.name,
              message: step.message,
              discountPercent,
              triggeredBy,
              ...(metadata ?? {}),
            },
          })
          .returning({
            id: scheduledEmails.id,
          });

        if (inserted[0]) {
          result.emailRecords.push({
            id: inserted[0].id,
            userId: user.id,
            scheduledFor,
            stepId: step.id,
          });
        }
      }

      result.scheduledCount++;
      logger.info("Scheduled sequence for user", {
        userId: user.id,
        email: user.email,
        steps: sequence.steps.length,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      result.errors.push({ userId: user.id, error: errorMsg });
      logger.error("Failed to schedule sequence for user", {
        userId: user.id,
        error: errorMsg,
      });
    }
  }

  result.success = result.errors.length === 0;

  logger.info("Email sequence scheduling completed", {
    sequenceId,
    scheduledCount: result.scheduledCount,
    errorCount: result.errors.length,
  });

  return result;
}

/**
 * Cancel all pending emails in a sequence for a user
 */
export async function cancelSequenceForUser(
  userId: string,
  sequenceId: string,
  reason: string = "user_subscribed"
): Promise<void> {
  // Import cancelQStashMessage here to avoid circular dependencies
  const { cancelQStashMessage } = await import("./qstash.service");

  // Get all pending emails for this sequence
  const pendingEmails = await db
    .select()
    .from(scheduledEmails)
    .where(eq(scheduledEmails.userId, userId));

  // Cancel each email in QStash if it has a message ID
  for (const email of pendingEmails) {
    if (email.qstashMessageId && email.status === "pending") {
      try {
        await cancelQStashMessage(email.qstashMessageId);
        logger.info("Cancelled QStash message for email", {
          emailId: email.id,
          messageId: email.qstashMessageId,
        });
      } catch (error) {
        logger.error("Failed to cancel QStash message", {
          emailId: email.id,
          messageId: email.qstashMessageId,
          error,
        });
      }
    }
  }

  // Update all emails in the database
  await db
    .update(scheduledEmails)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
      cancellationReason: reason,
    })
    .where(eq(scheduledEmails.userId, userId));

  logger.info("Cancelled sequence for user", { userId, sequenceId, reason });
}

/**
 * Get preview data for a sequence
 */
export function getSequencePreview(sequenceId: string): EmailSequence | null {
  return EMAIL_SEQUENCES[sequenceId] || null;
}

/**
 * Get all available sequences
 */
export function getAllSequences(): EmailSequence[] {
  return Object.values(EMAIL_SEQUENCES);
}
