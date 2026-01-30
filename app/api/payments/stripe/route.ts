import { NextResponse } from "next/server"
import { 
  createCheckoutSession, 
  createPaymentIntent,
  createOrRetrieveCustomer,
  productToLineItem,
  getProductById 
} from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, items, productIds, quantities, successUrl, cancelUrl, customerEmail, amount } = body

    // Validate required parameters
    if (!successUrl || !cancelUrl) {
      return NextResponse.json({
        error: "Missing required parameters: successUrl, cancelUrl"
      }, { status: 400 })
    }

    let lineItems: any[] = []

    // Handle different payment types
    if (type === 'checkout' && productIds) {
      // Product catalog checkout
      const productQuantities = quantities || productIds.map(() => 1)
      
      for (let i = 0; i < productIds.length; i++) {
        const product = getProductById(productIds[i])
        if (!product) {
          return NextResponse.json({
            error: `Product not found: ${productIds[i]}`
          }, { status: 400 })
        }
        
        lineItems.push(productToLineItem(product, productQuantities[i]))
      }
    } else if (type === 'checkout' && items) {
      // Direct line items
      lineItems = items
    } else if (type === 'payment_intent' && amount) {
      // Custom amount payment intent
      if (!customerEmail) {
        return NextResponse.json({
          error: "Customer email is required for payment intents"
        }, { status: 400 })
      }

      // Create or retrieve customer
      const customer = await createOrRetrieveCustomer(customerEmail)
      
      // Create payment intent
      const paymentIntent = await createPaymentIntent(
        Math.round(amount * 100), // Convert to cents
        'kes',
        { customer_id: customer.id }
      )

      return NextResponse.json({
        type: 'payment_intent',
        client_secret: paymentIntent.client_secret,
        customer_id: customer.id
      })
    } else {
      return NextResponse.json({
        error: "Invalid payment type or missing required parameters"
      }, { status: 400 })
    }

    // Create customer if email provided
    let customerId
    if (customerEmail) {
      const customer = await createOrRetrieveCustomer(customerEmail)
      customerId = customer.id
    }

    // Create checkout session
    const session = await createCheckoutSession({
      items: lineItems,
      successUrl,
      cancelUrl,
      customerEmail,
      metadata: {
        customer_id: customerId || '',
        source: 'brandson-website',
      },
    })

    return NextResponse.json({
      type: 'checkout',
      id: session.id,
      url: session.url,
      customer_id: customerId
    })

  } catch (error) {
    console.error('Stripe payment error:', error)
    return NextResponse.json({ 
      error: "Failed to process payment request" 
    }, { status: 500 })
  }
}

// Retrieve checkout session
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      return NextResponse.json({
        error: "Missing session_id parameter"
      }, { status: 400 })
    }

    const { getCheckoutSession } = await import('@/lib/stripe')
    const session = await getCheckoutSession(sessionId)

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
        metadata: session.metadata,
      }
    })

  } catch (error) {
    console.error('Stripe session retrieval error:', error)
    return NextResponse.json({ 
      error: "Failed to retrieve session" 
    }, { status: 500 })
  }
}

