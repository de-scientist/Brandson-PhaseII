import { NextResponse } from "next/server"
import { 
  createInvoiceFromOrder,
  getInvoices,
  getInvoiceStats,
  InvoiceStatus
} from '@/lib/invoices'
import { getOrderById } from '@/lib/orders'

// GET /api/invoices - Retrieve invoices with optional filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Parse filter parameters
    const filter: any = {}
    
    if (searchParams.get('status')) {
      filter.status = searchParams.get('status')?.split(',') as InvoiceStatus[]
    }
    
    if (searchParams.get('customer_email')) {
      filter.customerId = searchParams.get('customer_email')!
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
    
    // Check if requesting stats
    if (searchParams.get('stats') === 'true') {
      const stats = await getInvoiceStats(filter)
      return NextResponse.json({
        success: true,
        data: stats,
      })
    }
    
    const invoices = await getInvoices(filter)
    
    return NextResponse.json({
      success: true,
      data: invoices,
      count: invoices.length,
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch invoices',
    }, { status: 500 })
  }
}

// POST /api/invoices - Create new invoice (typically from order)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId } = body
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required',
      }, { status: 400 })
    }
    
    // Get the order
    const order = await getOrderById(orderId)
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
      }, { status: 404 })
    }
    
    // Check if invoice already exists for this order
    const existingInvoices = await getInvoices()
    const existingInvoice = existingInvoices.find(inv => inv.orderId === orderId)
    
    if (existingInvoice) {
      return NextResponse.json({
        success: false,
        error: 'Invoice already exists for this order',
        data: existingInvoice,
      }, { status: 409 })
    }
    
    // Create invoice from order
    const invoice = await createInvoiceFromOrder(order)
    
    return NextResponse.json({
      success: true,
      data: invoice,
    })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create invoice',
    }, { status: 500 })
  }
}
