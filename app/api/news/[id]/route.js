import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateNews } from '@/lib/validations'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return Response.json(
        createErrorResponse('News ID is required', 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json(
          createErrorResponse('News not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      throw error
    }
    
    return Response.json(createResponse(data, 'News fetched successfully'))
  } catch (error) {
    console.error('Error fetching news:', error)
    return Response.json(
      createErrorResponse(error, 'NEWS_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    if (!id) {
      return Response.json(
        createErrorResponse('News ID is required', 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    // Validate the input
    const validatedData = validateNews.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('news')
      .update(validatedData)
      .eq('id', id)
      .select()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json(
          createErrorResponse('News not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      throw error
    }
    
    return Response.json(createResponse(data[0], 'News updated successfully'))
  } catch (error) {
    console.error('Error updating news:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'NEWS_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return Response.json(
        createErrorResponse('News ID is required', 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)
    
    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json(
          createErrorResponse('News not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      throw error
    }
    
    return Response.json(createResponse(null, 'News deleted successfully'))
  } catch (error) {
    console.error('Error deleting news:', error)
    return Response.json(
      createErrorResponse(error, 'NEWS_DELETE_ERROR'),
      { status: 500 }
    )
  }
}
