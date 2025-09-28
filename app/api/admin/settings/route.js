import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
    
    if (error) throw error
    
    // Convert array to object
    const settings = {}
    data.forEach(setting => {
      settings[setting.key] = setting.value
    })
    
    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch settings'
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const settings = await request.json()
    const supabase = createClient()
    
    // Get current user from headers
    const userHeader = request.headers.get('x-admin-user')
    const user = userHeader ? JSON.parse(userHeader) : null
    
    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update settings'
    }, { status: 500 })
  }
}
