import { NextResponse } from "next/server"
import { 
  getOrderById, 
  updatePaymentStatus,
  PaymentStatus,
  PaymentMethod
} from '@/lib/orders'

interface RouteParams {
  params: Promise<{
    orderId: string
  }>
}

// PUT /api/orders/[orderId]/payment - Update payment status
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { 
      paymentStatus, 
      paymentMethod 
    }: { 
      paymentStatus: PaymentStatus
      paymentMethod?: PaymentMethod 
    } = await req.json()
    
    if (!paymentStatus) {
      return NextResponse.json({
        success: false,
        error: 'Payment status is required',
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
    
    // Update payment status
    const order = await updatePaymentStatus(orderId, paymentStatus, paymentMethod)
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update payment status',
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      data: order,
      message: `Payment status updated to ${paymentStatus}`,
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update payment status',
    }, { status: 500 })
  }
}
