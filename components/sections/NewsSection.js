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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <Newspaper className="mx-auto mb-4 w-12 h-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Unable to load news
            </h3>
            <p className="mb-4 text-gray-600">{error}</p>
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
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
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
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(limit)].map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="py-12 text-center">
            <Newspaper className="mx-auto mb-4 w-12 h-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No news available
            </h3>
            <p className="text-gray-600">
              Check back later for the latest updates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      <section className={`py-16 text-white bg-primary-blue ${className}`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-4 w-64 h-8 rounded bg-white/20"></div>
            <div className="mb-6 w-96 h-4 rounded bg-white/20"></div>
            <div className="h-32 rounded bg-white/20"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!featuredNews) {
    return null
  }

  return (
    <section className={`py-16 text-white bg-primary-blue ${className}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold">
            Latest Updates
          </h2>
          <p className="mb-6 text-xl text-primary-gold">
            {featuredNews.title}
          </p>
          <p className="mb-8 leading-relaxed text-gray-200">
            {featuredNews.description}
          </p>
          <Button
            asChild
            className="bg-primary-gold text-primary-blue hover:bg-primary-gold/90"
          >
            <Link href={`/news/${featuredNews.id}`}>
              Read Full Story
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
