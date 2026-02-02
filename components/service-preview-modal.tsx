"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Eye,
  Heart,
  Share2,
  Download,
  Star,
  Clock,
  CheckCircle,
  Package,
  Zap,
  Shield
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface ServicePreviewModalProps {
  service: {
    id: string
    title: string
    description: string
    icon: any
    startingFrom: string
    features: string[]
    images?: string[]
    popular?: boolean
    isNew?: boolean
  }
  isOpen: boolean
  onClose: () => void
}

const serviceDetails = {
  "printing-stickers": {
    fullDescription: "Professional printing services for all your business needs. We offer high-quality banners, stickers, vehicle branding, and promotional materials that make your brand stand out.",
    images: [
      "/branded-corporate-t-shirts-uniform.jpg",
      "/professional-event-banners-displays.jpg",
      "/branded-vehicle-car-wrapping.jpg",
      "/3d-company-signage-letters.jpg"
    ],
    benefits: [
      "High-quality printing with vibrant colors",
      "Fast turnaround time",
      "Weather-resistant materials",
      "Custom sizes and designs",
      "Bulk order discounts",
      "Professional design assistance"
    ],
    timeline: "Standard: 3-5 days, Express: 1-2 days",
    samples: [
      { name: "Vinyl Stickers", price: "KES 500" },
      { name: "Event Banners", price: "KES 2,000" },
      { name: "Vehicle Wraps", price: "KES 25,000" },
      { name: "Business Cards", price: "KES 100" }
    ]
  },
  "branding-services": {
    fullDescription: "Complete branding solutions including T-shirts, uniforms, caps, and corporate apparel. We help businesses create a consistent and professional brand identity through custom apparel.",
    images: [
      "/branded-corporate-t-shirts-uniform.jpg",
      "/professional-event-banners-displays.jpg",
      "/3d-company-signage-letters.jpg",
      "/acrylic-menu-holders-displays.jpg"
    ],
    benefits: [
      "Premium quality materials",
      "Custom designs and logos",
      "Various apparel options",
      "Bulk pricing available",
      "Quick delivery",
      "Professional finishing"
    ],
    timeline: "Standard: 5-7 days, Express: 2-3 days",
    samples: [
      { name: "Corporate T-Shirts", price: "KES 800" },
      { name: "Staff Uniforms", price: "KES 1,500" },
      { name: "Branded Caps", price: "KES 400" },
      { name: "Work Jackets", price: "KES 2,500" }
    ]
  },
  "uv-printing": {
    fullDescription: "Advanced UV printing technology for custom promotional items, gifts, and branded merchandise. Perfect for unique marketing materials that leave a lasting impression.",
    images: [
      "/uv-printed-promotional-items-bottles.jpg",
      "/acrylic-menu-holders-displays.jpg",
      "/branded-corporate-t-shirts-uniform.jpg",
      "/3d-company-signage-letters.jpg"
    ],
    benefits: [
      "Eco-friendly printing process",
      "Vibrant, long-lasting colors",
      "Print on various materials",
      "Quick production time",
      "Custom shapes and sizes",
      "Weather-resistant finish"
    ],
    timeline: "Standard: 2-3 days, Express: Same day",
    samples: [
      { name: "Promotional Bottles", price: "KES 300" },
      { name: "Custom Keychains", price: "KES 150" },
      { name: "Branded Pens", price: "KES 50" },
      { name: "Phone Cases", price: "KES 400" }
    ]
  },
  "signage-3d-signs": {
    fullDescription: "Indoor and outdoor signage solutions including 3D signs, LED displays, and custom building signage. We create eye-catching signs that enhance your business visibility.",
    images: [
      "/3d-company-signage-letters.jpg",
      "/professional-event-banners-displays.jpg",
      "/branded-vehicle-car-wrapping.jpg",
      "/acrylic-menu-holders-displays.jpg"
    ],
    benefits: [
      "3D illuminated signs",
      "Weather-resistant materials",
      "Custom designs and sizes",
      "LED lighting options",
      "Professional installation",
      "Durable construction"
    ],
    timeline: "Standard: 7-10 days, Express: 3-5 days",
    samples: [
      { name: "3D Lettering", price: "KES 2,000" },
      { name: "LED Signage", price: "KES 15,000" },
      { name: "Building Signs", price: "KES 25,000" },
      { name: "Directional Signs", price: "KES 1,500" }
    ]
  },
  "laser-cutting": {
    fullDescription: "Precision laser cutting services for acrylic, wood, and custom displays. Perfect for creating intricate designs, prototypes, and custom promotional items.",
    images: [
      "/acrylic-menu-holders-displays.jpg",
      "/uv-printed-promotional-items-bottles.jpg",
      "/3d-company-signage-letters.jpg",
      "/branded-corporate-t-shirts-uniform.jpg"
    ],
    benefits: [
      "Precision cutting technology",
      "Various materials supported",
      "Custom designs and shapes",
      "Quick prototyping",
      "Smooth edges and finish",
      "Bulk order capabilities"
    ],
    timeline: "Standard: 2-4 days, Express: 1-2 days",
    samples: [
      { name: "Acrylic Displays", price: "KES 5,000" },
      { name: "Wooden Signs", price: "KES 3,000" },
      { name: "Custom Cutouts", price: "KES 1,000" },
      { name: "Prototype Models", price: "KES 8,000" }
    ]
  },
  "paper-printing": {
    fullDescription: "Professional paper printing services including business cards, brochures, company profiles, and marketing materials. High-quality printing with various paper options.",
    images: [
      "/branded-corporate-t-shirts-uniform.jpg",
      "/professional-event-banners-displays.jpg",
      "/3d-company-signage-letters.jpg",
      "/acrylic-menu-holders-displays.jpg"
    ],
    benefits: [
      "Premium paper quality",
      "Various paper types and weights",
      "Full-color printing",
      "Custom designs and layouts",
      "Bulk discounts available",
      "Professional finishing"
    ],
    timeline: "Standard: 2-3 days, Express: 1 day",
    samples: [
      { name: "Business Cards", price: "KES 100" },
      { name: "Brochures", price: "KES 500" },
      { name: "Company Profiles", price: "KES 1,200" },
      { name: "Flyers", price: "KES 50" }
    ]
  }
}

