import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams } from '@/lib/api-helpers'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)
    const active = searchParams.get('active') !== 'false' // Default to true

    const supabase = createClient()

    let query = supabase
      .from('stats')
      .select('*')
      .order('order_index', { ascending: true })

    // Filter by active status if specified
    if (active !== null) {
      query = query.eq('is_active', active)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return Response.json(createResponse(data, 'Stats retrieved successfully', {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }))

  } catch (error) {
    console.error('Stats fetch error:', error)
    return Response.json(createErrorResponse(error, 'STATS_FETCH_ERROR'), { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['icon', 'value', 'label', 'color', 'bg_color']
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(createErrorResponse(`Missing required field: ${field}`, 'VALIDATION_ERROR'), { status: 400 })
      }
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from('stats')
      .insert([{
        icon: body.icon,
        value: body.value,
        label: body.label,
        color: body.color,
        bg_color: body.bg_color,
        order_index: body.order_index || 0,
        is_active: body.is_active !== undefined ? body.is_active : true
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return Response.json(createResponse(data, 'Stat created successfully'), { status: 201 })

  } catch (error) {
    console.error('Stats creation error:', error)
    return Response.json(createErrorResponse(error, 'STATS_CREATE_ERROR'), { status: 500 })
  }
}
