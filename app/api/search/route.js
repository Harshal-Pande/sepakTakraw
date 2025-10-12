import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse, getPaginationParams } from '@/lib/api-helpers'
import { validateSearch } from '@/lib/validations'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)
    const searchQuery = searchParams.get('q')
    const type = searchParams.get('type') || 'all'
    
    // Validate search parameters
    const validatedParams = validateSearch.parse({
      q: searchQuery,
      type,
      page,
      limit
    })
    
    if (!validatedParams.q) {
      return Response.json(
        createErrorResponse('Search query is required', 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    const results = []
    
    // Search across different tables based on type
    const searchPromises = []
    
    if (type === 'all' || type === 'news') {
      searchPromises.push(
        supabase
          .from('news')
          .select('id, title, description, created_at')
          .or(`title.ilike.%${validatedParams.q}%,description.ilike.%${validatedParams.q}%`)
          .limit(validatedParams.limit)
          .then(result => ({
            ...result,
            data: result.data?.map(item => ({ ...item, type: 'news' })) || []
          }))
      )
    }
    
    if (type === 'all' || type === 'results') {
      searchPromises.push(
        supabase
          .from('results')
          .select('id, title, description, created_at')
          .or(`title.ilike.%${validatedParams.q}%,description.ilike.%${validatedParams.q}%`)
          .limit(validatedParams.limit)
          .then(result => ({
            ...result,
            data: result.data?.map(item => ({ ...item, type: 'results' })) || []
          }))
      )
    }
    
    if (type === 'all' || type === 'events') {
      searchPromises.push(
        supabase
          .from('events')
          .select('id, title, description, event_date as created_at')
          .or(`title.ilike.%${validatedParams.q}%,description.ilike.%${validatedParams.q}%,location.ilike.%${validatedParams.q}%`)
          .limit(validatedParams.limit)
          .then(result => ({
            ...result,
            data: result.data?.map(item => ({ ...item, type: 'events' })) || []
          }))
      )
    }
    
    if (type === 'all' || type === 'general-body') {
      searchPromises.push(
        supabase
          .from('general_body')
          .select('id, name as title, district as description, created_at')
          .or(`name.ilike.%${validatedParams.q}%,district.ilike.%${validatedParams.q}%,position.ilike.%${validatedParams.q}%`)
          .limit(validatedParams.limit)
          .then(result => ({
            ...result,
            data: result.data?.map(item => ({ ...item, type: 'general-body' })) || []
          }))
      )
    }
    
    // Execute all search queries
    const searchResults = await Promise.all(searchPromises)
    
    // Combine results
    searchResults.forEach(result => {
      if (result.data) {
        results.push(...result.data)
      }
    })
    
    // Sort by created_at and apply pagination
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
    const startIndex = (validatedParams.page - 1) * validatedParams.limit
    const endIndex = startIndex + validatedParams.limit
    const paginatedResults = results.slice(startIndex, endIndex)
    
    const pagination = {
      page: validatedParams.page,
      limit: validatedParams.limit,
      total: results.length,
      totalPages: Math.ceil(results.length / validatedParams.limit)
    }
    
    return Response.json(
      createResponse(paginatedResults, 'Search completed successfully', pagination)
    )
  } catch (error) {
    console.error('Error performing search:', error)
    
    if (error.name === 'ZodError') {
      return Response.json(
        createErrorResponse('Validation error: ' + (error.errors ? error.errors.map(e => e.message).join(', ') : error.message), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    return Response.json(
      createErrorResponse(error, 'SEARCH_ERROR'),
      { status: 500 }
    )
  }
}
