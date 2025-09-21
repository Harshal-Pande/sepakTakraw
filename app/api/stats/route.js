import { createResponse, createErrorResponse } from '@/lib/api-helpers'

// Hardcoded stats data since stats table doesn't exist in the schema
const STATS_DATA = [
  {
    id: '1',
    icon: 'Trophy',
    value: '150+',
    label: 'Tournaments',
    color: 'text-yellow-600',
    bg_color: 'bg-yellow-100',
    order_index: 1,
    is_active: true
  },
  {
    id: '2',
    icon: 'Users',
    value: '5000+',
    label: 'Players',
    color: 'text-blue-600',
    bg_color: 'bg-blue-100',
    order_index: 2,
    is_active: true
  },
  {
    id: '3',
    icon: 'Calendar',
    value: '25+',
    label: 'Years',
    color: 'text-green-600',
    bg_color: 'bg-green-100',
    order_index: 3,
    is_active: true
  },
  {
    id: '4',
    icon: 'Award',
    value: '50+',
    label: 'Awards',
    color: 'text-purple-600',
    bg_color: 'bg-purple-100',
    order_index: 4,
    is_active: true
  }
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active') !== 'false' // Default to true

    // Filter by active status if specified
    let data = STATS_DATA
    if (active !== null) {
      data = STATS_DATA.filter(stat => stat.is_active === active)
    }

    return Response.json(createResponse(data, 'Stats retrieved successfully', {
      total: data.length,
      totalPages: 1
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
