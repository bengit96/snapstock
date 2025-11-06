/**
 * Discord Webhook Service
 * Sends notifications to Discord for important events
 */

import { db } from "@/lib/db";
import { discordNotifications } from "@/lib/db/schema";

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string };
  timestamp?: string;
}

interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
}

interface NotificationLogData {
  notificationType: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

type WebhookType = "default" | "landing";

class DiscordService {
  private webhookUrl: string | undefined;
  private landingWebhookUrl: string | undefined;

  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    this.landingWebhookUrl = process.env.DISCORD_WEBHOOK_URL_LANDING;
  }

  /**
   * Check if Discord webhook is configured
   */
  isConfigured(type: WebhookType = "default"): boolean {
    if (type === "landing") {
      return !!this.landingWebhookUrl;
    }
    return !!this.webhookUrl;
  }

  /**
   * Get the appropriate webhook URL based on type
   */
  private getWebhookUrl(type: WebhookType = "default"): string | undefined {
    if (type === "landing" && this.landingWebhookUrl) {
      return this.landingWebhookUrl;
    }
    return this.webhookUrl;
  }

  /**
   * Send a message to Discord and log the result
   */
  private async send(
    message: DiscordMessage,
    logData?: NotificationLogData,
    webhookType: WebhookType = "default"
  ): Promise<void> {
    const targetWebhookUrl = this.getWebhookUrl(webhookType);

    if (!targetWebhookUrl) {
      console.warn(`Discord webhook not configured for type: ${webhookType}`);
      return;
    }

    let success = false;
    let errorMessage: string | undefined;

    try {
      const response = await fetch(targetWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(
          `Discord API error: ${response.status} ${response.statusText}`
        );
      }

      success = true;
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
      errorMessage = error instanceof Error ? error.message : "Unknown error";
      // Don't throw - we don't want Discord failures to break the app
    }

    // Log the notification to database
    if (logData) {
      try {
        await db.insert(discordNotifications).values({
          notificationType: logData.notificationType,
          success,
          error: errorMessage,
          metadata: logData.metadata,
          ipAddress: logData.ipAddress,
          referrer: logData.referrer,
          utmSource: logData.utmSource,
          utmMedium: logData.utmMedium,
          utmCampaign: logData.utmCampaign,
        });
      } catch (dbError) {
        console.error("Failed to log Discord notification:", dbError);
      }
    }
  }

  /**
   * Notify about a new user signup
   */
  async notifySignup(data: {
    email: string;
    userId: string;
    referralCode?: string;
  }): Promise<void> {
    const embed: DiscordEmbed = {
      title: "✨ New User Signup",
      description: "A new user has signed up!",
      color: 0x7c3aed, // purple
      fields: [
        { name: "Email", value: data.email, inline: true },
        { name: "User ID", value: data.userId, inline: true },
      ],
      timestamp: new Date().toISOString(),
    };

    if (data.referralCode) {
      embed.fields!.push({
        name: "Referral Code",
        value: data.referralCode,
        inline: false,
      });
    }

    await this.send(
      { embeds: [embed] },
      {
        notificationType: "signup",
        metadata: { email: data.email, referralCode: data.referralCode },
      }
    );
  }

