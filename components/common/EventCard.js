'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function EventCard({ 
  event, 
  variant = 'default',
  showImage = true,
  showDescription = true,
  maxDescriptionLength = 150 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date()
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getDescription = () => {
    if (!showDescription) return ''
    if (isExpanded || event.description.length <= maxDescriptionLength) {
      return event.description
    }
    return truncateText(event.description, maxDescriptionLength)
  }

  const variants = {
    default: 'hover:shadow-lg transition-all duration-200',
    featured: 'border-2 border-primary-gold shadow-xl',
    compact: 'h-full',
  }

  return (
    <Card className={`${variants[variant]} h-full flex flex-col`}>
      {/* Image */}
      {showImage && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={(event.photos && event.photos.length > 0 && !String(event.photos[0]).includes('via.placeholder.com'))
              ? event.photos[0]
              : 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop'}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <Badge 
              variant={isUpcoming(event.event_date) ? "default" : "secondary"}
              className={isUpcoming(event.event_date) 
                ? "bg-primary-gold text-primary-blue" 
                : "bg-gray-500 text-white"
              }
            >
              {isUpcoming(event.event_date) ? 'Upcoming' : 'Past Event'}
            </Badge>
          </div>
          {event.photos && event.photos.length > 1 && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-black/50 text-white border-white">
                +{event.photos.length - 1} more
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="flex-1">
        <CardTitle className="text-lg font-semibold text-primary-blue hover:text-primary-gold transition-colors duration-200">
          <Link href={`/events/${event.id}`}>
            {event.title}
          </Link>
        </CardTitle>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.event_date)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(event.event_date)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>

        {showDescription && (
          <CardDescription className="text-gray-600 leading-relaxed mt-3">
            {getDescription()}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {event.photos && event.photos.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
              >
                <Link href={`/events/${event.id}`}>
                  View Gallery
                </Link>
              </Button>
            )}
          </div>

          {showDescription && event.description.length > maxDescriptionLength && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary-blue hover:text-primary-gold"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show More
                </>
              )}
            </Button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
          >
            <Link href={`/events/${event.id}`}>
              View Event Details
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function EventCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="space-y-2 mt-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  )
}
