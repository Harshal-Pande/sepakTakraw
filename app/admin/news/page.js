'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminNewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchNews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/news?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setNews(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    window.open(`/news/${item.id}`, '_blank')
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (item) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{item.title}</p>
          {item.featured_image && (
            <Badge variant="outline" className="mt-1 text-xs">
              Has Image
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
      key: 'created_at',
      label: 'Created',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(item.created_at), 'MMM dd, yyyy')}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: () => (
        <Badge variant="outline" className="text-green-600 border-green-200">
          Published
        </Badge>
      )
    }
  ]

  return (
    <AdminPage
      title="News Management"
      description="Manage news articles and announcements"
      data={news}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onView={handleView}
      createHref="/admin/news/create"
      createLabel="Add News Article"
      emptyMessage="No news articles found"
      fetchData={fetchNews}
    />
  )
}