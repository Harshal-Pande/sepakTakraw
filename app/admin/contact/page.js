'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminContactPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/contact?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setContacts(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    // Contact messages are typically viewed in admin, not public pages
    console.log('View contact:', item)
  }

  const getContactStatus = (isRead) => {
    return isRead ? { label: 'Read', variant: 'secondary' } : { label: 'Unread', variant: 'default' }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{item.name}</p>
          <p className="text-sm text-gray-500 truncate">{item.email}</p>
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
      key: 'message',
      label: 'Message',
      render: (item) => (
        <p className="text-sm text-gray-600 max-w-xs truncate">
          {item.message}
        </p>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <Phone className="w-4 h-4 mr-1" />
          {item.phone || 'N/A'}
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(item.created_at), 'MMM dd, yyyy')}
        </div>
      )
    },
    {
      key: 'is_read',
      label: 'Status',
      render: (item) => {
        const status = getContactStatus(item.is_read)
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
      title="Contact Messages"
      description="Manage contact form submissions"
      data={contacts}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onView={handleView}
      createHref={null}
      createLabel={null}
      emptyMessage="No contact messages found"
      fetchData={fetchContacts}
    />
  )
}
