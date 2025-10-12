'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function EventDetailPage() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/events/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Event not found')
        }
        
        const data = await response.json()
        setEvent(data.data)
      } catch (err) {
        console.error('Error fetching event:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="py-8 min-h-screen bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="animate-pulse">
            <div className="mb-4 w-1/4 h-8 bg-gray-200 rounded"></div>
            <div className="mb-4 h-64 bg-gray-200 rounded"></div>
            <div className="mb-2 w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8 min-h-screen bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Event Not Found</h1>
            <p className="mb-6 text-gray-600">{error}</p>
            <Link href="/events">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="py-8 min-h-screen bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Event Not Found</h1>
            <Link href="/events">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isUpcoming = (date) => {
    return new Date(date) > new Date()
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  return (
    <div className="py-8 min-h-screen bg-gray-50">
      <div className="container px-4 mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/events">
            <Button variant="outline">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Events
            </Button>
          </Link>
        </div>

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex gap-2 items-center mb-4">
            <Badge 
              variant={isUpcoming(event.event_date) ? "default" : "secondary"}
              className={isUpcoming(event.event_date) 
                ? "bg-primary-gold text-primary-blue" 
                : "bg-gray-200 text-gray-700"
              }
            >
              {isUpcoming(event.event_date) ? "Upcoming" : "Past Event"}
            </Badge>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {event.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
            <div className="flex gap-2 items-center">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="flex gap-2 items-center">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            {event.photos && event.photos.length > 0 && (
              <div className="mb-8">
                <div className="overflow-hidden relative w-full h-96 rounded-lg">
                  <Image
                    src={event.photos[0]}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    className="object-cover"
                    onError={(e) => {
                      console.error('Image load error:', e.target.src);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Event Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle >Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-none prose">
                  <p className="leading-relaxed text-gray-700">
                    {event.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Photos */}
            {event.photos && event.photos.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {event.photos.slice(1).map((photo, index) => (
                      <div key={index} className="overflow-hidden relative w-full h-32 rounded-lg">
                        <Image
                          src={photo}
                          alt={`${event.title} - Photo ${index + 2}`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover"
                          onError={(e) => {
                            console.error('Image load error:', e.target.src);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="text-black lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-blue">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 items-center">
                  <Calendar className="w-5 h-5 text-primary-blue" />
                  <div>
                    <p className="font-medium text-primary-blue">Date</p>
                    <p className="text-gray-600">{formatDate(event.event_date)}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center">
                  <MapPin className="w-5 h-5 text-primary-blue" />
                  <div>
                    <p className="font-medium text-primary-blue">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-center">
                  <Clock className="w-5 h-5 text-primary-blue" />
                  <div>
                    <p className="font-medium text-primary-blue">Status</p>
                    <p className="text-gray-600">
                      {isUpcoming(event.event_date) ? "Upcoming" : "Past Event"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
