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
  match_date: z.string().min(1, 'Match date is required'),
  venue: z.string().min(1, 'Venue is required'),
  team1: z.string().min(1, 'Team 1 is required'),
  team2: z.string().min(1, 'Team 2 is required'),
  score1: z.number().min(0, 'Score must be non-negative'),
  score2: z.number().min(0, 'Score must be non-negative'),
  winner: z.string().optional(),
  photos: z.array(z.string()).optional(),
})

export default function EditResultPage({ params }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchResult = async () => {
    try {
      const response = await fetch(`/api/results/${params.id}`)
      const data = await response.json()

      if (data.success) {
        return {
          title: data.data.title || '',
          description: data.data.description || '',
          match_date: data.data.match_date?.slice(0, 10) || '',
          venue: data.data.venue || '',
          team1: data.data.team1 || '',
          team2: data.data.team2 || '',
          score1: data.data.score1 || 0,
          score2: data.data.score2 || 0,
          winner: data.data.winner || '',
          photos: data.data.photos || [],
        }
      } else {
        setError(data.error || 'Failed to load result')
        return null
      }
    } catch (err) {
      setError('An error occurred while loading result')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/results/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/results')
      } else {
        setError(data.error || 'Failed to update result')
      }
    } catch (err) {
      setError('An error occurred while updating result')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      placeholder: 'Enter match title',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter match description',
      rows: 4,
      required: true
    },
    {
      name: 'match_date',
      type: 'date',
      label: 'Match Date',
      required: true
    },
    {
      name: 'venue',
      type: 'text',
      label: 'Venue',
      placeholder: 'Enter match venue',
      required: true
    },
    {
      name: 'team1',
      type: 'text',
      label: 'Team 1',
      placeholder: 'Enter first team name',
      required: true
    },
    {
      name: 'team2',
      type: 'text',
      label: 'Team 2',
      placeholder: 'Enter second team name',
      required: true
    },
    {
      name: 'score1',
      type: 'number',
      label: 'Team 1 Score',
      placeholder: 'Enter team 1 score',
      required: true
    },
    {
      name: 'score2',
      type: 'number',
      label: 'Team 2 Score',
      placeholder: 'Enter team 2 score',
      required: true
    },
    {
      name: 'winner',
      type: 'text',
      label: 'Winner',
      placeholder: 'Enter winner team name'
    },
    {
      name: 'photos',
      type: 'file',
      label: 'Match Photos',
      fileType: 'image',
      multiple: true,
      maxSize: 5
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading result...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminForm
      title="Edit Match Result"
      description="Update match result details"
      backHref="/admin/results"
      backLabel="Back to Results"
      formSchema={formSchema}
      defaultValues={fetchResult}
      onSubmit={onSubmit}
      fields={fields}
      submitLabel="Update Result"
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
