'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const DEFAULT_HERO_IMAGES = [
  {
    image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1920&auto=format&fit=crop',
    alt_text: 'Dynamic sports action background'
  },
  {
    image_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop',
    alt_text: 'Stadium lights over a court'
  },
  {
    image_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop',
    alt_text: 'Team huddle and strategy moment'
  },
  {
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1920&auto=format&fit=crop',
    alt_text: 'Court lines with minimal aesthetic'
  },
]

export default function Hero({ images = [] }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [api, setApi] = useState()
  const hasImages = images && images.length > 0
  const slideshowImages = hasImages ? images : DEFAULT_HERO_IMAGES
  const safeImages = slideshowImages.map((img) => {
    const url = img.image_url || ''
    if (url.includes('via.placeholder.com') || url.trim() === '') {
      return {
        ...img,
        image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1920&auto=format&fit=crop',
        alt_text: img.alt_text || 'Hero image'
      }
    }
    return img
  })

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Simple auto-rotation with progress bar
  useEffect(() => {
    if (!isPlaying || safeImages.length <= 1 || !api) return
    
    let currentIndex = 0
    let progressValue = 0
    const duration = 4000 // 4 seconds per image
    const totalDuration = duration * safeImages.length
    
    const interval = setInterval(() => {
      progressValue += (100 / (duration / 50)) // Increment progress
      setProgress(progressValue)
      
      if (progressValue >= 100) {
        currentIndex = (currentIndex + 1) % safeImages.length
        setCurrentSlide(currentIndex)
        api.scrollNext()
        progressValue = 0
        setProgress(0)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying, safeImages.length, api])

  // Sync currentSlide with carousel position
  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap()
      setCurrentSlide(selectedIndex)
    }

    api.on('select', onSelect)
    onSelect()

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <section className="relative h-[70vh] overflow-hidden border-b border-gray-200">
      <Carousel 
        className="w-full h-full" 
        setApi={setApi}
        opts={{
          loop: true,
          skipSnaps: false,
          dragFree: false
        }}
      >
        <CarouselContent className="h-full">
          {safeImages.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full">
                <Image
                  src={image.image_url}
                  alt={image.alt_text || 'Hero image'}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40"></div>
                
                {/* Left Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-5"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center z-10">
                  <div className="text-left text-white max-w-4xl px-8">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
                      Sepaktakraw Sports Federation
                    </h1>
                    <p className="text-lg md:text-2xl mb-6 md:mb-8 text-primary-gold">
                      Promoting Excellence in Sepaktakraw Sports
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Controls */}
        {safeImages.length > 1 && (
          <>
            <CarouselPrevious className="left-4 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white border-none" />
            <CarouselNext className="right-4 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white border-none" />
          </>
        )}
      </Carousel>

      {/* Play/Pause Control */}
      {safeImages.length > 1 && (
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="h-10 w-10 rounded-full bg-black/20 hover:bg-black/40 text-white"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Thumbnail Gallery with Progress Bar */}
      {safeImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col gap-2 bg-black/30 backdrop-blur-sm px-2 py-2 rounded-lg border border-white/20">
            {/* Thumbnails */}
            <div className="flex gap-2">
              {safeImages.slice(0, 6).map((thumb, i) => (
                <div 
                  key={i} 
                  className={`relative w-16 h-10 rounded overflow-hidden border transition-all duration-200 ${
                    i === currentSlide 
                      ? 'border-primary-gold shadow-lg shadow-primary-gold/50' 
                      : 'border-white/30'
                  }`}
                >
                  <Image
                    src={thumb.image_url}
                    alt={thumb.alt_text || 'Thumbnail'}
                    fill
                    sizes="(max-width: 640px) 64px, 128px"
                    className="object-cover"
                  />
                  {i === currentSlide && (
                    <div className="absolute inset-0 bg-primary-gold/20"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Progress Bar - Shows current image progress */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-gold transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
