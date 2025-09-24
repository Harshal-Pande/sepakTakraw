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
  category: z.string().min(1, 'Category is required'),
  document_type: z.string().min(1, 'Document type is required'),
  effective_date: z.string().min(1, 'Effective date is required'),
  document_url: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
})

export default function EditMyasCompliancePage({ params }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchCompliance = async () => {
    try {
      const response = await fetch(`/api/myas-compliance/${params.id}`)
      const data = await response.json()

      if (data.success) {
        return {
          title: data.data.title || '',
          description: data.data.description || '',
          category: data.data.category || '',
          document_type: data.data.document_type || '',
          effective_date: data.data.effective_date?.slice(0, 10) || '',
          document_url: data.data.document_url || '',
          status: data.data.status || 'active',
        }
      } else {
        setError(data.error || 'Failed to load compliance document')
        return null
      }
    } catch (err) {
      setError('An error occurred while loading compliance document')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/myas-compliance/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/myas-compliance')
      } else {
        setError(data.error || 'Failed to update compliance document')
      }
    } catch (err) {
      setError('An error occurred while updating compliance document')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      placeholder: 'Enter document title',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter document description',
      rows: 4,
      required: true
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { value: 'guidelines', label: 'Guidelines' },
        { value: 'policies', label: 'Policies' },
        { value: 'procedures', label: 'Procedures' },
        { value: 'forms', label: 'Forms' },
        { value: 'other', label: 'Other' }
      ],
      required: true
    },
    {
      name: 'document_type',
      type: 'select',
      label: 'Document Type',
      options: [
        { value: 'pdf', label: 'PDF Document' },
        { value: 'word', label: 'Word Document' },
        { value: 'excel', label: 'Excel Spreadsheet' },
        { value: 'image', label: 'Image' },
        { value: 'other', label: 'Other' }
      ],
      required: true
    },
    {
      name: 'effective_date',
      type: 'date',
      label: 'Effective Date',
      required: true
    },
    {
      name: 'document_url',
      type: 'file',
      label: 'Document File',
      fileType: 'document',
      maxSize: 10
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
        { value: 'archived', label: 'Archived' }
      ]
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading compliance document...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminForm
      title="Edit MYAS Compliance Document"
      description="Update compliance document details"
      backHref="/admin/myas-compliance"
      backLabel="Back to MYAS Compliance"
      formSchema={formSchema}
      defaultValues={fetchCompliance}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Update Document"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
