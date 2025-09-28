import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, validateFile } from '@/lib/api-helpers'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'images'
    
    if (!file) {
      return Response.json(
        createErrorResponse('No file provided', 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }

    // Validate file
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ]
    
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    try {
      validateFile(file, allowedTypes, maxSize)
    } catch (validationError) {
      return Response.json(
        createErrorResponse(validationError.message, 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${randomString}.${fileExtension}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase Storage
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path)

    return Response.json(
      createResponse({
        url: publicUrl,
        path: data.path,
        name: file.name,
        size: file.size,
        type: file.type
      }, 'Image uploaded successfully')
    )
  } catch (error) {
    console.error('Error uploading image:', error)
    return Response.json(
      createErrorResponse(error, 'IMAGE_UPLOAD_ERROR'),
      { status: 500 }
    )
  }
}
