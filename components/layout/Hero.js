'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export default function Hero({ images = [] }) {
  const [isPlaying, setIsPlaying] = useState(true)

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
      <Carousel className="w-full h-full">
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full">
                <Image
                  src={image.image_url}
                  alt={image.alt_text || 'Hero image'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40"></div>
                
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-4 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white border-none" />
            <CarouselNext className="right-4 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white border-none" />
          </>
        )}
      </Carousel>

      {/* Play/Pause Control */}
      {images.length > 1 && (
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
    </section>
  )
}
