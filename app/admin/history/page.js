'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { Calendar, BookOpen } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminHistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/history?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setHistory(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'content',
      label: 'Content',
      render: (item) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{item.content}</p>
          {item.timeline_year && (
            <Badge variant="outline" className="mt-1 text-xs">
              <BookOpen className="w-3 h-3 mr-1" />
              {item.timeline_year}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'timeline_year',
      label: 'Year',
      render: (item) => (
        item.timeline_year ? (
          <Badge variant="default">
            {item.timeline_year}
          </Badge>
        ) : (
          <span className="text-gray-400">No year</span>
        )
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
    }
  ]

  return (
    <AdminPage
      title="History Management"
      description="Manage federation history and timeline"
      data={history}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      createHref="/admin/history/create"
      createLabel="Add History Entry"
      emptyMessage="No history entries found"
      fetchData={fetchHistory}
    />
  )
}
