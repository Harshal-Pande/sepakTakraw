import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Users, FileText } from 'lucide-react'

export default function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      details: [
        "Sepak Takraw Association of India",
        "Sports Authority of India Complex",
        "Jawaharlal Nehru Stadium, New Delhi",
        "Pin Code: 110003"
      ]
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "General Enquiries: +91-11-2345-6789",
        "Competitions: +91-11-2345-6790",
        "Technical: +91-11-2345-6791",
        "Administration: +91-11-2345-6792"
      ]
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "General: info@sepaktakraw.org",
        "Competitions: competitions@sepaktakraw.org",
        "Technical: technical@sepaktakraw.org",
        "Media: media@sepaktakraw.org"
      ]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 2:00 PM",
        "Sunday: Closed",
        "Public Holidays: Closed"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with the Sepak Takraw Association of India. We&#39;re here to help with all your queries and concerns.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <info.icon className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {info.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-sm text-gray-600">
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-1 gap-12">
          {/* Contact Form */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <span>Send us a Message</span>
              </CardTitle>
              <p className="text-gray-600">We&#39;ll get back to you within 24 hours</p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email address" />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is this about?" />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us how we can help you..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-600">Membership</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Interested in becoming a member?</p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-blue-600">Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Need official documents or certificates?</p>
              <Button variant="outline" size="sm">
                Request Documents
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-600">Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Share your feedback and suggestions</p>
              <Button variant="outline" size="sm">
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}