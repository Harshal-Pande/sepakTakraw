// Simple in-memory cache for API responses
class Cache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map()
    this.ttl = ttl
  }

  set(key, value, customTtl = null) {
    const expiry = Date.now() + (customTtl || this.ttl)
    this.cache.set(key, { value, expiry })
  }

  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  has(key) {
    return this.get(key) !== null
  }

  delete(key) {
    return this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

// Create cache instances for different data types
export const newsCache = new Cache(10 * 60 * 1000) // 10 minutes
export const eventsCache = new Cache(15 * 60 * 1000) // 15 minutes
export const statsCache = new Cache(30 * 60 * 1000) // 30 minutes
export const generalCache = new Cache(60 * 60 * 1000) // 1 hour

// Cache key generators
export const generateCacheKey = (endpoint, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key]
      return result
    }, {})
  
  return `${endpoint}:${JSON.stringify(sortedParams)}`
}

// Cache middleware for API routes
export const withCache = (handler, cache, ttl = null) => {
  return async (req, res) => {
    const url = new URL(req.url)
    const cacheKey = generateCacheKey(url.pathname, Object.fromEntries(url.searchParams))
    
    // Try to get from cache first
    const cached = cache.get(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    // Execute handler and cache result
    const result = await handler(req, res)
    
    if (result && !res.headersSent) {
      cache.set(cacheKey, result, ttl)
    }
    
    return result
  }
}

// Cache invalidation helpers
export const invalidateCache = (pattern) => {
  const caches = [newsCache, eventsCache, statsCache, generalCache]
  
  caches.forEach(cache => {
    for (const [key] of cache.cache) {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    }
  })
}

// Cache statistics
export const getCacheStats = () => {
  return {
    news: newsCache.size(),
    events: eventsCache.size(),
    stats: statsCache.size(),
    general: generalCache.size(),
    total: newsCache.size() + eventsCache.size() + statsCache.size() + generalCache.size()
  }
}
