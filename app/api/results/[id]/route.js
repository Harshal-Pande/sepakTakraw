import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateResults } from '@/lib/validations'

export async function GET(request, { params }) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    return Response.json(createResponse(data, 'Result fetched successfully'))
  } catch (error) {
    console.error('Error fetching result:', error)
    return Response.json(
      createErrorResponse(error, 'RESULT_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateResults.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('results')
      .update(validatedData)
      .eq('id', params.id)
      .select()
    
    if (error) throw error
    
    return Response.json(createResponse(data[0], 'Result updated successfully'))
  } catch (error) {
    console.error('Error updating result:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'RESULT_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('results')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return Response.json(createResponse(null, 'Result deleted successfully'))
  } catch (error) {
    console.error('Error deleting result:', error)
    return Response.json(
      createErrorResponse(error, 'RESULT_DELETE_ERROR'),
      { status: 500 }
    )
  }
}
