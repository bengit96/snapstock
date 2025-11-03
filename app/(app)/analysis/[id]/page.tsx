import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { db } from "@/lib/db";
import { chartAnalyses, analysisFeedback } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { AnalysisResult } from "@/components/analysis/analysis-result";
import type { ChartAnalysis } from "@/lib/types";
import type { Metadata } from "next";

interface AnalysisPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AnalysisPageProps): Promise<Metadata> {
  const session = await auth();

  if (!session) {
    return {
      title: "Chart Analysis",
      description: "View your AI-powered stock chart analysis results",
    };
  }

  // Fetch analysis for metadata
  const analysis = await db
    .select()
    .from(chartAnalyses)
    .where(
      and(
        eq(chartAnalyses.id, params.id),
        eq(chartAnalyses.userId, session.user.id)
      )
    )
    .limit(1);

  if (!analysis || analysis.length === 0) {
    return {
      title: "Chart Analysis",
      description: "View your AI-powered stock chart analysis results",
    };
  }

  const analysisData = analysis[0];
  const stockSymbol = analysisData.stockSymbol || "Stock";
  const grade = analysisData.grade || "";

  return {
    title: `${stockSymbol} Chart Analysis - Grade ${grade}`,
    description: `AI-powered technical analysis for ${stockSymbol}. ${analysisData.chartSummary || "Get detailed trading insights with MACD, EMA, volume, and VWAP analysis."}`,
    openGraph: {
      title: `${stockSymbol} Chart Analysis`,
      description: `AI analysis: ${analysisData.chartSummary || "Professional trading signals and recommendations"}`,
      images: analysisData.imageUrl ? [analysisData.imageUrl] : [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const session = await auth();

  if (!session) {
    redirect(ROUTES.login);
  }

  // Fetch the analysis - ensure it belongs to the user
  const analysis = await db
    .select()
    .from(chartAnalyses)
    .where(
      and(
        eq(chartAnalyses.id, params.id),
        eq(chartAnalyses.userId, session.user.id)
      )
    )
    .limit(1);

  if (!analysis || analysis.length === 0) {
    redirect("/home");
  }

  const analysisData = analysis[0];

  // Fetch feedback for this analysis
  const feedback = await db
    .select()
    .from(analysisFeedback)
    .where(
      and(
        eq(analysisFeedback.analysisId, params.id),
        eq(analysisFeedback.userId, session.user.id)
      )
    )
    .limit(1);

  // Convert database feedback to component format (null -> undefined)
  const feedbackData = feedback.length > 0 ? {
    wasCorrect: feedback[0].wasCorrect,
    notes: feedback[0].notes ?? undefined,
    actualHighPrice: feedback[0].actualHighPrice ? parseFloat(feedback[0].actualHighPrice) : undefined,
    actualLowPrice: feedback[0].actualLowPrice ? parseFloat(feedback[0].actualLowPrice) : undefined,
    screenshotUrl: feedback[0].screenshotUrl ?? undefined,
    additionalNotes: feedback[0].additionalNotes ?? undefined,
  } : undefined;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <main className="flex-1 container mx-auto px-4 pt-4 pb-8">
        <AnalysisResult
          analysis={analysisData as ChartAnalysis}
          existingFeedback={feedbackData}
        />
      </main>
    </div>
  );
}
