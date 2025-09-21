'use client'

import { useState, useEffect } from 'react'
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

export default function Hero({ images = [] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [isPlaying, images.length])

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    )
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Default hero content if no images
  if (!images || images.length === 0) {
    return (
      <section className="relative h-[70vh] bg-hero-gradient flex items-center justify-center">
        <div className="text-center text-white z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sepaktakraw Sports Federation
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-gold">
            Promoting Excellence in Sepaktakraw Sports
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary-gold text-primary-blue hover:bg-primary-gold/90 font-semibold"
            >
              View Latest News
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary-blue"
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>
    )
  }

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Image Carousel */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.image_url}
              alt={image.alt_text || 'Hero image'}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sepaktakraw Sports Federation
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-gold">
            Promoting Excellence in Sepaktakraw Sports
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary-gold text-primary-blue hover:bg-primary-gold/90 font-semibold"
            >
              View Latest News
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary-blue"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex
                    ? 'bg-primary-gold'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
