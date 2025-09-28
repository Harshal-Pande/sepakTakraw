import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No token provided'
      }, { status: 401 })
    }
    
    const user = await getCurrentUser(token)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 })
    }
    
    return NextResponse.json({
      success: true,
      data: { user }
    })
    
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({
      success: false,
      error: 'Token verification failed'
    }, { status: 500 })
  }
}
