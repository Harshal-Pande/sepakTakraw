'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar, Filter } from 'lucide-react'
import { format } from 'date-fns'

export default function MyasCompliancePage() {
  const [compliance, setCompliance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory)
        }
        
        const response = await fetch(`/api/myas-compliance?${params}`)
        const data = await response.json()
        
        if (data.success) {
          setCompliance(data.data)
        } else {
          setError(data.error || 'Failed to load compliance documents')
        }
      } catch (err) {
        setError('An error occurred while loading compliance documents')
      } finally {
        setLoading(false)
      }
    }

    fetchCompliance()
  }, [selectedCategory])

  const handleDownload = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank')
    }
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'guidelines', label: 'Guidelines' },
    { value: 'policies', label: 'Policies' },
    { value: 'procedures', label: 'Procedures' },
    { value: 'forms', label: 'Forms' },
    { value: 'other', label: 'Other' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'default'
      case 'draft': return 'secondary'
      case 'archived': return 'outline'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHeader 
          title="MYAS Compliance" 
          description="Ministry of Youth Affairs and Sports compliance documents"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading compliance documents...</p>
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
          title="MYAS Compliance" 
          description="Ministry of Youth Affairs and Sports compliance documents"
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
        title="MYAS Compliance" 
        description="Ministry of Youth Affairs and Sports compliance documents and guidelines"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {compliance.length === 0 ? (
            <AdminCard>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
                <p className="text-gray-600">Compliance documents will be published here when available.</p>
              </div>
            </AdminCard>
          ) : (
            compliance.map((doc) => (
              <AdminCard key={doc.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {doc.title}
                        </h3>
                        <Badge variant={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <Badge variant="outline">
                          {doc.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {doc.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          <span>{doc.document_type}</span>
                        </div>
                        {doc.effective_date && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              Effective: {format(new Date(doc.effective_date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {doc.document_url && (
                      <Button
                        onClick={() => handleDownload(doc.document_url)}
                        className="ml-4"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
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
