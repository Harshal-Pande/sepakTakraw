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
  document_url: z.string().optional(),
})

export default function EditAntiDopGuidelinesPage({ params }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      document_url: '',
    },
  })

  useEffect(() => {
    const fetchGuideline = async () => {
      try {
        const response = await fetch(`/api/anti-dop-guidelines/${params.id}`)
        const data = await response.json()
        
        if (data.success) {
          form.reset(data.data)
        } else {
          setError('Failed to load guideline')
        }
      } catch (err) {
        setError('Failed to load guideline')
      } finally {
        setLoading(false)
      }
    }

    fetchGuideline()
  }, [params.id, form])

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/anti-dop-guidelines/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/anti-dop-guidelines')
      } else {
        setError(data.error || 'Failed to update guideline')
      }
    } catch (err) {
      setError('An error occurred while updating guideline')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      placeholder: 'Enter guidelines title',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter guidelines description',
      rows: 6,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  return (
    <AdminForm
      title="Edit Anti-DOP Guidelines"
      description="Update anti-doping guidelines and policies"
      backHref="/admin/anti-dop-guidelines"
      backLabel="Back to Guidelines"
      formSchema={formSchema}
      defaultValues={form.getValues()}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Update Guidelines"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
