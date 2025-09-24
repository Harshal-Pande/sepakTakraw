'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AdminForm } from '@/components/admin/common/AdminForm'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  photo_url: z.string().optional(),
  order: z.number().min(0, 'Order must be a positive number').optional(),
})

export default function EditGeneralBodyPage({ params }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/general-body/${params.id}`)
      const data = await response.json()

      if (data.success) {
        return {
          name: data.data.name || '',
          position: data.data.position || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          bio: data.data.bio || '',
          photo_url: data.data.photo_url || '',
          order: data.data.order || 0,
        }
      } else {
        setError(data.error || 'Failed to load member')
        return null
      }
    } catch (err) {
      setError('An error occurred while loading member')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/general-body/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/general-body')
      } else {
        setError(data.error || 'Failed to update member')
      }
    } catch (err) {
      setError('An error occurred while updating member')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      placeholder: 'Enter member name',
      required: true
    },
    {
      name: 'position',
      type: 'text',
      label: 'Position',
      placeholder: 'Enter position/title',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter email address'
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone',
      placeholder: 'Enter phone number'
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
      placeholder: 'Enter member bio',
      rows: 4
    },
    {
      name: 'photo_url',
      type: 'file',
      label: 'Photo',
      fileType: 'image',
      maxSize: 5
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      placeholder: 'Enter display order (0 = first)'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading member...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminForm
      title="Edit General Body Member"
      description="Update general body member details"
      backHref="/admin/general-body"
      backLabel="Back to General Body"
      formSchema={formSchema}
      defaultValues={fetchMember}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Update Member"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
