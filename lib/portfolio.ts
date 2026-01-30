export interface PortfolioItem {
  id: string
  title: string
  description?: string
  category: string
  subcategory?: string
  tags: string[]
  image: string
  images?: string[] // Additional images for gallery view
  client?: string
  projectDate?: Date
  completionDate?: Date
  featured: boolean
  status: 'completed' | 'in-progress' | 'concept'
  services: string[]
  materials?: string[]
  dimensions?: {
    width?: number
    height?: number
    depth?: number
    unit?: string
  }
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
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioFilter {
  categories?: string[]
  subcategories?: string[]
  tags?: string[]
  services?: string[]
  status?: PortfolioItem['status'][]
  featured?: boolean
  dateRange?: {
    from?: Date
    to?: Date
  }
  budgetRange?: {
    min?: number
    max?: number
  }
  search?: string
  sortBy?: 'date' | 'title' | 'views' | 'featured' | 'alphabetical'
  sortOrder?: 'asc' | 'desc'
}

export interface PortfolioStats {
  totalProjects: number
  completedProjects: number
  featuredProjects: number
  totalViews: number
  projectsByCategory: Record<string, number>
  projectsByService: Record<string, number>
  recentProjects: PortfolioItem[]
}

// In-memory storage for development (replace with database in production)
let portfolioItems: PortfolioItem[] = []

// Initialize with sample data
export async function initializePortfolioData(): Promise<void> {
  if (portfolioItems.length > 0) return // Already initialized

  const sampleData: PortfolioItem[] = [
    {
      id: crypto.randomUUID(),
      title: "Corporate T-Shirt Branding",
      description: "Complete corporate uniform branding for a leading tech company",
      category: "Branding",
      subcategory: "Apparel",
      tags: ["corporate", "t-shirts", "uniform", "branding"],
      image: "/branded-corporate-t-shirts-uniform.jpg",
      client: "TechCorp Kenya",
      projectDate: new Date("2024-01-15"),
      completionDate: new Date("2024-01-20"),
      featured: true,
      status: "completed",
      services: ["Screen Printing", "Design", "Embroidery"],
      materials: ["Cotton", "Polyester Blend"],
      dimensions: { unit: "units" },
      location: "Nairobi, Kenya",
      budget: { min: 50000, max: 100000, currency: "KES" },
      metadata: { views: 245, likes: 18, shares: 5 },
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      id: crypto.randomUUID(),
      title: "Roll-Up Banner Design",
      description: "Professional roll-up banners for trade show exhibition",
      category: "Printing",
      subcategory: "Banners",
      tags: ["banner", "roll-up", "exhibition", "trade-show"],
      image: "/professional-roll-up-banner-stand.jpg",
      client: "Expo Events Ltd",
      projectDate: new Date("2024-02-10"),
      completionDate: new Date("2024-02-15"),
      featured: false,
      status: "completed",
      services: ["Large Format Printing", "Design", "Installation"],
      materials: ["Vinyl", "Aluminum Frame"],
      dimensions: { width: 85, height: 200, unit: "cm" },
      location: "KICC, Nairobi",
      budget: { min: 15000, max: 30000, currency: "KES" },
      metadata: { views: 156, likes: 12, shares: 3 },
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-15"),
    },
    {
      id: crypto.randomUUID(),
      title: "Vehicle Fleet Branding",
      description: "Complete vehicle branding for delivery fleet",
      category: "Branding",
      subcategory: "Vehicle Graphics",
      tags: ["vehicle", "fleet", "branding", "delivery"],
      image: "/branded-vehicle-fleet-company-cars.jpg",
      client: "FastDelivery Services",
      projectDate: new Date("2024-03-05"),
      completionDate: new Date("2024-03-12"),
      featured: true,
      status: "completed",
      services: ["Vehicle Wrapping", "Design", "Installation"],
      materials: ["Vinyl Wrap", "Laminate"],
      dimensions: { unit: "vehicles" },
      location: "Nairobi, Kenya",
      budget: { min: 200000, max: 500000, currency: "KES" },
      metadata: { views: 389, likes: 34, shares: 8 },
      createdAt: new Date("2024-03-12"),
      updatedAt: new Date("2024-03-12"),
    },
    {
      id: crypto.randomUUID(),
      title: "Restaurant 3D Signage",
      description: "Illuminated 3D signage for upscale restaurant",
      category: "Signage",
      subcategory: "3D Signs",
      tags: ["3d", "signage", "restaurant", "illuminated"],
      image: "/3d-restaurant-signage-illuminated.jpg",
      client: "The Grand Restaurant",
      projectDate: new Date("2024-04-20"),
      completionDate: new Date("2024-04-28"),
      featured: true,
      status: "completed",
      services: ["3D Fabrication", "LED Installation", "Design"],
      materials: ["Acrylic", "LED Lights", "Metal Frame"],
      dimensions: { width: 300, height: 150, depth: 10, unit: "cm" },
      location: "Westlands, Nairobi",
      budget: { min: 80000, max: 150000, currency: "KES" },
      metadata: { views: 412, likes: 28, shares: 6 },
      createdAt: new Date("2024-04-28"),
      updatedAt: new Date("2024-04-28"),
    },
    {
      id: crypto.randomUUID(),
      title: "Branded Water Bottles",
      description: "UV printed promotional water bottles for corporate event",
      category: "UV Printing",
      subcategory: "Promotional Items",
      tags: ["uv-printing", "water-bottles", "promotional", "corporate"],
      image: "/uv-printed-branded-water-bottles.jpg",
      client: "Summit Conference 2024",
      projectDate: new Date("2024-05-15"),
      completionDate: new Date("2024-05-18"),
      featured: false,
      status: "completed",
      services: ["UV Printing", "Product Sourcing"],
      materials: ["Aluminum Bottles", "UV Ink"],
      dimensions: { unit: "bottles" },
      location: "Kenyatta International Convention Centre",
      budget: { min: 25000, max: 40000, currency: "KES" },
      metadata: { views: 178, likes: 15, shares: 4 },
      createdAt: new Date("2024-05-18"),
      updatedAt: new Date("2024-05-18"),
    },
    {
      id: crypto.randomUUID(),
      title: "Conference Event Setup",
      description: "Complete branding and setup for international conference",
      category: "Events",
      subcategory: "Conference",
      tags: ["conference", "event", "branding", "setup"],
      image: "/corporate-conference-event-branding.jpg",
      client: "Africa Business Summit",
      projectDate: new Date("2024-06-10"),
      completionDate: new Date("2024-06-12"),
      featured: true,
      status: "completed",
      services: ["Event Branding", "Stage Design", "Banner Printing", "Installation"],
      materials: ["Fabric", "Foam Board", "LED Screens"],
      dimensions: { unit: "venue" },
      location: "KICC, Nairobi",
      budget: { min: 500000, max: 1000000, currency: "KES" },
      metadata: { views: 567, likes: 45, shares: 12 },
      createdAt: new Date("2024-06-12"),
      updatedAt: new Date("2024-06-12"),
    },
    {
      id: crypto.randomUUID(),
      title: "Acrylic Menu Holders",
      description: "Custom acrylic menu holders for restaurant chain",
      category: "Signage",
      subcategory: "Menu Displays",
      tags: ["acrylic", "menu", "restaurant", "display"],
      image: "/acrylic-menu-holders.jpg",
      client: "Pizza Palace Chain",
      projectDate: new Date("2024-07-08"),
      completionDate: new Date("2024-07-15"),
      featured: false,
      status: "completed",
      services: ["Laser Cutting", "Acrylic Fabrication", "Design"],
      materials: ["Acrylic", "LED Base"],
      dimensions: { width: 25, height: 35, unit: "cm" },
      location: "Multiple Locations",
      budget: { min: 30000, max: 60000, currency: "KES" },
      metadata: { views: 134, likes: 8, shares: 2 },
      createdAt: new Date("2024-07-15"),
      updatedAt: new Date("2024-07-15"),
    },
    {
      id: crypto.randomUUID(),
      title: "Promotional Pens",
      description: "Branded promotional pens for marketing campaign",
      category: "UV Printing",
      subcategory: "Promotional Items",
      tags: ["pens", "promotional", "marketing", "branding"],
      image: "/branded-pens.jpg",
      client: "Marketing Pro Agency",
      projectDate: new Date("2024-08-20"),
      completionDate: new Date("2024-08-22"),
      featured: false,
      status: "completed",
      services: ["UV Printing", "Product Sourcing"],
      materials: ["Plastic Pens", "UV Ink"],
      dimensions: { unit: "pens" },
      location: "Nairobi, Kenya",
      budget: { min: 10000, max: 25000, currency: "KES" },
      metadata: { views: 98, likes: 6, shares: 1 },
      createdAt: new Date("2024-08-22"),
      updatedAt: new Date("2024-08-22"),
    },
  ]

  portfolioItems = sampleData
}

/**
 * Get all portfolio items with optional filtering
 */
export async function getPortfolioItems(filter?: PortfolioFilter): Promise<PortfolioItem[]> {
  await initializePortfolioData()
  
  let filteredItems = [...portfolioItems]

  if (filter) {
    // Category filter
    if (filter.categories?.length) {
      filteredItems = filteredItems.filter(item => 
        filter.categories!.includes(item.category)
      )
    }

    // Subcategory filter
    if (filter.subcategories?.length) {
      filteredItems = filteredItems.filter(item => 
        item.subcategory && filter.subcategories!.includes(item.subcategory)
      )
    }

    // Tags filter
    if (filter.tags?.length) {
      filteredItems = filteredItems.filter(item =>
        filter.tags!.some(tag => item.tags.includes(tag))
      )
    }

    // Services filter
    if (filter.services?.length) {
      filteredItems = filteredItems.filter(item =>
        filter.services!.some(service => item.services.includes(service))
      )
    }

    // Status filter
    if (filter.status?.length) {
      filteredItems = filteredItems.filter(item => 
        filter.status!.includes(item.status)
      )
    }

    // Featured filter
    if (filter.featured !== undefined) {
      filteredItems = filteredItems.filter(item => item.featured === filter.featured)
    }

    // Date range filter
    if (filter.dateRange?.from) {
      filteredItems = filteredItems.filter(item => 
        item.completionDate && item.completionDate >= filter.dateRange!.from!
      )
    }

    if (filter.dateRange?.to) {
      filteredItems = filteredItems.filter(item => 
        item.completionDate && item.completionDate <= filter.dateRange!.to!
      )
    }

    // Budget range filter
    if (filter.budgetRange?.min) {
      filteredItems = filteredItems.filter(item =>
        item.budget?.max && item.budget.max >= filter.budgetRange!.min!
      )
    }

    if (filter.budgetRange?.max) {
      filteredItems = filteredItems.filter(item =>
        item.budget?.min && item.budget.min <= filter.budgetRange!.max!
      )
    }

    // Search filter
    if (filter.search) {
      const search = filter.search.toLowerCase()
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.client?.toLowerCase().includes(search) ||
        item.tags.some(tag => tag.toLowerCase().includes(search)) ||
        item.services.some(service => service.toLowerCase().includes(search))
      )
    }

    // Sorting
    const sortBy = filter.sortBy || 'date'
    const sortOrder = filter.sortOrder || 'desc'

    filteredItems.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'date':
          comparison = a.completionDate!.getTime() - b.completionDate!.getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'views':
          comparison = (a.metadata?.views || 0) - (b.metadata?.views || 0)
          break
        case 'featured':
          comparison = (a.featured ? 1 : 0) - (b.featured ? 1 : 0)
          break
        case 'alphabetical':
          comparison = a.title.localeCompare(b.title)
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  return filteredItems
}

/**
 * Get portfolio item by ID
 */
export async function getPortfolioItemById(id: string): Promise<PortfolioItem | null> {
  await initializePortfolioData()
  const item = portfolioItems.find(i => i.id === id)
  return item || null
}

/**
 * Get portfolio statistics
 */
export async function getPortfolioStats(): Promise<PortfolioStats> {
  await initializePortfolioData()
  
  const stats: PortfolioStats = {
    totalProjects: portfolioItems.length,
    completedProjects: portfolioItems.filter(i => i.status === 'completed').length,
    featuredProjects: portfolioItems.filter(i => i.featured).length,
    totalViews: portfolioItems.reduce((sum, i) => sum + (i.metadata?.views || 0), 0),
    projectsByCategory: {},
    projectsByService: {},
    recentProjects: portfolioItems
      .filter(i => i.status === 'completed')
      .sort((a, b) => b.completionDate!.getTime() - a.completionDate!.getTime())
      .slice(0, 6),
  }

  // Count by category
  portfolioItems.forEach(item => {
    stats.projectsByCategory[item.category] = (stats.projectsByCategory[item.category] || 0) + 1
  })

  // Count by service
  portfolioItems.forEach(item => {
    item.services.forEach(service => {
      stats.projectsByService[service] = (stats.projectsByService[service] || 0) + 1
    })
  })

  return stats
}

/**
 * Get available categories
 */
export async function getPortfolioCategories(): Promise<string[]> {
  await initializePortfolioData()
  return [...new Set(portfolioItems.map(item => item.category))]
}

/**
 * Get available subcategories
 */
export async function getPortfolioSubcategories(): Promise<string[]> {
  await initializePortfolioData()
  return [...new Set(portfolioItems.map(item => item.subcategory).filter(Boolean) as string[])]
}

/**
 * Get available tags
 */
export async function getPortfolioTags(): Promise<string[]> {
  await initializePortfolioData()
  const allTags = portfolioItems.flatMap(item => item.tags)
  return [...new Set(allTags)]
}

/**
 * Get available services
 */
export async function getPortfolioServices(): Promise<string[]> {
  await initializePortfolioData()
  const allServices = portfolioItems.flatMap(item => item.services)
  return [...new Set(allServices)]
}

/**
 * Get featured portfolio items
 */
export async function getFeaturedPortfolioItems(limit?: number): Promise<PortfolioItem[]> {
  await initializePortfolioData()
  const featured = portfolioItems.filter(item => item.featured)
  return limit ? featured.slice(0, limit) : featured
}

/**
 * Get related portfolio items
 */
export async function getRelatedPortfolioItems(itemId: string, limit: number = 4): Promise<PortfolioItem[]> {
  await initializePortfolioData()
  
  const item = await getPortfolioItemById(itemId)
  if (!item) return []

  // Find items with same category or tags
  const related = portfolioItems
    .filter(i => 
      i.id !== itemId && (
        i.category === item.category ||
        i.tags.some(tag => item.tags.includes(tag))
      )
    )
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === item.category && b.category !== item.category) return -1
      if (b.category === item.category && a.category !== item.category) return 1
      
      // Then by featured status
      if (a.featured && !b.featured) return -1
      if (b.featured && !a.featured) return 1
      
      // Then by views
      return (b.metadata?.views || 0) - (a.metadata?.views || 0)
    })
    .slice(0, limit)

  return related
}
