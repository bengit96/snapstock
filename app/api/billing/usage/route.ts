import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  getUserBillingPeriod,
  countAnalysesInPeriod,
} from "@/lib/utils/billing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details
    const user = await db
      .select({
        subscriptionTier: users.subscriptionTier,
        subscriptionStatus: users.subscriptionStatus,
        freeAnalysesUsed: users.freeAnalysesUsed,
        freeAnalysesLimit: users.freeAnalysesLimit,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = user[0];

    // Get billing period info and count analyses
    const billingInfo = await getUserBillingPeriod(session.user.id);
    const analysesUsed = await countAnalysesInPeriod(
      session.user.id,
      billingInfo.periodStart
    );

    const responseData = {
      analysesUsed: userData.subscriptionTier
        ? analysesUsed
        : userData.freeAnalysesUsed || 0,
      analysesLimit: billingInfo.analysesLimit,
      currentPeriodEnd: billingInfo.periodEnd,
      subscriptionTier: userData.subscriptionTier || null,
      subscriptionStatus: userData.subscriptionStatus,
      role: userData.role,
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Error fetching usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}
