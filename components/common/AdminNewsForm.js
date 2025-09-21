'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { FileUpload } from './FileUpload'
import { Save, Loader2 } from 'lucide-react'

export function AdminNewsForm({ onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    document: null,
    image: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedDocument, setUploadedDocument] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDocumentUpload = (file) => {
    setUploadedDocument(file)
  }

  const handleImageUpload = (file) => {
    setUploadedImage(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      
      if (uploadedDocument) {
        formDataToSend.append('document', uploadedDocument)
      }
      
      if (uploadedImage) {
        formDataToSend.append('image', uploadedImage)
      }

      const response = await fetch('/api/news', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (result.success) {
        onSave?.(result.data)
        // Reset form
        setFormData({
          title: '',
          description: '',
          document: null,
          image: null
        })
        setUploadedDocument(null)
        setUploadedImage(null)
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create News Article</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
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
              required
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Document (PDF, DOC, DOCX)</Label>
            <FileUpload
              type="document"
              onUpload={handleDocumentUpload}
              maxSize={10}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Featured Image (JPG, PNG, WEBP)</Label>
            <FileUpload
              type="image"
              onUpload={handleImageUpload}
              maxSize={5}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.title || !formData.description}
            className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white"
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
        </form>
      </CardContent>
    </Card>
  )
}
