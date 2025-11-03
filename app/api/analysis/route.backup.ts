import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chartAnalyses, userActivity, users } from "@/lib/db/schema";
import { analyzeChart } from "@/lib/trading/analysis";
import { analyzeChartWithAI } from "@/lib/openai";
import { discordService } from "@/lib/services/discord.service";
import { analyticsService } from "@/lib/services/analytics.service";
import { emailNotificationService } from "@/lib/services/email-notification.service";
import { SUBSCRIPTION_LIMITS } from "@/lib/constants";
import { eq, and, gte } from "drizzle-orm";
import { put } from "@vercel/blob";
import { requireAuth } from "@/lib/utils/security";
import { ApiResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import type { Session } from "next-auth";

export async function POST(request: NextRequest) {
  let session: Session | null = null;

  try {
    session = await requireAuth();

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
    const isFreeUser =
      !user.subscriptionStatus || user.subscriptionStatus !== "active";

    // Check free trial limits
    if (isFreeUser) {
      if ((user.freeAnalysesUsed || 0) >= (user.freeAnalysesLimit || 1)) {
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
      const tier = user.subscriptionTier as
        | "monthly"
        | "yearly"
        | "lifetime"
        | null;
      const monthlyLimit = tier
        ? SUBSCRIPTION_LIMITS[tier]?.monthlyAnalyses
        : null;

      // Only check if there's a limit (null = unlimited for lifetime)
      if (monthlyLimit !== null && monthlyLimit !== undefined) {
        // Get start of current month
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        // Count analyses this month
        const thisMonthAnalyses = await db
          .select()
          .from(chartAnalyses)
          .where(
            and(
              eq(chartAnalyses.userId, session.user.id),
              gte(chartAnalyses.createdAt, monthStart)
            )
          );

        if (thisMonthAnalyses.length >= monthlyLimit) {
          return NextResponse.json(
            {
              error: "Monthly limit reached",
              message: `You have reached your monthly limit of ${monthlyLimit} analyses. Your limit will reset on the 1st of next month.`,
              monthlyLimit,
              monthlyUsed: thisMonthAnalyses.length,
              tier,
            },
            { status: 402 }
          );
        }
      }
    }

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
    let imageUrl: string;
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
      return ApiResponse.serverError(
        "Failed to upload image. Please try again."
      );
    }

    // Convert file to base64 for OpenAI
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

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
      return ApiResponse.badRequest("Invalid chart", {
        message:
          "The uploaded image does not appear to be a valid LIVE stock chart. Please ensure: (1) It's a chart from a trading platform, (2) It shows CURRENT/LIVE price action (not historical data from weeks/months ago), (3) It has visible price action, volume bars, and technical indicators.",
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
      confidence: aiAnalysis.confidence,
    });

    console.log("Analysis result:", analysisResult);

    // Save to database
    const [savedAnalysis] = await db
      .insert(chartAnalyses)
      .values({
        userId: session.user.id,
        imageUrl: imageUrl, // Store blob URL instead of base64
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
      })
      .returning();
    console.log("Saved analysis:", savedAnalysis);

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

    // Update free analyses count for free users
    if (isFreeUser) {
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
    const response = {
      id: savedAnalysis.id,
      ...analysisResult,
      stockSymbol: aiAnalysis.stockSymbol,
      chartDescription: undefined,
      aiConfidence: aiAnalysis.confidence,
      isFreeUser,
      freeAnalysesRemaining: isFreeUser
        ? (user.freeAnalysesLimit || 1) - ((user.freeAnalysesUsed || 0) + 1)
        : undefined,
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

    // Send email notification for critical errors
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error in analysis route";
    const errorStack = error instanceof Error ? error.stack : undefined;

    await emailNotificationService.sendErrorNotification({
      error: errorMessage,
      context: "Chart Analysis API",
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
