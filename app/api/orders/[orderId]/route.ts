import { NextResponse } from "next/server"
import { 
  getOrderById, 
  updateOrder, 
  deleteOrder,
  updateOrderStatus,
  updatePaymentStatus,
  OrderUpdateInput
} from '@/lib/orders'

interface RouteParams {
  params: Promise<{
    orderId: string
  }>
}

// GET /api/orders/[orderId] - Get specific order
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params
    const order = await getOrderById(orderId)
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order',
    }, { status: 500 })
  }
}

// PUT /api/orders/[orderId] - Update order
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const updates: OrderUpdateInput = await req.json()
    const { orderId } = await params
    
    const order = await updateOrder(orderId, updates)
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update order',
    }, { status: 500 })
  }
}

// DELETE /api/orders/[orderId] - Delete/cancel order
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { orderId } = await params
    const success = await deleteOrder(orderId)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to cancel order',
    }, { status: 500 })
  }
}
