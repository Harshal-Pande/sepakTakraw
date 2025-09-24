'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AdminForm } from '@/components/admin/common/AdminForm'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().min(1, 'Image is required'),
  display_order: z.number().min(0, 'Order must be a positive number').default(0),
  is_active: z.boolean().default(true),
})

export default function EditHeroImagePage({ params }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchHeroImage = async () => {
    try {
      const response = await fetch(`/api/hero-images/${params.id}`)
      const data = await response.json()

      if (data.success) {
        return {
          title: data.data.title || '',
          subtitle: data.data.subtitle || '',
          description: data.data.description || '',
          image_url: data.data.image_url || '',
          display_order: data.data.display_order || 0,
          is_active: data.data.is_active ?? true,
        }
      } else {
        setError(data.error || 'Failed to load hero image')
        return null
      }
    } catch (err) {
      setError('An error occurred while loading hero image')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/hero-images/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/hero-images')
      } else {
        setError(data.error || 'Failed to update hero image')
      }
    } catch (err) {
      setError('An error occurred while updating hero image')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      placeholder: 'Enter hero image title',
      required: true
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      placeholder: 'Enter hero image subtitle'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter hero image description',
      rows: 3
    },
    {
      name: 'image_url',
      type: 'file',
      label: 'Hero Image',
      fileType: 'image',
      maxSize: 5,
      required: true
    },
    {
      name: 'display_order',
      type: 'number',
      label: 'Display Order',
      placeholder: 'Enter display order (0 = first)'
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'Active',
      description: 'Show this hero image on the homepage'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading hero image...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminForm
      title="Edit Hero Image"
      description="Update hero image details"
      backHref="/admin/hero-images"
      backLabel="Back to Hero Images"
      formSchema={formSchema}
      defaultValues={fetchHeroImage}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Update Hero Image"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
