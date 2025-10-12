import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateHistory } from '@/lib/validations'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return Response.json(createResponse(data, 'History entry fetched successfully'))
  } catch (error) {
    console.error('Error fetching history entry:', error)
    return Response.json(
      createErrorResponse(error, 'HISTORY_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateHistory.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('history')
      .update(validatedData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    return Response.json(createResponse(data[0], 'History entry updated successfully'))
  } catch (error) {
    console.error('Error updating history entry:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + (error.errors ? error.errors.map(e => e.message).join(', ') : error.message), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'HISTORY_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const supabase = createClient()
    
    const { error } = await supabase
      .from('history')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return Response.json(createResponse(null, 'History entry deleted successfully'))
  } catch (error) {
    console.error('Error deleting history entry:', error)
    return Response.json(
      createErrorResponse(error, 'HISTORY_DELETE_ERROR'),
      { status: 500 }
    )
  }
}
