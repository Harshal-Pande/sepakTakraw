import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return Response.json(createResponse(data))
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
    const { image_url, alt_text, is_active = true } = body
    
    if (!image_url || !alt_text) {
      return Response.json(
        createErrorResponse('Image URL and alt text are required', 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('hero_images')
      .insert([{
        image_url,
        alt_text,
        is_active
      }])
      .select()
    
    if (error) throw error
    
    return Response.json(
      createResponse(data[0], 'Hero image created successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating hero image:', error)
    return Response.json(
      createErrorResponse(error, 'HERO_IMAGE_CREATE_ERROR'),
      { status: 500 }
    )
  }
}
