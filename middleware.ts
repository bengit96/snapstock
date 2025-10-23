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
    // @ts-ignore - role is added to token via callbacks
    const userRole = token.role as string | undefined

    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/analysis/:path*',
    '/api/trades/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}