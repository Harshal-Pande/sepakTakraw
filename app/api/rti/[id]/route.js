import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateRtiRequest } from '@/lib/validations'

export async function GET(request, { params }) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('rti_requests')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    return Response.json(createResponse(data, 'RTI request fetched successfully'))
  } catch (error) {
    console.error('Error fetching RTI request:', error)
    return Response.json(
      createErrorResponse(error, 'RTI_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateRtiRequest.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('rti_requests')
      .update(validatedData)
      .eq('id', params.id)
      .select()
    
    if (error) throw error
    
    return Response.json(createResponse(data[0], 'RTI request updated successfully'))
  } catch (error) {
    console.error('Error updating RTI request:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'RTI_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('rti_requests')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return Response.json(createResponse(null, 'RTI request deleted successfully'))
  } catch (error) {
    console.error('Error deleting RTI request:', error)
    return Response.json(
      createErrorResponse(error, 'RTI_DELETE_ERROR'),
      { status: 500 }
    )
  }
}
