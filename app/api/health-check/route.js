import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Perform multiple database operations to keep Supabase active
    const operations = []
    
    // 1. Read operations - Check various tables
    operations.push(
      supabase.from('news').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('results').select('id', { count: 'exact', head: true }),
      supabase.from('general_body').select('id', { count: 'exact', head: true }),
      supabase.from('hero_images').select('id', { count: 'exact', head: true })
    )
    
    // 2. Execute all operations in parallel
    const results = await Promise.all(operations)
    
    // 3. Create a health check log entry (if table exists)
    try {
      await supabase.from('admin_activity_logs').insert({
        user_id: null, // System operation
        action: 'HEALTH_CHECK',
        details: 'Automated health check to keep database active',
        ip_address: '127.0.0.1',
        user_agent: 'Cron Job Health Check'
      })
    } catch (logError) {
      // Ignore if table doesn't exist or log fails
      console.log('Could not log health check:', logError.message)
    }
    
    // 4. Get database stats
    const stats = {
      timestamp: new Date().toISOString(),
      database_status: 'active',
      tables_checked: results.length,
      news_count: results[0]?.count || 0,
      events_count: results[1]?.count || 0,
      results_count: results[2]?.count || 0,
      general_body_count: results[3]?.count || 0,
      hero_images_count: results[4]?.count || 0,
      operation: 'health_check_completed'
    }
    
    return Response.json(createResponse(stats, 'Database health check completed successfully'))
    
  } catch (error) {
    console.error('Health check error:', error)
    
    // Even if there's an error, return a response to indicate the service is running
    const errorStats = {
      timestamp: new Date().toISOString(),
      database_status: 'error',
      error: error.message,
      operation: 'health_check_failed'
    }
    
    return Response.json(
      createErrorResponse(errorStats, 'HEALTH_CHECK_ERROR'),
      { status: 500 }
    )
  }
}
