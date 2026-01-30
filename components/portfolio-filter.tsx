"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  Calendar,
  DollarSign,
  Star
} from "lucide-react"

interface PortfolioFilterProps {
  onFilterChange: (filters: any) => void
  categories: string[]
  subcategories: string[]
  tags: string[]
  services: string[]
  initialFilters?: any
}

export function PortfolioFilter({ 
  onFilterChange, 
  categories, 
  subcategories, 
  tags, 
  services,
  initialFilters = {}
}: PortfolioFilterProps) {
  const [filters, setFilters] = useState(initialFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '')

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const addCategory = (category: string) => {
    const current = filters.categories || []
    if (!current.includes(category)) {
      updateFilter('categories', [...current, category])
    }
  }

  const removeCategory = (category: string) => {
    const current = filters.categories || []
    updateFilter('categories', current.filter((c: string) => c !== category))
  }

  const addTag = (tag: string) => {
    const current = filters.tags || []
    if (!current.includes(tag)) {
      updateFilter('tags', [...current, tag])
    }
  }

  const removeTag = (tag: string) => {
    const current = filters.tags || []
    updateFilter('tags', current.filter((t: string) => t !== tag))
  }

  const addService = (service: string) => {
    const current = filters.services || []
    if (!current.includes(service)) {
      updateFilter('services', [...current, service])
    }
  }

  const removeService = (service: string) => {
    const current = filters.services || []
    updateFilter('services', current.filter((s: string) => s !== service))
  }

  const clearAllFilters = () => {
    setFilters({})
    setSearchQuery('')
    onFilterChange({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== filters.search) {
        updateFilter('search', searchQuery || undefined)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filter Portfolio
            </CardTitle>
            <CardDescription>
              Find projects by category, tags, services, or search terms
            </CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects, clients, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.featured ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter('featured', filters.featured ? undefined : true)}
          >
            <Star className="h-4 w-4 mr-2" />
            Featured
          </Button>
          <Button
            variant={filters.status?.includes('completed') ? "default" : "outline"}
            size="sm"
            onClick={() => {
              const current = filters.status || []
              if (current.includes('completed')) {
                updateFilter('status', current.filter((s: string) => s !== 'completed'))
              } else {
                updateFilter('status', [...current, 'completed'])
              }
            }}
          >
            Completed
          </Button>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-medium mb-3">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filters.categories?.includes(category) ? "default" : "outline"}
                size="sm"
                onClick={() => 
                  filters.categories?.includes(category) 
                    ? removeCategory(category)
                    : addCategory(category)
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div>
            <h4 className="font-medium mb-3">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              {filters.categories?.map((category: string) => (
                <Badge key={category} variant="secondary" className="gap-1">
                  {category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeCategory(category)}
                  />
                </Badge>
              ))}
              {filters.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  Tag: {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
              {filters.services?.map((service: string) => (
                <Badge key={service} variant="secondary" className="gap-1">
                  Service: {service}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeService(service)}
                  />
                </Badge>
              ))}
              {filters.featured && (
                <Badge variant="secondary" className="gap-1">
                  Featured
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('featured', undefined)}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Advanced Filters Toggle */}
        <div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
          >
            <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Advanced Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Tags */}
            <div>
              <h4 className="font-medium mb-3">Tags</h4>
              <div className="max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 20).map((tag) => (
                    <Button
                      key={tag}
                      variant={filters.tags?.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        filters.tags?.includes(tag) 
                          ? removeTag(tag)
                          : addTag(tag)
                      }
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-medium mb-3">Services</h4>
              <div className="max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <Button
                      key={service}
                      variant={filters.services?.includes(service) ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        filters.services?.includes(service) 
                          ? removeService(service)
                          : addService(service)
                      }
                    >
                      {service}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h4 className="font-medium mb-3">Sort By</h4>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.sortBy || 'date'}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                  <option value="views">Views</option>
                  <option value="featured">Featured</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.sortOrder || 'desc'}
                  onChange={(e) => updateFilter('sortOrder', e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
