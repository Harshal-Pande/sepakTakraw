'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Trophy } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminResultsPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchResults = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/results?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    if (item.document_url) {
      window.open(item.document_url, '_blank')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (item) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{item.title}</p>
          {item.document_url && (
            <Badge variant="outline" className="mt-1 text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Has Document
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
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Trophy className="w-3 h-3 mr-1" />
          Published
        </Badge>
      )
    }
  ]

  return (
    <AdminPage
      title="Results Management"
      description="Manage competition results and standings"
      data={results}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onView={handleView}
      createHref="/admin/results/create"
      createLabel="Add Result"
      emptyMessage="No results found"
      fetchData={fetchResults}
    />
  )
}
