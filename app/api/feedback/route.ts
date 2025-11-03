import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analysisFeedback, chartAnalyses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      console.error('[Feedback API] Unauthorized access attempt');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log('[Feedback API] Received feedback submission:', {
      analysisId: body.analysisId,
      userId: session.user.id,
      wasCorrect: body.wasCorrect,
    });

    const {
      analysisId,
      wasCorrect,
      notes,
      actualHighPrice,
      actualLowPrice,
      screenshotUrl,
      additionalNotes,
    } = body;

    // Validate required fields
    if (!analysisId || typeof wasCorrect !== "boolean") {
      console.error('[Feedback API] Missing required fields:', { analysisId, wasCorrect });
      return NextResponse.json(
        { error: "Missing required fields: analysisId, wasCorrect" },
        { status: 400 }
      );
    }

    // Verify the analysis belongs to this user
    const analysis = await db
      .select()
      .from(chartAnalyses)
      .where(
        and(
          eq(chartAnalyses.id, analysisId),
          eq(chartAnalyses.userId, session.user.id)
        )
      )
      .limit(1);

    if (analysis.length === 0) {
      console.error('[Feedback API] Analysis not found or unauthorized:', {
        analysisId,
        userId: session.user.id,
      });
      return NextResponse.json(
        { error: "Analysis not found or doesn't belong to you" },
        { status: 404 }
      );
    }

    console.log('[Feedback API] Analysis verified, checking for existing feedback...');

    // Check if feedback already exists
    const existingFeedback = await db
      .select()
      .from(analysisFeedback)
      .where(
        and(
          eq(analysisFeedback.analysisId, analysisId),
          eq(analysisFeedback.userId, session.user.id)
        )
      )
      .limit(1);

    let result;
    if (existingFeedback.length > 0) {
      console.log('[Feedback API] Updating existing feedback:', existingFeedback[0].id);
      // Update existing feedback
      [result] = await db
        .update(analysisFeedback)
        .set({
          wasCorrect,
          notes: notes || null,
          actualHighPrice: actualHighPrice ? actualHighPrice.toString() : null,
          actualLowPrice: actualLowPrice ? actualLowPrice.toString() : null,
          screenshotUrl: screenshotUrl || null,
          additionalNotes: additionalNotes || null,
          updatedAt: new Date(),
        })
        .where(eq(analysisFeedback.id, existingFeedback[0].id))
        .returning();
      console.log('[Feedback API] Feedback updated successfully');
    } else {
      console.log('[Feedback API] Creating new feedback entry...');
      // Create new feedback
      [result] = await db
        .insert(analysisFeedback)
        .values({
          analysisId,
          userId: session.user.id,
          wasCorrect,
          notes: notes || null,
          actualHighPrice: actualHighPrice ? actualHighPrice.toString() : null,
          actualLowPrice: actualLowPrice ? actualLowPrice.toString() : null,
          screenshotUrl: screenshotUrl || null,
          additionalNotes: additionalNotes || null,
        })
        .returning();
      console.log('[Feedback API] Feedback created successfully:', result.id);
    }

    console.log('[Feedback API] Returning success response');
    return NextResponse.json({
      success: true,
      feedback: result,
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve feedback for an analysis
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get("analysisId");

    if (!analysisId) {
      return NextResponse.json(
        { error: "Missing analysisId parameter" },
        { status: 400 }
      );
    }

    const feedback = await db
      .select()
      .from(analysisFeedback)
      .where(
        and(
          eq(analysisFeedback.analysisId, analysisId),
          eq(analysisFeedback.userId, session.user.id)
        )
      )
      .limit(1);

    if (feedback.length === 0) {
      return NextResponse.json({ feedback: null });
    }

    return NextResponse.json({ feedback: feedback[0] });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
