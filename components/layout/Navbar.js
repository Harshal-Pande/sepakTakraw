'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Phone, Search, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ModeToggle } from '@/components/mode-toggle'

const navigationItems = [
	{ name: 'Governance', href: '/general-body' },
	{ name: 'National Team', href: '/results' },
	{ name: 'Competitions', href: '/events' },
	{ name: 'Development', href: '/myas-compliance' },
	{ name: 'Documents', href: '/rti' },
	{ name: 'News', href: '/news' },
	{ name: 'Fan Zone', href: '/' },
]

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const pathname = usePathname()

	// Hide public navbar on all admin routes
	if (pathname && pathname.startsWith('/admin')) {
		return null
	}

	return (
		<nav className="fixed top-0 z-50 w-full shadow-lg" style={{ background: 'linear-gradient(135deg, #1a4d9e 0%, #0d2b5c 100%)' }}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-stretch justify-between min-h-[90px]">
					{/* Left: Logo + Spotlight */}
					<div className="relative flex items-center gap-4 pr-12 pl-4 py-3" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(10px)', clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
						<Link href="/" className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-md bg-white text-primary-blue font-bold text-[10px] leading-[1.1] flex items-center justify-center shadow-md">
								ST<br/>FEDERATION
							</div>
							<div className="hidden sm:block text-white">
								<div className="text-sm font-bold leading-tight">Sepaktakraw</div>
								<div className="text-xs opacity-90">Sports Federation</div>
							</div>
						</Link>
						<div className="hidden md:block text-white/95 text-xs font-medium whitespace-nowrap">
							<strong className="font-semibold">Spotlight:</strong> National titles, one vision
						</div>
					</div>

					{/* Right: Two rows */}
					<div className="flex-1 flex flex-col justify-center items-end gap-2 pl-10 pr-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}>
						{/* Top links */}
						<div className="hidden lg:flex items-center gap-4 text-white text-sm">
							<Link href="/" className="hover:opacity-80 transition">Shop</Link>
							<div className="flex items-center gap-2 ml-2">
								<Link href="#" className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/25 transition"><Facebook className="w-3.5 h-3.5" /></Link>
								<Link href="#" className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/25 transition"><Twitter className="w-3.5 h-3.5" /></Link>
								<Link href="#" className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/25 transition"><Instagram className="w-3.5 h-3.5" /></Link>
								<Link href="#" className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/25 transition"><Youtube className="w-3.5 h-3.5" /></Link>
							</div>
							<div className="hidden xl:flex items-center gap-2 ml-4 text-white/95">
								<Phone className="w-4 h-4" />
								<span className="text-sm">+91 98765 43210</span>
							</div>
						</div>

						{/* Main menu (slanted buttons) */}
						<nav className="hidden lg:block">
							<ul className="flex gap-[2px]">
								{navigationItems.map((item) => {
									const isActive = pathname === item.href
									return (
										<li key={item.name} className={`overflow-hidden border border-white/30 backdrop-blur-md ${isActive ? 'bg-white' : 'bg-white/95 hover:bg-[rgba(240,244,255,0.95)]'} transition will-change-transform`}
											style={{ transform: 'skew(-15deg)' }}
										>
											<Link href={item.href} className={`block px-5 py-3 font-semibold text-sm whitespace-nowrap transition ${isActive ? 'text-primary-blue' : 'text-[#0d2b5c] hover:text-[#1a4d9e]'}`} style={{ transform: 'skew(15deg)' }}>
												{item.name}
											</Link>
										</li>
									)
								})}
								<li className="overflow-hidden border border-white/30 bg-white/20 hover:bg-white/30 transition" style={{ transform: 'skew(-15deg)' }}>
									<Link href="#" className="block px-4 py-3 text-white" style={{ transform: 'skew(15deg)' }}>
										<Search className="w-4 h-4" />
									</Link>
								</li>
							</ul>
						</nav>

						{/* Mobile actions */}
						<div className="flex lg:hidden items-center gap-2">
							<ModeToggle />
							<Sheet open={isOpen} onOpenChange={setIsOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
										<Menu className="w-6 h-6" />
										<span className="sr-only">Open menu</span>
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-80 bg-primary-blue">
									<div className="flex flex-col h-full">
										<div className="flex items-center gap-2 pb-6 border-b border-white/20">
											<div className="w-8 h-8 bg-primary-gold rounded flex items-center justify-center">
												<span className="text-primary-blue font-bold text-sm">ST</span>
											</div>
											<div>
												<h2 className="text-white font-bold">Sepaktakraw</h2>
												<p className="text-primary-gold text-xs">Sports Federation</p>
											</div>
										</div>
										<nav className="flex-1 py-6">
											<div className="space-y-2">
												{navigationItems.map((item) => {
													const isActive = pathname === item.href
													return (
														<Link
															key={item.name}
															href={item.href}
															onClick={() => setIsOpen(false)}
															className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-primary-gold text-primary-blue' : 'text-white hover:bg-white/10 hover:text-primary-gold'}`}
														>
															{item.name}
														</Link>
													)
												})}
											</div>
										</nav>
										<div className="pt-6 border-t border-white/20 text-white">
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4" />
												<span className="text-sm">+91 98765 43210</span>
											</div>
										</div>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
