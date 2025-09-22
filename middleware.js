import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow unauthenticated access to the admin login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    const user = verifyToken(token)
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-user', JSON.stringify(user))
    
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
