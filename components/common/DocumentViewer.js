'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, X, FileText, FileImage, File, Maximize2, Minimize2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'

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

    // Use react-doc-viewer for all document types
    const docs = [{ uri: documentUrl }]
    
    return (
      <div className="w-full h-full">
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={docs}
          style={{ 
            height: '100%', 
            width: '100%',
            borderRadius: '0 0 12px 12px'
          }}
          config={{
            header: {
              disableHeader: true,
              disableFileName: true,
              retainURLParams: false
            },
            pdfZoom: {
              defaultZoom: 1.2,
              zoomJump: 0.2
            },
            pdfVerticalScrollByDefault: true,
            loadingRenderer: {
              overrideComponent: () => (
                <div className="flex justify-center items-center h-full">
                  <div className="w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                </div>
              )
            }
          }}
        />
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`p-0 gap-0 overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'm-0 w-screen max-w-full h-screen rounded-none' 
          : 'w-full rounded-2xl max-w-[98vw] h-[95vh]'
      } border-0 shadow-2xl`}>
        
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