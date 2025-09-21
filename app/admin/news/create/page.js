'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import AdminLayout from '@/components/admin/layout/AdminLayout'
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/common/FileUpload'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  document_url: z.string().optional(),
  featured_image: z.string().optional(),
})

export default function CreateNewsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      document_url: '',
      featured_image: '',
    },
  })

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
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/news')
      } else {
        setError(data.error || 'Failed to create news article')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
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
            <h1 className="text-3xl font-bold text-gray-900">Create News Article</h1>
            <p className="text-gray-600">Add a new news article or announcement</p>
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
                maxSize={5}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Document (PDF)</Label>
              <FileUpload
                type="document"
                onUpload={(url) => handleFileUpload('document_url', url)}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create News Article
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
    </AdminLayout>
  )
}
