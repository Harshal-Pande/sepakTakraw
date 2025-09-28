import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams } from '@/lib/api-helpers'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)

    const supabase = createClient()

    const { data, error, count } = await supabase
      .from('anti_dop_guidelines')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      throw error
    }

    return Response.json(createResponse(data, 'Anti-DOP guidelines retrieved successfully', {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }))

  } catch (error) {
    console.error('Anti-DOP guidelines fetch error:', error)
    return Response.json(createErrorResponse(error, 'ANTI_DOP_GUIDELINES_FETCH_ERROR'), { status: 500 })
  }
}

export async function POST(request) {
  try {
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
      .insert([{
        title: body.title,
        description: body.description,
        document_url: body.document_url || null
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return Response.json(createResponse(data, 'Anti-DOP guidelines created successfully'), { status: 201 })

  } catch (error) {
    console.error('Anti-DOP guidelines creation error:', error)
    return Response.json(createErrorResponse(error, 'ANTI_DOP_GUIDELINES_CREATE_ERROR'), { status: 500 })
  }
}
