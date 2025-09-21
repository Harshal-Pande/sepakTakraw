'use client'

import { useState, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from './Card'
import { Badge } from '@/components/ui/badge'

export function SearchBox({ 
  onSearch, 
  placeholder = "Search...",
  showFilters = true,
  className = ""
}) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, setSearchType] = useState('all')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const searchTypes = [
    { value: 'all', label: 'All' },
    { value: 'news', label: 'News' },
    { value: 'results', label: 'Results' },
    { value: 'events', label: 'Events' },
    { value: 'general-body', label: 'General Body' },
  ]

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      await onSearch(query, searchType)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setShowSuggestions(false)
    onSearch('', searchType)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(value.length > 0)
  }

  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim()) {
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(() => {
      // Here you could implement suggestion fetching
      // For now, we'll just show the suggestions UI
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(query.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {showFilters && (
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          >
            {searchTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        )}

        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="bg-primary-blue hover:bg-primary-blue/90 text-white px-6"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-64 overflow-y-auto">
          <CardContent className="p-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-500 px-2 py-1">
                Recent searches
              </div>
              {/* Here you would map through actual suggestions */}
              <div className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm">
                {query}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function SearchResults({ 
  results, 
  isLoading, 
  query,
  onResultClick 
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search terms or filters
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Search Results for "{query}"
        </h3>
        <Badge variant="outline">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onResultClick && onResultClick(result)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-primary-blue hover:text-primary-gold transition-colors">
                    {result.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {result.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {result.type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(result.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
