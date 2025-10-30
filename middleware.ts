import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { requireEnv } from '@/lib/utils/env'

// Extend JWT token type to include role
interface TokenWithRole {
  sub?: string
  role?: 'user' | 'admin'
  [key: string]: unknown
}

export async function middleware(req: NextRequest) {
  const secret = requireEnv('NEXTAUTH_SECRET')
  const token = (await getToken({ req, secret })) as TokenWithRole | null

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Check for admin routes
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute) {
    const userRole = token.role

    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // User pages
    '/dashboard/:path*',
    '/home/:path*',
    '/billing/:path*',
    '/settings/:path*',
    // API routes
    '/api/analysis/:path*',
    '/api/analyses/:path*',
    '/api/billing/:path*',
    '/api/stripe/checkout',
    '/api/stripe/portal',
    '/api/trades/:path*',
    '/api/usage/:path*',
    '/api/referrals/:path*',
    // Admin routes
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}