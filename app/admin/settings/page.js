'use client'

import { useState, useEffect } from 'react'
// AdminLayout is provided by app/admin/layout.js; avoid wrapping inside pages
import { AdminCard } from '@/components/admin/common/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Save, Loader2, Settings as SettingsIcon } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    site_name: 'Sepaktakraw Federation',
    site_email: 'contact@sepaktakraw.org',
    maintenance_mode: false,
    max_file_size: 52428800,
    allowed_file_types: 'pdf,jpg,jpeg,png,webp,doc,docx'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()

      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSwitchChange = (name, checked) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Settings saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to save settings')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <SettingsIcon className="w-8 h-8 text-primary-blue" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage system settings and configuration</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* General Settings */}
        <AdminCard title="General Settings">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  name="site_name"
                  value={settings.site_name}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="site_email">Site Email</Label>
                <Input
                  id="site_email"
                  name="site_email"
                  type="email"
                  value={settings.site_email}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="maintenance_mode" className="text-base font-medium">
                  Maintenance Mode
                </Label>
                <p className="text-sm text-gray-600">
                  Enable maintenance mode to temporarily disable the website
                </p>
              </div>
              <Switch
                id="maintenance_mode"
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) => handleSwitchChange('maintenance_mode', checked)}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary-blue hover:bg-primary-blue/90 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </AdminCard>

        {/* File Upload Settings */}
        <AdminCard title="File Upload Settings">
          <div className="space-y-6">
            <div>
              <Label htmlFor="max_file_size">Maximum File Size (bytes)</Label>
              <Input
                id="max_file_size"
                name="max_file_size"
                type="number"
                value={settings.max_file_size}
                onChange={handleInputChange}
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Current: {Math.round(settings.max_file_size / (1024 * 1024))} MB
              </p>
            </div>

            <div>
              <Label htmlFor="allowed_file_types">Allowed File Types</Label>
              <Input
                id="allowed_file_types"
                name="allowed_file_types"
                value={settings.allowed_file_types}
                onChange={handleInputChange}
                placeholder="pdf,jpg,jpeg,png,webp,doc,docx"
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Comma-separated list of allowed file extensions
              </p>
            </div>
          </div>
        </AdminCard>

        {/* System Information */}
        <AdminCard title="System Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Admin Panel Version</Label>
              <p className="text-sm text-gray-600 mt-1">v1.0.0</p>
            </div>
            <div>
              <Label>Last Updated</Label>
              <p className="text-sm text-gray-600 mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label>Environment</Label>
              <p className="text-sm text-gray-600 mt-1">
                {process.env.NODE_ENV || 'development'}
              </p>
            </div>
            <div>
              <Label>Database Status</Label>
              <p className="text-sm text-green-600 mt-1">Connected</p>
            </div>
          </div>
        </AdminCard>
      </div>
  )
}
