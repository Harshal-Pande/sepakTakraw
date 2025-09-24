'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Eye } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminMyasCompliancePage() {
  const [compliance, setCompliance] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchCompliance = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/myas-compliance?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setCompliance(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching compliance:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    window.open(`/myas-compliance/${item.id}`, '_blank')
  }

  const getComplianceStatus = (status) => {
    switch (status) {
      case 'active': return { label: 'Active', variant: 'default' }
      case 'draft': return { label: 'Draft', variant: 'secondary' }
      case 'archived': return { label: 'Archived', variant: 'outline' }
      default: return { label: 'Unknown', variant: 'outline' }
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (item) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{item.title}</p>
          {item.category && (
            <Badge variant="outline" className="mt-1 text-xs">
              {item.category}
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
      key: 'document_type',
      label: 'Type',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <FileText className="w-4 h-4 mr-1" />
          {item.document_type || 'Document'}
        </div>
      )
    },
    {
      key: 'effective_date',
      label: 'Effective Date',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {item.effective_date ? format(new Date(item.effective_date), 'MMM dd, yyyy') : 'N/A'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const status = getComplianceStatus(item.status)
        return (
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        )
      }
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (item) => (
        <span className="text-sm text-gray-500">
          {format(new Date(item.created_at), 'MMM dd, yyyy')}
        </span>
      )
    }
  ]

  return (
    <AdminPage
      title="MYAS Compliance"
      description="Manage MYAS compliance documents and guidelines"
      data={compliance}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onView={handleView}
      createHref="/admin/myas-compliance/create"
      createLabel="Add Compliance Document"
      emptyMessage="No compliance documents found"
      fetchData={fetchCompliance}
    />
  )
}
