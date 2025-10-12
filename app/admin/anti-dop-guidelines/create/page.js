'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
// AdminLayout is already applied at /app/admin/layout.js; avoid double wrapping
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
})

export default function CreateAntiDopGuidelinesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [dataRestored, setDataRestored] = useState(false)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      document_url: '',
    },
  })

  // Save form data to localStorage whenever form values change
  useEffect(() => {
    if (isLoaded) {
      const subscription = form.watch((value) => {
        localStorage.setItem('anti_dop_guidelines_create_form', JSON.stringify(value))
      })
      return () => subscription.unsubscribe()
    }
  }, [form, isLoaded])

  // Restore form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('anti_dop_guidelines_create_form')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        console.log('Restoring saved anti-dop guidelines form data:', parsedData)
        
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key] !== undefined && parsedData[key] !== null) {
            console.log(`Restoring ${key}:`, parsedData[key])
            form.setValue(key, parsedData[key])
          }
        })
        setDataRestored(true)
      } catch (error) {
        console.error('Error parsing saved anti-dop guidelines form data:', error)
      }
    }
    setIsLoaded(true)
  }, [form])

  const handleFileUpload = (field, fileData) => {
    console.log(`File uploaded for ${field}:`, fileData)
    
    // Extract URL from file data
    const url = fileData?.url || fileData
    console.log(`Setting ${field} to URL:`, url)
    
    form.setValue(field, url)
    
    // Immediately save to localStorage when file is uploaded
    const currentValues = form.getValues()
    localStorage.setItem('anti_dop_guidelines_create_form', JSON.stringify({
      ...currentValues,
      [field]: url
    }))
  }

  const onSubmit = async (values) => {
    console.log("=== ANTI-DOP GUIDELINES FORM SUBMISSION ===");
    console.log("Form values:", JSON.stringify(values, null, 2));
    
    // Check if form has file URLs
    const currentFormValues = form.getValues()
    console.log("Current form values:", JSON.stringify(currentFormValues, null, 2));
    
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/anti-dop-guidelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.success) {
        // Clear saved form data on successful submission
        localStorage.removeItem('anti_dop_guidelines_create_form')
        setDataRestored(false)
        router.push('/admin/anti-dop-guidelines')
      } else {
        setError(data.error || 'Failed to create anti-dop guidelines')
      }
    } catch (err) {
      console.error("API Error:", err);
      setError('An error occurred while creating anti-dop guidelines')
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearSavedData = () => {
    localStorage.removeItem('anti_dop_guidelines_create_form')
    form.reset()
    setError('')
    setDataRestored(false)
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Anti-DOP Guidelines</h1>
            <p className="text-gray-600">Add new anti-doping guidelines and policies</p>
          </div>
        </div>

        {/* Form */}
        <AdminCard>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guidelines title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter guidelines description"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document (PDF)</FormLabel>
                  <FormControl>
                    <FileUpload
                      type="document"
                      onUpload={(url) => handleFileUpload('document_url', url)}
                      maxSize={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
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
                    Create Guidelines
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
                onClick={clearSavedData}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear Saved Data
              </Button>
            </div>
            </form>
          </Form>
        </AdminCard>
      </div>
  )
}
