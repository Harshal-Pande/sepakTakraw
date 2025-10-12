'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

export function AdminForm({
  title,
  description,
  backHref,
  backLabel = 'Back',
  formSchema,
  defaultValues,
  onSubmit,
  fields = [],
  submitLabel = 'Save',
  isSubmitting = false,
  error = '',
  storageKey = null // Key for localStorage persistence
}) {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [dataRestored, setDataRestored] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Save form data to localStorage whenever form values change
  useEffect(() => {
    if (isLoaded && storageKey) {
      const subscription = form.watch((value) => {
        localStorage.setItem(storageKey, JSON.stringify(value))
      })
      return () => subscription.unsubscribe()
    }
  }, [form, isLoaded, storageKey])

  // Restore form data from localStorage on component mount
  useEffect(() => {
    if (storageKey) {
      const savedData = localStorage.getItem(storageKey)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          console.log(`Restoring saved form data for ${storageKey}:`, parsedData)
          
          // Restore form values
          Object.keys(parsedData).forEach(key => {
            if (parsedData[key] !== undefined && parsedData[key] !== null) {
              console.log(`Restoring ${key}:`, parsedData[key])
              form.setValue(key, parsedData[key])
            }
          })
          setDataRestored(true)
        } catch (error) {
          console.error(`Error parsing saved form data for ${storageKey}:`, error)
        }
      }
    }
    setIsLoaded(true)
  }, [form, storageKey])

  const handleFileUpload = (field, fileData) => {
    console.log(`File uploaded for ${field}:`, fileData)
    
    // Extract URL from file data
    const url = fileData?.url || fileData
    console.log(`Setting ${field} to URL:`, url)
    
    form.setValue(field, url)
    
    // Immediately save to localStorage when file is uploaded
    if (storageKey) {
      const currentValues = form.getValues()
      localStorage.setItem(storageKey, JSON.stringify({
        ...currentValues,
        [field]: url
      }))
    }
  }

  const handleSubmit = async (values) => {
    console.log("=== FORM SUBMISSION ===");
    console.log("Form values:", JSON.stringify(values, null, 2));
    
    // Check if form has file URLs
    const currentFormValues = form.getValues()
    console.log("Current form values:", JSON.stringify(currentFormValues, null, 2));
    
    await onSubmit(values)
  }

  const clearSavedData = () => {
    if (storageKey) {
      localStorage.removeItem(storageKey)
      form.reset()
      setDataRestored(false)
    }
  }

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && '*'}</FormLabel>
                <FormControl>
                  <Input 
                    type={field.type}
                    placeholder={field.placeholder} 
                    {...formField} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      
      case 'textarea':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && '*'}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    rows={field.rows || 4}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      
      case 'file':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <FileUpload
                    type={field.fileType || 'document'}
                    onUpload={(url) => handleFileUpload(field.name, url)}
                    maxSize={field.maxSize || 10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      
      case 'date':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && '*'}</FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...formField}
                    value={formField.value ? formField.value.split('T')[0] : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={backHref}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      </div>

      {/* Form */}
      <AdminCard>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

            {fields.map(renderField)}

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-blue hover:bg-primary-blue/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {submitLabel}
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

              {storageKey && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearSavedData}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear Saved Data
                </Button>
              )}
            </div>
          </form>
        </Form>
      </AdminCard>
    </div>
  )
}
