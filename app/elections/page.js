'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, Download } from 'lucide-react'
import { format } from 'date-fns'

export default function ElectionsPage() {
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('/api/elections')
        const data = await response.json()
        
        if (data.success) {
          setElections(data.data)
        } else {
          setError(data.error || 'Failed to load elections')
        }
      } catch (err) {
        setError('An error occurred while loading elections')
      } finally {
        setLoading(false)
      }
    }

    fetchElections()
  }, [])

  const handleDownload = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank')
    }
  }

  const getElectionStatus = (electionDate) => {
    const today = new Date()
    const election = new Date(electionDate)
    const diffTime = election - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { label: 'Completed', variant: 'secondary' }
    if (diffDays <= 30) return { label: 'Upcoming', variant: 'default' }
    return { label: 'Scheduled', variant: 'outline' }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHeader 
          title="Federation Elections" 
          description="Election information and documents"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading elections...</p>
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
          title="Federation Elections" 
          description="Election information and documents"
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
        title="Federation Elections" 
        description="Election information and official documents"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {elections.length === 0 ? (
            <AdminCard>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Elections Available</h3>
                <p className="text-gray-600">Election information will be published here when available.</p>
              </div>
            </AdminCard>
          ) : (
            elections.map((election) => {
              const status = getElectionStatus(election.election_date)
              return (
                <AdminCard key={election.id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {election.title}
                          </h3>
                          <Badge variant={status.variant}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {election.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            Election Date: {format(new Date(election.election_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      {election.document_url && (
                        <Button
                          onClick={() => handleDownload(election.document_url)}
                          className="ml-4"
                          variant="outline"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Document
                        </Button>
                      )}
                    </div>
                  </div>
                </AdminCard>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
