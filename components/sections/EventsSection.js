'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { EventCard, EventCardSkeleton } from '@/components/common/EventCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function EventsSection({ 
  title = "Upcoming Events",
  showViewAll = true,
  limit = 6,
  className = ""
}) {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/events?limit=${limit}`)
        const data = await response.json()
        
        if (data.success) {
          setEvents(data.data)
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

    fetchEvents()
  }, [limit])

  if (error) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Unable to load events
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600">
              Don't miss out on exciting tournaments and events
            </p>
          </div>
          
          {showViewAll && (
            <Button
              asChild
              variant="outline"
              className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
            >
              <Link href="/events">
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events scheduled
            </h3>
            <p className="text-gray-600">
              Check back later for upcoming events
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard
                key={event.id || index}
                event={event}
                variant={index === 0 ? 'featured' : 'default'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export function UpcomingEventsSection({ className = "" }) {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/events?upcoming=true&limit=3')
        const data = await response.json()
        
        if (data.success) {
          setUpcomingEvents(data.data)
        }
      } catch (err) {
        console.error('Error fetching upcoming events:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUpcomingEvents()
  }, [])

  if (isLoading) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (upcomingEvents.length === 0) {
    return null
  }

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Upcoming Events
        </h2>
        
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div
              key={event.id || index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.event_date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(event.event_date).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary-gold text-primary-blue">
                    Upcoming
                  </Badge>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
                  >
                    <Link href={`/events/${event.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            asChild
            variant="outline"
            className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
          >
            <Link href="/events">
              View All Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
