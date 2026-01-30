import { NextResponse } from "next/server"
import { initiateStkPush, validateMpesaConfig, MpesaPaymentRequest } from '@/lib/mpesa'

export async function POST(req: Request) {
  try {
    // Validate M-Pesa configuration
    const configValidation = validateMpesaConfig()
    if (!configValidation.valid) {
      console.error('M-Pesa configuration missing:', configValidation.missing)
      return NextResponse.json({
        success: false,
        message: 'M-Pesa is not properly configured',
        error: 'Configuration error',
      }, { status: 500 })
    }

    const body = await req.json()
    const { phoneNumber, amount, accountReference, transactionDesc, callbackUrl } = body

    // Validate required fields
    if (!phoneNumber || !amount || !accountReference) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: phoneNumber, amount, accountReference',
      }, { status: 400 })
    }

    // Validate amount
    if (amount < 1 || amount > 150000) {
      return NextResponse.json({
        success: false,
        message: 'Amount must be between KES 1 and KES 150,000',
      }, { status: 400 })
    }

    const paymentRequest: MpesaPaymentRequest = {
      phoneNumber,
      amount,
      accountReference,
      transactionDesc: transactionDesc || 'Brandson Media Payment',
      callbackUrl,
    }

    const result = await initiateStkPush(paymentRequest)
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('M-Pesa payment error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Payment processing failed',
    }, { status: 500 })
  }
}

// Handle M-Pesa callback
export async function PUT(req: Request) {
  try {
    const callbackData = await req.json()
    console.log('M-Pesa callback received:', callbackData)
    
    // Here you would typically:
    // 1. Process the callback data
    // 2. Update order status in your database
    // 3. Send confirmation to customer
    // 4. Trigger any business logic
    
    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully',
    })
  } catch (error) {
    console.error('M-Pesa callback error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to process callback',
    }, { status: 500 })
  }
}