export function ServicePreviewModal({ service, isOpen, onClose }: ServicePreviewModalProps) {
  const { addToCart, isInCart } = useCart()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  if (!isOpen) return null

  const details = serviceDetails[service.id as keyof typeof serviceDetails]
  const images = details?.images || ["/branded-corporate-t-shirts-uniform.jpg"]

  const handleAddToCart = () => {
    addToCart({
      id: service.id,
      service: service.title,
      category: service.id,
      description: service.description,
      quantity: 1,
      unitPrice: parseInt(service.startingFrom.replace('KES ', '').replace(',', '')),
      specifications: {},
      timeline: details?.timeline || 'Standard (3-5 days)',
      image: images[0]
    })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <service.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{service.title}</h2>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${service.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Price and Rating */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Starting from</p>
                <p className="text-3xl font-bold text-green-600">{service.startingFrom}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-1">(4.8)</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2">
              {service.popular && <Badge className="bg-orange-500">Popular</Badge>}
              {service.isNew && <Badge className="bg-green-500">New</Badge>}
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {details?.timeline}
              </Badge>
            </div>

            {/* Full Description */}
            <div>
              <h3 className="font-semibold mb-2">About this service</h3>
              <p className="text-gray-600">{details?.fullDescription}</p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold mb-3">Key Benefits</h3>
              <div className="space-y-2">
                {details?.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Products */}
            <div>
              <h3 className="font-semibold mb-3">Popular Products</h3>
              <div className="grid grid-cols-2 gap-2">
                {details?.samples.map((sample, index) => (
                  <Card key={index} className="p-3">
                    <div className="text-sm font-medium">{sample.name}</div>
                    <div className="text-sm text-green-600 font-semibold">{sample.price}</div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isInCart(service.id)}
                className="w-full text-lg py-6"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isInCart(service.id) ? 'In Cart' : 'Add to Cart'}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button variant="outline" className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
