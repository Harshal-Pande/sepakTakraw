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
        return <Badge variant="destructive" className="bg-red-100 text-red-800">PDF</Badge>
      case 'image':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Image</Badge>
      case 'document':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Document</Badge>
      default:
        return <Badge variant="outline">File</Badge>
    }
  }

  const renderDocumentContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <File className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load document</h3>
          <p className="text-gray-600 mb-4">The document could not be displayed.</p>
          <Button onClick={handleDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Instead
          </Button>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
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
              className="w-full h-full border-0 rounded-lg"
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
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={documentUrl}
              alt={documentName || 'Image'}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
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
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <FileText className="w-16 h-16 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
            <p className="text-gray-600 mb-4">This document type cannot be previewed inline.</p>
            <Button onClick={handleDownload} className="bg-primary-blue hover:bg-primary-blue/90">
              <Download className="w-4 h-4 mr-2" />
              Download Document
            </Button>
          </div>
        )
      
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <File className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">File Preview</h3>
            <p className="text-gray-600 mb-4">This file type cannot be previewed inline.</p>
            <Button onClick={handleDownload} className="bg-primary-blue hover:bg-primary-blue/90">
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] w-full h-full p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {documentName || 'Document Viewer'}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  {getFileTypeBadge()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
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
        
        <div className="flex-1 overflow-hidden bg-white">
          <div className="h-full p-6 overflow-auto">
            {renderDocumentContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}