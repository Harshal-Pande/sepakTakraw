import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateMyasCompliance } from '@/lib/validations'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('myas_compliance')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return Response.json(createResponse(data, 'MYAS compliance document fetched successfully'))
  } catch (error) {
    console.error('Error fetching MYAS compliance document:', error)
    return Response.json(
      createErrorResponse(error, 'MYAS_COMPLIANCE_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateMyasCompliance.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('myas_compliance')
      .update(validatedData)
      .eq('id', params.id)
      .select()
    
    if (error) throw error
    
    return Response.json(createResponse(data[0], 'MYAS compliance document updated successfully'))
  } catch (error) {
    console.error('Error updating MYAS compliance document:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + (error.errors || []).map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'MYAS_COMPLIANCE_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('myas_compliance')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return Response.json(createResponse(null, 'MYAS compliance document deleted successfully'))
  } catch (error) {
    console.error('Error deleting MYAS compliance document:', error)
    return Response.json(
      createErrorResponse(error, 'MYAS_COMPLIANCE_DELETE_ERROR'),
      { status: 500 }
    )
  }
}
