'use client'

import { useState, useEffect } from 'react'
import { EventCard, EventCardSkeleton } from '@/components/common/EventCard'
import { SearchBox, SearchResults } from '@/components/common/SearchBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/ui/badge'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, past

  const fetchEvents = async (pageNum = 1, searchQuery = '', eventFilter = 'all') => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12'
      })
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      
      if (eventFilter === 'upcoming') {
        params.append('upcoming', 'true')
      }
      
      const response = await fetch(`/api/events?${params}`)
      const data = await response.json()
      
      if (data.success) {
        if (pageNum === 1) {
          setEvents(data.data)
        } else {
          setEvents(prev => [...prev, ...data.data])
        }
        setHasMore(data.pagination.page < data.pagination.totalPages)
        setSearchResults(null)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to fetch events')
      console.error('Error fetching events:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query, type) => {
    if (!query.trim()) {
      setSearchResults(null)
      fetchEvents(1, '', filter)
      return
    }

    try {
      setIsSearching(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.data)
        setEvents([])
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Search failed')
      console.error('Error searching:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setPage(1)
    fetchEvents(1, '', newFilter)
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchEvents(nextPage, '', filter)
    }
  }

  const handleResultClick = (result) => {
    window.location.href = `/events/${result.id}`
  }

  useEffect(() => {
    fetchEvents(1, '', filter)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unable to load events
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => {
                  setError(null)
                  fetchEvents(1, '', filter)
                }}
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Events & Tournaments</h1>
          <p className="text-xl text-primary-gold">
            Discover upcoming tournaments and past events
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search events..."
            showFilters={true}
            className="max-w-2xl mx-auto"
          />
          
          {/* Filter Buttons */}
          <div className="flex justify-center space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('all')}
              className={filter === 'all' ? 'bg-primary-blue text-white' : ''}
            >
              All Events
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('upcoming')}
              className={filter === 'upcoming' ? 'bg-primary-blue text-white' : ''}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('past')}
              className={filter === 'past' ? 'bg-primary-blue text-white' : ''}
            >
              Past Events
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults !== null && (
          <SearchResults
            results={searchResults}
            isLoading={isSearching}
            query={searchResults.length > 0 ? 'search query' : ''}
            onResultClick={handleResultClick}
          />
        )}

        {/* Events Grid */}
        {searchResults === null && (
          <>
            {isLoading && events.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, index) => (
                  <EventCardSkeleton key={index} />
                ))}
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-600">
                    {filter === 'upcoming' 
                      ? 'No upcoming events scheduled'
                      : filter === 'past'
                      ? 'No past events found'
                      : 'No events available'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event, index) => (
                    <EventCard
                      key={event.id || index}
                      event={event}
                      variant={index === 0 ? 'featured' : 'default'}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={loadMore}
                      disabled={isLoading}
                      variant="outline"
                      className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
                    >
                      {isLoading ? 'Loading...' : 'Load More Events'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
