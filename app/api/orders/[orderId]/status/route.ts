import { NextResponse } from "next/server"
import { 
  getOrderById, 
  updateOrderStatus,
  OrderStatus 
} from '@/lib/orders'

interface RouteParams {
  params: Promise<{
    orderId: string
  }>
}

// PUT /api/orders/[orderId]/status - Update order status
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { status }: { status: OrderStatus } = await req.json()
    
    if (!status) {
      return NextResponse.json({
        success: false,
        error: 'Status is required',
      }, { status: 400 })
    }
    
    const { orderId } = await params
    
    // Validate that order exists
    const existingOrder = await getOrderById(orderId)
    if (!existingOrder) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
      }, { status: 404 })
    }
    
    // Update order status
    const order = await updateOrderStatus(orderId, status)
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update order status',
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update order status',
    }, { status: 500 })
  }
}
