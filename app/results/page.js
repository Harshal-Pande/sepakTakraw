'use client'

import { useState, useEffect } from 'react'
import { DocumentViewer } from '@/components/common/DocumentViewer'
import { SearchBox, SearchResults } from '@/components/common/SearchBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Download } from 'lucide-react'

export default function ResultsPage() {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedYear, setSelectedYear] = useState('')

  const fetchResults = async (pageNum = 1, searchQuery = '', year = '') => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12'
      })
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      
      if (year) {
        params.append('year', year)
      }
      
      const response = await fetch(`/api/results?${params}`)
      const data = await response.json()
      
      if (data.success) {
        if (pageNum === 1) {
          setResults(data.data)
        } else {
          setResults(prev => [...prev, ...data.data])
        }
        setHasMore(data.pagination.page < data.pagination.totalPages)
        setSearchResults(null)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to fetch results')
      console.error('Error fetching results:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query, type) => {
    if (!query.trim()) {
      setSearchResults(null)
      fetchResults(1, '', selectedYear)
      return
    }

    try {
      setIsSearching(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.data)
        setResults([])
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

  const handleYearChange = (year) => {
    setSelectedYear(year)
    setPage(1)
    fetchResults(1, '', year)
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchResults(nextPage, '', selectedYear)
    }
  }

  const handleResultClick = (result) => {
    // For results, we might want to scroll to the specific result
    const element = document.getElementById(`result-${result.id}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCurrentYear = () => new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => getCurrentYear() - i)

  useEffect(() => {
    fetchResults(1, '', selectedYear)
  }, [selectedYear])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unable to load results
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => {
                  setError(null)
                  fetchResults(1, '', selectedYear)
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
          <h1 className="text-4xl font-bold mb-4">Tournament Results</h1>
          <p className="text-xl text-primary-gold">
            View results and standings from past tournaments
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search results..."
            showFilters={true}
            className="max-w-2xl mx-auto"
          />
          
          {/* Year Filter */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant={selectedYear === '' ? 'default' : 'outline'}
                onClick={() => handleYearChange('')}
                className={selectedYear === '' ? 'bg-primary-blue text-white' : ''}
              >
                All Years
              </Button>
              {years.map(year => (
                <Button
                  key={year}
                  variant={selectedYear === year.toString() ? 'default' : 'outline'}
                  onClick={() => handleYearChange(year.toString())}
                  className={selectedYear === year.toString() ? 'bg-primary-blue text-white' : ''}
                >
                  {year}
                </Button>
              ))}
            </div>
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

        {/* Results List */}
        {searchResults === null && (
          <>
            {isLoading && results.length === 0 ? (
              <div className="space-y-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-32 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : results.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600">
                    {selectedYear 
                      ? `No results found for ${selectedYear}`
                      : 'No results available'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <Card key={result.id || index} id={`result-${result.id}`} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl text-primary-blue mb-2">
                              {result.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(result.created_at)}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {result.description}
                            </p>
                          </div>
                          {result.document_url && (
                            <Badge variant="outline" className="ml-4">
                              <FileText className="w-4 h-4 mr-1" />
                              PDF Available
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      {result.document_url && (
                        <CardContent className="pt-0">
                          <DocumentViewer
                            documentUrl={result.document_url}
                            title={result.title}
                            description="Tournament results document"
                            showDownload={true}
                            showExternalLink={true}
                            className="max-w-4xl"
                          />
                        </CardContent>
                      )}
                    </Card>
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
                      {isLoading ? 'Loading...' : 'Load More Results'}
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
