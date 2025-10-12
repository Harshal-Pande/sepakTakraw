'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { Image, Eye, Edit, Trash2, Plus } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminHeroImagesPage() {
  const [heroImages, setHeroImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchHeroImages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/hero-images?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setHeroImages(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching hero images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    window.open(item.image_url, '_blank')
  }

  const getImageStatus = (isActive) => {
    return isActive ? { label: 'Active', variant: 'default' } : { label: 'Inactive', variant: 'secondary' }
  }

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (item) => (
        <div className="flex items-center max-w-xs">
          <img 
            src={item.image_url} 
            alt={item.title || 'Hero image'}
            className="w-16 h-10 object-cover rounded"
          />
        </div>
      )
    },
    {
      key: 'title',
      label: 'Title',
      render: (item) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{item.title || 'Untitled'}</p>
          {item.subtitle && (
            <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
          )}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (item) => (
        <p className="text-sm text-gray-600 max-w-xs truncate">
          {item.description || 'No description'}
        </p>
      )
    },
    {
      key: 'order',
      label: 'Order',
      render: (item) => (
        <Badge variant="outline">
          {item.display_order || 0}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const status = getImageStatus(item.is_active)
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
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(item)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push(`/admin/hero-images/edit/${item.id}`)}
            className="p-1 text-green-600 hover:text-green-800"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log('Delete hero image:', item.id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <AdminPage
      title="Hero Images"
      description="Manage homepage hero images and banners"
      data={heroImages}
      columns={columns}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onView={handleView}
      createHref="/admin/hero-images/create"
      createLabel="Add Hero Image"
      emptyMessage="No hero images found"
      fetchData={fetchHeroImages}
    />
  )
}
