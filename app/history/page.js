'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Trophy, Users, Target } from 'lucide-react'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history')
        const data = await response.json()
        
        if (data.success) {
          setHistory(data.data)
        } else {
          setError(data.error)
        }
      } catch (err) {
        setError('Failed to fetch history')
        console.error('Error fetching history:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unable to load history
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-blue text-white rounded hover:bg-primary-blue/90"
              >
                Try Again
              </button>
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
          <h1 className="text-4xl font-bold mb-4">Our History</h1>
          <p className="text-xl text-primary-gold">
            Journey of the Sepaktakraw Sports Federation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="space-y-8">
            {/* Default History Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary-blue" />
                  <CardTitle className="text-xl">2020 - Federation Founded</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  The Sepaktakraw Sports Federation was officially established with the vision 
                  to promote and develop Sepaktakraw sports across the nation. Our mission is 
                  to foster excellence, sportsmanship, and unity through this beautiful sport.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary-gold" />
                  <CardTitle className="text-xl">2021 - First National Championship</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  We successfully organized our first National Sepaktakraw Championship, 
                  bringing together teams from across the country. This marked a significant 
                  milestone in our journey to establish Sepaktakraw as a premier sport in India.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary-blue" />
                  <CardTitle className="text-xl">2022 - Membership Growth</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Our federation grew to include over 500 active members across 25 states. 
                  We established district-level committees and began grassroots development 
                  programs to identify and nurture young talent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary-gold" />
                  <CardTitle className="text-xl">2023 - International Recognition</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Our players represented India in international competitions, bringing home 
                  medals and recognition. We also hosted our first international tournament, 
                  welcoming teams from Southeast Asia and beyond.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary-blue" />
                  <CardTitle className="text-xl">2024 - Continued Excellence</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Today, we continue to build on our foundation of excellence, organizing 
                  regular tournaments, training camps, and development programs. Our vision 
                  remains clear: to make Sepaktakraw a household name in Indian sports.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {history.map((item, index) => (
              <Card key={item.id || index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-primary-blue" />
                      <CardTitle className="text-xl">
                        {item.timeline_year ? `${item.timeline_year}` : 'Milestone'}
                      </CardTitle>
                    </div>
                    {item.timeline_year && (
                      <Badge variant="outline" className="text-primary-blue border-primary-blue">
                        {item.timeline_year}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-primary-blue text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Be Part of Our Story</h2>
              <p className="text-lg mb-6 text-primary-gold">
                Join us in promoting Sepaktakraw and creating new chapters in our history
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/events"
                  className="px-6 py-3 bg-primary-gold text-primary-blue rounded-lg font-semibold hover:bg-primary-gold/90 transition-colors"
                >
                  View Upcoming Events
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-blue transition-colors"
                >
                  Get in Touch
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
