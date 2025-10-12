'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, Phone, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ModeToggle } from '@/components/mode-toggle'

const navigationItems = [
	{ name: 'GOVERNANCE', href: '/governance' },
	{ name: 'NATIONAL TEAM', href: '/national-team' },
	{ name: 'COMPETITIONS', href: '/competitions' },
	{ name: 'DEVELOPMENT', href: '/development' },
	{ name: 'DOCUMENTS', href: '/documents' },
	{ name: 'NEWS', href: '/news' },
	{ name: 'FAN ZONE', href: '/fan-zone' },
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
			<div className="px-0 w-full">
				<div className="flex items-stretch min-h-[90px]">
					{/* Left: Logo + Spotlight */}
					<div className="flex relative gap-4 items-center py-0 pr-16 pl-4" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(10px)', clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)', borderRight: '1px solid rgba(255,255,255,0.1)', marginLeft: 0 }}>
					<Link href="/" className="flex items-center space-x-3">
						<div className="hidden sm:block">
							<h1 className="text-xl font-bold text-white">INDIA ALL INDIA FOOTBALL FEDERATION</h1>
						</div>
					</Link>
					</div>

					{/* Right: Two rows */}
					<div className="flex flex-col flex-1 gap-1 justify-center items-start py-0 pr-4 pl-2">
						{/* Top links */}
						<div className="hidden gap-4 justify-end items-center pb-2 w-full text-base text-white lg:flex">
							<div className="text-sm text-white/95">
								<span className="font-semibold">Spotlight:</span> India U23 men to play two friendlies against Indonesia in Jakarta
							</div>
							<div className="hidden gap-2 items-center ml-4 xl:flex text-white/95">
								<Phone className="w-4 h-4" />
								<span className="text-sm">+91 98765 43210</span>
							</div>
						</div>

						{/* Main menu (rectangular buttons) */}
						<nav className="hidden w-full lg:block">
							<ul className="flex gap-1 flex-wrap">
								{navigationItems.map((item) => {
									const isActive = pathname === item.href
									return (
										<li key={item.name} className={`border border-white/30 backdrop-blur-md ${isActive ? 'bg-white' : 'bg-white/95 hover:bg-[rgba(240,244,255,0.95)]'} transition flex-shrink-0 rounded-sm`}>
											<Link href={item.href} className={`block px-4 py-2 font-medium text-sm whitespace-nowrap transition ${isActive ? 'text-primary-blue' : 'text-[#0d2b5c] hover:text-[#1a4d9e]'}`}>
												{item.name}
											</Link>
										</li>
									)
								})}
								<li className="flex-shrink-0 border border-white/30 bg-white/20 hover:bg-white/30 transition rounded-sm">
									<Link href="#" className="block px-3 py-2 text-white">
										<Search className="w-4 h-4" />
									</Link>
								</li>
							</ul>
						</nav>

						{/* Mobile actions */}
						<div className="flex gap-2 items-center lg:hidden">
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
										<div className="flex gap-2 items-center pb-6 border-b border-white/20">
											<div className="flex justify-center items-center w-8 h-8 rounded bg-primary-gold">
												<span className="text-sm font-bold text-primary-blue">ST</span>
											</div>
											<div>
												<h2 className="font-bold text-white">Sepaktakraw</h2>
												<p className="text-xs text-primary-gold">Sports Federation</p>
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
										<div className="pt-6 text-white border-t border-white/20">
											<div className="flex gap-2 items-center">
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