  /**
   * Notify about a new chart analysis
   */
  async notifyAnalysis(data: {
    userId: string;
    email: string;
    stockSymbol?: string;
    grade: string;
    shouldEnter: boolean;
    confidence?: number;
    isFree?: boolean;
  }): Promise<void> {
    const embed: DiscordEmbed = {
      title: "📊 Chart Analysis Generated",
      color: data.shouldEnter ? 0x10b981 : 0xef4444, // green if enter, red if skip
      fields: [
        { name: "User", value: data.email, inline: true },
        { name: "Stock", value: data.stockSymbol || "Unknown", inline: true },
        { name: "Grade", value: data.grade, inline: true },
        {
          name: "Recommendation",
          value: data.shouldEnter ? "✅ ENTER" : "❌ SKIP",
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    if (data.confidence) {
      embed.fields!.push({
        name: "AI Confidence",
        value: `${data.confidence}%`,
        inline: true,
      });
    }

    if (data.isFree) {
      embed.fields!.push({
        name: "Type",
        value: "🆓 Free Trial",
        inline: true,
      });
    }

    await this.send(
      { embeds: [embed] },
      {
        notificationType: "analysis",
        metadata: {
          userId: data.userId,
          email: data.email,
          stockSymbol: data.stockSymbol,
          grade: data.grade,
          shouldEnter: data.shouldEnter,
          confidence: data.confidence,
          isFree: data.isFree,
        },
      }
    );
  }

  /**
   * Notify about a new payment/subscription
   */
  async notifyPayment(data: {
    userId: string;
    email: string;
    tier: string;
    amount: number;
    isNew: boolean;
  }): Promise<void> {
    const embed: DiscordEmbed = {
      title: data.isNew ? "💰 New Subscription" : "🔄 Subscription Renewed",
      description: `User subscribed to ${data.tier} plan`,
      color: 0x10b981, // green
      fields: [
        { name: "Email", value: data.email, inline: true },
        { name: "Plan", value: data.tier.toUpperCase(), inline: true },
        { name: "Amount", value: `$${data.amount.toFixed(2)}`, inline: true },
      ],
      timestamp: new Date().toISOString(),
    };

    await this.send(
      { embeds: [embed] },
      {
        notificationType: "payment",
        metadata: {
          userId: data.userId,
          email: data.email,
          tier: data.tier,
          amount: data.amount,
          isNew: data.isNew,
        },
      }
    );
  }

  /**
   * Notify about a cancellation
   */
  async notifyCancellation(data: {
    userId: string;
    email: string;
    tier: string;
    reason?: string;
  }): Promise<void> {
    const embed: DiscordEmbed = {
      title: "⚠️ Subscription Cancelled",
      description: "A user has cancelled their subscription",
      color: 0xef4444, // red
      fields: [
        { name: "Email", value: data.email, inline: true },
        { name: "Plan", value: data.tier.toUpperCase(), inline: true },
      ],
      timestamp: new Date().toISOString(),
    };

    if (data.reason) {
      embed.fields!.push({
        name: "Reason",
        value: data.reason,
        inline: false,
      });
    }

    await this.send(
      { embeds: [embed] },
      {
        notificationType: "cancellation",
        metadata: {
          userId: data.userId,
          email: data.email,
          tier: data.tier,
          reason: data.reason,
        },
      }
    );
  }

  /**
   * Notify about a new referral
   */
  async notifyReferral(data: {
    referrerEmail: string;
    referredEmail: string;
    referralCode: string;
    status: "signed_up" | "converted";
  }): Promise<void> {
    const isConverted = data.status === "converted";

    const embed: DiscordEmbed = {
      title: isConverted ? "🎉 Referral Converted!" : "👥 New Referral",
      description: isConverted
        ? "A referred user has subscribed!"
        : "A new user signed up via referral",
      color: isConverted ? 0x10b981 : 0x3b82f6, // green if converted, blue otherwise
      fields: [
        { name: "Referrer", value: data.referrerEmail, inline: true },
        { name: "New User", value: data.referredEmail, inline: true },
        { name: "Code", value: data.referralCode, inline: true },
      ],
      timestamp: new Date().toISOString(),
    };

    await this.send(
      { embeds: [embed] },
      {
        notificationType: "referral",
        metadata: {
          referrerEmail: data.referrerEmail,
          referredEmail: data.referredEmail,
          referralCode: data.referralCode,
          status: data.status,
        },
      }
    );
  }

  /**
   * Notify about landing page visit
   */
  async notifyLandingPageVisit(data: {
    ipAddress?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }): Promise<void> {
    const embed: DiscordEmbed = {
      title: "👀 Landing Page Visit",
      color: 0x3b82f6, // blue
      fields: [],
      timestamp: new Date().toISOString(),
    };

    if (data.ipAddress) {
      embed.fields!.push({
        name: "IP Address",
        value: data.ipAddress,
        inline: true,
      });
    }

    if (data.referrer) {
      embed.fields!.push({
        name: "Referrer",
        value: data.referrer,
        inline: false,
      });
    }

    if (data.utmSource || data.utmMedium || data.utmCampaign) {
      const utmInfo = [
        data.utmSource && `Source: ${data.utmSource}`,
        data.utmMedium && `Medium: ${data.utmMedium}`,
        data.utmCampaign && `Campaign: ${data.utmCampaign}`,
      ]
        .filter(Boolean)
        .join("\n");

      embed.fields!.push({
        name: "UTM Parameters",
        value: utmInfo,
        inline: false,
      });
    }

    // Always send landing page visit notifications with logging
    await this.send(
      { embeds: [embed] },
      {
        notificationType: "landing_page_visit",
        ipAddress: data.ipAddress,
        referrer: data.referrer,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
      },
      "landing"
    );
  }

  /**
   * Notify about page visits (batched)
   */
  async notifyPageVisit(data: {
    page: string;
    count: number;
    unique?: number;
  }): Promise<void> {
    const embed: DiscordEmbed = {
      title: "📈 Page Visit Summary",
      color: 0x6366f1, // indigo
      fields: [
        { name: "Page", value: data.page, inline: true },
        { name: "Total Visits", value: data.count.toString(), inline: true },
      ],
      timestamp: new Date().toISOString(),
    };

    if (data.unique) {
      embed.fields!.push({
        name: "Unique Visitors",
        value: data.unique.toString(),
        inline: true,
      });
    }

    await this.send(
      { embeds: [embed] },
      {
        notificationType: "page_visit_summary",
        metadata: {
          page: data.page,
          count: data.count,
          unique: data.unique,
        },
      }
    );
  }

  /**
   * Notify about a failed chart analysis
   */
  async notifyFailedAnalysis(data: {
    userId: string;
    email: string;
    error: string;
    failureType: string;
    chartUrl?: string;
    stockSymbol?: string;
  }): Promise<void> {
    const embed: DiscordEmbed = {
      title: "❌ Failed Chart Analysis",
      description: data.error,
      color: 0xf59e0b, // amber/orange
      fields: [
        { name: "User", value: data.email, inline: true },
        { name: "Failure Type", value: data.failureType, inline: true },
      ],
      timestamp: new Date().toISOString(),
    };

    if (data.stockSymbol) {
      embed.fields!.push({
        name: "Stock Symbol",
        value: data.stockSymbol,
        inline: true,
      });
    }

    if (data.chartUrl) {
      embed.fields!.push({
        name: "Chart Link",
        value: `[View Chart](${data.chartUrl})`,
        inline: false,
      });
    }

    await this.send(
      { embeds: [embed] },
      {
        notificationType: "failed_analysis",
        metadata: {
          userId: data.userId,
          email: data.email,
          error: data.error,
          failureType: data.failureType,
          chartUrl: data.chartUrl,
          stockSymbol: data.stockSymbol,
        },
      }
    );
  }

  /**
   * Send error notification
   */
  async notifyError(data: {
    error: string;
    context?: string;
    userId?: string;
  }): Promise<void> {
    const embed: DiscordEmbed = {
      title: "🔴 Application Error",
      description: data.error,
      color: 0xdc2626, // red
      fields: [],
      timestamp: new Date().toISOString(),
    };

    if (data.context) {
      embed.fields!.push({
        name: "Context",
        value: data.context,
        inline: false,
      });
    }

    if (data.userId) {
      embed.fields!.push({
        name: "User ID",
        value: data.userId,
        inline: true,
      });
    }

    await this.send(
      { embeds: [embed] },
      {
        notificationType: "error",
        metadata: {
          error: data.error,
          context: data.context,
          userId: data.userId,
        },
      }
    );
  }
}

// Export singleton instance
export const discordService = new DiscordService();
