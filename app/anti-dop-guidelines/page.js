import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, AlertTriangle, Shield, Users, Calendar } from 'lucide-react'

export default function AntiDopGuidelinesPage() {
  const guidelines = [
    {
      id: 1,
      title: "WADA Anti-Doping Code",
      description: "Comprehensive guidelines following World Anti-Doping Agency standards",
      category: "International",
      lastUpdated: "2024-01-15",
      downloads: [
        { name: "WADA Code 2024", type: "PDF", size: "2.3 MB" },
        { name: "Prohibited List 2024", type: "PDF", size: "1.8 MB" }
      ]
    },
    {
      id: 2,
      title: "National Anti-Doping Policy",
      description: "India's national anti-doping regulations and procedures",
      category: "National",
      lastUpdated: "2024-01-10",
      downloads: [
        { name: "NADA Policy 2024", type: "PDF", size: "3.1 MB" },
        { name: "Testing Procedures", type: "PDF", size: "1.5 MB" }
      ]
    },
    {
      id: 3,
      title: "Sepak Takraw Specific Rules",
      description: "Sport-specific anti-doping guidelines for Sepak Takraw",
      category: "Sport Specific",
      lastUpdated: "2024-01-05",
      downloads: [
        { name: "Sepak Takraw Guidelines", type: "PDF", size: "1.2 MB" },
        { name: "Competition Rules", type: "PDF", size: "2.1 MB" }
      ]
    }
  ]

  const procedures = [
    {
      step: 1,
      title: "Education & Awareness",
      description: "Regular workshops and seminars for athletes, coaches, and support staff",
      icon: Users
    },
    {
      step: 2,
      title: "Testing Procedures",
      description: "In-competition and out-of-competition testing protocols",
      icon: Shield
    },
    {
      step: 3,
      title: "Therapeutic Use Exemptions",
      description: "Process for athletes requiring medication for medical conditions",
      icon: FileText
    },
    {
      step: 4,
      title: "Results Management",
      description: "Handling of positive test results and disciplinary procedures",
      icon: AlertTriangle
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Anti-Doping Guidelines
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive anti-doping policies, procedures, and resources to ensure clean sport in Sepak Takraw
          </p>
        </div>

        {/* Key Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-blue-600">Zero Tolerance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">We maintain a strict zero-tolerance policy towards doping in Sepak Takraw</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-600">Education First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Comprehensive education programs for all stakeholders</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-600">Regular Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Guidelines updated regularly to reflect latest WADA standards</p>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines Documents */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Guidelines & Documents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidelines.map((guideline) => (
              <Card key={guideline.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {guideline.category}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Updated: {guideline.lastUpdated}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{guideline.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{guideline.description}</p>
                  <div className="space-y-2">
                    {guideline.downloads.map((download, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{download.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{download.size}</span>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Procedures */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Anti-Doping Procedures</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {procedures.map((procedure) => (
              <Card key={procedure.step} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {procedure.step}
                    </div>
                    <procedure.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{procedure.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{procedure.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Need Help or Have Questions?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg mb-4">
              Our anti-doping team is here to help with any questions or concerns
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Contact Anti-Doping Officer
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                Report Doping Violation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
