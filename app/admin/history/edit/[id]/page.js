'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AdminForm } from '@/components/admin/common/AdminForm'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  year: z.number().min(1900, 'Year must be valid').max(new Date().getFullYear(), 'Year cannot be in the future'),
  image_url: z.string().optional(),
})

export default function EditHistoryPage({ params }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/history/${params.id}`)
      const data = await response.json()

      if (data.success) {
        return {
          title: data.data.title || '',
          description: data.data.description || '',
          year: data.data.year || new Date().getFullYear(),
          image_url: data.data.image_url || '',
        }
      } else {
        setError(data.error || 'Failed to load history entry')
        return null
      }
    } catch (err) {
      setError('An error occurred while loading history entry')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/history/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/history')
      } else {
        setError(data.error || 'Failed to update history entry')
      }
    } catch (err) {
      setError('An error occurred while updating history entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      placeholder: 'Enter history entry title',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter history entry description',
      rows: 6,
      required: true
    },
    {
      name: 'year',
      type: 'number',
      label: 'Year',
      placeholder: 'Enter year',
      required: true
    },
    {
      name: 'image_url',
      type: 'file',
      label: 'Image',
      fileType: 'image',
      maxSize: 5
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading history entry...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminForm
      title="Edit History Entry"
      description="Update federation history entry"
      backHref="/admin/history"
      backLabel="Back to History"
      formSchema={formSchema}
      defaultValues={fetchHistory}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Update History Entry"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
