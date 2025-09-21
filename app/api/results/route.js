import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams, queryWithPagination } from '@/lib/api-helpers'
import { validateResults } from '@/lib/validations'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)
    const search = searchParams.get('search')
    const year = searchParams.get('year')
    
    const supabase = createClient()
    
    let query = supabase
      .from('results')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    // Add search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    // Filter by year
    if (year) {
      const startDate = `${year}-01-01`
      const endDate = `${year}-12-31`
      query = query.gte('created_at', startDate).lte('created_at', endDate)
    }
    
    const result = await queryWithPagination(query, page, limit)
    
    return Response.json(createResponse(result.data, 'Results fetched successfully', result.pagination))
  } catch (error) {
    console.error('Error fetching results:', error)
    return Response.json(
      createErrorResponse(error, 'RESULTS_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateResults.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('results')
      .insert([validatedData])
      .select()
    
    if (error) throw error
    
    return Response.json(
      createResponse(data[0], 'Result created successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating result:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'RESULT_CREATE_ERROR'),
      { status: 500 }
    )
  }
}
