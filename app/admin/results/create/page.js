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
  document_url: z.string().min(1, 'Document is required'),
})

export default function CreateResultPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (values) => {
    console.log("=== RESULTS FORM SUBMISSION ===");
    console.log("Form values:", JSON.stringify(values, null, 2));
    
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.success) {
        router.push('/admin/results')
      } else {
        setError(data.error || 'Failed to create result')
      }
    } catch (err) {
      console.error("API Error:", err);
      setError('An error occurred while creating result')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      placeholder: 'Enter result title',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter result description',
      rows: 6,
      required: true
    },
    {
      name: 'document_url',
      type: 'file',
      label: 'Result Document (PDF)',
      fileType: 'document',
      maxSize: 10,
      required: true
    }
  ]

  return (
    <AdminForm
      title="Add Competition Result"
      description="Add new competition result"
      backHref="/admin/results"
      backLabel="Back to Results"
      formSchema={formSchema}
      defaultValues={{
        title: '',
        description: '',
        document_url: '',
      }}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Add Result"
      isSubmitting={isSubmitting}
      error={error}
      storageKey="results_create_form"
    />
  )
}
