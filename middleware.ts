import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { requireEnv } from "@/lib/utils/env";

// Extend JWT token type to include role
interface TokenWithRole {
  sub?: string;
  role?: "user" | "admin";
  [key: string]: unknown;
}

export async function middleware(req: NextRequest) {
  const secret = requireEnv("NEXTAUTH_SECRET");
  const token = (await getToken({ req, secret })) as TokenWithRole | null;

  // Check for admin API routes (page admin routes handled by AuthGuard)
  const isAdminApiRoute = req.nextUrl.pathname.startsWith("/api/admin");

  if (isAdminApiRoute) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = token.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
  }

  // For API routes, require authentication
  if (req.nextUrl.pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // API routes only - page auth handled by components
    "/api/analysis/:path*",
    "/api/analyses/:path*",
    "/api/billing/:path*",
    "/api/stripe/checkout",
    "/api/stripe/portal",
    "/api/stripe/webhook",
    "/api/trades/:path*",
    "/api/usage/:path*",
    "/api/referrals/:path*",
    "/api/admin/:path*",
  ],
};
