'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, X, FileText, FileImage, File, Maximize2, Minimize2 } from 'lucide-react'
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
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (documentUrl && isOpen) {
      setIsLoading(true)
      setError(null)
      
      try {
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

        const timeoutId = setTimeout(() => {
          console.log('Document loading timeout')
          setIsLoading(false)
        }, 10000)

        return () => clearTimeout(timeoutId)
      } catch (err) {
        console.error('Error parsing document URL:', err)
        setError(true)
        setIsLoading(false)
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
        return <FileText className="w-3 h-3 text-red-500" />
      case 'image':
        return <FileImage className="w-3 h-3 text-green-500" />
      case 'document':
        return <FileText className="w-3 h-3 text-blue-500" />
      default:
        return <File className="w-3 h-3 text-gray-500" />
    }
  }

  const getFileTypeBadge = () => {
    switch (fileType) {
      case 'pdf':
        return <Badge variant="destructive" className="px-1 py-0 h-4 text-xs text-red-700 bg-red-50 border border-red-200">PDF</Badge>
      case 'image':
        return <Badge variant="secondary" className="px-1 py-0 h-4 text-xs text-green-700 bg-green-50 border border-green-200">IMG</Badge>
      case 'document':
        return <Badge variant="secondary" className="px-1 py-0 h-4 text-xs text-blue-700 bg-blue-50 border border-blue-200">DOC</Badge>
      default:
        return <Badge variant="outline" className="px-1 py-0 h-4 text-xs">FILE</Badge>
    }
  }

  const renderDocumentContent = () => {
    if (error) {
      return (
        <div className="flex flex-col justify-center items-center p-6 h-full text-center">
          <File className="mb-4 w-16 h-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Unable to load document</h3>
          <p className="mb-4 text-sm text-gray-600">The document could not be displayed.</p>
          <Button onClick={handleDownload} variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
            <Download className="mr-2 w-4 h-4" />
            Download Instead
          </Button>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="mb-3 w-10 h-10 rounded-full border-2 border-blue-600 animate-spin border-t-transparent"></div>
          <p className="text-sm text-gray-600">Loading document...</p>
        </div>
      )
    }

    switch (fileType) {
      case 'pdf':
        return (
          <div className="relative w-full h-full">
            {isLoading && (
              <div className="flex absolute inset-0 z-10 justify-center items-center bg-white">
                <div className="text-center">
                  <div className="mx-auto mb-3 w-10 h-10 rounded-full border-2 border-blue-600 animate-spin border-t-transparent"></div>
                  <p className="text-sm text-gray-600">Loading PDF...</p>
                </div>
              </div>
            )}
            <iframe
              src={documentUrl}
              className="w-full h-full border-0"
              onLoad={() => {
                console.log('PDF loaded successfully')
                setIsLoading(false)
              }}
              onError={() => {
                console.error('PDF failed to load')
                setError(true)
                setIsLoading(false)
              }}
              title={documentName || 'PDF Document'}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          </div>
        )
      
      case 'image':
        return (
          <div className="flex justify-center items-center p-4 w-full h-full bg-gray-50">
            <Image
              src={documentUrl}
              alt={documentName || 'Image'}
              width={1200}
              height={800}
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
          <div className="flex flex-col justify-center items-center p-6 h-full text-center">
            <FileText className="mb-4 w-16 h-16 text-blue-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Document Preview</h3>
            <p className="mb-4 text-sm text-gray-600">This document type cannot be previewed inline.</p>
            <Button onClick={handleDownload} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 w-4 h-4" />
              Download Document
            </Button>
          </div>
        )
      
      default:
        return (
          <div className="flex flex-col justify-center items-center p-6 h-full text-center">
            <File className="mb-4 w-16 h-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">File Preview</h3>
            <p className="mb-4 text-sm text-gray-600">This file type cannot be previewed inline.</p>
            <Button onClick={handleDownload} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 w-4 h-4" />
              Download File
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[96vw] w-full h-[96vh] p-0 gap-0 border-2 border-gray-200 shadow-2xl">
        <DialogTitle className="sr-only">
          {documentName || 'Document Viewer'}
        </DialogTitle>
        {/* Ultra-thin Header */}
        <div className="flex justify-between items-center px-3 py-1 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-1 gap-2 items-center min-w-0">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-medium text-gray-900 truncate">
                {documentName || 'Document Viewer'}
              </h2>
            </div>
            {getFileTypeBadge()}
          </div>
          
          <div className="flex gap-1 items-center ml-3">
            <Button
              onClick={handleDownload}
              variant="ghost"
              size="sm"
              className="px-2 h-6 text-xs font-medium text-blue-700 hover:bg-blue-50"
              title="Download"
            >
              <Download className="mr-1 w-3 h-3" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="ghost"
              size="sm"
              className="px-2 h-6 text-xs font-medium text-gray-700 hover:bg-gray-100"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3 h-3" />
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </Button>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="px-2 h-6 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
              title="Close"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Document Content Area - Takes remaining space */}
        <div className="overflow-hidden flex-1 bg-white" style={{ height: 'calc(100% - 32px)' }}>
          {renderDocumentContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}