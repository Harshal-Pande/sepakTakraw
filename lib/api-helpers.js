import { createClient } from './supabase'

// Standard API response format
export const createResponse = (data, message = 'Success', pagination = null) => {
  return {
    success: true,
    data,
    message,
    ...(pagination && { pagination })
  }
}

// Error response format
export const createErrorResponse = (error, code = 'UNKNOWN_ERROR', status = 500) => {
  return {
    success: false,
    error: error.message || error,
    code,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  }
}

// Pagination helper
export const getPaginationParams = (searchParams) => {
  const page = parseInt(searchParams.get('page')) || 1
  const limit = Math.min(parseInt(searchParams.get('limit')) || 10, 50)
  const offset = (page - 1) * limit
  
  return { page, limit, offset }
}

// Database query helper with pagination
export const queryWithPagination = async (query, page, limit) => {
  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1)
  
  if (error) throw error
  
  return {
    data,
    count,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  }
}

// File upload helper
export const uploadFile = async (file, bucket, path) => {
  const supabase = createClient()
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)
  
  return publicUrl
}

// File validation helper
export const validateFile = (file, allowedTypes, maxSize) => {
  if (!file) {
    throw new Error('No file provided')
  }
  
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
  }
  
  const fileType = file.type
  if (!allowedTypes.includes(fileType)) {
    throw new Error(`File type ${fileType} not allowed`)
  }
  
  return true
}

// Search helper
export const buildSearchQuery = (query, searchFields, searchTerm) => {
  if (!searchTerm) return query
  
  const searchConditions = searchFields.map(field => 
    `${field}.ilike.%${searchTerm}%`
  ).join(',')
  
  return query.or(searchConditions)
}

// Date formatting helper
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// HTML sanitization helper
export const sanitizeHtml = (html) => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
}

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map()

export const rateLimit = (identifier, limit = 100, windowMs = 15 * 60 * 1000) => {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }
  
  const requests = rateLimitMap.get(identifier)
  const validRequests = requests.filter(time => time > windowStart)
  
  if (validRequests.length >= limit) {
    throw new Error('Rate limit exceeded')
  }
  
  validRequests.push(now)
  rateLimitMap.set(identifier, validRequests)
  
  return true
}

// CORS helper
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle CORS preflight
export const handleCORS = (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }
}

// Database connection helper
export const getSupabaseClient = () => {
  return createClient()
}

// Error logging helper
export const logError = (error, context = '') => {
  console.error(`[${new Date().toISOString()}] ${context}:`, error)
  
  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service like Sentry, LogRocket, etc.
  }
}
