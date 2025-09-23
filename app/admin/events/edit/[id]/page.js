'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/common/FileUpload'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditEventPage({ params }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    photos: []
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setFormData({
            title: data.data.title || '',
            description: data.data.description || '',
            event_date: data.data.event_date?.slice(0, 10) || '',
            location: data.data.location || '',
            photos: data.data.photos || []
          })
        } else {
          setError(data.error || 'Failed to load event')
        }
      } catch (e) {
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [params.id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (urls) => {
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...urls] }))
  }

  const removePhoto = (index) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin/events')
      } else {
        setError(data.error || 'Failed to update event')
      }
    } catch (e) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600">Update event details</p>
        </div>
      </div>

      <AdminCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required className="mt-1" />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" rows={6} value={formData.description} onChange={handleInputChange} required className="mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="event_date">Event Date *</Label>
              <Input id="event_date" name="event_date" type="date" value={formData.event_date} onChange={handleInputChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required className="mt-1" />
            </div>
          </div>

          <div>
            <Label>Event Photos</Label>
            <FileUpload type="image" onUpload={handleFileUpload} multiple={true} maxSize={5} className="mt-1" />
            {formData.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img src={photo} alt={`Event photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button type="button" onClick={() => removePhoto(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isSubmitting || !formData.title || !formData.description || !formData.event_date || !formData.location} className="bg-primary-blue hover:bg-primary-blue/90 text-white">
              {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</>) : (<><Save className="w-4 h-4 mr-2" />Update Event</>)}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </AdminCard>
    </div>
  )
}


