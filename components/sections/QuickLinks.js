'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Newspaper, 
  Trophy, 
  Calendar, 
  Users, 
  FileText, 
  Shield, 
  AlertTriangle, 
  Info, 
  Vote, 
  History, 
  Phone,
  BookOpen
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Icon mapping for dynamic icons
const iconMap = {
  'Newspaper': Newspaper,
  'Trophy': Trophy,
  'Calendar': Calendar,
  'Users': Users,
  'FileText': FileText,
  'Shield': Shield,
  'AlertTriangle': AlertTriangle,
  'Info': Info,
  'Vote': Vote,
  'History': History,
  'Phone': Phone,
  'BookOpen': BookOpen,
}

export function QuickLinksSection({ 
  title = "Quick Links",
  showAll = true,
  limit = 12,
  className = ""
}) {
  const [quickLinks, setQuickLinks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQuickLinks = async () => {
      try {
        const response = await fetch('/api/quick-links')
        const data = await response.json()
        
        if (data.success) {
          setQuickLinks(data.data)
        } else {
          setError(data.error)
        }
      } catch (err) {
        setError('Failed to fetch quick links')
        console.error('Error fetching quick links:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuickLinks()
  }, [])

  if (isLoading) {
    return <QuickLinksSkeleton className={className} />
  }

  if (error) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load quick links</p>
          </div>
        </div>
      </section>
    )
  }

  const displayLinks = showAll ? quickLinks : quickLinks.slice(0, limit)

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quick access to important information and resources
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayLinks.map((link, index) => {
            const Icon = iconMap[link.icon] || Newspaper // Fallback to Newspaper if icon not found
            return (
              <Card
                key={link.id || index}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
                variant="elevated"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${link.bg_color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${link.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-blue transition-colors duration-200">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {link.description}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
                  >
                    <Link href={link.href}>
                      Visit Page
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function QuickLinksCompact({ 
  title = "Quick Access",
  className = ""
}) {
  const [quickLinks, setQuickLinks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuickLinks = async () => {
      try {
        const response = await fetch('/api/quick-links')
        const data = await response.json()
        
        if (data.success) {
          setQuickLinks(data.data)
        }
      } catch (err) {
        console.error('Error fetching quick links:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuickLinks()
  }, [])

  if (isLoading) {
    return (
      <Card className={`${className}`} variant="elevated">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className}`} variant="elevated">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.slice(0, 8).map((link, index) => {
            const Icon = iconMap[link.icon] || Newspaper
            return (
              <Button
                key={link.id || index}
                asChild
                variant="ghost"
                className="justify-start h-auto p-3 text-left hover:bg-gray-100"
              >
                <Link href={link.href} className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${link.color}`} />
                  <span className="text-sm font-medium">{link.title}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function QuickLinksSkeleton({ className = "" }) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
