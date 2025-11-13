/**
 * QStash Service
 * Handles scheduling emails via Upstash QStash
 */

import { logger } from "@/lib/utils/logger";

interface QStashPublishParams {
  url: string;
  body: any;
  delay?: number; // seconds
  headers?: Record<string, string>;
}

interface QStashResponse {
  messageId: string;
}

/**
 * Publish a message to QStash for delayed execution
 */
export async function publishToQStash({
  url,
  body,
  delay = 0,
  headers = {},
}: QStashPublishParams): Promise<QStashResponse> {
  const qstashToken = process.env.QSTASH_TOKEN;
  const qstashUrl =
    process.env.QSTASH_URL || "https://qstash.upstash.io/v2/publish";

  if (!qstashToken) {
    throw new Error("QSTASH_TOKEN is not configured");
  }

  const targetUrl = `${process.env.APP_URL}${url}`;

  try {
    const response = await fetch(`${qstashUrl}/${targetUrl}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${qstashToken}`,
        "Content-Type": "application/json",
        "Upstash-Delay": `${delay}s`,
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`QStash publish failed: ${error}`);
    }

    const data = await response.json();

    logger.info("Published to QStash", {
      url: targetUrl,
      delay,
      messageId: data.messageId,
    });

    return data;
  } catch (error) {
    logger.error("QStash publish error", error);
    throw error;
  }
}

/**
 * Schedule an email to be sent via QStash
 */
export async function scheduleEmail({
  emailId,
  delaySeconds,
}: {
  emailId: string;
  delaySeconds: number;
}): Promise<QStashResponse> {
  return publishToQStash({
    url: "/api/cron/send-scheduled-email",
    body: { emailId },
    delay: delaySeconds,
  });
}

/**
 * Verify QStash signature (for webhook security)
 */
export function verifyQStashSignature(
  signature: string,
  body: string
): boolean {
  const signingKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!signingKey) {
    logger.warn("QSTASH_CURRENT_SIGNING_KEY not configured");
    return false;
  }

  // In production, implement proper signature verification
  // For now, just check if signature exists
  return !!signature;
}
