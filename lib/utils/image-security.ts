/**
 * Image security utilities
 * Provides functions to generate secure image URLs that proxy through our API
 */

/**
 * Generates a secure image URL that requires authentication
 * Instead of exposing the blob storage URL directly, we proxy through our API
 * which verifies user ownership before serving the image
 */
export function getSecureImageUrl(analysisId: string): string {
  // Use relative URL to work in all environments
  return `/api/images/${analysisId}`;
}

/**
 * Checks if a URL is a secure image URL (proxied through our API)
 */
export function isSecureImageUrl(url: string): boolean {
  return url.startsWith("/api/images/");
}

/**
 * Checks if a URL is a direct blob storage URL
 */
export function isBlobStorageUrl(url: string): boolean {
  return url.includes(".public.blob.vercel-storage.com");
}
