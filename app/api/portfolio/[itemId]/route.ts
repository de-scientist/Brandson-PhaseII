import { NextResponse } from "next/server"
import { getPortfolioItemById, getRelatedPortfolioItems } from '@/lib/portfolio'

interface RouteParams {
  params: Promise<{
    itemId: string
  }>
}

// GET /api/portfolio/[itemId] - Get specific portfolio item
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(req.url)
    const { itemId } = await params
    
    // Get portfolio item
    const item = await getPortfolioItemById(itemId)
    
    if (!item) {
      return NextResponse.json({
        success: false,
        error: 'Portfolio item not found',
      }, { status: 404 })
    }

    // Check if requesting related items
    if (searchParams.get('related') === 'true') {
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 4
      const relatedItems = await getRelatedPortfolioItems(itemId, limit)
      
      return NextResponse.json({
        success: true,
        data: {
          item,
          relatedItems,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: item,
    })
  } catch (error) {
    console.error('Portfolio item API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch portfolio item',
    }, { status: 500 })
  }
}
