'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/contact')
        const data = await response.json()
        
        if (data.success) {
          setContactInfo(data.data)
        }
      } catch (error) {
        console.error('Error fetching contact info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus('error')
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-primary-gold">
            Get in touch with the Sepaktakraw Sports Federation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : contactInfo ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-primary-blue mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                        <p className="text-gray-600">{contactInfo.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-primary-blue mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                        <p className="text-gray-600">{contactInfo.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-primary-blue mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                        <p className="text-gray-600">{contactInfo.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-primary-blue mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                        <p className="text-gray-600">{contactInfo.office_hours}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-primary-blue mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                        <p className="text-gray-600">123 Sports Complex, New Delhi, India 110001</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-primary-blue mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                        <p className="text-gray-600">+91 98765 43210</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-primary-blue mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                        <p className="text-gray-600">info@sepaktakrawfederation.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-primary-blue mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                        <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
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
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="mt-1"
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                      Thank you for your message! We&apos;ll get back to you soon.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                      Sorry, there was an error sending your message. Please try again.
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
