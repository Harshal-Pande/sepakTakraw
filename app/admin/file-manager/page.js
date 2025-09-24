'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminPage } from '@/components/admin/common/AdminPage'
import { Badge } from '@/components/ui/badge'
import { File, Image, FileText, Download, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminFileManagerPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/upload?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setFiles(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (item) => {
    window.open(item.url, '_blank')
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return Image
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText
    return File
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const columns = [
    {
      key: 'name',
      label: 'File Name',
      render: (item) => {
        const Icon = getFileIcon(item.mime_type)
        return (
          <div className="flex items-center max-w-xs">
            <Icon className="w-4 h-4 mr-2 text-gray-500" />
            <p className="truncate font-medium">{item.original_name}</p>
          </div>
        )
      }
    },
    {
      key: 'type',
      label: 'Type',
      render: (item) => (
        <Badge variant="outline">
          {item.mime_type}
        </Badge>
      )
    },
    {
      key: 'size',
      label: 'Size',
      render: (item) => (
        <span className="text-sm text-gray-600">
          {formatFileSize(item.size)}
        </span>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (item) => (
        <Badge variant="secondary">
          {item.category || 'General'}
        </Badge>
      )
    },
    {
      key: 'uploaded_at',
      label: 'Uploaded',
      render: (item) => (
        <span className="text-sm text-gray-500">
          {format(new Date(item.uploaded_at), 'MMM dd, yyyy')}
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
          <a
            href={item.url}
            download
            className="p-1 text-green-600 hover:text-green-800"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => console.log('Delete file:', item.id)}
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
      title="File Manager"
      description="Manage uploaded files and documents"
      data={files}
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
      emptyMessage="No files found"
      fetchData={fetchFiles}
    />
  )
}
