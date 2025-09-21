'use client'

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
import { Card, CardContent } from '@/components/common/Card'
import { Button } from '@/components/ui/button'

const quickLinks = [
  {
    title: 'News & Updates',
    description: 'Latest news and announcements',
    href: '/news',
    icon: Newspaper,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Results',
    description: 'Tournament results and standings',
    href: '/results',
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    title: 'Events',
    description: 'Upcoming tournaments and events',
    href: '/events',
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'General Body',
    description: 'Federation members and officials',
    href: '/general-body',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    title: 'Rules & Regulations',
    description: 'Game rules and regulations',
    href: '/events/rules-regulations',
    icon: BookOpen,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    title: 'MYAS Compliance',
    description: 'Ministry compliance documents',
    href: '/myas-compliance',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    title: 'Anti-DOP Guidelines',
    description: 'Anti-doping guidelines and policies',
    href: '/anti-dop-guidelines',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    title: 'RTI Information',
    description: 'Right to Information details',
    href: '/rti',
    icon: Info,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100'
  },
  {
    title: 'Elections',
    description: 'Election information and results',
    href: '/elections',
    icon: Vote,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    title: 'History',
    description: 'Federation history and milestones',
    href: '/history',
    icon: History,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  {
    title: 'Contact Us',
    description: 'Get in touch with us',
    href: '/contact',
    icon: Phone,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100'
  }
]

export function QuickLinksSection({ 
  title = "Quick Links",
  showAll = true,
  limit = 12,
  className = ""
}) {
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
            const Icon = link.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
                variant="elevated"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${link.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
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
  return (
    <Card className={`${className}`} variant="elevated">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.slice(0, 8).map((link, index) => {
            const Icon = link.icon
            return (
              <Button
                key={index}
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
