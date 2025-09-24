import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'
import { validateHeroImage } from '@/lib/validations'

export async function GET(request, { params }) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    return Response.json(createResponse(data, 'Hero image fetched successfully'))
  } catch (error) {
    console.error('Error fetching hero image:', error)
    return Response.json(
      createErrorResponse(error, 'HERO_IMAGE_FETCH_ERROR'),
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = validateHeroImage.parse(body)
    
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('hero_images')
      .update(validatedData)
      .eq('id', params.id)
      .select()
    
    if (error) throw error
    
    return Response.json(createResponse(data[0], 'Hero image updated successfully'))
  } catch (error) {
    console.error('Error updating hero image:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'HERO_IMAGE_UPDATE_ERROR'),
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('hero_images')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return Response.json(createResponse(null, 'Hero image deleted successfully'))
  } catch (error) {
    console.error('Error deleting hero image:', error)
    return Response.json(
      createErrorResponse(error, 'HERO_IMAGE_DELETE_ERROR'),
      { status: 500 }
    )
  }
}
