import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams } from '@/lib/api-helpers'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)

    const supabase = createClient()

    const { data, error, count } = await supabase
      .from('history')
      .select('*', { count: 'exact' })
      .order('timeline_year', { ascending: false, nullsLast: true })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      throw error
    }

    return Response.json(createResponse(data, 'History retrieved successfully', {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }))

  } catch (error) {
    console.error('History fetch error:', error)
    return Response.json(createErrorResponse(error, 'HISTORY_FETCH_ERROR'), { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['content']
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(createErrorResponse(`Missing required field: ${field}`, 'VALIDATION_ERROR'), { status: 400 })
      }
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from('history')
      .insert([{
        content: body.content,
        timeline_year: body.timeline_year || null
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return Response.json(createResponse(data, 'History entry created successfully'), { status: 201 })

  } catch (error) {
    console.error('History creation error:', error)
    return Response.json(createErrorResponse(error, 'HISTORY_CREATE_ERROR'), { status: 500 })
  }
}