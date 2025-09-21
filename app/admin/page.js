'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/layout/AdminLayout'
import { StatsCard } from '@/components/admin/dashboard/StatsCard'
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity'
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Button } from '@/components/ui/button'
import { 
  Newspaper, 
  Calendar, 
  Trophy, 
  Users, 
  Plus,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        const data = await response.json()

        if (data.success) {
          setDashboardData(data.data)
        } else {
          setError(data.error || 'Failed to load dashboard data')
        }
      } catch (error) {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </AdminLayout>
    )
  }

  const { stats, recentActivity, recentContent, quickMetrics } = dashboardData || {}

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to the admin panel</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/news/create">
                <Plus className="w-4 h-4 mr-2" />
                Add News
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/events/create">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickMetrics?.map((metric, index) => (
            <StatsCard
              key={index}
              title={metric.label}
              value={metric.value}
              change={metric.change}
              icon={metric.icon === 'newspaper' ? Newspaper : 
                    metric.icon === 'calendar' ? Calendar :
                    metric.icon === 'trophy' ? Trophy :
                    metric.icon === 'users' ? Users : null}
            />
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <RecentActivity activities={recentActivity} />

          {/* Quick Actions */}
          <AdminCard title="Quick Actions">
            <div className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/admin/news/create">
                  <Newspaper className="w-4 h-4 mr-2" />
                  Create News Article
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/admin/events/create">
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Event
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/admin/results/create">
                  <Trophy className="w-4 h-4 mr-2" />
                  Add Match Result
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/admin/general-body/create">
                  <Users className="w-4 h-4 mr-2" />
                  Add General Body Member
                </Link>
              </Button>
            </div>
          </AdminCard>
        </div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent News */}
          <AdminCard title="Recent News">
            <div className="space-y-3">
              {recentContent?.news?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/news/edit/${item.id}`}>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              {(!recentContent?.news || recentContent.news.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">No recent news</p>
              )}
            </div>
          </AdminCard>

          {/* Recent Events */}
          <AdminCard title="Recent Events">
            <div className="space-y-3">
              {recentContent?.events?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.event_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/events/edit/${item.id}`}>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              {(!recentContent?.events || recentContent.events.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">No recent events</p>
              )}
            </div>
          </AdminCard>

          {/* Recent Results */}
          <AdminCard title="Recent Results">
            <div className="space-y-3">
              {recentContent?.results?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/results/edit/${item.id}`}>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              {(!recentContent?.results || recentContent.results.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">No recent results</p>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  )
}
