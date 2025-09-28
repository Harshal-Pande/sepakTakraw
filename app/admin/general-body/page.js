'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin, Phone, Mail, Crown } from 'lucide-react'

export default function AdminGeneralBodyPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/general-body?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setMembers(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPositionIcon = (position) => {
    if (position.toLowerCase().includes('president') || position.toLowerCase().includes('chairman')) {
      return <Crown className="w-4 h-4 text-yellow-600" />
    }
    return <Users className="w-4 h-4 text-blue-600" />
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item) => (
        <div className="flex items-center">
          {getPositionIcon(item.position)}
          <span className="ml-2 font-medium">{item.name}</span>
        </div>
      )
    },
    {
      key: 'position',
      label: 'Position',
      render: (item) => (
        <Badge variant="outline">
          {item.position}
        </Badge>
      )
    },
    {
      key: 'district',
      label: 'District',
      render: (item) => (
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          {item.district}
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (item) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone className="w-3 h-3 mr-1" />
            {item.contact}
          </div>
          {item.email && (
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="w-3 h-3 mr-1" />
              {item.email}
            </div>
          )}
        </div>
      )
    }
  ]

  return (
    <AdminPage
      title="General Body Management"
      description="Manage federation leadership and members"
      data={members}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      createHref="/admin/general-body/create"
      createLabel="Add Member"
      emptyMessage="No members found"
      fetchData={fetchMembers}
    />
  )
}
