'use client'

import { useState } from 'react'
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

export default function CreateHeroImagePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (values) => {
    console.log("=== HERO IMAGES FORM SUBMISSION ===");
    console.log("Form values:", JSON.stringify(values, null, 2));
    
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/hero-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.success) {
        router.push('/admin/hero-images')
      } else {
        setError(data.error || 'Failed to create hero image')
      }
    } catch (err) {
      console.error("API Error:", err);
      setError('An error occurred while creating hero image')
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

  return (
    <AdminForm
      title="Create Hero Image"
      description="Add new homepage hero image"
      backHref="/admin/hero-images"
      backLabel="Back to Hero Images"
      formSchema={formSchema}
      defaultValues={{
        title: '',
        subtitle: '',
        description: '',
        image_url: '',
        display_order: 0,
        is_active: true,
      }}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Create Hero Image"
      isSubmitting={isSubmitting}
      error={error}
      storageKey="hero_images_create_form"
    />
  )
}
