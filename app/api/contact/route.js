import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateContactInfo } from '@/lib/validations'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) throw error
    
    return Response.json(createResponse(data[0] || null, 'Contact information fetched successfully'))
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return Response.json(
      createErrorResponse(error, 'CONTACT_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateContactInfo.parse(body)
    
    const supabase = createClient()
    
    // Delete existing contact info and insert new one
    await supabase.from('contact_info').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    const { data, error } = await supabase
      .from('contact_info')
      .insert([validatedData])
      .select()
    
    if (error) throw error
    
    return Response.json(
      createResponse(data[0], 'Contact information updated successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error updating contact info:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'CONTACT_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}
