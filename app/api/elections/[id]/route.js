import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateElections } from '@/lib/validations'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('elections')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return Response.json(createResponse(data, 'Election fetched successfully'))
  } catch (error) {
    console.error('Error fetching election:', error)
    return Response.json(
      createErrorResponse(error, 'ELECTION_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateElections.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('elections')
      .update(validatedData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    return Response.json(createResponse(data[0], 'Election updated successfully'))
  } catch (error) {
    console.error('Error updating election:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + (error.errors || []).map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'ELECTION_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const supabase = createClient()
    
    const { error } = await supabase
      .from('elections')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return Response.json(createResponse(null, 'Election deleted successfully'))
  } catch (error) {
    console.error('Error deleting election:', error)
    return Response.json(
      createErrorResponse(error, 'ELECTION_DELETE_ERROR'),
      { status: 500 }
    )
  }
}
