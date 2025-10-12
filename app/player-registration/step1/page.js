'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, Copy, Mail } from 'lucide-react'

export default function PlayerRegistrationStep1() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/player-registration/step1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.data)
      } else {
        setError(data.error || 'Failed to generate reference number')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(success.reference_number)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const proceedToStep2 = () => {
    router.push(`/player-registration/step2?ref=${success.reference_number}`)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Your Reference Number is Ready!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Copy this reference number and use it to complete your official registration.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Reference Number Display */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <Label className="text-sm font-medium text-blue-700 mb-2 block">
                  Your Reference Number
                </Label>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-2xl font-bold text-blue-900 bg-white px-4 py-2 rounded border">
                    {success.reference_number}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Next Steps:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-gray-700">
                      <strong>Copy the reference number carefully</strong> - you'll need it for Step 2
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-gray-700">
                      Click the button below to proceed to the registration form
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-gray-700">
                      Complete all required fields and submit your registration
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={proceedToStep2}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Continue to Registration Form
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccess(null)
                    setFormData({ full_name: '', email: '' })
                  }}
                  className="flex-1"
                >
                  Generate Another Number
                </Button>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If you have any questions or need assistance, please contact us:
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Mail className="w-4 h-4" />
                  <span>info@sepaktakrawfederation.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Step 1: Get Your Unique Reference Number
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Enter your details below to receive a unique reference number for completing your official registration with our federation.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !formData.full_name || !formData.email}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Reference Number...
                  </>
                ) : (
                  'Generate Reference Number'
                )}
              </Button>
            </form>

            {/* Instructions */}
            <div className="mt-8 space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Please enter your correct name and email — your reference number will be sent here.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Copy your reference number carefully — it will be required in Step 2.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
