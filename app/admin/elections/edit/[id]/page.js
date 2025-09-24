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
  election_date: z.string().min(1, 'Election date is required'),
  document_url: z.string().optional(),
})

export default function EditElectionPage({ params }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchElection = async () => {
    try {
      const response = await fetch(`/api/elections/${params.id}`)
      const data = await response.json()

      if (data.success) {
        return {
          title: data.data.title || '',
          description: data.data.description || '',
          election_date: data.data.election_date?.slice(0, 10) || '',
          document_url: data.data.document_url || '',
        }
      } else {
        setError(data.error || 'Failed to load election')
        return null
      }
    } catch (err) {
      setError('An error occurred while loading election')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/elections/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/elections')
      } else {
        setError(data.error || 'Failed to update election')
      }
    } catch (err) {
      setError('An error occurred while updating election')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      placeholder: 'Enter election title',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter election description',
      rows: 6,
      required: true
    },
    {
      name: 'election_date',
      type: 'date',
      label: 'Election Date',
      required: true
    },
    {
      name: 'document_url',
      type: 'file',
      label: 'Document (PDF)',
      fileType: 'document',
      maxSize: 10
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading election...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminForm
      title="Edit Election"
      description="Update federation election details"
      backHref="/admin/elections"
      backLabel="Back to Elections"
      formSchema={formSchema}
      defaultValues={fetchElection}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Update Election"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
