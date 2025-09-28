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
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero images={heroImages} />

      {/* Stats Section */}
      <StatsSection />

      {/* Featured News Section */}
      <FeaturedNewsSection />

      {/* News Section */}
      <NewsSection 
        title="Latest News" 
        limit={6}
        showViewAll={true}
      />

      {/* Upcoming Events Section */}
      <UpcomingEventsSection />

      {/* Events Section */}
      <EventsSection 
        title="Recent Events" 
        limit={6}
        showViewAll={true}
      />

      {/* Quick Links Section */}
      <QuickLinksSection 
        title="Quick Access"
        showAll={true}
      />
    </div>
  )
}
