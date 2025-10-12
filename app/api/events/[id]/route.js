import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateEvents } from '@/lib/validations'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    console.log('Fetching event with ID:', id)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    
    console.log('Event query result:', { data, error })
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    if (!data) {
      console.log('No event found with ID:', id)
      return Response.json(
        createErrorResponse('Event not found', 'EVENT_NOT_FOUND'),
        { status: 404 }
      )
    }
    
    console.log('Event found:', data)
    return Response.json(createResponse(data, 'Event fetched successfully'))
  } catch (error) {
    console.error('Error fetching event:', error)
    return Response.json(
      createErrorResponse(error, 'EVENT_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateEvents.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('events')
      .update(validatedData)
      .eq('id', params.id)
      .select()
    
    if (error) throw error
    
    return Response.json(createResponse(data[0], 'Event updated successfully'))
  } catch (error) {
    console.error('Error updating event:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + (error.errors || []).map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'EVENT_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return Response.json(createResponse(null, 'Event deleted successfully'))
  } catch (error) {
    console.error('Error deleting event:', error)
    return Response.json(
      createErrorResponse(error, 'EVENT_DELETE_ERROR'),
      { status: 500 }
    )
  }
}
