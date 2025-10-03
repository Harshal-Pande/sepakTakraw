'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function NewsCard({ 
  news, 
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

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getDescription = () => {
    if (!showDescription) return ''
    if (isExpanded || news.description.length <= maxDescriptionLength) {
      return news.description
    }
    return truncateText(news.description, maxDescriptionLength)
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
            src={news.featured_image || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop'}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-primary-gold text-primary-blue">
              News
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(news.created_at)}</span>
        </div>
        
        <CardTitle className="text-lg font-semibold text-primary-blue hover:text-primary-gold transition-colors duration-200">
          <Link href={`/news/${news.id}`}>
            {news.title}
          </Link>
        </CardTitle>

        {showDescription && (
          <CardDescription className="text-gray-600 leading-relaxed">
            {getDescription()}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {news.document_url && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
              >
                <Link href={news.document_url} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2" />
                  View Document
                </Link>
              </Button>
            )}
          </div>

          {showDescription && news.description.length > maxDescriptionLength && (
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
            <Link href={`/news/${news.id}`}>
              Read Full Story
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function NewsCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
      <CardHeader>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="space-y-2">
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
