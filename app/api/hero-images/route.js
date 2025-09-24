import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams, queryWithPagination } from '@/lib/api-helpers'
import { validateHeroImages } from '@/lib/validations'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)
    const search = searchParams.get('search')
    const active = searchParams.get('active')
    
    const supabase = createClient()
    
    let query = supabase
      .from('hero_images')
      .select('*', { count: 'exact' })
      .order('display_order', { ascending: true })
    
    // Add search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,subtitle.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    // Filter by active status
    if (active !== null) {
      query = query.eq('is_active', active === 'true')
    }
    
    const result = await queryWithPagination(query, page, limit)
    
    return Response.json(createResponse(result.data, 'Hero images fetched successfully', result.pagination))
  } catch (error) {
    console.error('Error fetching hero images:', error)
    return Response.json(
      createErrorResponse(error, 'HERO_IMAGES_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateHeroImage.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('hero_images')
      .insert([validatedData])
      .select()
    
    if (error) throw error
    
    return Response.json(
      createResponse(data[0], 'Hero image created successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating hero image:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'HERO_IMAGE_CREATE_ERROR'),
      { status: 500 }
    )
  }
}