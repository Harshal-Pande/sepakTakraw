import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('anti_dop_guidelines')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return Response.json(createResponse(data, 'Anti-DOP guideline retrieved successfully'))

  } catch (error) {
    console.error('Anti-DOP guideline fetch error:', error)
    return Response.json(createErrorResponse(error, 'ANTI_DOP_GUIDELINE_FETCH_ERROR'), { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description']
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(createErrorResponse(`Missing required field: ${field}`, 'VALIDATION_ERROR'), { status: 400 })
      }
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from('anti_dop_guidelines')
      .update({
        title: body.title,
        description: body.description,
        document_url: body.document_url || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return Response.json(createResponse(data, 'Anti-DOP guideline updated successfully'))

  } catch (error) {
    console.error('Anti-DOP guideline update error:', error)
    return Response.json(createErrorResponse(error, 'ANTI_DOP_GUIDELINE_UPDATE_ERROR'), { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('anti_dop_guidelines')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return Response.json(createResponse(null, 'Anti-DOP guideline deleted successfully'))

  } catch (error) {
    console.error('Anti-DOP guideline delete error:', error)
    return Response.json(createErrorResponse(error, 'ANTI_DOP_GUIDELINE_DELETE_ERROR'), { status: 500 })
  }
}
