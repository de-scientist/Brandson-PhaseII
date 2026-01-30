import { NextResponse } from "next/server"
import { 
  getPortfolioItems, 
  getPortfolioStats, 
  getPortfolioCategories,
  getPortfolioSubcategories,
  getPortfolioTags,
  getPortfolioServices,
  getFeaturedPortfolioItems
} from '@/lib/portfolio'

// GET /api/portfolio - Retrieve portfolio items with filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Check if requesting stats
    if (searchParams.get('stats') === 'true') {
      const stats = await getPortfolioStats()
      return NextResponse.json({
        success: true,
        data: stats,
      })
    }

    // Check if requesting categories
    if (searchParams.get('categories') === 'true') {
      const categories = await getPortfolioCategories()
      return NextResponse.json({
        success: true,
        data: categories,
      })
    }

    // Check if requesting subcategories
    if (searchParams.get('subcategories') === 'true') {
      const subcategories = await getPortfolioSubcategories()
      return NextResponse.json({
        success: true,
        data: subcategories,
      })
    }

    // Check if requesting tags
    if (searchParams.get('tags') === 'true') {
      const tags = await getPortfolioTags()
      return NextResponse.json({
        success: true,
        data: tags,
      })
    }

    // Check if requesting services
    if (searchParams.get('services') === 'true') {
      const services = await getPortfolioServices()
      return NextResponse.json({
        success: true,
        data: services,
      })
    }

    // Check if requesting featured items
    if (searchParams.get('featured') === 'true') {
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
      const featured = await getFeaturedPortfolioItems(limit)
      return NextResponse.json({
        success: true,
        data: featured,
      })
    }

    // Parse filter parameters
    const filter: any = {}
    
    if (searchParams.get('categories')) {
      filter.categories = searchParams.get('categories')?.split(',').map(c => c.trim())
    }
    
    if (searchParams.get('subcategories')) {
      filter.subcategories = searchParams.get('subcategories')?.split(',').map(s => s.trim())
    }
    
    if (searchParams.get('tags')) {
      filter.tags = searchParams.get('tags')?.split(',').map(t => t.trim())
    }
    
    if (searchParams.get('services')) {
      filter.services = searchParams.get('services')?.split(',').map(s => s.trim())
    }
    
    if (searchParams.get('status')) {
      filter.status = searchParams.get('status')?.split(',').map(s => s.trim()) as any
    }
    
    if (searchParams.get('featured') !== null) {
      filter.featured = searchParams.get('featured') === 'true'
    }
    
    if (searchParams.get('date_from')) {
      filter.dateRange = { ...filter.dateRange, from: new Date(searchParams.get('date_from')!) }
    }
    
    if (searchParams.get('date_to')) {
      filter.dateRange = { ...filter.dateRange, to: new Date(searchParams.get('date_to')!) }
    }
    
    if (searchParams.get('budget_min')) {
      filter.budgetRange = { ...filter.budgetRange, min: parseInt(searchParams.get('budget_min')!) }
    }
    
    if (searchParams.get('budget_max')) {
      filter.budgetRange = { ...filter.budgetRange, max: parseInt(searchParams.get('budget_max')!) }
    }
    
    if (searchParams.get('search')) {
      filter.search = searchParams.get('search')!
    }
    
    if (searchParams.get('sort_by')) {
      filter.sortBy = searchParams.get('sort_by')! as any
    }
    
    if (searchParams.get('sort_order')) {
      filter.sortOrder = searchParams.get('sort_order')! as any
    }

    // Get portfolio items
    const items = await getPortfolioItems(filter)
    
    return NextResponse.json({
      success: true,
      data: items,
      count: items.length,
    })
  } catch (error) {
    console.error('Portfolio API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch portfolio items',
    }, { status: 500 })
  }
}
