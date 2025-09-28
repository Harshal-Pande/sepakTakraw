import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs({ items = [] }) {
  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: Home },
    ...items
  ]

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
          {item.href ? (
            <Link 
              href={item.href}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4 mr-1" />}
              {item.label}
            </Link>
          ) : (
            <span className="flex items-center text-gray-900 font-medium">
              {item.icon && <item.icon className="h-4 w-4 mr-1" />}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
