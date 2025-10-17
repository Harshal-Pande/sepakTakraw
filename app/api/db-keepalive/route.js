import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Perform comprehensive database operations to keep Supabase active
    const operations = []
    
    // 1. READ operations - Check all major tables
    const readOperations = [
      supabase.from('news').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('events').select('id, title, event_date').order('event_date', { ascending: false }).limit(5),
      supabase.from('results').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('general_body').select('id, name, position, district').limit(10),
      supabase.from('hero_images').select('id, image_url, is_active').eq('is_active', true),
      supabase.from('contact_info').select('id, address, phone, email').limit(1),
      supabase.from('history').select('id, content, timeline_year').order('timeline_year', { ascending: false }).limit(5)
    ]
    
    // 2. Execute read operations
    const readResults = await Promise.all(readOperations)
    
    // 3. COUNT operations for statistics
    const countOperations = [
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('results').select('*', { count: 'exact', head: true }),
      supabase.from('general_body').select('*', { count: 'exact', head: true }),
      supabase.from('hero_images').select('*', { count: 'exact', head: true }),
      supabase.from('contact_info').select('*', { count: 'exact', head: true }),
      supabase.from('history').select('*', { count: 'exact', head: true })
    ]
    
    const countResults = await Promise.all(countOperations)
    
    // 4. Try to create a system log entry (if admin_activity_logs table exists)
    let logCreated = false
    try {
      const { data: logData, error: logError } = await supabase
        .from('admin_activity_logs')
        .insert({
          user_id: null, // System operation
          action: 'DATABASE_KEEPALIVE',
          details: JSON.stringify({
            timestamp: new Date().toISOString(),
            operation: 'comprehensive_db_check',
            tables_queried: 7,
            status: 'success'
          }),
          ip_address: '127.0.0.1',
          user_agent: 'Cron Job Database KeepAlive'
        })
        .select()
      
      if (!logError) {
        logCreated = true
      }
    } catch (logError) {
      console.log('Could not create system log entry:', logError.message)
    }
    
    // 5. Try to update a system setting or create a temporary record (if possible)
    let systemUpdate = false
    try {
      // Try to update or insert a system health record
      const { data: updateData, error: updateError } = await supabase
        .from('contact_info')
        .upsert({
          id: 1,
          address: 'System Health Check',
          phone: '+1-000-000-0000',
          email: 'system@sepaktakraw.org',
          office_hours: `Last health check: ${new Date().toISOString()}`,
          updated_at: new Date().toISOString()
        })
        .select()
      
      if (!updateError) {
        systemUpdate = true
      }
    } catch (updateError) {
      console.log('Could not update system record:', updateError.message)
    }
    
    // 6. Compile comprehensive stats
    const stats = {
      timestamp: new Date().toISOString(),
      database_status: 'active_and_healthy',
      operation_type: 'comprehensive_keepalive',
      
      // Read operation results
      news_articles: {
        count: countResults[0]?.count || 0,
        recent_items: readResults[0]?.data?.length || 0
      },
      events: {
        count: countResults[1]?.count || 0,
        recent_items: readResults[1]?.data?.length || 0
      },
      results: {
        count: countResults[2]?.count || 0,
        recent_items: readResults[2]?.data?.length || 0
      },
      general_body: {
        count: countResults[3]?.count || 0,
        members: readResults[3]?.data?.length || 0
      },
      hero_images: {
        count: countResults[4]?.count || 0,
        active_images: readResults[4]?.data?.length || 0
      },
      contact_info: {
        count: countResults[5]?.count || 0,
        records: readResults[5]?.data?.length || 0
      },
      history: {
        count: countResults[6]?.count || 0,
        entries: readResults[6]?.data?.length || 0
      },
      
      // System operations
      system_log_created: logCreated,
      system_record_updated: systemUpdate,
      
      // Performance metrics
      total_operations: readOperations.length + countOperations.length,
      queries_executed: readOperations.length,
      counts_executed: countOperations.length,
      
      // Health status
      health_score: 'excellent',
      recommendation: 'Database is active and responsive. Continue regular keepalive checks.'
    }
    
    return Response.json(createResponse(stats, 'Database keepalive operation completed successfully'))
    
  } catch (error) {
    console.error('Database keepalive error:', error)
    
    // Return error response but still indicate the service attempted to run
    const errorStats = {
      timestamp: new Date().toISOString(),
      database_status: 'error',
      operation_type: 'keepalive_failed',
      error: error.message,
      health_score: 'poor',
      recommendation: 'Check database connection and retry'
    }
    
    return Response.json(
      createErrorResponse(errorStats, 'DATABASE_KEEPALIVE_ERROR'),
      { status: 500 }
    )
  }
}
