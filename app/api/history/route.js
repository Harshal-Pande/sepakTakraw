import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateHistory } from '@/lib/validations'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('timeline_year', { ascending: false })
    
    if (error) throw error
    
    return Response.json(createResponse(data, 'History fetched successfully'))
  } catch (error) {
    console.error('Error fetching history:', error)
    return Response.json(
      createErrorResponse(error, 'HISTORY_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateHistory.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('history')
      .insert([validatedData])
      .select()
    
    if (error) throw error
    
    return Response.json(
      createResponse(data[0], 'History entry created successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating history entry:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'HISTORY_CREATE_ERROR'),
      { status: 500 }
    )
  }
}
