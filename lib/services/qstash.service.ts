/**
 * QStash Service
 * Handles scheduling emails via Upstash QStash
 */

import { Client, Receiver } from "@upstash/qstash";
import { logger } from "@/lib/utils/logger";

// QStash free tier max delay: 7 days (604800 seconds)
export const QSTASH_MAX_DELAY_SECONDS = 604800; // 7 days

interface QStashResponse {
  messageId: string;
}

/**
 * Get or create QStash client instance
 */
function getQStashClient(): Client {
  const token = process.env.QSTASH_TOKEN;

  if (!token) {
    throw new Error("QSTASH_TOKEN is not configured");
  }

  return new Client({
    token,
  });
}

/**
 * Publish a message to QStash for delayed execution
 */
export async function publishToQStash({
  url,
  body,
  delay = 0,
}: {
  url: string;
  body: any;
  delay?: number; // seconds
}): Promise<QStashResponse> {
  const appUrl = process.env.APP_URL;
  const targetUrl = `${appUrl}${url}`;

  try {
    const client = getQStashClient();

    const response = await client.publishJSON({
      url: targetUrl,
      body,
      delay,
    });

    logger.info("Published to QStash", {
      url: targetUrl,
      delay,
      messageId: response.messageId,
    });

    return { messageId: response.messageId };
  } catch (error) {
    logger.error("QStash publish error", error);
    throw error;
  }
}

/**
 * Schedule an email to be sent via QStash
 * Returns null if delay exceeds QStash max delay (emails will be scheduled later)
 */
export async function scheduleEmail({
  emailId,
  delaySeconds,
}: {
  emailId: string;
  delaySeconds: number;
}): Promise<QStashResponse | null> {
  // QStash free tier has a max delay of 7 days
  // Emails beyond this will be scheduled later via a periodic check
  if (delaySeconds > QSTASH_MAX_DELAY_SECONDS) {
    logger.info("Email delay exceeds QStash max delay, will schedule later", {
      emailId,
      delaySeconds,
      maxDelay: QSTASH_MAX_DELAY_SECONDS,
    });
    return null;
  }

  return publishToQStash({
    url: "/api/cron/send-scheduled-email",
    body: { emailId },
    delay: delaySeconds,
  });
}

/**
 * Cancel a scheduled message in QStash
 */
export async function cancelQStashMessage(
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getQStashClient();
    await client.messages.delete(messageId);

    logger.info("Cancelled QStash message", { messageId });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to cancel QStash message", { messageId, error: errorMsg });
    return { success: false, error: errorMsg };
  }
}

/**
 * Verify QStash signature (for webhook security)
 */
export async function verifyQStashSignature(
  signature: string,
  body: string,
  url: string
): Promise<boolean> {
  const signingKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!signingKey) {
    logger.warn("QSTASH_CURRENT_SIGNING_KEY not configured");
    return false;
  }

  try {
    // Use the SDK's Receiver to verify signature
    // nextSigningKey is required by the SDK, use empty string if not configured
    const receiver = new Receiver({
      currentSigningKey: signingKey,
      nextSigningKey: nextSigningKey || "",
    });

    await receiver.verify({
      signature,
      body,
      url,
    });

    return true;
  } catch (error) {
    logger.warn("QStash signature verification failed", { error });
    return false;
  }
}
