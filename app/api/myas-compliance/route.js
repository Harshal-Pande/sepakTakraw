import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams, queryWithPagination } from '@/lib/api-helpers'
import { validateMYASCompliance } from '@/lib/validations'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    
    const supabase = createClient()
    
    let query = supabase
      .from('myas_compliance')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    
    // Add search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    // Filter by category
    if (category) {
      query = query.eq('category', category)
    }
    
    // Filter by status
    if (status) {
      query = query.eq('status', status)
    }
    
    const result = await queryWithPagination(query, page, limit)
    
    return Response.json(createResponse(result.data, 'MYAS compliance documents fetched successfully', result.pagination))
  } catch (error) {
    console.error('Error fetching MYAS compliance:', error)
    return Response.json(
      createErrorResponse(error, 'MYAS_COMPLIANCE_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateMYASCompliance.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('myas_compliance')
      .insert([validatedData])
      .select()
    
    if (error) throw error
    
    return Response.json(
      createResponse(data[0], 'MYAS compliance document created successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating MYAS compliance document:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'MYAS_COMPLIANCE_CREATE_ERROR'),
      { status: 500 }
    )
  }
}
