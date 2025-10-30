import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Check for admin routes
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute) {
    const userRole = (token.role as string | undefined) ?? undefined

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