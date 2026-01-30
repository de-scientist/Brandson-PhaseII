"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { PortfolioFilter } from "@/components/portfolio-filter"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Grid3X3,
  List,
  SlidersHorizontal,
  Search,
  TrendingUp,
  Eye,
  Star,
  Calendar
} from "lucide-react"

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

export default function EnhancedPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [subcategories, setSubcategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [services, setServices] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<any>({})
  const [stats, setStats] = useState<any>(null)

  // Load initial data
  useEffect(() => {
    loadPortfolioData()
    loadFilterOptions()
    loadStats()
  }, [])

  // Load portfolio items
  const loadPortfolioData = async (filters = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      // Add filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          params.set(key, value.join(','))
        } else if (value !== undefined && value !== null) {
          params.set(key, value.toString())
        }
      })

      const response = await fetch(`/api/portfolio?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setItems(result.data)
        setFilteredItems(result.data)
      }
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load filter options
  const loadFilterOptions = async () => {
    try {
      const [categoriesRes, subcategoriesRes, tagsRes, servicesRes] = await Promise.all([
        fetch('/api/portfolio?categories=true'),
        fetch('/api/portfolio?subcategories=true'),
        fetch('/api/portfolio?tags=true'),
        fetch('/api/portfolio?services=true'),
      ])

      const [categoriesData, subcategoriesData, tagsData, servicesData] = await Promise.all([
        categoriesRes.json(),
        subcategoriesRes.json(),
        tagsRes.json(),
        servicesRes.json(),
      ])

      if (categoriesData.success) setCategories(categoriesData.data)
      if (subcategoriesData.success) setSubcategories(subcategoriesData.data)
      if (tagsData.success) setTags(tagsData.data)
      if (servicesData.success) setServices(servicesData.data)
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await fetch('/api/portfolio?stats=true')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters)
    loadPortfolioData(filters)
  }

  // Handle search
  const handleSearch = (query: string) => {
    handleFilterChange({ ...activeFilters, search: query })
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-dark-section-bg text-dark-section-fg overflow-hidden">
        <div className="absolute inset-0 bg-[url('/modern-printing-press-industrial.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Our <span className="text-secondary">Portfolio</span>
            </h1>
            <p className="mt-6 text-xl text-dark-section-fg/80 leading-relaxed">
              Explore our recent projects and see the quality of our work. 
              Use advanced filters to find exactly what you're looking for.
            </p>
            
            {/* Quick Stats */}
            {stats && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <div className="text-sm text-dark-section-fg/70">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.completedProjects}</div>
                  <div className="text-sm text-dark-section-fg/70">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.featuredProjects}</div>
                  <div className="text-sm text-dark-section-fg/70">Featured</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <div className="text-sm text-dark-section-fg/70">Total Views</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search projects, clients, or keywords..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="lg:w-80 flex-shrink-0">
                <PortfolioFilter
                  onFilterChange={handleFilterChange}
                  categories={categories}
                  subcategories={subcategories}
                  tags={tags}
                  services={services}
                  initialFilters={activeFilters}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {filteredItems.length} Project{filteredItems.length !== 1 ? 's' : ''}
                  </h2>
                  {Object.keys(activeFilters).length > 0 && (
                    <p className="text-muted-foreground text-sm">
                      Filtered results
                    </p>
                  )}
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select
                    className="border border-border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={activeFilters.sortBy || 'date'}
                    onChange={(e) => handleFilterChange({ ...activeFilters, sortBy: e.target.value })}
                  >
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                    <option value="views">Views</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>
              </div>

              {/* Portfolio Grid */}
              <PortfolioGrid
                items={filteredItems}
                loading={loading}
                viewMode={viewMode}
                showClient={true}
                showDate={true}
                showLocation={true}
                showBudget={false}
              />

              {/* Load More Button */}
              {!loading && filteredItems.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">
                    Load More Projects
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Like What You See?</h2>
          <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Let us create something amazing for your brand too. Contact us today to discuss your project.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
              <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                Start Your Project
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href="https://photos.app.goo.gl/62LxMxU1mRU2efhp7" target="_blank" rel="noopener noreferrer">
                View Full Gallery
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
