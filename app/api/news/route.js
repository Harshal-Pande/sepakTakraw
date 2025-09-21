import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams, queryWithPagination } from '@/lib/api-helpers'
import { validateNews } from '@/lib/validations'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)
    const search = searchParams.get('search')
    
    const supabase = createClient()
    
    let query = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    // Add search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    const result = await queryWithPagination(query, page, limit)
    
    return Response.json(createResponse(result.data, 'News fetched successfully', result.pagination))
  } catch (error) {
    console.error('Error fetching news:', error)
    return Response.json(
      createErrorResponse(error, 'NEWS_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateNews.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('news')
      .insert([validatedData])
      .select()
    
    if (error) throw error
    
    return Response.json(
      createResponse(data[0], 'News created successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating news:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'NEWS_CREATE_ERROR'),
      { status: 500 }
    )
  }
}
