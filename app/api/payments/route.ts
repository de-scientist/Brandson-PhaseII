import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET() {
  try {
    // Return payment methods and configuration
    const paymentMethods = [
      {
        id: 'mpesa',
        name: 'M-Pesa',
        description: 'Pay via M-Pesa mobile money',
        icon: '📱',
        enabled: true,
        currencies: ['KES']
      },
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, Mastercard, or other cards',
        icon: '💳',
        enabled: true,
        currencies: ['KES', 'USD', 'EUR']
      },
      {
        id: 'bank-transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer to our account',
        icon: '🏦',
        enabled: true,
        currencies: ['KES']
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        paymentMethods,
        supportedCurrencies: ['KES', 'USD', 'EUR'],
        defaultCurrency: 'KES'
      }
    })
  } catch (error) {
    console.error('Payments API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch payment methods'
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, currency, method, items, customerInfo } = body

    // Validate required fields
    if (!amount || !method || !customerInfo) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: amount, method, customerInfo'
      }, { status: 400 })
    }

    // Process payment based on method
    let paymentResponse

    switch (method) {
      case 'mpesa':
        paymentResponse = await processMpesaPayment(amount, customerInfo)
        break
      case 'stripe':
        paymentResponse = await processStripePayment(amount, currency, items, customerInfo)
        break
      case 'bank-transfer':
        paymentResponse = await processBankTransfer(amount, customerInfo)
        break
      default:
        return NextResponse.json({
          success: false,
          error: 'Unsupported payment method'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: paymentResponse
    })
  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json({
      success: false,
      error: 'Payment processing failed'
    }, { status: 500 })
  }
}

async function processMpesaPayment(amount: number, customerInfo: any) {
  // In production, integrate with M-Pesa API
  return {
    method: 'mpesa',
    transactionId: `MPESA_${Date.now()}`,
    phoneNumber: customerInfo.phone,
    amount,
    status: 'pending',
    instructions: 'Please check your phone for M-Pesa prompt and enter your PIN to complete payment'
  }
}

async function processStripePayment(amount: number, currency: string, items: any[], customerInfo: any) {
  // In production, integrate with Stripe API
  return {
    method: 'stripe',
    paymentIntentId: `pi_${Date.now()}`,
    amount,
    currency,
    status: 'requires_payment_method',
    clientSecret: `pi_${Date.now()}_secret_${Date.now()}`,
    items
  }
}

async function processBankTransfer(amount: number, customerInfo: any) {
  // Return bank transfer details
  return {
    method: 'bank-transfer',
    transactionId: `BT_${Date.now()}`,
    amount,
    status: 'pending',
    bankDetails: {
      bankName: 'Equity Bank Kenya',
      accountName: 'Brandson Media Limited',
      accountNumber: '0030192837465',
      branch: 'Nairobi CBD Branch',
      sortCode: '070100'
    },
    instructions: 'Please transfer the amount to the bank account above and share the payment slip with us'
  }
}
