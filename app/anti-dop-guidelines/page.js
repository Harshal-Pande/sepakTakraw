'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function AntiDopGuidelinesPage() {
  const [guidelines, setGuidelines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGuidelines = async () => {
      try {
        const response = await fetch('/api/anti-dop-guidelines')
        const data = await response.json()
        
        if (data.success) {
          setGuidelines(data.data)
        } else {
          setError(data.error || 'Failed to load guidelines')
        }
      } catch (err) {
        setError('An error occurred while loading guidelines')
      } finally {
        setLoading(false)
      }
    }

    fetchGuidelines()
  }, [])

  const handleDownload = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHeader 
          title="Anti-DOP Guidelines" 
          description="Anti-doping policies and guidelines"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading guidelines...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <PageHeader 
          title="Anti-DOP Guidelines" 
          description="Anti-doping policies and guidelines"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Anti-DOP Guidelines" 
        description="Anti-doping policies and guidelines for athletes and officials"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {guidelines.length === 0 ? (
            <AdminCard>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Guidelines Available</h3>
                <p className="text-gray-600">Anti-doping guidelines will be published here soon.</p>
              </div>
            </AdminCard>
          ) : (
            guidelines.map((guideline) => (
              <AdminCard key={guideline.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {guideline.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {guideline.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          Updated: {format(new Date(guideline.updated_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    {guideline.document_url && (
                      <Button
                        onClick={() => handleDownload(guideline.document_url)}
                        className="ml-4"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>
              </AdminCard>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
