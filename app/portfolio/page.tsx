"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Calendar,
  User,
  Tag,
  ArrowRight,
  Heart,
  Share2,
  Download,
  ZoomIn
} from "lucide-react"

// Sample portfolio data
const portfolioItems = [
  {
    id: 1,
    title: "Corporate Branding Package",
    category: "Branding",
    description: "Complete corporate identity redesign for Tech Innovators Kenya",
    image: "/branded-corporate-t-shirts-uniform.jpg",
    images: [
      "/branded-corporate-t-shirts-uniform.jpg",
      "/professional-event-banners-displays.jpg",
      "/3d-company-signage-letters.jpg"
    ],
    client: "Tech Innovators Kenya",
    date: "2024-01-15",
    featured: true,
    tags: ["Corporate", "Logo Design", "Brand Guidelines"],
    likes: 45,
    views: 234
  },
  {
    id: 2,
    title: "Event Branding Campaign",
    category: "Events",
    description: "Comprehensive branding for Nairobi Tech Summit 2024",
    image: "/professional-event-banners-displays.jpg",
    images: [
      "/professional-event-banners-displays.jpg",
      "/branded-vehicle-car-wrapping.jpg",
      "/acrylic-menu-holders-displays.jpg"
    ],
    client: "Nairobi Tech Summit",
    date: "2024-02-20",
    featured: true,
    tags: ["Events", "Banners", "Marketing"],
    likes: 67,
    views: 456
  },
  {
    id: 3,
    title: "Vehicle Fleet Branding",
    category: "Vehicle Branding",
    description: "Full fleet branding for delivery company with custom designs",
    image: "/branded-vehicle-car-wrapping.jpg",
    images: [
      "/branded-vehicle-car-wrapping.jpg",
      "/3d-company-signage-letters.jpg",
      "/professional-event-banners-displays.jpg"
    ],
    client: "Swift Delivery Services",
    date: "2024-03-10",
    featured: false,
    tags: ["Vehicles", "Fleet", "Marketing"],
    likes: 89,
    views: 678
  },
  {
    id: 4,
    title: "3D Signage Installation",
    category: "Signage",
    description: "Custom illuminated 3D signage for commercial building",
    image: "/3d-company-signage-letters.jpg",
    images: [
      "/3d-company-signage-letters.jpg",
      "/acrylic-menu-holders-displays.jpg",
      "/branded-corporate-t-shirts-uniform.jpg"
    ],
    client: "Commercial Plaza Ltd",
    date: "2024-01-25",
    featured: false,
    tags: ["3D", "Signage", "Illuminated"],
    likes: 34,
    views: 189
  },
  {
    id: 5,
    title: "UV Printed Promotional Items",
    category: "UV Printing",
    description: "Custom promotional products with UV printing technology",
    image: "/uv-printed-promotional-items-bottles.jpg",
    images: [
      "/uv-printed-promotional-items-bottles.jpg",
      "/acrylic-menu-holders-displays.jpg",
      "/branded-corporate-t-shirts-uniform.jpg"
    ],
    client: "Promo Plus Kenya",
    date: "2024-02-15",
    featured: true,
    tags: ["UV Printing", "Promotional", "Custom"],
    likes: 56,
    views: 345
  },
  {
    id: 6,
    title: "Acrylic Display Solutions",
    category: "Laser Cutting",
    description: "Custom acrylic displays and menu holders for restaurants",
    image: "/acrylic-menu-holders-displays.jpg",
    images: [
      "/acrylic-menu-holders-displays.jpg",
      "/uv-printed-promotional-items-bottles.jpg",
      "/3d-company-signage-letters.jpg"
    ],
    client: "Restaurant Chain",
    date: "2024-03-05",
    featured: false,
    tags: ["Acrylic", "Displays", "Restaurant"],
    likes: 23,
    views: 156
  }
]

const categories = ["All", "Branding", "Events", "Vehicle Branding", "Signage", "UV Printing", "Laser Cutting"]

export default function PortfolioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredItems, setFilteredItems] = useState(portfolioItems)

  // Filter items based on search and category
  const filterItems = () => {
    let filtered = portfolioItems

    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredItems(filtered)
  }

  // Update filtered items when dependencies change
  useEffect(() => {
    filterItems()
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our latest projects and see how we've helped businesses transform their brand identity
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search portfolio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No portfolio items found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }>
            {filteredItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                {viewMode === "grid" ? (
                  // Grid View
                  <>
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="secondary">
                            <ZoomIn className="h-4 w-4 mr-1" />
                            Quick Look
                          </Button>
                        </div>
                      </div>
                      {item.featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Heart className="h-3 w-3" />
                          {item.likes}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>{item.client}</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full">
                        View Project <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </>
                ) : (
                  // List View
                  <div className="flex">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{item.category}</Badge>
                            {item.featured && (
                              <Badge className="bg-yellow-500">Featured</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span>Client: {item.client}</span>
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {item.views}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredItems.length > 0 && (
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Projects
          </Button>
        </div>
      )}
    </div>
  )
}
