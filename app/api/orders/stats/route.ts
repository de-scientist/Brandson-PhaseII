import { NextResponse } from "next/server"
import { getOrderStats, OrderFilter } from '@/lib/orders'

// GET /api/orders/stats - Get order statistics
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Parse filter parameters for stats
    const filter: OrderFilter = {}
    
    if (searchParams.get('date_from')) {
      filter.dateFrom = new Date(searchParams.get('date_from')!)
    }
    
    if (searchParams.get('date_to')) {
      filter.dateTo = new Date(searchParams.get('date_to')!)
    }
    
    if (searchParams.get('customer_email')) {
      filter.customerEmail = searchParams.get('customer_email')!
    }
    
    const stats = await getOrderStats(filter)
    
    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching order stats:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order statistics',
    }, { status: 500 })
  }
}
