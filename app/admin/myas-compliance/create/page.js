'use client'

import { useState } from 'react'
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

export default function CreateMyasCompliancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/myas-compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/myas-compliance')
      } else {
        setError(data.error || 'Failed to create compliance document')
      }
    } catch (err) {
      setError('An error occurred while creating compliance document')
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

  return (
    <AdminForm
      title="Create MYAS Compliance Document"
      description="Add new compliance document"
      backHref="/admin/myas-compliance"
      backLabel="Back to MYAS Compliance"
      formSchema={formSchema}
      defaultValues={{
        title: '',
        description: '',
        category: '',
        document_type: '',
        effective_date: '',
        document_url: '',
        status: 'active',
      }}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Create Document"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
