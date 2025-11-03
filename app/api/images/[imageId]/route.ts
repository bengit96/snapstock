import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chartAnalyses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/utils/logger";

/**
 * Secure image serving endpoint
 * Verifies user authentication and ownership before serving images
 * Includes rate limiting and security headers
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await context.params;

    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      logger.warn("Unauthorized image access attempt - no session", { imageId });
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting: 100 image requests per minute per user
    const { withRateLimit, RATE_LIMITS } = await import("@/lib/utils/rate-limit");
    const rateLimitResult = await withRateLimit(
      request,
      RATE_LIMITS.imageAccess,
      session.user.id
    );

    if (!rateLimitResult.success) {
      logger.warn("Image access rate limit exceeded", {
        userId: session.user.id,
        imageId,
      });
      return new NextResponse("Too many requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          "Retry-After": Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      });
    }

    // Find the analysis to verify ownership
    const analysis = await db
      .select()
      .from(chartAnalyses)
      .where(eq(chartAnalyses.id, imageId))
      .limit(1);

    if (analysis.length === 0) {
      logger.warn("Image not found", { imageId, userId: session.user.id });
      return new NextResponse("Image not found", { status: 404 });
    }

    // Verify the user owns this image
    if (analysis[0].userId !== session.user.id) {
      logger.warn("Unauthorized image access attempt - wrong owner", {
        userId: session.user.id,
        imageId,
        ownerId: analysis[0].userId,
      });
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Fetch the image from blob storage
    const imageUrl = analysis[0].imageUrl;
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      logger.error("Failed to fetch image from blob storage", {
        imageUrl,
        status: imageResponse.status,
      });
      return new NextResponse("Failed to fetch image", { status: 500 });
    }

    // Get the image content
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get("content-type") || "image/png";

    // Return the image with appropriate security headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600", // Cache for 1 hour, private to user
        "X-Content-Type-Options": "nosniff", // Prevent MIME sniffing
        "X-Frame-Options": "DENY", // Prevent embedding in frames
        "Content-Security-Policy": "default-src 'none'; img-src 'self';", // Restrict content loading
      },
    });
  } catch (error) {
    logger.error("Error serving image", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
