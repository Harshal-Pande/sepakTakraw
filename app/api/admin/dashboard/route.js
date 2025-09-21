import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }
    
    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 })
    }
    
    const supabase = createClient()
    
    // Get stats from all tables
    const [
      newsCount,
      eventsCount,
      resultsCount,
      generalBodyCount,
      recentActivity
    ] = await Promise.all([
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('results').select('*', { count: 'exact', head: true }),
      supabase.from('general_body').select('*', { count: 'exact', head: true }),
      supabase
        .from('admin_activity_logs')
        .select(`
          *,
          admin_users!admin_activity_logs_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(10)
    ])
    
    // Get recent content
    const [recentNews, recentEvents, recentResults] = await Promise.all([
      supabase
        .from('news')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('events')
        .select('id, title, event_date, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('results')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalNews: newsCount.count || 0,
          totalEvents: eventsCount.count || 0,
          totalResults: resultsCount.count || 0,
          totalGeneralBody: generalBodyCount.count || 0
        },
        recentActivity: recentActivity.data || [],
        recentContent: {
          news: recentNews.data || [],
          events: recentEvents.data || [],
          results: recentResults.data || []
        },
        quickMetrics: [
          { 
            label: 'News Articles', 
            value: newsCount.count || 0, 
            change: '+5%',
            icon: 'newspaper'
          },
          { 
            label: 'Events', 
            value: eventsCount.count || 0, 
            change: '+2%',
            icon: 'calendar'
          },
          { 
            label: 'Results', 
            value: resultsCount.count || 0, 
            change: '+8%',
            icon: 'trophy'
          },
          { 
            label: 'General Body', 
            value: generalBodyCount.count || 0, 
            change: '+1%',
            icon: 'users'
          }
        ]
      }
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to load dashboard data'
    }, { status: 500 })
  }
}
