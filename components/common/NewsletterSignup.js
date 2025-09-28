'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export function NewsletterSignup({ className = "" }) {
  const [email, setEmail] = useState('')
  const [interests, setInterests] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // 'success', 'error', null
  const [message, setMessage] = useState('')

  const interestOptions = [
    { id: 'news', label: 'Latest News & Updates' },
    { id: 'events', label: 'Events & Tournaments' },
    { id: 'results', label: 'Match Results' },
    { id: 'training', label: 'Training Programs' },
    { id: 'youth', label: 'Youth Development' },
    { id: 'technical', label: 'Technical Updates' }
  ]

  const handleInterestChange = (interestId, checked) => {
    if (checked) {
      setInterests(prev => [...prev, interestId])
    } else {
      setInterests(prev => prev.filter(id => id !== interestId))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    if (interests.length === 0) {
      setStatus('error')
      setMessage('Please select at least one interest area')
      return
    }

    setIsSubmitting(true)
    setStatus(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStatus('success')
      setMessage('Thank you for subscribing! You will receive our newsletter soon.')
      setEmail('')
      setInterests([])
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-blue-600" />
          <span>Stay Updated</span>
        </CardTitle>
        <p className="text-gray-600">
          Subscribe to our newsletter for the latest news, events, and updates from the Sepak Takraw community.
        </p>
      </CardHeader>
      
      <CardContent>
        {status && (
          <div className={`mb-4 p-3 rounded-md flex items-center space-x-2 ${
            status === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>Areas of Interest *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {interestOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={interests.includes(option.id)}
                    onCheckedChange={(checked) => handleInterestChange(option.id, checked)}
                    disabled={isSubmitting}
                  />
                  <Label 
                    htmlFor={option.id} 
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Subscribe Now
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          By subscribing, you agree to receive emails from us. You can unsubscribe at any time.
        </p>
      </CardContent>
    </Card>
  )
}

export function NewsletterStats() {
  const stats = [
    { label: 'Subscribers', value: '2,500+' },
    { label: 'Open Rate', value: '85%' },
    { label: 'Countries', value: '25+' },
    { label: 'Languages', value: '3' }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
