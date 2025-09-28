'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AdminForm } from '@/components/admin/common/AdminForm'

const formSchema = z.object({
  district: z.string().min(1, 'District is required'),
  position: z.string().min(1, 'Position is required'),
  name: z.string().min(1, 'Name is required'),
  contact: z.string().min(1, 'Contact is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
})

export default function CreateGeneralBodyMemberPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/general-body', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/general-body')
      } else {
        setError(data.error || 'Failed to create member')
      }
    } catch (err) {
      setError('An error occurred while creating member')
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
      name: 'district',
      type: 'text',
      label: 'District',
      placeholder: 'Enter district',
      required: true
    },
    {
      name: 'contact',
      type: 'text',
      label: 'Contact',
      placeholder: 'Enter phone number',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter email address'
    }
  ]

  return (
    <AdminForm
      title="Add General Body Member"
      description="Add new federation member"
      backHref="/admin/general-body"
      backLabel="Back to General Body"
      formSchema={formSchema}
      defaultValues={{
        name: '',
        position: '',
        district: '',
        contact: '',
        email: '',
      }}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Add Member"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
