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
  election_date: z.string().min(1, 'Election date is required'),
  document_url: z.string().optional(),
})

export default function CreateElectionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/elections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/elections')
      } else {
        setError(data.error || 'Failed to create election')
      }
    } catch (err) {
      setError('An error occurred while creating election')
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

  return (
    <AdminForm
      title="Create Election"
      description="Add new federation election"
      backHref="/admin/elections"
      backLabel="Back to Elections"
      formSchema={formSchema}
      defaultValues={{
        title: '',
        description: '',
        election_date: '',
        document_url: '',
      }}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Create Election"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
