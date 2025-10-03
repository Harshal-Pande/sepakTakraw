'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/layout/Hero'
import { StatsSection } from '@/components/sections/StatsSection'
import { NewsSection, FeaturedNewsSection } from '@/components/sections/NewsSection'
import { EventsSection, UpcomingEventsSection } from '@/components/sections/EventsSection'
import { QuickLinksSection } from '@/components/sections/QuickLinks'

export default function Home() {
  const [heroImages, setHeroImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero-images')
        const data = await response.json()
        
        if (data.success) {
          setHeroImages(data.data)
        }
      } catch (error) {
        console.error('Error fetching hero images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHeroImages()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero images={heroImages} />

      {/* Stats Section */}
      <StatsSection className="border-t border-gray-200" />

      {/* Featured News Section */}
      <FeaturedNewsSection className="border-t border-gray-200" />

      {/* News Section */}
      <NewsSection 
        title="Latest News" 
        limit={6}
        showViewAll={true}
        className="border-t border-gray-200"
      />

      {/* Upcoming Events Section */}
      <UpcomingEventsSection className="border-t border-gray-200" />

      {/* Events Section */}
      <EventsSection 
        title="Recent Events" 
        limit={6}
        showViewAll={true}
        className="border-t border-gray-200"
      />

      {/* Quick Links Section */}
      <QuickLinksSection 
        title="Quick Access"
        showAll={true}
        className="border-t border-gray-200"
      />
    </div>
  )
}
