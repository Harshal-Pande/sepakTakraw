import { createClient } from './supabase'

export const logActivity = async ({
  user_id,
  action,
  resource_type,
  resource_id = null,
  details = {},
  ip_address = null,
  user_agent = null
}) => {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('admin_activity_logs')
      .insert([{
        user_id,
        action,
        resource_type,
        resource_id,
        details,
        ip_address,
        user_agent
      }])
    
    if (error) {
      console.error('Activity logging error:', error)
    }
  } catch (error) {
    console.error('Activity logging error:', error)
  }
}

export const getActivityLogs = async (filters = {}) => {
  try {
    const supabase = createClient()
    
    let query = supabase
      .from('admin_activity_logs')
      .select(`
        *,
        admin_users!admin_activity_logs_user_id_fkey(name, email)
      `)
      .order('created_at', { ascending: false })
    
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }
    
    if (filters.action) {
      query = query.eq('action', filters.action)
    }
    
    if (filters.resource_type) {
      query = query.eq('resource_type', filters.resource_type)
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return []
  }
}
