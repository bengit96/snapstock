/**
 * Environment variable validation and access utilities
 *
 * Validates required environment variables at startup and provides
 * type-safe access to environment variables.
 */

interface EnvConfig {
  // Database
  DATABASE_URL: string;

  // NextAuth
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;

  // OpenAI
  OPENAI_API_KEY: string;

  // Stripe
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_MONTHLY_PRICE_ID?: string;
  STRIPE_YEARLY_PRICE_ID?: string;

  // Vercel Blob
  BLOB_READ_WRITE_TOKEN?: string;

  // Email (Resend)
  RESEND_API_KEY?: string;

  // Discord Webhook
  DISCORD_WEBHOOK_URL?: string;
  DISCORD_WEBHOOK_URL_LANDING?: string;

  // Optional: Feature flags
  NODE_ENV?: "development" | "production" | "test";
}

type RequiredEnvKey = keyof EnvConfig;

/**
 * Validate that all required environment variables are set
 */
export function validateEnv(): void {
  const required: RequiredEnvKey[] = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "OPENAI_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file and ensure all required variables are set."
    );
  }
}

/**
 * Get required environment variable or throw
 */
export function requireEnv<K extends RequiredEnvKey>(key: K): EnvConfig[K] {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value as EnvConfig[K];
}
