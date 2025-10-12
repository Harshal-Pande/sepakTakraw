import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, validateFile } from '@/lib/api-helpers'

export async function POST(request) {
  try {
    console.log("=== IMAGE UPLOAD API CALLED ===");
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'images'
    
    console.log("File info:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      folder
    });
    
    if (!file) {
      console.log("No file provided");
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
    console.log("Attempting to upload to Supabase...");
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }

      console.log("Upload successful, getting public URL...");
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path)

      console.log("Public URL generated:", publicUrl);

      return Response.json(
        createResponse({
          url: publicUrl,
          path: data.path,
          name: file.name,
          size: file.size,
          type: file.type
        }, 'Image uploaded successfully')
      )
    } catch (supabaseError) {
      console.error("Supabase error:", supabaseError);
      
      // Fallback: Return a mock URL for development
      if (process.env.NODE_ENV === 'development') {
        console.log("Using fallback URL for development");
        const fallbackUrl = `https://via.placeholder.com/800x400/cccccc/666666?text=${encodeURIComponent(file.name)}`;
        
        return Response.json(
          createResponse({
            url: fallbackUrl,
            path: `fallback/${fileName}`,
            name: file.name,
            size: file.size,
            type: file.type
          }, 'Image uploaded successfully (fallback)')
        )
      }
      
      throw supabaseError;
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return Response.json(
      createErrorResponse(error, 'IMAGE_UPLOAD_ERROR'),
      { status: 500 }
    )
  }
}
