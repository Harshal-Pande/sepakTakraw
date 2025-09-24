import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateGeneralBody } from '@/lib/validations'

export async function GET(request, { params }) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('general_body')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    return Response.json(createResponse(data, 'General body member fetched successfully'))
  } catch (error) {
    console.error('Error fetching general body member:', error)
    return Response.json(
      createErrorResponse(error, 'GENERAL_BODY_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateGeneralBody.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('general_body')
      .update(validatedData)
      .eq('id', params.id)
      .select()
    
    if (error) throw error
    
    return Response.json(createResponse(data[0], 'General body member updated successfully'))
  } catch (error) {
    console.error('Error updating general body member:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'GENERAL_BODY_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('general_body')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return Response.json(createResponse(null, 'General body member deleted successfully'))
  } catch (error) {
    console.error('Error deleting general body member:', error)
    return Response.json(
      createErrorResponse(error, 'GENERAL_BODY_DELETE_ERROR'),
      { status: 500 }
    )
  }
}
