'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// AdminLayout is applied at the route level; avoid local wrapping
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/common/FileUpload'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditNewsPage({ params }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_url: '',
    featured_image: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchNewsItem()
  }, [params.id])

  const fetchNewsItem = async () => {
    try {
      const response = await fetch(`/api/news/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setFormData({
          title: data.data.title || '',
          description: data.data.description || '',
          document_url: data.data.document_url || '',
          featured_image: data.data.featured_image || ''
        })
      } else {
        setError(data.error || 'Failed to load news article')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (field, url) => {
    setFormData(prev => ({
      ...prev,
      [field]: url
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/news/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/news')
      } else {
        setError(data.error || 'Failed to update news article')
      }
    } catch (error) {
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
          <p className="mt-2 text-gray-600">Loading news article...</p>
        </div>
      </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit News Article</h1>
            <p className="text-gray-600">Update the news article details</p>
          </div>
        </div>

        {/* Form */}
        <AdminCard>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter news title"
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
                placeholder="Enter news description"
                rows={6}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label>Featured Image</Label>
              <FileUpload
                type="image"
                onUpload={(url) => handleFileUpload('featured_image', url)}
                currentFile={formData.featured_image}
                maxSize={5}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Document (PDF)</Label>
              <FileUpload
                type="document"
                onUpload={(url) => handleFileUpload('document_url', url)}
                currentFile={formData.document_url}
                maxSize={10}
                className="mt-1"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description}
                className="bg-primary-blue hover:bg-primary-blue/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update News Article
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
            </div>
          </form>
        </AdminCard>
      </div>
  )
}
