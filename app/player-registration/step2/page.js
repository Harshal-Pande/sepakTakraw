'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, CheckCircle, ArrowLeft, Upload } from 'lucide-react'

export default function PlayerRegistrationStep2() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referenceNumber = searchParams.get('ref')

  const [formData, setFormData] = useState({
    reference_number: referenceNumber || '',
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    playing_position: '',
    experience_years: '',
    previous_teams: '',
    achievements: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    additional_notes: '',
    terms_accepted: false,
    privacy_policy_accepted: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [refData, setRefData] = useState(null)

  // Validate reference number on component mount
  useEffect(() => {
    const validateReferenceNumber = async () => {
      if (!referenceNumber) {
        setError('Reference number is required')
        setIsValidating(false)
        return
      }

      try {
        const response = await fetch(`/api/player-registration/step1?reference_number=${referenceNumber}`)
        const data = await response.json()

        if (data.success) {
          setRefData(data.data)
          setFormData(prev => ({
            ...prev,
            full_name: data.data.full_name,
            email: data.data.email
          }))
        } else {
          setError(data.error || 'Invalid reference number')
        }
      } catch (err) {
        setError('Failed to validate reference number')
      } finally {
        setIsValidating(false)
      }
    }

    validateReferenceNumber()
  }, [referenceNumber])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  // Simple client-side validation before submit
  const validateBeforeSubmit = () => {
    const required = ['phone', 'date_of_birth', 'gender']
    for (const field of required) {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        setError(`${field.replace('_',' ')} is required`)
        return false
      }
    }
    if (!formData.terms_accepted || !formData.privacy_policy_accepted) {
      setError('You must accept the terms and privacy policy')
      return false
    }
    return true
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateBeforeSubmit()) return
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/player-registration/step2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to submit registration')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <div className="py-12 min-h-screen bg-gray-50">
        <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <Loader2 className="mx-auto w-8 h-8 text-blue-600 animate-spin" />
              <p className="mt-4 text-gray-600">Validating reference number...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="py-12 min-h-screen bg-gray-50">
        <div className="px-4 mx-auto max-w-2xl sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Registration Submitted Successfully!
              </CardTitle>
              <p className="mt-2 text-gray-600">
                Your registration has been submitted and is under review.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="mb-2 font-semibold text-blue-900">Reference Number</h3>
                <code className="text-lg font-bold text-blue-900">
                  {formData.reference_number}
                </code>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-shrink-0 justify-center items-center mt-0.5 w-6 h-6 text-sm font-bold text-white bg-blue-600 rounded-full">
                      1
                    </div>
                    <p className="text-gray-700">
                      Our team will review your registration within 2-3 business days
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-shrink-0 justify-center items-center mt-0.5 w-6 h-6 text-sm font-bold text-white bg-blue-600 rounded-full">
                      2
                    </div>
                    <p className="text-gray-700">
                      You&apos;ll receive an email notification about the status of your registration
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-shrink-0 justify-center items-center mt-0.5 w-6 h-6 text-sm font-bold text-white bg-blue-600 rounded-full">
                      3
                    </div>
                    <p className="text-gray-700">
                      If approved, you&apos;ll receive further instructions for participation
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push('/')}
                className="w-full text-white bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error && !refData) {
    return (
      <div className="py-12 min-h-screen bg-gray-50">
        <div className="px-4 mx-auto max-w-2xl sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button
                onClick={() => router.push('/player-registration/step1')}
                className="mt-4"
                variant="outline"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Step 1
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 min-h-screen bg-gray-50">
      <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => router.push('/player-registration/step1')}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Step 1
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Step 2: Complete Your Registration
                </CardTitle>
                <p className="mt-1 text-gray-600">
                  Fill out all the required information to complete your player registration.
                </p>
              </div>
            </div>
            
            {/* Reference Number Display */}
            <div className="p-4 mt-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-sm font-medium text-blue-700">Reference Number</Label>
                  <code className="block text-lg font-bold text-blue-900">
                    {formData.reference_number}
                  </code>
                </div>
                <div className="text-sm text-blue-600">
                  <p><strong>Name:</strong> {refData?.full_name}</p>
                  <p><strong>Email:</strong> {refData?.email}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Personal Information</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700">
                      Date of Birth *
                    </Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      required
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                      Gender *
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="playing_position" className="text-sm font-medium text-gray-700">
                      Playing Position
                    </Label>
                    <Select value={formData.playing_position} onValueChange={(value) => handleSelectChange('playing_position', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tekong">Tekong</SelectItem>
                        <SelectItem value="Killer">Killer</SelectItem>
                        <SelectItem value="Feeder">Feeder</SelectItem>
                        <SelectItem value="All-rounder">All-rounder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Address Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address_line_1" className="text-sm font-medium text-gray-700">
                      Address Line 1
                    </Label>
                    <Input
                      id="address_line_1"
                      name="address_line_1"
                      value={formData.address_line_1}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address_line_2" className="text-sm font-medium text-gray-700">
                      Address Line 2
                    </Label>
                    <Input
                      id="address_line_2"
                      name="address_line_2"
                      value={formData.address_line_2}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, etc."
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">
                        Postal Code
                      </Label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        placeholder="Postal code"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sports Information */}
              <div className="space-y-6">
                <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Sports Information</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="experience_years" className="text-sm font-medium text-gray-700">
                      Years of Experience
                    </Label>
                    <Input
                      id="experience_years"
                      name="experience_years"
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="previous_teams" className="text-sm font-medium text-gray-700">
                    Previous Teams
                  </Label>
                  <Textarea
                    id="previous_teams"
                    name="previous_teams"
                    value={formData.previous_teams}
                    onChange={handleInputChange}
                    placeholder="List any previous teams you've played for"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="achievements" className="text-sm font-medium text-gray-700">
                    Achievements
                  </Label>
                  <Textarea
                    id="achievements"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    placeholder="List your sports achievements, awards, etc."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-6">
                <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Emergency Contact</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="emergency_contact_name" className="text-sm font-medium text-gray-700">
                      Contact Name
                    </Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergency_contact_phone" className="text-sm font-medium text-gray-700">
                      Contact Phone
                    </Label>
                    <Input
                      id="emergency_contact_phone"
                      name="emergency_contact_phone"
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergency_contact_relation" className="text-sm font-medium text-gray-700">
                      Relationship
                    </Label>
                    <Input
                      id="emergency_contact_relation"
                      name="emergency_contact_relation"
                      value={formData.emergency_contact_relation}
                      onChange={handleInputChange}
                      placeholder="e.g., Parent, Spouse"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Additional Information</h3>
                
                <div>
                  <Label htmlFor="additional_notes" className="text-sm font-medium text-gray-700">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="additional_notes"
                    name="additional_notes"
                    value={formData.additional_notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information you'd like to share"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Terms and Conditions</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <Checkbox
                      id="terms_accepted"
                      name="terms_accepted"
                      checked={formData.terms_accepted}
                      onCheckedChange={(checked) => handleInputChange({ target: { name: 'terms_accepted', type: 'checkbox', checked } })}
                      required
                    />
                    <Label htmlFor="terms_accepted" className="text-sm text-gray-700">
                      I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> *
                    </Label>
                  </div>

                  <div className="flex gap-3 items-start">
                    <Checkbox
                      id="privacy_policy_accepted"
                      name="privacy_policy_accepted"
                      checked={formData.privacy_policy_accepted}
                      onCheckedChange={(checked) => handleInputChange({ target: { name: 'privacy_policy_accepted', type: 'checkbox', checked } })}
                      required
                    />
                    <Label htmlFor="privacy_policy_accepted" className="text-sm text-gray-700">
                      I agree to the <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> *
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !formData.terms_accepted || !formData.privacy_policy_accepted}
                className="w-full text-white bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Submitting Registration...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
