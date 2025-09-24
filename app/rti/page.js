'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileText, Send, Clock, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function RtiPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    subject: '',
    description: ''
  })

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/rti')
        const data = await response.json()
        
        if (data.success) {
          setRequests(data.data)
        } else {
          setError(data.error || 'Failed to load RTI requests')
        }
      } catch (err) {
        setError('An error occurred while loading RTI requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/rti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          request_number: `RTI-${Date.now()}`,
          request_date: new Date().toISOString().split('T')[0],
          status: 'pending'
        })
      })

      const data = await response.json()

      if (data.success) {
        setFormData({
          applicant_name: '',
          applicant_email: '',
          applicant_phone: '',
          subject: '',
          description: ''
        })
        // Refresh the requests list
        const refreshResponse = await fetch('/api/rti')
        const refreshData = await refreshResponse.json()
        if (refreshData.success) {
          setRequests(refreshData.data)
        }
        alert('RTI request submitted successfully!')
      } else {
        setError(data.error || 'Failed to submit RTI request')
      }
    } catch (err) {
      setError('An error occurred while submitting RTI request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'default'
      case 'rejected': return 'destructive'
      case 'in_progress': return 'secondary'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHeader 
          title="Right to Information (RTI)" 
          description="Submit and track RTI requests"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading RTI requests...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Right to Information (RTI)" 
        description="Submit and track Right to Information requests"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit RTI Request Form */}
          <div>
            <AdminCard title="Submit RTI Request">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="applicant_name">Applicant Name *</Label>
                  <Input
                    id="applicant_name"
                    name="applicant_name"
                    value={formData.applicant_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="applicant_email">Email Address *</Label>
                  <Input
                    id="applicant_email"
                    name="applicant_email"
                    type="email"
                    value={formData.applicant_email}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="applicant_phone">Phone Number</Label>
                  <Input
                    id="applicant_phone"
                    name="applicant_phone"
                    type="tel"
                    value={formData.applicant_phone}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit RTI Request
                    </>
                  )}
                </Button>
              </form>
            </AdminCard>
          </div>

          {/* RTI Requests List */}
          <div>
            <AdminCard title="Recent RTI Requests">
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No RTI requests found</p>
                  </div>
                ) : (
                  requests.slice(0, 5).map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{request.subject}</h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <Badge variant={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.description.length > 100 
                          ? `${request.description.substring(0, 100)}...` 
                          : request.description
                        }
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{request.applicant_name}</span>
                        <span>{format(new Date(request.request_date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  )
}
