'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function LatestMixedSection({
	title = 'Latest',
	limitPerType = 6,
	className = '',
}) {
	const [news, setNews] = useState([])
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let cancelled = false

		const load = async () => {
			try {
				setLoading(true)
				const [newsRes, eventsRes] = await Promise.all([
					fetch(`/api/news?limit=${limitPerType}`),
					fetch(`/api/events?limit=${limitPerType}`),
				])
				const [newsData, eventsData] = await Promise.all([
					newsRes.json(),
					eventsRes.json(),
				])
				if (!cancelled) {
					if (newsData?.success) setNews(newsData.data)
					if (eventsData?.success) setEvents(eventsData.data)
				}
			} catch (e) {
				if (!cancelled) setError('Failed to load latest updates')
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		load()
		return () => {
			cancelled = true
		}
	}, [limitPerType])

	const items = useMemo(() => {
		const newsItems = (news || []).map((n) => ({
			id: n.id,
			type: 'news',
			title: n.title,
			description: n.description,
			imageUrl: n.featured_image || null,
			date: n.created_at,
			link: `/news/${n.id}`,
		}))
		const eventItems = (events || []).map((e) => ({
			id: e.id,
			type: 'event',
			title: e.title,
			description: e.description,
			imageUrl: Array.isArray(e.photos) && e.photos.length > 0 ? e.photos[0] : null,
			date: e.event_date || e.created_at,
			link: `/events/${e.id}`,
		}))
		return [...newsItems, ...eventItems]
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(0, limitPerType * 2)
	}, [news, events, limitPerType])

	if (error) {
		return (
			<section className={`py-16 ${className}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<p className="text-center text-red-600">{error}</p>
				</div>
			</section>
		)
	}

	return (
		<section className={`py-16 ${className}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="h-48 bg-gray-100 rounded animate-pulse" />
						))}
					</div>
				) : (
					<>
						{/* Top row: two large feature tiles */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							{items.slice(0, 2).map((item) => (
								<Link
									key={`${item.type}-${item.id}`}
									href={item.link}
									className="relative block h-64 rounded-lg overflow-hidden group"
								>
									{/* Background image */}
									<div
										className="absolute inset-0 bg-cover bg-center"
										style={{
											backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
											backgroundColor: item.imageUrl ? undefined : '#e5e7eb',
										}}
									/>
									{/* Bottom gradient + blur overlay */}
									<div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-sm">
										<div className="flex items-center gap-2 mb-2">
											<Badge className="bg-white/90 text-gray-900">
												{item.type === 'news' ? 'News' : 'Event'}
											</Badge>
											<span className="text-xs text-white/80">
												{new Date(item.date).toLocaleDateString('en-IN', {
													year: 'numeric', month: 'short', day: '2-digit',
												})}
											</span>
										</div>
										<h3 className="text-white font-semibold text-lg leading-snug line-clamp-2">
											{item.title}
										</h3>
									</div>
								</Link>
							))}
						</div>

						{/* Remaining grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{items.slice(2).map((item) => (
								<Link
									key={`${item.type}-${item.id}`}
									href={item.link}
									className="group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
								>
									<div className="aspect-[16/9] bg-gray-100 relative">
										{item.imageUrl && (
											<div
												className="absolute inset-0 bg-cover bg-center"
												style={{ backgroundImage: `url(${item.imageUrl})` }}
											/>
										)}
									</div>
									<div className="p-4">
										<div className="flex items-center gap-2 mb-2">
											<Badge variant="outline" className="text-xs">
												{item.type === 'news' ? 'News' : 'Event'}
											</Badge>
											<span className="text-xs text-gray-500">
												{new Date(item.date).toLocaleDateString('en-IN', {
													year: 'numeric', month: 'short', day: '2-digit',
												})}
											</span>
										</div>
										<h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
											{item.title}
										</h3>
									</div>
								</Link>
							))}
						</div>
					</>
				)}
			</div>
		</section>
	)
}


