import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, FileText, Users, Calendar, Shield } from 'lucide-react'

export default function MYASCompliancePage() {
  const complianceAreas = [
    {
      title: "Financial Transparency",
      description: "Complete financial reporting and audit compliance",
      status: "Compliant",
      lastAudit: "2024-01-15",
      documents: ["Annual Financial Report", "Audit Certificate", "Budget Allocation"]
    },
    {
      title: "Governance Structure",
      description: "Proper organizational structure and decision-making processes",
      status: "Compliant",
      lastAudit: "2024-01-10",
      documents: ["Constitution", "Bye-laws", "Meeting Minutes"]
    },
    {
      title: "Anti-Doping Measures",
      description: "Implementation of anti-doping policies and procedures",
      status: "Compliant",
      lastAudit: "2024-01-05",
      documents: ["Anti-Doping Policy", "Testing Records", "Education Programs"]
    },
    {
      title: "Athlete Welfare",
      description: "Protection and support systems for athletes",
      status: "Under Review",
      lastAudit: "2024-01-20",
      documents: ["Welfare Policy", "Support Programs", "Complaint Procedures"]
    },
    {
      title: "Technical Standards",
      description: "Adherence to international technical standards",
      status: "Compliant",
      lastAudit: "2024-01-12",
      documents: ["Technical Rules", "Equipment Standards", "Competition Guidelines"]
    },
    {
      title: "Communication & Transparency",
      description: "Public communication and information disclosure",
      status: "Compliant",
      lastAudit: "2024-01-08",
      documents: ["Annual Report", "Public Disclosures", "Media Guidelines"]
    }
  ]

  const keyMetrics = [
    { label: "Compliance Score", value: "92%", color: "text-green-600" },
    { label: "Audit Frequency", value: "Quarterly", color: "text-blue-600" },
    { label: "Documentation", value: "100%", color: "text-purple-600" },
    { label: "Training Completion", value: "95%", color: "text-orange-600" }
  ]

  const upcomingTasks = [
    {
      title: "Annual Compliance Review",
      dueDate: "2024-03-15",
      priority: "High",
      description: "Comprehensive review of all compliance areas"
    },
    {
      title: "Anti-Doping Education Program",
      dueDate: "2024-02-28",
      priority: "Medium",
      description: "Quarterly education session for all stakeholders"
    },
    {
      title: "Financial Audit Preparation",
      dueDate: "2024-02-15",
      priority: "High",
      description: "Prepare documents for annual financial audit"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MYAS Compliance Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive compliance monitoring and reporting for Ministry of Youth Affairs & Sports requirements
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                  {metric.value}
                </div>
                <p className="text-gray-600">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compliance Areas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Compliance Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceAreas.map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{area.title}</CardTitle>
                    <Badge 
                      variant={area.status === "Compliant" ? "default" : "secondary"}
                      className={area.status === "Compliant" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                    >
                      {area.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{area.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Last Audit: {area.lastAudit}</p>
                    <div className="space-y-1">
                      {area.documents.map((doc, docIndex) => (
                        <div key={docIndex} className="flex items-center space-x-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Upcoming Compliance Tasks</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingTasks.map((task, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge 
                      variant={task.priority === "High" ? "destructive" : "secondary"}
                      className={task.priority === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {task.dueDate}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Task
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Compliance Status Overview */}
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
              <CheckCircle className="h-8 w-8" />
              <span>Overall Compliance Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold mb-4">92% Compliant</div>
            <p className="text-lg mb-6">
              Excellent compliance record with ongoing improvements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Download Compliance Report
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-green-600">
                View Audit History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Compliance Support</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              For compliance-related questions or support, contact our compliance team
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Compliance Officer</h3>
                <p className="text-sm text-gray-600">compliance@sepaktakraw.org</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Legal Advisor</h3>
                <p className="text-sm text-gray-600">legal@sepaktakraw.org</p>
              </div>
              <div className="text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Documentation</h3>
                <p className="text-sm text-gray-600">docs@sepaktakraw.org</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
