"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { usePathname } from 'next/navigation'

const footerLinks = {
  'Quick Links': [
    { name: 'News', href: '/news' },
    { name: 'Results', href: '/results' },
    { name: 'Events', href: '/events' },
    { name: 'General Body', href: '/general-body' },
  ],
  'Resources': [
    { name: 'Rules & Regulations', href: '/events/rules-regulations' },
    { name: 'MYAS Compliance', href: '/myas-compliance' },
    { name: 'Anti-DOP Guidelines', href: '/anti-dop-guidelines' },
    { name: 'RTI', href: '/rti' },
  ],
  'About': [
    { name: 'History', href: '/history' },
    { name: 'Elections', href: '/elections' },
    { name: 'Contact', href: '/contact' },
  ],
}

export default function Footer() {
  const pathname = usePathname()
  // Hide public footer on all admin routes (e.g., /admin, /admin/login, /admin/*)
  if (pathname && pathname.startsWith('/admin')) {
    return null
  }
  return (
    <footer className="bg-primary-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Federation Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/Logos/sepak.png"
                  alt="Sepaktakraw Sports Federation"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Sepaktakraw</h3>
                <p className="text-primary-gold text-sm">Sports Federation</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Promoting and developing Sepaktakraw sports across the nation. 
              Building champions and fostering sportsmanship.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-primary-gold" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-primary-gold" />
                <span>info@sepaktakrawfederation.com</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-primary-gold mt-0.5" />
                <span>123 Sports Complex,<br />New Delhi, India 110001</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-primary-gold" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-4 text-primary-gold">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-primary-gold transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pre-Footer Section */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* OUR PARTNERS */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-gold">
                OUR PARTNERS
              </h4>
              <div className="space-y-3">
                <div className="relative w-32 h-16 opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/Logos/FootballSportsDevelopment.jpg"
                    alt="Football Sports Development Limited"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
              </div>
            </div>

            {/* OUR SPONSORS */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-gold">
                OUR SPONSORS
              </h4>
              <div className="space-y-3">
                <div className="relative w-32 h-16 opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/Logos/PerformatxActivewear.jpg"
                    alt="PERFORMAX ACTIVEWEAR"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
                <div className="relative w-32 h-16 opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/Logos/Nivia.jpg"
                    alt="NIVIA"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
                <div className="relative w-32 h-16 opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/Logos/IndiGo.jpg"
                    alt="IndiGo"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
              </div>
            </div>

            {/* OUR SUPPORTERS */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-gold">
                OUR SUPPORTERS
              </h4>
              <p className="text-gray-300 text-sm">
                Supporting our mission to promote Sepaktakraw sports
              </p>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-gold">
                QUICK LINKS
              </h4>
              <div className="space-y-3">
                <div className="relative w-32 h-16 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/FIFA.jpg"
                    alt="FIFA"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
                <div className="relative w-32 h-16 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/AFC.jpg"
                    alt="AFC"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Logos Section */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <h4 className="text-lg font-semibold mb-6 text-primary-gold text-center">
            Our Partners & Affiliates
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {/* Dr. Nirmal M. Mungra */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/DrNirmalMMungra.jpg"
                alt="Dr. Nirmal M. Mungra"
                fill
                className="object-contain rounded-full"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
            {/* Dr. Raksha H.M. Mungra */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/DrRakshaHMMungra.jpg"
                alt="Dr. Raksha H.M. Mungra"
                fill
                className="object-contain rounded-full"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
            {/* 75 Azadi Ka Amrit Mahotsav */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/AzadikaAmrut.png"
                alt="75 Azadi Ka Amrit Mahotsav"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
            {/* FIT INDIA */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/fitindia.jpg"
                alt="FIT INDIA"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
            {/* GUJJU */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/Gujju.jpg"
                alt="GUJJU"
                fill
                className="object-contain rounded-full"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
            {/* ISTAR */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/Istar.jpg"
                alt="ISTAR"
                fill
                className="object-contain rounded-full"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
            {/* KHELO INDIA */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/KheloIndia.jpg"
                alt="KHELO INDIA"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
            {/* SAI */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/Logos/Sai.png"
                alt="SAI"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-300">
              © {new Date().getFullYear()} Sepaktakraw Sports Federation. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-300 hover:text-primary-gold transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-300 hover:text-primary-gold transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-300 hover:text-primary-gold transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
