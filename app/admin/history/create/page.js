'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AdminForm } from '@/components/admin/common/AdminForm'

const formSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  timeline_year: z.number().optional(),
})

export default function CreateHistoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/history')
      } else {
        setError(data.error || 'Failed to create history entry')
      }
    } catch (err) {
      setError('An error occurred while creating history entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'content',
      type: 'textarea',
      label: 'Content',
      placeholder: 'Enter history content',
      rows: 8,
      required: true
    },
    {
      name: 'timeline_year',
      type: 'text',
      label: 'Timeline Year',
      placeholder: 'Enter year (optional)'
    }
  ]

  return (
    <AdminForm
      title="Add History Entry"
      description="Add new federation history entry"
      backHref="/admin/history"
      backLabel="Back to History"
      formSchema={formSchema}
      defaultValues={{
        content: '',
        timeline_year: '',
      }}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Add History Entry"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
