import { NextResponse } from "next/server"
import { processMpesaCallback, MpesaCallback } from '@/lib/mpesa'

export async function POST(req: Request) {
  try {
    const callbackData: MpesaCallback = await req.json()
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2))
    
    // Process the callback data
    const result = processMpesaCallback(callbackData)
    
    // Log the processed result
    console.log('Processed M-Pesa callback result:', result)
    
    // Here you would typically:
    // 1. Update order status in your database
    // 2. Send confirmation email/SMS to customer
    // 3. Update inventory if applicable
    // 4. Notify admin staff
    // 5. Create invoice if payment successful
    
    if (result.success) {
      // Payment was successful
      console.log(`Payment successful: ${result.mpesaReceipt} for KES ${result.amount}`)
      
      // TODO: Implement business logic for successful payment
      // - Update order status to 'paid'
      // - Send payment confirmation
      // - Trigger fulfillment process
      
    } else {
      // Payment failed or was cancelled
      console.log(`Payment failed: ${result.resultDesc}`)
      
      // TODO: Implement business logic for failed payment
      // - Update order status to 'failed'
      // - Notify customer of payment failure
      // - Offer retry options
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
