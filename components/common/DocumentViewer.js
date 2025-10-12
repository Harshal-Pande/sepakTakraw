'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, X, FileText, FileImage, File } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function DocumentViewer({ 
  documentUrl, 
  documentName, 
  isOpen, 
  onClose 
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fileType, setFileType] = useState('')

  useEffect(() => {
    if (documentUrl && isOpen) {
      setIsLoading(true)
      setError(null)
      
      // Determine file type from URL
      const url = new URL(documentUrl)
      const pathname = url.pathname.toLowerCase()
      
      if (pathname.includes('.pdf')) {
        setFileType('pdf')
      } else if (pathname.includes('.jpg') || pathname.includes('.jpeg') || 
                 pathname.includes('.png') || pathname.includes('.gif') || 
                 pathname.includes('.webp')) {
        setFileType('image')
      } else if (pathname.includes('.doc') || pathname.includes('.docx')) {
        setFileType('document')
      } else {
        setFileType('unknown')
      }
    }
  }, [documentUrl, isOpen])

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a')
      link.href = documentUrl
      link.download = documentName || 'document'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getFileIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />
      case 'image':
        return <FileImage className="w-6 h-6 text-green-500" />
      case 'document':
        return <FileText className="w-6 h-6 text-blue-500" />
      default:
        return <File className="w-6 h-6 text-gray-500" />
    }
  }

  const getFileTypeBadge = () => {
    switch (fileType) {
      case 'pdf':
        return <Badge variant="destructive" className="text-red-800 bg-red-100">PDF</Badge>
      case 'image':
        return <Badge variant="secondary" className="text-green-800 bg-green-100">Image</Badge>
      case 'document':
        return <Badge variant="secondary" className="text-blue-800 bg-blue-100">Document</Badge>
      default:
        return <Badge variant="outline">File</Badge>
    }
  }

  const renderDocumentContent = () => {
    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-96 text-center">
          <File className="mb-4 w-16 h-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">Unable to load document</h3>
          <p className="mb-4 text-gray-600">The document could not be displayed.</p>
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 w-4 h-4" />
            Download Instead
          </Button>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-96">
          <div className="mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-primary-blue"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      )
    }

    switch (fileType) {
      case 'pdf':
        return (
          <div className="w-full h-full">
            <iframe
              src={documentUrl}
              className="w-full h-full rounded-lg border-0"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError(true)
                setIsLoading(false)
              }}
              title={documentName || 'PDF Document'}
            />
          </div>
        )
      
      case 'image':
        return (
          <div className="flex justify-center items-center w-full h-full">
            <Image
              src={documentUrl}
              alt={documentName || 'Image'}
              width={800}
              height={600}
              className="object-contain max-w-full max-h-full rounded-lg shadow-lg"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError(true)
                setIsLoading(false)
              }}
            />
          </div>
        )
      
      case 'document':
        return (
          <div className="flex flex-col justify-center items-center h-96 text-center">
            <FileText className="mb-4 w-16 h-16 text-blue-500" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Document Preview</h3>
            <p className="mb-4 text-gray-600">This document type cannot be previewed inline.</p>
            <Button onClick={handleDownload} className="bg-primary-blue hover:bg-primary-blue/90">
              <Download className="mr-2 w-4 h-4" />
              Download Document
            </Button>
          </div>
        )
      
      default:
        return (
          <div className="flex flex-col justify-center items-center h-96 text-center">
            <File className="mb-4 w-16 h-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">File Preview</h3>
            <p className="mb-4 text-gray-600">This file type cannot be previewed inline.</p>
            <Button onClick={handleDownload} className="bg-primary-blue hover:bg-primary-blue/90">
              <Download className="mr-2 w-4 h-4" />
              Download File
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-full h-full p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              {getFileIcon()}
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {documentName || 'Document Viewer'}
                </DialogTitle>
                <div className="flex gap-2 items-center mt-1">
                  {getFileTypeBadge()}
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
              >
                <Download className="mr-2 w-4 h-4" />
                Download
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="overflow-hidden flex-1 bg-white">
          <div className="overflow-auto p-6 h-full">
            {renderDocumentContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}