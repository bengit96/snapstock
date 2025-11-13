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
    name: "One Analysis Wonder Recovery",
    description: "Re-engage users who did 1 free analysis and stopped",
    targetSegment: "one_time_users",
    steps: [
      {
        id: "day_0_free_analyses",
        delayDays: 0,
        subject: "{{firstName}}, here's 2 more free analyses on us",
        message: `Hi {{firstName}},

I noticed you analyzed one chart with Snapstock but haven't been back since.

**Here's the truth:** Most traders who stop after 1 analysis tell us they weren't sure if the tool was worth paying for yet. That's totally fair.

So here's what I'm doing for you:

**→ 2 more FREE analyses (no card required)**

Upload 2 more charts this week and see if Snapstock helps you spot better entries, avoid bad setups, or just trade with more confidence. If it clicks, great. If not, no worries.

👉 **[Claim my 2 free analyses]({{dashboardUrl}})**

And if you do decide to upgrade after that? Use code **SNAP30** to lock in 30% off your first month (valid through Sunday).

**Why traders who upgrade say it's worth it:**
- "Saved me from a $800 loss on a fake breakout" — Mike T.
- "Cut my chart review time from 20 min to under 2 min" — Sarah K.
- "Finally stopped second-guessing my entries" — James L.

No pressure—just wanted to make sure price wasn't the only thing holding you back.

See you in the terminal,
Ben
Founder, Snapstock

_P.S. Hit reply if you have questions about pricing or want me to personally review one of your charts—I read every email._`,
        promoCode: "SNAP30",
        discountPercent: 30,
      },
      {
        id: "day_3_check_in",
        delayDays: 3,
        subject: "Did you get a chance to use your free analyses?",
        message: `Hi {{firstName}},

Just checking in—did you get a chance to use the 2 free analyses I sent over?

I know the market's been moving fast lately, and I didn't want you to miss out on having Snapstock in your corner for the next setup.

**Quick reminder of what you get:**
✓ AI-powered momentum & pullback signals
✓ Exact entry/exit zones with risk/reward ratios
✓ Side-by-side strength/weakness breakdowns

If you haven't used them yet, they're still waiting for you in your dashboard:
👉 **[Go to my dashboard]({{dashboardUrl}})**

And your **SNAP30** code (30% off) is still active if you decide to upgrade.

Questions? Just hit reply—I'm here to help.

Ben
Founder, Snapstock`,
        promoCode: "SNAP30",
        discountPercent: 30,
      },
      {
        id: "day_7_urgency",
        delayDays: 7,
        subject: "Your SNAP30 code expires tonight",
        message: `Hi {{firstName}},

Quick heads up—your **SNAP30** discount code (30% off) expires at midnight tonight.

If you've been on the fence about upgrading to Snapstock Pro, now's the time to lock in the savings.

**What you'll unlock:**
• Unlimited chart analyses (no throttling when the market lines up)
• Advanced momentum & pullback models
• Priority support from our trading team

👉 **[Activate SNAP30 before midnight]({{checkoutUrl}}?promo=SNAP30)**

After tonight, this code disappears and the price goes back to full rate.

See you in the terminal,
Ben
Founder, Snapstock

_P.S. Still have questions? Reply to this email—I'll get back to you within the hour._`,
        promoCode: "SNAP30",
        discountPercent: 30,
      },
      {
        id: "day_10_final_offer",
        delayDays: 10,
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

      // Grant 2 free analyses for the "one_analysis_recovery" sequence
      if (sequenceId === "one_analysis_recovery") {
        await db
          .update(users)
          .set({
            freeAnalysesLimit: 3, // Grant 2 more (1 + 2 = 3 total)
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        logger.info("Granted 2 free analyses to user", {
          userId: user.id,
          sequenceId,
        });
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
