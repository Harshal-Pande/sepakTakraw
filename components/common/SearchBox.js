'use client'

import { useState, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SearchBox({ 
  placeholder = "Search...", 
  onSearch, 
  suggestions = [], 
  showSuggestions = true,
  className = "" 
}) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestionsList, setShowSuggestionsList] = useState(false)

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      await onSearch(searchQuery)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    setShowSuggestionsList(false)
    handleSearch(suggestion)
  }

  const clearSearch = () => {
    setQuery('')
    setShowSuggestionsList(false)
    onSearch('')
  }

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestionsList(e.target.value.length > 0)
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestionsList(query.length > 0)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="h-8"
          >
            {isSearching ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Search className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {showSuggestions && showSuggestionsList && filteredSuggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            <div className="space-y-1">
              {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function SearchFilters({ filters, activeFilters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <Badge
          key={filter.value}
          variant={activeFilters.includes(filter.value) ? "default" : "outline"}
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </Badge>
      ))}
    </div>
  )
}

export function SearchResults({ results, isLoading, onResultClick }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Searching...</span>
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No results found</p>
        <p className="text-sm text-gray-500">Try adjusting your search terms</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card 
          key={index} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onResultClick(result)}
        >
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{result.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{result.category}</span>
              <span className="text-xs text-gray-500">{result.date}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}