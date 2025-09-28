'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ModeToggle } from '@/components/mode-toggle'

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'News', href: '/news' },
  { name: 'Results', href: '/results' },
  { name: 'Events', href: '/events' },
  { name: 'General Body', href: '/general-body' },
  { name: 'Rules & Regulations', href: '/events/rules-regulations' },
  { name: 'MYAS Compliance', href: '/myas-compliance' },
  { name: 'Anti-DOP Guidelines', href: '/anti-dop-guidelines' },
  { name: 'RTI', href: '/rti' },
  { name: 'Elections', href: '/elections' },
  { name: 'History', href: '/history' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Hide public navbar on all admin routes
  if (pathname && pathname.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="bg-navbar fixed w-full top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-gold rounded-full flex items-center justify-center">
                <span className="text-primary-blue font-bold text-lg">ST</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg">Sepaktakraw</h1>
                <p className="text-primary-gold text-xs">Sports Federation</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-gold text-primary-blue'
                        : 'text-white hover:bg-white/10 hover:text-primary-gold'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Contact Info & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Contact Info - Desktop */}
            <div className="hidden md:flex items-center space-x-2 text-white">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+91 98765 43210</span>
            </div>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-white hover:bg-white/10"
                >
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-primary-blue">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-2 pb-6 border-b border-white/20">
                    <div className="w-8 h-8 bg-primary-gold rounded-full flex items-center justify-center">
                      <span className="text-primary-blue font-bold text-sm">ST</span>
                    </div>
                    <div>
                      <h2 className="text-white font-bold">Sepaktakraw</h2>
                      <p className="text-primary-gold text-xs">Sports Federation</p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navigationItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                              isActive
                                ? 'bg-primary-gold text-primary-blue'
                                : 'text-white hover:bg-white/10 hover:text-primary-gold'
                            }`}
                          >
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  </nav>

                  {/* Mobile Contact Info */}
                  <div className="pt-6 border-t border-white/20">
                    <div className="flex items-center space-x-2 text-white">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">+91 98765 43210</span>
                    </div>
                    <p className="text-primary-gold text-xs mt-2">
                      info@sepaktakrawfederation.com
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
