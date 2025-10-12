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
          setIsLoading(false)
        }, 10000)

        return () => clearTimeout(timeoutId)
      } catch (err) {
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
    const iconClass = "w-5 h-5"
    switch (fileType) {
      case 'pdf':
        return <FileText className={`text-red-600 ${iconClass}`} />
      case 'image':
        return <FileImage className={`text-blue-600 ${iconClass}`} />
      case 'document':
        return <FileText className={`text-indigo-600 ${iconClass}`} />
      default:
        return <File className={`text-gray-600 ${iconClass}`} />
    }
  }

  const getFileTypeBadge = () => {
    const badgeClass = "text-xs font-semibold px-2 py-1 rounded-md"
    switch (fileType) {
      case 'pdf':
        return <Badge className={`text-red-700 bg-red-100 ${badgeClass} hover:bg-red-200`}>PDF</Badge>
      case 'image':
        return <Badge className={`text-blue-700 bg-blue-100 ${badgeClass} hover:bg-blue-200`}>IMAGE</Badge>
      case 'document':
        return <Badge className={`text-indigo-700 bg-indigo-100 ${badgeClass} hover:bg-indigo-200`}>DOC</Badge>
      default:
        return <Badge className={`text-gray-700 bg-gray-100 ${badgeClass} hover:bg-gray-200`}>FILE</Badge>
    }
  }

  const renderDocumentContent = () => {
    if (error) {
      return (
        <div className="flex flex-col justify-center items-center p-8 h-full text-center">
          <div className="p-4 mb-4 bg-red-50 rounded-full">
            <File className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Unable to Load Document</h3>
          <p className="mb-6 max-w-md text-sm text-gray-500">
            The document could not be displayed. Please try downloading it instead.
          </p>
          <Button 
            onClick={handleDownload} 
            className="text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg hover:from-blue-700 hover:to-blue-800"
          >
            <Download className="mr-2 w-4 h-4" />
            Download Document
          </Button>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 animate-spin border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent"></div>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600">Loading document...</p>
        </div>
      )
    }

    switch (fileType) {
      case 'pdf':
        return (
          <div className="relative w-full h-full bg-gray-50">
            <iframe
              src={`${documentUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=100`}
              className="w-full h-full border-0 rounded-b-lg"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError(true)
                setIsLoading(false)
              }}
              title={documentName || 'PDF Document'}
              style={{ 
                backgroundColor: '#f8f9fa'
              }}
            />
          </div>
        )
      
      case 'image':
        return (
          <div className="flex justify-center items-center p-6 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="relative max-w-full max-h-full">
              <Image
                src={documentUrl}
                alt={documentName || 'Image'}
                width={1600}
                height={1200}
                className="object-contain max-w-full max-h-full rounded-xl shadow-2xl"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setError(true)
                  setIsLoading(false)
                }}
              />
            </div>
          </div>
        )
      
      case 'document':
        return (
          <div className="flex flex-col justify-center items-center p-8 h-full text-center">
            <div className="p-5 mb-4 bg-indigo-50 rounded-full">
              <FileText className="w-14 h-14 text-indigo-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Document Preview Unavailable</h3>
            <p className="mb-6 max-w-md text-sm text-gray-500">
              This document format cannot be previewed in the browser. Download to view it.
            </p>
            <Button 
              onClick={handleDownload} 
              className="text-white bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg hover:from-indigo-700 hover:to-indigo-800"
            >
              <Download className="mr-2 w-4 h-4" />
              Download Document
            </Button>
          </div>
        )
      
      default:
        return (
          <div className="flex flex-col justify-center items-center p-8 h-full text-center">
            <div className="p-5 mb-4 bg-gray-100 rounded-full">
              <File className="w-14 h-14 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Preview Not Available</h3>
            <p className="mb-6 max-w-md text-sm text-gray-500">
              This file type cannot be previewed. Download the file to view it.
            </p>
            <Button 
              onClick={handleDownload} 
              className="text-white bg-gradient-to-r from-gray-700 to-gray-800 shadow-lg hover:from-gray-800 hover:to-gray-900"
            >
              <Download className="mr-2 w-4 h-4" />
              Download File
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`p-0 gap-0 overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'm-0 w-screen max-w-full h-screen rounded-none' 
          : 'w-full rounded-2xl max-w-[98vw] h-[95vh]'
      } border-0 shadow-2xl`}>
        
        {/* Hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">
          Document Viewer - {documentName || 'Untitled Document'}
        </DialogTitle>
        
        {/* Modern Glassmorphic Header */}
        <div className="relative border-b shadow-sm backdrop-blur-xl bg-white/80 border-gray-200/50">
          <div className="flex justify-between items-center px-5 py-3">
            {/* Left Section - File Info */}
            <div className="flex flex-1 gap-3 items-center min-w-0">
              <div className="flex-shrink-0">
                {getFileIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold leading-tight text-gray-900 truncate">
                  {documentName || 'Untitled Document'}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500 truncate">
                  {fileType.toUpperCase()} Document
                </p>
              </div>
              <div className="hidden flex-shrink-0 sm:block">
                {getFileTypeBadge()}
              </div>
            </div>
            
            {/* Right Section - Actions */}
            <div className="flex gap-2 items-center ml-4">
              <Button
                onClick={handleDownload}
                variant="ghost"
                size="sm"
                className="px-3 h-9 text-sm font-medium text-blue-700 rounded-lg transition-all hover:bg-blue-50 hover:text-blue-800"
                title="Download"
              >
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              
              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="ghost"
                size="sm"
                className="px-3 h-9 text-sm font-medium text-gray-700 rounded-lg transition-all hover:bg-gray-100 hover:text-gray-900"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
              
              <div className="mx-1 w-px h-6 bg-gray-300"></div>
              
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="p-0 w-9 h-9 text-gray-600 rounded-lg transition-all hover:bg-red-50 hover:text-red-600"
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Loading Progress Bar */}
          {isLoading && (
            <div className="overflow-hidden absolute right-0 bottom-0 left-0 h-1 bg-gray-200">
              <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* Document Content Area */}
        <div className="overflow-hidden flex-1 bg-white" style={{ height: 'calc(100% - 65px)' }}>
          {renderDocumentContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}