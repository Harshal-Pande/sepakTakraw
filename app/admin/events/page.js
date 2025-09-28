'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/events?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setEvents(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    window.open(`/events/${item.id}`, '_blank')
  }

  const getEventStatus = (eventDate) => {
    const today = new Date()
    const event = new Date(eventDate)
    const diffTime = event - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { label: 'Past', variant: 'secondary' }
    if (diffDays <= 7) return { label: 'Upcoming', variant: 'default' }
    return { label: 'Scheduled', variant: 'outline' }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (item) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{item.title}</p>
          {item.photos && item.photos.length > 0 && (
            <Badge variant="outline" className="mt-1 text-xs">
              {item.photos.length} Photos
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (item) => (
        <p className="text-sm text-gray-600 max-w-xs truncate">
          {item.description}
        </p>
      )
    },
    {
      key: 'event_date',
      label: 'Date',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(item.event_date), 'MMM dd, yyyy')}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate max-w-32">{item.location}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const status = getEventStatus(item.event_date)
        return (
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        )
      }
    }
  ]

  return (
    <AdminPage
      title="Events Management"
      description="Manage tournaments and events"
      data={events}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onView={handleView}
      createHref="/admin/events/create"
      createLabel="Add Event"
      emptyMessage="No events found"
      fetchData={fetchEvents}
    />
  )
}