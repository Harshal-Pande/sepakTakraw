import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams, queryWithPagination } from '@/lib/api-helpers'
import { validateGeneralBody } from '@/lib/validations'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)
    const district = searchParams.get('district')
    const position = searchParams.get('position')
    const search = searchParams.get('search')
    
    const supabase = createClient()
    
    let query = supabase
      .from('general_body')
      .select('*', { count: 'exact' })
      .order('district', { ascending: true })
      .order('position', { ascending: true })
    
    // Add filters
    if (district) {
      query = query.eq('district', district)
    }
    
    if (position) {
      query = query.eq('position', position)
    }
    
    // Add search functionality
    if (search) {
      query = query.or(`name.ilike.%${search}%,district.ilike.%${search}%,position.ilike.%${search}%`)
    }
    
    const result = await queryWithPagination(query, page, limit)
    
    return Response.json(createResponse(result.data, 'General body members fetched successfully', result.pagination))
  } catch (error) {
    console.error('Error fetching general body members:', error)
    return Response.json(
      createErrorResponse(error, 'GENERAL_BODY_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateGeneralBody.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('general_body')
      .insert([validatedData])
      .select()
    
    if (error) throw error
    
    return Response.json(
      createResponse(data[0], 'General body member added successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding general body member:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'GENERAL_BODY_CREATE_ERROR'),
      { status: 500 }
    )
  }
}
