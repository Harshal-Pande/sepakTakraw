'use client'

import { Trophy, Users, Calendar, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'

const stats = [
  {
    icon: Trophy,
    value: '150+',
    label: 'Tournaments Won',
    color: 'text-primary-gold',
    bgColor: 'bg-primary-gold/10'
  },
  {
    icon: Users,
    value: '500+',
    label: 'Active Players',
    color: 'text-primary-blue',
    bgColor: 'bg-primary-blue/10'
  },
  {
    icon: Calendar,
    value: '25+',
    label: 'Events This Year',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: Award,
    value: '50+',
    label: 'Medals Won',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
]

export function StatsSection({ className = '' }) {
  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Achievements
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Celebrating excellence and dedication in Sepaktakraw sports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card 
                key={index} 
                className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                variant="elevated"
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function StatsSectionSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
