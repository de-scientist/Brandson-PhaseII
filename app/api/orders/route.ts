import { NextResponse } from "next/server"
import { 
  createOrder, 
  getOrders, 
  validateOrder,
  OrderCreateInput,
  OrderFilter 
} from '@/lib/orders'

// GET /api/orders - Retrieve orders with optional filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Parse filter parameters
    const filter: OrderFilter = {}
    
    if (searchParams.get('status')) {
      filter.status = searchParams.get('status')?.split(',') as any[]
    }
    
    if (searchParams.get('payment_status')) {
      filter.paymentStatus = searchParams.get('payment_status')?.split(',') as any[]
    }
    
    if (searchParams.get('payment_method')) {
      filter.paymentMethod = searchParams.get('payment_method')?.split(',') as any[]
    }
    
    if (searchParams.get('customer_email')) {
      filter.customerEmail = searchParams.get('customer_email')!
    }
    
    if (searchParams.get('customer_id')) {
      filter.customerId = searchParams.get('customer_id')!
    }
    
    if (searchParams.get('date_from')) {
      filter.dateFrom = new Date(searchParams.get('date_from')!)
    }
    
    if (searchParams.get('date_to')) {
      filter.dateTo = new Date(searchParams.get('date_to')!)
    }
    
    if (searchParams.get('search')) {
      filter.search = searchParams.get('search')!
    }
    
    const orders = await getOrders(filter)
    
    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders',
    }, { status: 500 })
  }
}

// POST /api/orders - Create new order
export async function POST(req: Request) {
  try {
    const body: OrderCreateInput = await req.json()
    
    // Validate order data
    const validation = validateOrder(body)
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      }, { status: 400 })
    }
    
    // Create order
    const order = await createOrder(body)
    
    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create order',
    }, { status: 500 })
  }
}
