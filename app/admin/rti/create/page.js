'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { AdminForm } from '@/components/admin/common/AdminForm'

const formSchema = z.object({
  request_number: z.string().min(1, 'Request number is required'),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  applicant_email: z.string().email('Invalid email address'),
  applicant_phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
  request_date: z.string().min(1, 'Request date is required'),
  response_due_date: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'rejected']).default('pending'),
  response: z.string().optional(),
})

export default function CreateRtiPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (values) => {
    console.log("=== RTI FORM SUBMISSION ===");
    console.log("Form values:", JSON.stringify(values, null, 2));
    
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/rti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.success) {
        router.push('/admin/rti')
      } else {
        setError(data.error || 'Failed to create RTI request')
      }
    } catch (err) {
      console.error("API Error:", err);
      setError('An error occurred while creating RTI request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'request_number',
      type: 'text',
      label: 'Request Number',
      placeholder: 'Enter request number',
      required: true
    },
    {
      name: 'applicant_name',
      type: 'text',
      label: 'Applicant Name',
      placeholder: 'Enter applicant name',
      required: true
    },
    {
      name: 'applicant_email',
      type: 'email',
      label: 'Applicant Email',
      placeholder: 'Enter applicant email',
      required: true
    },
    {
      name: 'applicant_phone',
      type: 'tel',
      label: 'Applicant Phone',
      placeholder: 'Enter applicant phone number'
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subject',
      placeholder: 'Enter request subject',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter request description',
      rows: 4,
      required: true
    },
    {
      name: 'request_date',
      type: 'date',
      label: 'Request Date',
      required: true
    },
    {
      name: 'response_due_date',
      type: 'date',
      label: 'Response Due Date'
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'rejected', label: 'Rejected' }
      ]
    },
    {
      name: 'response',
      type: 'textarea',
      label: 'Response',
      placeholder: 'Enter response to the request',
      rows: 4
    }
  ]

  return (
    <AdminForm
      title="Create RTI Request"
      description="Add new RTI request"
      backHref="/admin/rti"
      backLabel="Back to RTI Requests"
      formSchema={formSchema}
      defaultValues={{
        request_number: '',
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        subject: '',
        description: '',
        request_date: '',
        response_due_date: '',
        status: 'pending',
        response: '',
      }}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Create Request"
      isSubmitting={isSubmitting}
      error={error}
      storageKey="rti_create_form"
    />
  )
}
