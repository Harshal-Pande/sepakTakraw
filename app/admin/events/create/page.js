'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// AdminLayout is applied via app/admin/layout.js; do not wrap again here
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/common/FileUpload'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    photos: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [dataRestored, setDataRestored] = useState(false)
  const router = useRouter()

  // Save form data to localStorage whenever form data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('events_create_form', JSON.stringify(formData))
    }
  }, [formData, isLoaded])

  // Restore form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('events_create_form')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        console.log('Restoring saved events form data:', parsedData)
        
        setFormData(parsedData)
        setDataRestored(true)
      } catch (error) {
        console.error('Error parsing saved events form data:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (fileData) => {
    console.log('File uploaded:', fileData)
    
    // Extract URLs from file data
    const urls = Array.isArray(fileData) 
      ? fileData.map(file => file?.url || file)
      : [fileData?.url || fileData]
    
    console.log('Extracted URLs:', urls)
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...urls]
    }))
  }

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submission:', formData)
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Clear saved form data on successful submission
        localStorage.removeItem('events_create_form')
        setDataRestored(false)
        router.push('/admin/events')
      } else {
        setError(data.error || 'Failed to create event')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
            <p className="text-gray-600">Add a new event or tournament</p>
          </div>
        </div>

        {/* Form */}
        <AdminCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            {dataRestored && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600 text-sm">
                  📝 Your previous form data has been restored. You can continue where you left off.
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                rows={6}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="event_date">Event Date *</Label>
                <Input
                  id="event_date"
                  name="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Event Photos</Label>
              <FileUpload
                type="image"
                onUpload={handleFileUpload}
                multiple={true}
                maxSize={5}
                className="mt-1"
              />
              
              {/* Display uploaded photos */}
              {formData.photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Photos:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Event photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description || !formData.event_date || !formData.location}
                className="bg-primary-blue hover:bg-primary-blue/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('events_create_form')
                  setFormData({
                    title: '',
                    description: '',
                    event_date: '',
                    location: '',
                    photos: []
                  })
                  setError('')
                  setDataRestored(false)
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear Saved Data
              </Button>
            </div>
          </form>
        </AdminCard>
      </div>
  )
}
