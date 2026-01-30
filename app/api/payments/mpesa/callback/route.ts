import { NextResponse } from "next/server"
import { processMpesaCallback, MpesaCallback } from '@/lib/mpesa'
import { 
  updatePaymentStatus, 
  updateOrderStatus,
  getOrderByNumber,
  PaymentStatus,
  OrderStatus,
  PaymentMethod
} from '@/lib/orders'

export async function POST(req: Request) {
  try {
    const callbackData: MpesaCallback = await req.json()
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2))
    
    // Process the callback data
    const result = processMpesaCallback(callbackData)
    
    // Log the processed result
    console.log('Processed M-Pesa callback result:', result)
    
    // Extract order information from callback metadata if available
    // This would need to be passed during STK Push initiation
    const orderNumber = callbackData.Body.stkCallback.MerchantRequestID
    
    if (result.success) {
      // Payment was successful
      console.log(`Payment successful: ${result.mpesaReceipt} for KES ${result.amount}`)
      
      // Find and update the order
      if (orderNumber) {
        const order = await getOrderByNumber(orderNumber)
        if (order) {
          // Update payment status
          await updatePaymentStatus(order.id, 'paid', 'mpesa')
          
          // Update order status to confirmed
          await updateOrderStatus(order.id, 'confirmed')
          
          console.log(`Order ${orderNumber} payment confirmed via M-Pesa`)
          
          // TODO: Send confirmation email to customer
          // TODO: Send SMS confirmation
          // TODO: Notify admin staff
          // TODO: Create invoice
          // TODO: Update inventory if applicable
        } else {
          console.error(`Order not found for M-Pesa payment: ${orderNumber}`)
        }
      }
      
    } else {
      // Payment failed or was cancelled
      console.log(`Payment failed: ${result.resultDesc}`)
      
      // Find and update the order
      if (orderNumber) {
        const order = await getOrderByNumber(orderNumber)
        if (order) {
          // Update payment status to failed
          await updatePaymentStatus(order.id, 'failed')
          
          console.log(`Order ${orderNumber} payment failed via M-Pesa`)
          
          // TODO: Notify customer of payment failure
          // TODO: Offer retry options
          // TODO: Send failure notification to admin
        }
      }
    }
    
    // Return success response to M-Pesa
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    })
  } catch (error) {
    console.error('M-Pesa callback processing error:', error)
    
    // Still return success to M-Pesa to avoid retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback received',
    })
  }
}
