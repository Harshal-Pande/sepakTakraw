'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Eye, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminRtiPage() {
  const [rtiRequests, setRtiRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchRtiRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/rti?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setRtiRequests(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching RTI requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    window.open(`/rti/${item.id}`, '_blank')
  }

  const getRtiStatus = (status) => {
    switch (status) {
      case 'pending': return { label: 'Pending', variant: 'default' }
      case 'in_progress': return { label: 'In Progress', variant: 'secondary' }
      case 'completed': return { label: 'Completed', variant: 'outline' }
      case 'rejected': return { label: 'Rejected', variant: 'destructive' }
      default: return { label: 'Unknown', variant: 'outline' }
    }
  }

  const columns = [
    {
      key: 'request_number',
      label: 'Request #',
      render: (item) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{item.request_number || `RTI-${item.id}`}</p>
          <p className="text-sm text-gray-500 truncate">{item.applicant_name}</p>
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (item) => (
        <p className="text-sm text-gray-900 max-w-xs truncate">
          {item.subject}
        </p>
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
      key: 'request_date',
      label: 'Request Date',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(item.request_date), 'MMM dd, yyyy')}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const status = getRtiStatus(item.status)
        return (
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        )
      }
    },
    {
      key: 'response_due',
      label: 'Response Due',
      render: (item) => {
        const dueDate = item.response_due_date ? new Date(item.response_due_date) : null
        const isOverdue = dueDate && dueDate < new Date()
        return (
          <div className="flex items-center text-sm">
            <Clock className={`w-4 h-4 mr-1 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`} />
            <span className={isOverdue ? 'text-red-600' : 'text-gray-500'}>
              {dueDate ? format(dueDate, 'MMM dd, yyyy') : 'N/A'}
            </span>
          </div>
        )
      }
    }
  ]

  return (
    <AdminPage
      title="RTI Requests"
      description="Manage Right to Information requests"
      data={rtiRequests}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onView={handleView}
      createHref="/admin/rti/create"
      createLabel="Add RTI Request"
      emptyMessage="No RTI requests found"
      fetchData={fetchRtiRequests}
    />
  )
}
