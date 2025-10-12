'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone,
  Calendar,
  MapPin,
  Trophy,
  Users,
  FileText,
  Download
} from 'lucide-react'

export default function PlayerRegistrationsAdmin() {
  const [registrations, setRegistrations] = useState([])
  const [filteredRegistrations, setFilteredRegistrations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    filterRegistrations()
  }, [registrations, searchTerm, statusFilter])

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true)
      // This would be a real API call in production
      const mockData = [
        {
          id: '1',
          reference_number: 'SPF-2025-00001',
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+91-9876543210',
          status: 'pending',
          submitted_at: '2025-01-10T10:30:00Z',
          playing_position: 'Tekong',
          experience_years: 3,
          city: 'Mumbai',
          state: 'Maharashtra'
        },
        {
          id: '2',
          reference_number: 'SPF-2025-00002',
          full_name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+91-9876543211',
          status: 'approved',
          submitted_at: '2025-01-09T14:20:00Z',
          reviewed_at: '2025-01-10T09:15:00Z',
          playing_position: 'Killer',
          experience_years: 5,
          city: 'Delhi',
          state: 'Delhi'
        },
        {
          id: '3',
          reference_number: 'SPF-2025-00003',
          full_name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          phone: '+91-9876543212',
          status: 'rejected',
          submitted_at: '2025-01-08T16:45:00Z',
          reviewed_at: '2025-01-09T11:30:00Z',
          review_notes: 'Incomplete documentation',
          playing_position: 'Feeder',
          experience_years: 2,
          city: 'Bangalore',
          state: 'Karnataka'
        }
      ]
      setRegistrations(mockData)
    } catch (err) {
      setError('Failed to fetch registrations')
      console.error('Error fetching registrations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRegistrations = () => {
    let filtered = registrations

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reg => 
        reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.reference_number.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter)
    }

    setFilteredRegistrations(filtered)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, text: 'Pending' },
      approved: { variant: 'default', icon: CheckCircle, text: 'Approved' },
      rejected: { variant: 'destructive', icon: XCircle, text: 'Rejected' },
      under_review: { variant: 'outline', icon: Eye, text: 'Under Review' }
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      setIsSubmitting(true)
      
      // This would be a real API call in production
      console.log(`Updating registration ${registrationId} to status ${newStatus}`)
      
      // Update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { 
                ...reg, 
                status: newStatus, 
                reviewed_at: new Date().toISOString(),
                review_notes: reviewNotes 
              }
            : reg
        )
      )
      
      setSelectedRegistration(null)
      setReviewNotes('')
    } catch (err) {
      setError('Failed to update registration status')
      console.error('Error updating status:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading registrations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Player Registrations</h1>
        <p className="text-gray-600">Manage and review player registration applications</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or reference number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registrations.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registrations.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registrations.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations List */}
      <div className="grid gap-6">
        {filteredRegistrations.map((registration) => (
          <Card key={registration.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {registration.full_name}
                    </h3>
                    {getStatusBadge(registration.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{registration.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{registration.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{registration.playing_position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{registration.city}, {registration.state}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted: {formatDate(registration.submitted_at)}</span>
                    </div>
                    {registration.reviewed_at && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Reviewed: {formatDate(registration.reviewed_at)}</span>
                      </div>
                    )}
                  </div>
                  
                  {registration.review_notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Review Notes:</strong> {registration.review_notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRegistration(registration)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  {registration.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(registration.id, 'approved')}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(registration.id, 'rejected')}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRegistrations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No player registrations have been submitted yet.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Registration Details - {selectedRegistration.full_name}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRegistration(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{selectedRegistration.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{selectedRegistration.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reference Number</label>
                    <p className="text-gray-900 font-mono">{selectedRegistration.reference_number}</p>
                  </div>
                </div>
              </div>

              {/* Review Section */}
              {selectedRegistration.status === 'pending' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Review Registration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">
                        Review Notes
                      </label>
                      <Textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add any notes about this registration..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleStatusUpdate(selectedRegistration.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isSubmitting}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Registration
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(selectedRegistration.id, 'rejected')}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        disabled={isSubmitting}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Registration
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
