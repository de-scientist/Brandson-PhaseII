"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Eye,
  Heart,
  Share2,
  Calendar,
  MapPin,
  DollarSign,
  ExternalLink,
  Maximize2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PortfolioItem {
  id: string
  title: string
  description?: string
  category: string
  subcategory?: string
  tags: string[]
  image: string
  client?: string
  completionDate?: Date
  featured: boolean
  status: string
  services: string[]
  location?: string
  budget?: {
    min?: number
    max?: number
    currency?: string
  }
  metadata?: {
    views?: number
    likes?: number
    shares?: number
  }
}

interface PortfolioGridProps {
  items: PortfolioItem[]
  loading?: boolean
  viewMode?: 'grid' | 'list'
  showClient?: boolean
  showDate?: boolean
  showLocation?: boolean
  showBudget?: boolean
}

export function PortfolioGrid({ 
  items, 
  loading = false, 
  viewMode = 'grid',
  showClient = true,
  showDate = true,
  showLocation = true,
  showBudget = false
}: PortfolioGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const formatBudget = (budget?: { min?: number; max?: number; currency?: string }) => {
    if (!budget) return null
    
    const { min, max, currency = 'KES' } = budget
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`
    }
    return null
  }

  const formatDate = (date?: Date) => {
    if (!date) return null
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="aspect-[4/3] bg-muted" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Maximize2 className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 lg:w-1/4">
                <div className="aspect-[4/3] md:aspect-square relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {item.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{item.category}</Badge>
                      {item.subcategory && (
                        <Badge variant="outline">{item.subcategory}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {item.metadata?.views || 0}
                  </div>
                </div>
                
                {item.description && (
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {showClient && item.client && (
                      <span>Client: {item.client}</span>
                    )}
                    {showDate && item.completionDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.completionDate)}
                      </span>
                    )}
                    {showLocation && item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </span>
                    )}
                  </div>
                  
                  <Link href={`/portfolio/${item.id}`}>
                    <Button size="sm">
                      View Details
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className="group overflow-hidden hover:shadow-lg transition-all duration-300"
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
              hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-white/90 line-clamp-2 mb-2">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {item.category}
                  </Badge>
                  {item.featured && (
                    <Badge className="bg-yellow-500 text-white border-yellow-500">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-300 ${
              hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Title and Category */}
              <div>
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  {item.subcategory && (
                    <Badge variant="outline" className="text-xs">
                      {item.subcategory}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 2}
                  </Badge>
                )}
              </div>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  {showClient && item.client && (
                    <span className="line-clamp-1">{item.client}</span>
                  )}
                  {showDate && item.completionDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.completionDate)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {item.metadata?.views || 0}
                </div>
              </div>

              {/* Budget */}
              {showBudget && item.budget && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  {formatBudget(item.budget)}
                </div>
              )}

              {/* View Details Button */}
              <Link href={`/portfolio/${item.id}`} className="block">
                <Button className="w-full" size="sm">
                  View Details
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
