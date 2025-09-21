'use client'

import { useState, useEffect } from 'react'
import { SearchBox, SearchResults } from '@/components/common/SearchBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin, Phone, Mail, Crown, User } from 'lucide-react'

export default function GeneralBodyPage() {
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [districts, setDistricts] = useState([])
  const [positions, setPositions] = useState([])

  const fetchMembers = async (pageNum = 1, searchQuery = '', district = '', position = '') => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20'
      })
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      
      if (district) {
        params.append('district', district)
      }
      
      if (position) {
        params.append('position', position)
      }
      
      const response = await fetch(`/api/general-body?${params}`)
      const data = await response.json()
      
      if (data.success) {
        if (pageNum === 1) {
          setMembers(data.data)
        } else {
          setMembers(prev => [...prev, ...data.data])
        }
        setHasMore(data.pagination.page < data.pagination.totalPages)
        setSearchResults(null)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to fetch members')
      console.error('Error fetching members:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/general-body')
      const data = await response.json()
      
      if (data.success) {
        const uniqueDistricts = [...new Set(data.data.map(member => member.district))].sort()
        const uniquePositions = [...new Set(data.data.map(member => member.position))].sort()
        setDistricts(uniqueDistricts)
        setPositions(uniquePositions)
      }
    } catch (err) {
      console.error('Error fetching filters:', err)
    }
  }

  const handleSearch = async (query, type) => {
    if (!query.trim()) {
      setSearchResults(null)
      fetchMembers(1, '', selectedDistrict, selectedPosition)
      return
    }

    try {
      setIsSearching(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.data)
        setMembers([])
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

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district)
    setPage(1)
    fetchMembers(1, '', district, selectedPosition)
  }

  const handlePositionChange = (position) => {
    setSelectedPosition(position)
    setPage(1)
    fetchMembers(1, '', selectedDistrict, position)
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchMembers(nextPage, '', selectedDistrict, selectedPosition)
    }
  }

  const handleResultClick = (result) => {
    // For general body members, we might want to scroll to the specific member
    const element = document.getElementById(`member-${result.id}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getPositionIcon = (position) => {
    const lowerPosition = position.toLowerCase()
    if (lowerPosition.includes('president') || lowerPosition.includes('chairman')) {
      return <Crown className="w-5 h-5 text-yellow-600" />
    }
    return <User className="w-5 h-5 text-blue-600" />
  }

  const getPositionColor = (position) => {
    const lowerPosition = position.toLowerCase()
    if (lowerPosition.includes('president') || lowerPosition.includes('chairman')) {
      return 'bg-yellow-100 text-yellow-800'
    }
    if (lowerPosition.includes('secretary') || lowerPosition.includes('treasurer')) {
      return 'bg-blue-100 text-blue-800'
    }
    if (lowerPosition.includes('vice') || lowerPosition.includes('deputy')) {
      return 'bg-green-100 text-green-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  useEffect(() => {
    fetchMembers(1, '', selectedDistrict, selectedPosition)
    fetchFilters()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unable to load members
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => {
                  setError(null)
                  fetchMembers(1, '', selectedDistrict, selectedPosition)
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
          <h1 className="text-4xl font-bold mb-4">General Body</h1>
          <p className="text-xl text-primary-gold">
            Meet our federation members and officials
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search members..."
            showFilters={true}
            className="max-w-2xl mx-auto"
          />
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedDistrict === '' ? 'default' : 'outline'}
              onClick={() => handleDistrictChange('')}
              className={selectedDistrict === '' ? 'bg-primary-blue text-white' : ''}
            >
              All Districts
            </Button>
            {districts.map(district => (
              <Button
                key={district}
                variant={selectedDistrict === district ? 'default' : 'outline'}
                onClick={() => handleDistrictChange(district)}
                className={selectedDistrict === district ? 'bg-primary-blue text-white' : ''}
              >
                {district}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedPosition === '' ? 'default' : 'outline'}
              onClick={() => handlePositionChange('')}
              className={selectedPosition === '' ? 'bg-primary-blue text-white' : ''}
            >
              All Positions
            </Button>
            {positions.map(position => (
              <Button
                key={position}
                variant={selectedPosition === position ? 'default' : 'outline'}
                onClick={() => handlePositionChange(position)}
                className={selectedPosition === position ? 'bg-primary-blue text-white' : ''}
              >
                {position}
              </Button>
            ))}
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

        {/* Members Grid */}
        {searchResults === null && (
          <>
            {isLoading && members.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : members.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No members found
                  </h3>
                  <p className="text-gray-600">
                    {selectedDistrict || selectedPosition 
                      ? 'No members found with the selected filters'
                      : 'No members available'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member, index) => (
                    <Card key={member.id || index} id={`member-${member.id}`} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {getPositionIcon(member.position)}
                            <CardTitle className="text-lg text-primary-blue">
                              {member.name}
                            </CardTitle>
                          </div>
                          <Badge className={getPositionColor(member.position)}>
                            {member.position}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{member.district}</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{member.contact}</span>
                          </div>
                          
                          {member.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <a 
                                href={`mailto:${member.email}`}
                                className="text-primary-blue hover:text-primary-gold transition-colors"
                              >
                                {member.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
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
                      {isLoading ? 'Loading...' : 'Load More Members'}
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
