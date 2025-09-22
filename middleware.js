import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export const runtime = 'nodejs'

export function middleware(request) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value

    // Admin login route: if already authenticated, send to /admin; otherwise allow
    if (request.nextUrl.pathname === '/admin/login') {
      console.log('[MW] /admin/login hit', {
        path: request.nextUrl.pathname,
        hasToken: Boolean(token)
      })
      if (token) {
        const user = verifyToken(token)
        console.log('[MW] /admin/login token present, verify result', {
          verified: Boolean(user)
        })
        if (user) {
          console.log('[MW] redirecting authenticated user from /admin/login -> /admin')
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
      console.log('[MW] allowing unauthenticated access to /admin/login')
      return NextResponse.next()
    }
    
    if (!token) {
      console.log('[MW] missing token for admin route, redirecting to /admin/login', {
        path: request.nextUrl.pathname
      })
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    const user = verifyToken(token)
    console.log('[MW] admin route token verify', {
      path: request.nextUrl.pathname,
      verified: Boolean(user)
    })
    if (!user) {
      console.log('[MW] invalid token, redirect to /admin/login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-user', JSON.stringify(user))
    
    console.log('[MW] allowing admin route', { path: request.nextUrl.pathname })
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  // Protect admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }
    
    // Add user info to headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-user', JSON.stringify(user))
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }
    
    return response
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;"
  )
  
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/:path*'
  ],
}
