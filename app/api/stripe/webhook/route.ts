import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { users, stripeEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { discordService } from "@/lib/services/discord.service";
import { analyticsService } from "@/lib/services/analytics.service";
import { referralService } from "@/lib/services/referral.service";
import { emailNotificationService } from "@/lib/services/email-notification.service";
import { requireEnv } from "@/lib/utils/env";
import { logger } from "@/lib/utils/logger";
import { ApiResponse } from "@/lib/utils/api-response";
import { getPricingPlanByPriceId } from "@/lib/pricing";

const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2024-06-20",
});

const webhookSecret = requireEnv("STRIPE_WEBHOOK_SECRET");

// Disable caching for webhook endpoints
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      logger.warn("Stripe webhook missing signature");
      return ApiResponse.badRequest("Missing stripe-signature header");
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const errorStack = err instanceof Error ? err.stack : undefined;

      logger.error("Webhook signature verification failed", err);
      await emailNotificationService.sendErrorNotification({
        error: "Stripe webhook signature verification failed",
        context: "Webhook endpoint",
        stackTrace: errorStack,
      });
      return ApiResponse.badRequest("Invalid signature");
    }

    // Use db directly

    // Log the event
    await db.insert(stripeEvents).values({
      stripeEventId: event.id,
      type: event.type,
      data: event.data as unknown as Record<string, unknown>,
      processed: false,
    });

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.userId) {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.id, session.metadata.userId))
            .limit(1);

          if (user.length > 0) {
            const isNewSubscription = !user[0].stripeCustomerId;

            // Update user subscription status
            await db
              .update(users)
              .set({
                stripeCustomerId: session.customer as string,
                subscriptionStatus: "active",
                subscriptionTier:
                  (session.metadata.tier as
                    | "monthly"
                    | "yearly"
                    | "lifetime") || null,
                updatedAt: new Date(),
              })
              .where(eq(users.id, session.metadata.userId));

            // Track conversion
            await analyticsService.trackConversion(
              session.metadata.userId,
              session.metadata.tier,
              (session.amount_total || 0) / 100
            );

            // Mark referral as converted if user was referred
            if (user[0].referredBy) {
              await referralService.markAsConverted(session.metadata.userId);
            }

            // Send Discord notification
            await discordService.notifyPayment({
              userId: session.metadata.userId,
              email: user[0].email,
              tier: session.metadata.tier,
              amount: (session.amount_total || 0) / 100,
              isNew: isNewSubscription,
            });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        console.log(`🔄 Processing ${event.type} webhook event`);
        const subscription = event.data.object as Stripe.Subscription;

        // Find user by Stripe customer ID
        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, subscription.customer as string))
          .limit(1);

        if (userResults.length > 0) {
          const user = userResults[0];

          // Determine tier from subscription items using database lookup
          const priceId = subscription.items.data[0]?.price.id;
          const plan = priceId ? await getPricingPlanByPriceId(priceId) : null;

          let tier: "monthly" | "yearly" | null = null;
          if (plan && (plan.tier === "monthly" || plan.tier === "yearly")) {
            tier = plan.tier;
          }

          const wasInactive = user.subscriptionStatus !== "active";

          // Get subscription creation time
          // subscription.created is a Unix timestamp (seconds since epoch)
          const subscriptionCreatedAt = subscription.created
            ? new Date(subscription.created * 1000)
            : null;

          logger.info("Subscription webhook processed", {
            eventType: event.type,
            subscriptionId: subscription.id,
            status: subscription.status,
            created: subscriptionCreatedAt,
            customerId: subscription.customer,
            priceId: priceId,
            planName: plan?.name,
            tier: tier,
            previousTier: user.subscriptionTier,
          });

          // Check if we have period data, if not fetch from Stripe API
          let periodStart = subscription.current_period_start;
          let periodEnd = subscription.current_period_end;

          if (!periodStart || !periodEnd) {
            console.log(
              "⚠️ Period data missing from webhook, fetching from Stripe API..."
            );
            try {
              const fullSubscription = await stripe.subscriptions.retrieve(
                subscription.id
              );
              periodStart = fullSubscription.current_period_start;
              periodEnd = fullSubscription.current_period_end;
              console.log("✅ Fetched period data from API:", {
                current_period_start: periodStart,
                current_period_end: periodEnd,
              });
            } catch (apiError) {
              console.error(
                "❌ Failed to fetch subscription from API:",
                apiError
              );
            }
          }

          console.log("Subscription period data:", {
            current_period_start: periodStart,
            current_period_end: periodEnd,
            hasCurrentPeriodStart: !!periodStart,
            hasCurrentPeriodEnd: !!periodEnd,
            currentPeriodStartDate: periodStart
              ? new Date(periodStart * 1000)
              : null,
            subscriptionEndDate: periodEnd ? new Date(periodEnd * 1000) : null,
            subscriptionStatus: subscription.status,
            eventType: event.type,
            fetchedFromAPI:
              !subscription.current_period_start ||
              !subscription.current_period_end,
          });

          try {
            const updateResult = await db
              .update(users)
              .set({
                stripeSubscriptionId: subscription.id,
                subscriptionStatus: "active",
                subscriptionTier: tier,
                currentPeriodStart: periodStart
                  ? new Date(periodStart * 1000)
                  : null,
                // Note: If you want to store subscriptionCreatedAt, add this field to schema:
                // subscriptionCreatedAt: timestamp("subscription_created_at"),
                // Then uncomment the line below:
                // subscriptionCreatedAt: subscriptionCreatedAt,
                updatedAt: new Date(),
              })
              .where(eq(users.id, user.id));

            console.log(
              "Database update result for user",
              user.id,
              ":",
              updateResult
            );

            // Verify the update
            const updatedUser = await db
              .select({
                currentPeriodStart: users.currentPeriodStart,
                subscriptionEndDate: users.subscriptionEndDate,
                subscriptionStatus: users.subscriptionStatus,
                subscriptionTier: users.subscriptionTier,
              })
              .from(users)
              .where(eq(users.id, user.id))
              .limit(1);

            console.log("User after update:", updatedUser[0]);
          } catch (dbError) {
            console.error("Database update failed:", dbError);
            throw dbError;
          }

          // If subscription became active, track conversion and check referrals
          if (wasInactive && subscription.status === "active") {
            await referralService.markAsConverted(user.id);

            await discordService.notifyPayment({
              userId: user.id,
              email: user.email,
              tier: tier || "unknown",
              amount:
                (subscription.items.data[0]?.price.unit_amount || 0) / 100,
              isNew: true,
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        console.log(
          "🔔 Webhook: Processing subscription deletion/cancellation"
        );
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription cancelled:", {
          id: subscription.id,
          customer: subscription.customer,
          status: subscription.status,
          canceled_at: subscription.canceled_at,
        });

        // Find user by Stripe customer ID
        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, subscription.customer as string))
          .limit(1);

        if (userResults.length === 0) {
          console.error(
            "❌ Webhook: No user found for cancelled subscription",
            subscription.customer
          );
          return;
        }

        const user = userResults[0];
        console.log("Found user for cancellation:", {
          userId: user.id,
          email: user.email,
          currentStatus: user.subscriptionStatus,
        });

        // Update user subscription status
        await db
          .update(users)
          .set({
            subscriptionStatus: "cancelled",
            subscriptionTier: null,
            stripeSubscriptionId: null,
            subscriptionEndDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));

        console.log(
          "✅ Webhook: Updated user subscription status to 'cancelled'"
        );

        // Verify the update
        const updatedUser = await db
          .select({ subscriptionStatus: users.subscriptionStatus })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);

        console.log(
          "Verification: User status after update:",
          updatedUser[0]?.subscriptionStatus
        );

        // Send cancellation notification
        try {
          await discordService.notifyCancellation({
            userId: user.id,
            email: user.email,
            tier: user.subscriptionTier || "unknown",
          });
          console.log("✅ Webhook: Discord notification sent");
        } catch (error) {
          console.error(
            "❌ Webhook: Failed to send Discord notification:",
            error
          );
        }

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        // Find user
        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, invoice.customer as string))
          .limit(1);

        if (userResults.length > 0) {
          const user = userResults[0];

          // Check if user has pending referral rewards
          const discount = await referralService.getAvailableDiscount(user.id);

          // If discount available, create a coupon for next billing cycle
          if (discount > 0 && user.stripeSubscriptionId) {
            try {
              // Create a one-time coupon
              const coupon = await stripe.coupons.create({
                percent_off: discount,
                duration: "once",
                name: "Referral Reward",
              });

              // Apply coupon to subscription
              await stripe.subscriptions.update(user.stripeSubscriptionId, {
                coupon: coupon.id,
              });

              // Mark reward as claimed
              await referralService.claimReward(user.id);

              logger.info(`Applied ${discount}% discount to user`, {
                userId: user.id,
                discount,
              });
            } catch (error) {
              logger.error("Failed to apply referral discount", error, {
                userId: user.id,
              });
              await emailNotificationService.sendErrorNotification({
                error: "Failed to apply referral discount",
                context: `User ID: ${user.id}`,
                userId: user.id,
              });
            }
          }
        }

        logger.info("Payment succeeded for invoice", { invoiceId: invoice.id });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        // Find user and update subscription status
        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, invoice.customer as string))
          .limit(1);

        if (userResults.length > 0) {
          const user = userResults[0];

          await db
            .update(users)
            .set({
              subscriptionStatus: "past_due",
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

          // Send email notification for critical payment failure
          await emailNotificationService.sendCriticalAlert({
            title: "Payment Failed",
            message: `Payment failed for user ${user.email}`,
            details: {
              userId: user.id,
              email: user.email,
              invoiceId: invoice.id,
            },
          });
        }
        break;
      }

      default:
        logger.info("Unhandled Stripe webhook event", {
          eventType: event.type,
        });
    }

    // Mark event as processed
    await db
      .update(stripeEvents)
      .set({ processed: true })
      .where(eq(stripeEvents.stripeEventId, event.id));

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    logger.error("Error processing webhook", error);

    // Send email notification for webhook processing errors
    const errorStack = error instanceof Error ? error.stack : undefined;
    await emailNotificationService.sendErrorNotification({
      error: "Stripe webhook processing failed",
      context: "Webhook endpoint",
      stackTrace: errorStack,
    });

    return ApiResponse.serverError("Webhook processing failed");
  }
}
