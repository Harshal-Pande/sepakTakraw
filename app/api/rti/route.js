import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams, queryWithPagination } from '@/lib/api-helpers'
import { validateRTIOfficers } from '@/lib/validations'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    
    const supabase = createClient()
    
    let query = supabase
      .from('rti_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    // Add search functionality
    if (search) {
      query = query.or(`subject.ilike.%${search}%,description.ilike.%${search}%,applicant_name.ilike.%${search}%`)
    }
    
    // Filter by status
    if (status) {
      query = query.eq('status', status)
    }
    
    const result = await queryWithPagination(query, page, limit)
    
    return Response.json(createResponse(result.data, 'RTI requests fetched successfully', result.pagination))
  } catch (error) {
    console.error('Error fetching RTI requests:', error)
    return Response.json(
      createErrorResponse(error, 'RTI_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateRtiRequest.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('rti_requests')
      .insert([validatedData])
      .select()
    
    if (error) throw error
    
    return Response.json(
      createResponse(data[0], 'RTI request created successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating RTI request:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'RTI_CREATE_ERROR'),
      { status: 500 }
    )
  }
}
