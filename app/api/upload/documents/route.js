import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, uploadFile, validateFile } from '@/lib/api-helpers'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'documents'
    
    if (!file) {
      return Response.json(
        createErrorResponse('No file provided', 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }

    // Validate file
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    
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
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path)

    return Response.json(
      createResponse({
        url: publicUrl,
        path: data.path,
        name: file.name,
        size: file.size,
        type: file.type
      }, 'File uploaded successfully')
    )
  } catch (error) {
    console.error('Error uploading file:', error)
    return Response.json(
      createErrorResponse(error, 'FILE_UPLOAD_ERROR'),
      { status: 500 }
    )
  }
}
