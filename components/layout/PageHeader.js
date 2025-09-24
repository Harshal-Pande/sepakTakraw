import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function PageHeader({ title, description, showBack = false, backHref = '/', backLabel = 'Back' }) {
  return (
    <div className="bg-gradient-to-r from-primary-blue to-secondary-blue text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl">
          {showBack && (
            <Link 
              href={backHref}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Link>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-white/90 max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
