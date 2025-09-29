import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, BookOpen, Users, Trophy, Clock, MapPin } from 'lucide-react'

export default function RulesRegulationsPage() {
  const ruleCategories = [
    {
      title: "Game Rules & Regulations",
      description: "Official rules governing Sepak Takraw gameplay",
      icon: BookOpen,
      rules: [
        "Court dimensions and markings",
        "Ball specifications and standards",
        "Team composition and substitutions",
        "Scoring system and match format",
        "Service rules and rotation",
        "Fouls and violations"
      ]
    },
    {
      title: "Competition Rules",
      description: "Rules specific to tournaments and competitions",
      icon: Trophy,
      rules: [
        "Tournament format and structure",
        "Seeding and draw procedures",
        "Match scheduling and timing",
        "Referee assignments and duties",
        "Result recording and verification",
        "Tie-breaking procedures"
      ]
    },
    {
      title: "Player Eligibility",
      description: "Rules governing player participation",
      icon: Users,
      rules: [
        "Age categories and restrictions",
        "Registration requirements",
        "Transfer and loan procedures",
        "Medical clearance standards",
        "Disciplinary measures",
        "Appeal processes"
      ]
    }
  ]

  const importantDocuments = [
    {
      title: "Official Sepak Takraw Rules 2024",
      description: "Complete rulebook with latest updates",
      version: "v2.1",
      lastUpdated: "2024-01-15",
      size: "4.2 MB",
      downloads: 1250
    },
    {
      title: "Competition Guidelines",
      description: "Guidelines for organizing tournaments",
      version: "v1.8",
      lastUpdated: "2024-01-10",
      size: "2.1 MB",
      downloads: 890
    },
    {
      title: "Referee Manual",
      description: "Comprehensive guide for match officials",
      version: "v3.0",
      lastUpdated: "2024-01-05",
      size: "3.5 MB",
      downloads: 650
    },
    {
      title: "Player Code of Conduct",
      description: "Standards of behavior for all participants",
      version: "v1.5",
      lastUpdated: "2024-01-08",
      size: "1.8 MB",
      downloads: 1100
    }
  ]

  const quickReference = [
    {
      title: "Match Duration",
      content: "Best of 3 sets, 21 points per set (minimum 2-point lead)",
      icon: Clock
    },
    {
      title: "Court Size",
      content: "13.4m × 6.1m (44ft × 20ft) with 2m clearance",
      icon: MapPin
    },
    {
      title: "Team Size",
      content: "3 players per team (2 substitutes allowed)",
      icon: Users
    },
    {
      title: "Ball Weight",
      content: "170-180 grams (6-6.3 oz) for men, 150-160 grams (5.3-5.6 oz) for women",
      icon: Trophy
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rules & Regulations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive rules, regulations, and guidelines for Sepak Takraw competitions and governance
          </p>
        </div>

        {/* Quick Reference */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickReference.map((item, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <item.icon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg text-purple-600">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rule Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Rule Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ruleCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <category.icon className="h-8 w-8 text-purple-600" />
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                  <p className="text-gray-600">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start space-x-2 text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{rule}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Full Rules
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Documents */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Important Documents</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {importantDocuments.map((doc, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                      <p className="text-gray-600 text-sm mt-1">{doc.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doc.version}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Last Updated: {doc.lastUpdated}</span>
                      <span>{doc.size}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{doc.downloads} downloads</span>
                      <span>PDF Format</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rule Updates & Changes */}
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Recent Rule Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">2024 Rule Changes</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Updated service rotation rules</li>
                  <li>• Modified scoring system for tie-breaks</li>
                  <li>• New equipment standards for balls</li>
                  <li>• Enhanced referee training requirements</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Implementation Timeline</h3>
                <ul className="space-y-1 text-sm">
                  <li>• National Championships: March 2024</li>
                  <li>• State Championships: April 2024</li>
                  <li>• District Championships: May 2024</li>
                  <li>• All competitions: June 2024</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Rules & Regulations Support</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Need clarification on rules or have questions about regulations?
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Rules Committee</h3>
                <p className="text-sm text-gray-600">rules@sepaktakraw.org</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Technical Director</h3>
                <p className="text-sm text-gray-600">technical@sepaktakraw.org</p>
              </div>
              <div className="text-center">
                <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Competition Manager</h3>
                <p className="text-sm text-gray-600">competitions@sepaktakraw.org</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
