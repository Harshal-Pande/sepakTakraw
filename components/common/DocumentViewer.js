'use client'

import { useState } from 'react'
import { Download, ExternalLink, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Badge } from '@/components/ui/badge'

export function DocumentViewer({ 
  documentUrl, 
  title, 
  description,
  showDownload = true,
  showExternalLink = true,
  className = ''
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const downloadDocument = () => {
    if (documentUrl) {
      const link = document.createElement('a')
      link.href = documentUrl
      link.download = title || 'document'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const openInNewTab = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const getFileType = (url) => {
    if (!url) return 'unknown'
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return 'pdf'
      case 'doc':
      case 'docx':
        return 'word'
      case 'xls':
      case 'xlsx':
        return 'excel'
      case 'ppt':
      case 'pptx':
        return 'powerpoint'
      default:
        return 'document'
    }
  }

  const fileType = getFileType(documentUrl)

  if (!documentUrl) {
    return (
      <Card className={`${className}`}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4" />
            <p>No document available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-blue" />
            <CardTitle className="text-lg">{title || 'Document'}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {fileType.toUpperCase()}
          </Badge>
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        )}
      </CardHeader>

      <CardContent>
        {hasError ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <p className="mb-2">Failed to load document</p>
              <p className="text-sm">The document may be corrupted or unavailable</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary-blue" />
                  <p className="text-sm text-gray-600">Loading document...</p>
                </div>
              </div>
            )}

            {fileType === 'pdf' ? (
              <iframe
                src={documentUrl}
                className="w-full h-96 border-0 rounded-lg"
                onLoad={handleLoad}
                onError={handleError}
                title={title || 'PDF Document'}
              />
            ) : (
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p className="mb-2">Preview not available</p>
                  <p className="text-sm">This file type cannot be previewed inline</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {showDownload && (
            <Button
              onClick={downloadDocument}
              disabled={hasError}
              className="flex-1 bg-primary-gold text-primary-blue hover:bg-primary-gold/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
          
          {showExternalLink && (
            <Button
              onClick={openInNewTab}
              disabled={hasError}
              variant="outline"
              className="flex-1 text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function DocumentViewerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>
      </CardContent>
    </Card>
  )
}
