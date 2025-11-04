import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chartAnalyses, userActivity, users } from "@/lib/db/schema";
import { analyzeChart } from "@/lib/trading/analysis";
import { analyzeChartWithAI } from "@/lib/openai";
import { discordService } from "@/lib/services/discord.service";
import { analyticsService } from "@/lib/services/analytics.service";
import { emailNotificationService } from "@/lib/services/email-notification.service";
import { eq, and, gte } from "drizzle-orm";
import { put } from "@vercel/blob";
import { requireAuth } from "@/lib/utils/security";
import { ApiResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import type { Session } from "next-auth";

/**
 * Unified POST endpoint to analyze a chart
 * Accepts either:
 * 1. FormData with 'image' file (traditional upload)
 * 2. JSON with 'imageUrl' (pre-uploaded blob URL)
 */
export async function POST(request: NextRequest) {
  let session: Session | null = null;
  let imageUrl: string | undefined;

  try {
    session = await requireAuth();

    // Determine the content type and extract image data accordingly
    const contentType = request.headers.get("content-type") || "";
    let base64Image: string;

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData();
      const imageFile = formData.get("image") as File;

      if (!imageFile) {
        return ApiResponse.badRequest("No image provided");
      }

      // Validate image file
      const { validateImageFile, generateSecureFilename } = await import(
        "@/lib/utils/file-validation"
      );
      const validationResult = await validateImageFile(imageFile);

      if (!validationResult.valid) {
        return ApiResponse.badRequest(
          validationResult.error || "Invalid image file"
        );
      }

      // Upload image to Vercel Blob Storage with sanitized filename
      try {
        const secureFilename = generateSecureFilename(
          session.user.id,
          imageFile.name
        );
        const blob = await put(secureFilename, imageFile, {
          access: "public",
        });
        imageUrl = blob.url;
        logger.info("Image uploaded to blob storage", {
          imageUrl,
          userId: session.user.id,
        });
      } catch (uploadError) {
        logger.error("Failed to upload image to blob storage", uploadError, {
          userId: session.user.id,
        });

        // Notify Discord about failed analysis due to upload error
        await discordService.notifyFailedAnalysis({
          userId: session.user.id,
          email: session.user.email,
          error: uploadError instanceof Error ? uploadError.message : "Failed to upload image to blob storage",
          failureType: "File Upload",
        });

        return ApiResponse.serverError(
          "Failed to upload image. Please try again."
        );
      }

      // Convert file to base64 for OpenAI
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Image = buffer.toString("base64");
    } else if (contentType.includes("application/json")) {
      // Handle URL input
      const body = await request.json();
      imageUrl = body.imageUrl;

      if (!imageUrl) {
        return ApiResponse.badRequest("No image URL provided");
      }

      // Fetch the image from the blob URL
      logger.info("Fetching image from blob URL", {
        userId: session.user.id,
      });
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch image from blob storage");
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      base64Image = Buffer.from(imageBuffer).toString("base64");
    } else {
      return ApiResponse.badRequest(
        "Invalid content type. Expected multipart/form-data or application/json"
      );
    }

    // Apply rate limiting: 10 analyses per hour per user
    const { withRateLimit, RATE_LIMITS } = await import(
      "@/lib/utils/rate-limit"
    );
    const rateLimitResult = await withRateLimit(
      request,
      RATE_LIMITS.analysis,
      session.user.id
    );

    if (!rateLimitResult.success) {
      // Notify Discord about failed analysis due to rate limiting
      await discordService.notifyFailedAnalysis({
        userId: session.user.id,
        email: session.user.email,
        error: `Rate limit exceeded (${rateLimitResult.remaining}/${rateLimitResult.limit} requests remaining)`,
        failureType: "Rate Limit",
      });

      return NextResponse.json(
        {
          error: "Too many analysis requests. Please try again later.",
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          },
        }
      );
    }

    // Get user details
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (userResult.length === 0) {
      return ApiResponse.notFound("User not found");
    }

    const user = userResult[0];
    const isAdmin = user.role === "admin";
    const isFreeUser =
      !user.subscriptionStatus || user.subscriptionStatus !== "active";

    // Skip all limits for admin users
    if (!isAdmin) {
      // Check free trial limits
      if (isFreeUser) {
        if ((user.freeAnalysesUsed || 0) >= (user.freeAnalysesLimit || 1)) {
          // Notify Discord about failed analysis due to free trial limit
          await discordService.notifyFailedAnalysis({
            userId: session.user.id,
            email: user.email,
            error: `Free trial limit reached (${user.freeAnalysesUsed}/${user.freeAnalysesLimit} analyses used)`,
            failureType: "Free Trial Limit",
          });

          return NextResponse.json(
            {
              error: "Free trial limit reached",
              message:
                "You have used your free analysis. Please subscribe to continue.",
              freeAnalysesUsed: user.freeAnalysesUsed,
              freeAnalysesLimit: user.freeAnalysesLimit,
            },
            { status: 402 }
          );
        }
      } else {
        // Check monthly limits for paid users
        const { checkAnalysisLimit } = await import("@/lib/utils/billing");
        const limitCheck = await checkAnalysisLimit(session.user.id);

        if (!limitCheck.allowed) {
          // Calculate next reset date
          const nextResetDate = limitCheck.periodEnd
            ? new Date(limitCheck.periodEnd).toLocaleDateString()
            : "your next billing date";

          // Notify Discord about failed analysis due to monthly limit
          await discordService.notifyFailedAnalysis({
            userId: session.user.id,
            email: user.email,
            error: `Monthly limit reached (${limitCheck.used}/${limitCheck.limit} analyses used, tier: ${user.subscriptionTier})`,
            failureType: "Monthly Limit",
          });

          return NextResponse.json(
            {
              error: "Monthly limit reached",
              message: `You have reached your monthly limit of ${limitCheck.limit} analyses. Your limit will reset on ${nextResetDate}.`,
              monthlyLimit: limitCheck.limit,
              monthlyUsed: limitCheck.used,
              tier: user.subscriptionTier,
            },
            { status: 402 }
          );
        }
      }
    }

    // Analyze chart with OpenAI GPT-4 Vision
    logger.info("Analyzing chart with OpenAI", { userId: session.user.id });
    const aiAnalysis = await analyzeChartWithAI(base64Image);

    // Log what we received from AI for debugging
    console.log("=== AI Analysis Result ===");
    console.log("stockSymbol:", aiAnalysis.stockSymbol);
    console.log("timeframe:", aiAnalysis.timeframe);
    console.log("chartQuality:", aiAnalysis.chartQuality);
    console.log("plainLanguageAnalysis:", aiAnalysis.plainLanguageAnalysis);
    console.log("tradeThesis:", aiAnalysis.tradeThesis);
    console.log("chartDescription:", aiAnalysis.chartDescription);
    console.log("keyStrengths:", aiAnalysis.keyStrengths);
    console.log("keyConcerns:", aiAnalysis.keyConcerns);
    console.log("overallReason:", aiAnalysis.overallReason);
    console.log("=========================");

    // Check if it's a valid chart
    if (!aiAnalysis.isValidChart) {
      // Notify Discord about failed analysis due to invalid chart
      await discordService.notifyFailedAnalysis({
        userId: session.user.id,
        email: user.email,
        error: `Invalid chart detected (confidence: ${aiAnalysis.confidence}%) - Not a valid LIVE stock chart`,
        failureType: "Invalid Chart",
        chartUrl: imageUrl,
      });

      return ApiResponse.badRequest("Invalid chart", {
        message:
          "The uploaded image does not appear to be a valid LIVE stock chart. Please ensure: (1) It's a chart from a trading platform, (2) It shows CURRENT/LIVE price action (not historical data from weeks/months ago), (3) It has visible price action, volume bars, technical indicators and x and y axis",
        confidence: aiAnalysis.confidence,
      });
    }

    // Run trading strategy analysis on the detected signals
    const analysisResult = analyzeChart({
      bullishSignals: aiAnalysis.bullishSignals,
      bearishSignals: aiAnalysis.bearishSignals,
      noGoSignals: aiAnalysis.noGoSignals,
      targetEntry: aiAnalysis.targetEntry,
      targetExit: aiAnalysis.targetExit,
      stopLoss: aiAnalysis.stopLoss,
      chartDescription: aiAnalysis.chartDescription,
      plainLanguageAnalysis: aiAnalysis.plainLanguageAnalysis,
      tradeThesis: aiAnalysis.tradeThesis,
      overallReason: aiAnalysis.overallReason,
      confidence: aiAnalysis.confidence,
      pullbackAnalysis: aiAnalysis.pullbackAnalysis,
    });

    console.log("Analysis result grade:", analysisResult.grade);

    // Save to database with ALL fields
    const [savedAnalysis] = await db
      .insert(chartAnalyses)
      .values({
        userId: session.user.id,
        imageUrl: imageUrl,
        stockSymbol: aiAnalysis.stockSymbol || undefined,
        isValidChart: true,
        grade: analysisResult.grade,
        gradeLabel: analysisResult.gradeLabel,
        gradeColor: analysisResult.gradeColor,
        totalScore: analysisResult.totalScore?.toFixed(2),
        shouldEnter: analysisResult.shouldEnter,
        entryPrice: analysisResult.entryPrice?.toString(),
        stopLoss: analysisResult.stopLoss?.toString(),
        takeProfit: analysisResult.takeProfit?.toString(),
        riskRewardRatio: analysisResult.riskRewardRatio?.toString(),
        activeBullishSignals: analysisResult.activeBullishSignals,
        activeBearishSignals: analysisResult.activeBearishSignals,
        activeNoGoConditions: analysisResult.activeNoGoConditions,
        confluenceCount: analysisResult.confluenceCount,
        confluenceCategories: analysisResult.confluenceCategories,
        analysisReasons: analysisResult.reasons,
        chartSummary: analysisResult.chartSummary,
        chartDescription: aiAnalysis.chartDescription || undefined,
        // Additional AI analysis data
        timeframe: aiAnalysis.timeframe || undefined,
        chartQuality: aiAnalysis.chartQuality || undefined,
        tradeThesis: aiAnalysis.tradeThesis || undefined,
        plainLanguageAnalysis: aiAnalysis.plainLanguageAnalysis || undefined,
        overallReason: aiAnalysis.overallReason || undefined,
        keyStrengths: aiAnalysis.keyStrengths || [],
        keyConcerns: aiAnalysis.keyConcerns || [],
        pullbackRecommendation:
          analysisResult.pullbackRecommendation || undefined,
      })
      .returning();

    console.log("Saved analysis ID:", savedAnalysis.id);

    // Log activity
    await db.insert(userActivity).values({
      userId: session.user.id,
      action: "chart_analysis",
      metadata: {
        analysisId: savedAnalysis.id,
        stockSymbol: aiAnalysis.stockSymbol,
        grade: analysisResult.grade,
        confidence: aiAnalysis.confidence,
      },
    });

    // Update free analyses count for free users (skip for admin)
    if (!isAdmin && isFreeUser) {
      await db
        .update(users)
        .set({
          freeAnalysesUsed: (user.freeAnalysesUsed || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));
    }

    // Track analytics
    await analyticsService.trackAnalysis(
      session.user.id,
      {
        analysisId: savedAnalysis.id,
        stockSymbol: aiAnalysis.stockSymbol,
        grade: analysisResult.grade,
        isFree: isFreeUser,
      },
      request
    );

    // Send Discord notification
    await discordService.notifyAnalysis({
      userId: session.user.id,
      email: user.email,
      stockSymbol: aiAnalysis.stockSymbol,
      grade: analysisResult.grade,
      shouldEnter: analysisResult.shouldEnter,
      confidence: aiAnalysis.confidence,
      isFree: isFreeUser,
    });

    // Prepare response with enhanced information
    // Use secure image URL instead of direct blob storage URL
    const { getSecureImageUrl } = await import("@/lib/utils/image-security");
    const secureImageUrl = getSecureImageUrl(savedAnalysis.id);

    const response = {
      id: savedAnalysis.id,
      ...analysisResult,
      imageUrl: secureImageUrl, // Return secure URL instead of blob URL
      stockSymbol: aiAnalysis.stockSymbol,
      chartDescription: undefined, // Don't send to frontend to reduce payload
      aiConfidence: aiAnalysis.confidence,
      isFreeUser,
      freeAnalysesRemaining: isFreeUser
        ? (user.freeAnalysesLimit || 1) - ((user.freeAnalysesUsed || 0) + 1)
        : undefined,
      pullbackRecommendation: analysisResult.pullbackRecommendation,
      detectedSignals: {
        bullish: analysisResult.activeBullishSignals.map((s) => ({
          name: s.name,
          points: s.points,
          explanation: s.explanation,
        })),
        bearish: analysisResult.activeBearishSignals.map((s) => ({
          name: s.name,
          points: Math.abs(s.points),
          explanation: s.explanation,
        })),
        noGo: analysisResult.activeNoGoConditions.map((c) => c.name),
      },
      disclaimer:
        "This analysis is for educational and informational purposes only. The recommendations are based on technical analysis patterns and historical probability, but do not guarantee future market performance. Markets are inherently unpredictable and volatile. This is NOT financial advice. Always conduct your own research, consider your risk tolerance, and consult with a licensed financial advisor before making any investment decisions. Trading stocks involves substantial risk of loss.",
    };

    return ApiResponse.success(response);
  } catch (error: unknown) {
    logger.error("Error in analysis route", error, {
      userId: session?.user?.id,
    });

    // Send Discord notification for failed analysis
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error in analysis route";

    if (session?.user) {
      await discordService.notifyFailedAnalysis({
        userId: session.user.id,
        email: session.user.email,
        error: errorMessage,
        failureType: "Analysis Error",
        chartUrl: imageUrl, // May be undefined if error occurred before upload
      });
    }

    // Send email notification for critical errors
    const errorStack = error instanceof Error ? error.stack : undefined;

    await emailNotificationService.sendErrorNotification({
      error: errorMessage,
      context: "Chart Analysis API (Consolidated)",
      stackTrace: errorStack,
      userId: session?.user?.id,
    });

    // Handle specific error types
    if (error instanceof Error) {
      // Handle authorization errors
      if (error.message.includes("Unauthorized")) {
        return ApiResponse.unauthorized(error.message);
      }

      // Handle OpenAI API errors
      if (error.message.includes("API key")) {
        return ApiResponse.serverError(
          "OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables."
        );
      }
    }

    return ApiResponse.serverError("Analysis failed. Please try again.");
  }
}
