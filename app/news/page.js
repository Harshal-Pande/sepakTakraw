'use client'

import { useState, useEffect } from 'react'
import { NewsCard, NewsCardSkeleton } from '@/components/common/NewsCard'
import { SearchBox, SearchResults } from '@/components/common/SearchBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/common/Card'

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchNews = async (pageNum = 1, searchQuery = '') => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12'
      })
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      
      const response = await fetch(`/api/news?${params}`)
      const data = await response.json()
      
      if (data.success) {
        if (pageNum === 1) {
          setNews(data.data)
        } else {
          setNews(prev => [...prev, ...data.data])
        }
        setHasMore(data.pagination.page < data.pagination.totalPages)
        setSearchResults(null)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to fetch news')
      console.error('Error fetching news:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query, type) => {
    if (!query.trim()) {
      setSearchResults(null)
      fetchNews(1)
      return
    }

    try {
      setIsSearching(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.data)
        setNews([])
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

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchNews(nextPage)
    }
  }

  const handleResultClick = (result) => {
    // Navigate to the specific news item
    window.location.href = `/news/${result.id}`
  }

  useEffect(() => {
    fetchNews(1)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unable to load news
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => {
                  setError(null)
                  fetchNews(1)
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
          <h1 className="text-4xl font-bold mb-4">News & Updates</h1>
          <p className="text-xl text-primary-gold">
            Stay informed with the latest news and announcements
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search news..."
            showFilters={true}
            className="max-w-2xl mx-auto"
          />
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

        {/* News Grid */}
        {searchResults === null && (
          <>
            {isLoading && news.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, index) => (
                  <NewsCardSkeleton key={index} />
                ))}
              </div>
            ) : news.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No news available
                  </h3>
                  <p className="text-gray-600">
                    Check back later for the latest updates
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item, index) => (
                    <NewsCard
                      key={item.id || index}
                      news={item}
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
                      {isLoading ? 'Loading...' : 'Load More News'}
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
