'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminCard } from '@/components/admin/common/AdminCard'
import { AdminDataTable } from '@/components/admin/common/AdminDataTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function AdminPage({
  title,
  description,
  data = [],
  columns = [],
  loading = false,
  searchTerm = '',
  onSearchChange = () => {},
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  createHref = '',
  createLabel = 'Create New',
  emptyMessage = 'No data found',
  fetchData = () => {},
  children
}) {
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [currentPage, searchTerm, fetchData])

  const handleEdit = (item) => {
    router.push(`${createHref}/edit/${item.id}`)
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/${title.toLowerCase().replace(/\s+/g, '-')}/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchData() // Refresh data
      } else {
        alert('Failed to delete item')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting')
    }
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <Button asChild>
            <Link href={createHref}>
              <Plus className="w-4 h-4 mr-2" />
              {createLabel}
            </Link>
          </Button>
        </div>

        {/* Content */}
        <AdminCard>
          {children || (
            <AdminDataTable
              data={data}
              columns={columns}
              loading={loading}
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={onView}
              createHref={createHref}
              createLabel={createLabel}
              emptyMessage={emptyMessage}
            />
          )}
        </AdminCard>
      </div>
  )
}
