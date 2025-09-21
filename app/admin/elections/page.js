'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Vote } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminElectionsPage() {
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchElections = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/elections?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setElections(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching elections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    if (item.document_url) {
      window.open(item.document_url, '_blank')
    }
  }

  const getElectionStatus = (electionDate) => {
    const today = new Date()
    const election = new Date(electionDate)
    const diffTime = election - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { label: 'Completed', variant: 'secondary' }
    if (diffDays <= 30) return { label: 'Upcoming', variant: 'default' }
    return { label: 'Scheduled', variant: 'outline' }
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
      key: 'election_date',
      label: 'Election Date',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(item.election_date), 'MMM dd, yyyy')}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const status = getElectionStatus(item.election_date)
        return (
          <Badge variant={status.variant}>
            <Vote className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        )
      }
    }
  ]

  return (
    <AdminPage
      title="Elections Management"
      description="Manage federation elections and voting"
      data={elections}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onView={handleView}
      createHref="/admin/elections/create"
      createLabel="Add Election"
      emptyMessage="No elections found"
      fetchData={fetchElections}
    />
  )
}
