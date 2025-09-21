'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import LoadingSpinner from '../common/LoadingSpinner'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify')
        const data = await response.json()
        
        if (data.success) {
          setUser(data.data.user)
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-gray-50 admin-layout">
      <AdminNavbar 
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <AdminSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userRole={user.role}
        />
        
        <main className="flex-1 p-6 lg:pl-72">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
