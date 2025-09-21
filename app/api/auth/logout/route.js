import { NextResponse } from 'next/server'
import { logActivity } from '@/lib/activity-logger'

export async function POST(request) {
  try {
    const token = request.cookies.get('admin-token')?.value
    
    if (token) {
      // Log activity if user is logged in
      try {
        const { verifyToken } = await import('@/lib/auth')
        const user = verifyToken(token)
        
        if (user) {
          await logActivity({
            user_id: user.id,
            action: 'logout',
            resource_type: 'auth',
            ip_address: request.ip || request.headers.get('x-forwarded-for'),
            user_agent: request.headers.get('user-agent')
          })
        }
      } catch (error) {
        console.error('Error logging logout activity:', error)
      }
    }
    
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
    
    // Clear the cookie
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 })
  }
}
