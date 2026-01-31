"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  ShoppingCart,
  ArrowRight,
  Star,
  Award,
  Zap,
  Target,
  CheckCircle
} from "lucide-react"

interface HeroSlide {
  id: string
  type: 'image' | 'video'
  src: string
  title: string
  subtitle: string
  description?: string
  cta?: {
    text: string
    href: string
    variant?: 'default' | 'outline' | 'secondary'
  }
  badge?: string
  features?: string[]
}

interface DynamicHeroProps {
  slides?: HeroSlide[]
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  showThumbnails?: boolean
  height?: string
  className?: string
}

const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    type: 'image',
    src: '/branded-corporate-t-shirts-uniform.jpg',
    title: 'Professional Branding Solutions',
    subtitle: 'Transform Your Business Identity',
    description: 'High-quality corporate branding, uniforms, and promotional materials that make your brand stand out.',
    cta: {
      text: 'Get Started',
      href: '/quote',
      variant: 'default'
    },
    badge: 'Popular',
    features: ['Premium Quality', 'Fast Delivery', 'Best Prices']
  },
  {
    id: '2',
    type: 'video',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'UV Printing Technology',
    subtitle: 'Advanced Printing Solutions',
    description: 'Cutting-edge UV printing technology for vibrant, durable prints on any surface.',
    cta: {
      text: 'Learn More',
      href: '/services?category=uv-printing',
      variant: 'outline'
    },
    badge: 'New',
    features: ['UV Technology', 'Eco-Friendly', 'Long-lasting']
  },
  {
    id: '3',
    type: 'image',
    src: '/professional-event-banners-displays.jpg',
    title: 'Event & Exhibition Solutions',
    subtitle: 'Make Your Event Unforgettable',
    description: 'Complete event branding solutions from banners to displays and everything in between.',
    cta: {
      text: 'View Portfolio',
      href: '/portfolio',
      variant: 'secondary'
    },
    features: ['Custom Designs', 'Quick Turnaround', 'Expert Installation']
  },
  {
    id: '4',
    type: 'video',
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Vehicle Branding Excellence',
    subtitle: 'Mobile Advertising That Works',
    description: 'Transform your vehicles into moving billboards with our premium vehicle branding services.',
    cta: {
      text: 'Get Quote',
      href: '/quote?service=vehicle-branding',
      variant: 'default'
    },
    badge: 'Featured',
    features: ['3M Materials', 'Professional Installation', 'Warranty Included']
  }
]

export function DynamicHero({ 
  slides = defaultSlides, 
  autoPlay = true, 
  interval = 5000,
  showControls = true,
  showThumbnails = false,
  height = "h-[600px]",
  className = ""
}: DynamicHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, interval, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const currentSlideData = slides[currentSlide]

  const renderSlideContent = () => {
    if (currentSlideData.type === 'video') {
      return (
        <div className="relative w-full h-full">
          <iframe
            src={`${currentSlideData.src}${isMuted ? '&mute=1' : ''}`}
            title={currentSlideData.title}
            className="w-full h-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
      )
    }

    return (
      <div className="relative w-full h-full">
        <img
          src={currentSlideData.src}
          alt={currentSlideData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>
    )
  }

  return (
    <div className={`relative ${height} overflow-hidden ${className}`}>
      {/* Slide Content */}
      <div className="relative w-full h-full">
        {renderSlideContent()}
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <div className="flex items-center gap-3 mb-4">
                {currentSlideData.badge && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {currentSlideData.badge}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {currentSlideData.title}
              </h1>
              
              <h2 className="text-xl md:text-2xl mb-6 text-white/90">
                {currentSlideData.subtitle}
              </h2>
              
              {currentSlideData.description && (
                <p className="text-lg mb-6 text-white/80 max-w-xl">
                  {currentSlideData.description}
                </p>
              )}
              
              {currentSlideData.features && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {currentSlideData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-4">
                {currentSlideData.cta && (
                  <Button
                    size="lg"
                    variant={currentSlideData.cta.variant as any}
                    asChild
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <a href={currentSlideData.cta.href}>
                      {currentSlideData.cta.text}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <a href="/portfolio">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Our Work
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Play/Pause and Volume Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            
            {currentSlideData.type === 'video' && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            )}
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-20 h-12 rounded overflow-hidden border-2 transition-all ${
                index === currentSlide 
                  ? 'border-white' 
                  : 'border-transparent hover:border-white/50'
              }`}
            >
              {slide.type === 'image' ? (
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
