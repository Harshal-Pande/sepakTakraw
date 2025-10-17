'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Newspaper, 
  Calendar, 
  Trophy, 
  Users, 
  Vote, 
  Shield, 
  AlertTriangle, 
  Info, 
  History, 
  Phone, 
  Image, 
  FolderOpen, 
  Settings,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Results', href: '/admin/results', icon: Trophy },
  { name: 'General Body', href: '/admin/general-body', icon: Users },
  { name: 'Elections', href: '/admin/elections', icon: Vote },
  { name: 'MYAS Compliance', href: '/admin/myas-compliance', icon: Shield },
  { name: 'Anti-DOP Guidelines', href: '/admin/anti-dop-guidelines', icon: AlertTriangle },
  // { name: 'RTI', href: '/admin/rti', icon: Info }, // Disabled: route not implemented
  { name: 'History', href: '/admin/history', icon: History },
  { name: 'Contact', href: '/admin/contact', icon: Phone },
  { name: 'Hero Images', href: '/admin/hero-images', icon: Image },
  { name: 'File Manager', href: '/admin/file-manager', icon: FolderOpen },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar({ isOpen, onClose, userRole }) {
  const pathname = usePathname()

  const getItemPermissions = (item) => {
    // Simple permission check - in a real app, you'd use the permissions system
    const restrictedItems = ['Settings']
    if (userRole === 'editor' && restrictedItems.includes(item.name)) {
      return false
    }
    return true
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const hasPermission = getItemPermissions(item)

            if (!hasPermission) return null

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-blue text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userRole?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {userRole?.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-xs text-gray-500">Admin User</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
