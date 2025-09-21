'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, Image, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from './Card'
import { Badge } from '@/components/ui/badge'

export function FileUpload({ 
  onUpload, 
  type = 'document', // 'document' or 'image'
  multiple = false,
  maxSize = 10, // MB
  className = '',
  disabled = false
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const allowedTypes = type === 'document' 
    ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  const handleFileSelect = async (files) => {
    if (disabled || isUploading) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Allowed types: ${allowedTypes.join(', ')}`)
        return false
      }
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File too large: ${file.name}. Maximum size: ${maxSize}MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setIsUploading(true)

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', type === 'document' ? 'documents' : 'images')

        const response = await fetch(`/api/upload/${type}s`, {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error)
        }

        return result.data
      })

      const uploadedResults = await Promise.all(uploadPromises)
      
      if (multiple) {
        setUploadedFiles(prev => [...prev, ...uploadedResults])
        onUpload?.(uploadedResults)
      } else {
        setUploadedFiles(uploadedResults)
        onUpload?.(uploadedResults[0])
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled || isUploading) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const openFileDialog = () => {
    if (disabled || isUploading) return
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-primary-blue bg-primary-blue/5' 
            : 'border-gray-300 hover:border-primary-blue'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center">
          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-primary-blue animate-spin mx-auto" />
              <p className="text-gray-600">Uploading files...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {type === 'document' ? (
                <FileText className="w-12 h-12 text-gray-400 mx-auto" />
              ) : (
                <Image className="w-12 h-12 text-gray-400 mx-auto" />
              )}
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {type === 'document' 
                    ? 'PDF, DOC, DOCX files up to 10MB'
                    : 'JPG, PNG, WEBP files up to 5MB'
                  }
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          {uploadedFiles.map((file, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {file.type.split('/')[1].toUpperCase()}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export function FileUploadPreview({ files, onRemove }) {
  if (!files || files.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900">
        Uploaded Files ({files.length})
      </h4>
      {files.map((file, index) => (
        <Card key={index} className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {file.type.split('/')[1].toUpperCase()}
              </Badge>
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
