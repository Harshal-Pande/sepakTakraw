'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Newspaper } from 'lucide-react'
import { NewsCard, NewsCardSkeleton } from '@/components/common/NewsCard'
import { Button } from '@/components/ui/button'

export function NewsSection({ 
  title = "Latest News",
  showViewAll = true,
  limit = 6,
  className = ""
}) {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/news?limit=${limit}`)
        const data = await response.json()
        
        if (data.success) {
          setNews(data.data)
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

    fetchNews()
  }, [limit])

  if (error) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Unable to load news
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
              Stay updated with the latest news and announcements
            </p>
          </div>
          
          {showViewAll && (
            <Button
              asChild
              variant="outline"
              className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
            >
              <Link href="/news">
                View All News
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No news available
            </h3>
            <p className="text-gray-600">
              Check back later for the latest updates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <NewsCard
                key={item.id || index}
                news={item}
                variant={index === 0 ? 'featured' : 'default'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export function FeaturedNewsSection({ className = "" }) {
  const [featuredNews, setFeaturedNews] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/news?limit=1')
        const data = await response.json()
        
        if (data.success && data.data.length > 0) {
          setFeaturedNews(data.data[0])
        }
      } catch (err) {
        console.error('Error fetching featured news:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedNews()
  }, [])

  if (isLoading) {
    return (
      <section className={`py-16 bg-primary-blue text-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-96 mb-6"></div>
            <div className="h-32 bg-white/20 rounded"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!featuredNews) {
    return null
  }

  return (
    <section className={`py-16 bg-primary-blue text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">
            Featured News
          </h2>
          <p className="text-xl text-primary-gold mb-6">
            {featuredNews.title}
          </p>
          <p className="text-gray-200 mb-8 leading-relaxed">
            {featuredNews.description}
          </p>
          <Button
            asChild
            className="bg-primary-gold text-primary-blue hover:bg-primary-gold/90"
          >
            <Link href={`/news/${featuredNews.id}`}>
              Read Full Story
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
