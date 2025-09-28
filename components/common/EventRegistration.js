'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, MapPin, Users, Trophy, AlertCircle, CheckCircle } from 'lucide-react'

export function EventRegistration({ event, onRegister }) {
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    captainEmail: '',
    captainPhone: '',
    players: [
      { name: '', age: '', position: 'Player' }
    ],
    emergencyContact: '',
    emergencyPhone: '',
    specialRequirements: '',
    termsAccepted: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handlePlayerChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.map((player, i) => 
        i === index ? { ...player, [field]: value } : player
      )
    }))
  }

  const addPlayer = () => {
    setFormData(prev => ({
      ...prev,
      players: [...prev.players, { name: '', age: '', position: 'Player' }]
    }))
  }

  const removePlayer = (index) => {
    if (formData.players.length > 1) {
      setFormData(prev => ({
        ...prev,
        players: prev.players.filter((_, i) => i !== index)
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required'
    if (!formData.captainName.trim()) newErrors.captainName = 'Captain name is required'
    if (!formData.captainEmail.trim()) newErrors.captainEmail = 'Email is required'
    if (!formData.captainPhone.trim()) newErrors.captainPhone = 'Phone number is required'
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions'

    // Validate players
    formData.players.forEach((player, index) => {
      if (!player.name.trim()) {
        newErrors[`player_${index}_name`] = 'Player name is required'
      }
      if (!player.age || player.age < 16 || player.age > 50) {
        newErrors[`player_${index}_age`] = 'Player age must be between 16 and 50'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onRegister(formData)
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <p className="text-gray-600">{event.description}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{event.event_date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>3 players per team</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Team Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamName">Team Name *</Label>
                  <Input
                    id="teamName"
                    value={formData.teamName}
                    onChange={(e) => handleInputChange('teamName', e.target.value)}
                    className={errors.teamName ? 'border-red-500' : ''}
                  />
                  {errors.teamName && (
                    <p className="text-red-500 text-sm mt-1">{errors.teamName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="captainName">Captain Name *</Label>
                  <Input
                    id="captainName"
                    value={formData.captainName}
                    onChange={(e) => handleInputChange('captainName', e.target.value)}
                    className={errors.captainName ? 'border-red-500' : ''}
                  />
                  {errors.captainName && (
                    <p className="text-red-500 text-sm mt-1">{errors.captainName}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="captainEmail">Captain Email *</Label>
                  <Input
                    id="captainEmail"
                    type="email"
                    value={formData.captainEmail}
                    onChange={(e) => handleInputChange('captainEmail', e.target.value)}
                    className={errors.captainEmail ? 'border-red-500' : ''}
                  />
                  {errors.captainEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.captainEmail}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="captainPhone">Captain Phone *</Label>
                  <Input
                    id="captainPhone"
                    value={formData.captainPhone}
                    onChange={(e) => handleInputChange('captainPhone', e.target.value)}
                    className={errors.captainPhone ? 'border-red-500' : ''}
                  />
                  {errors.captainPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.captainPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Players Information */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Team Players</h3>
                <Button type="button" variant="outline" size="sm" onClick={addPlayer}>
                  Add Player
                </Button>
              </div>

              {formData.players.map((player, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Player {index + 1}</h4>
                    {formData.players.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlayer(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`player_${index}_name`}>Player Name *</Label>
                      <Input
                        id={`player_${index}_name`}
                        value={player.name}
                        onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                        className={errors[`player_${index}_name`] ? 'border-red-500' : ''}
                      />
                      {errors[`player_${index}_name`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`player_${index}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`player_${index}_age`}>Age *</Label>
                      <Input
                        id={`player_${index}_age`}
                        type="number"
                        min="16"
                        max="50"
                        value={player.age}
                        onChange={(e) => handlePlayerChange(index, 'age', e.target.value)}
                        className={errors[`player_${index}_age`] ? 'border-red-500' : ''}
                      />
                      {errors[`player_${index}_age`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`player_${index}_age`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`player_${index}_position`}>Position</Label>
                      <Select
                        value={player.position}
                        onValueChange={(value) => handlePlayerChange(index, 'position', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Player">Player</SelectItem>
                          <SelectItem value="Captain">Captain</SelectItem>
                          <SelectItem value="Vice-Captain">Vice-Captain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                rows={3}
                placeholder="Any special dietary requirements, accessibility needs, or other notes..."
              />
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                  className={errors.termsAccepted ? 'border-red-500' : ''}
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  I agree to the{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    terms and conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    privacy policy
                  </a>
                  *
                </Label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Register Team
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
