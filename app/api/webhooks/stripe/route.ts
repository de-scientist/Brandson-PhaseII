import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { handleStripeWebhook } from '@/lib/stripe'
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
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    // Verify webhook signature
    const event = await handleStripeWebhook(body, signature, webhookSecret)

    console.log(`Stripe webhook received: ${event.type}`)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as any)
        break

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object as any)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as any)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as any)
        break

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as any)
        break

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    console.log('Processing completed checkout session:', session.id)

    // Extract order information from metadata
    const orderNumber = session.metadata?.order_number
    const customerEmail = session.customer_details?.email

    if (!orderNumber) {
      console.error('No order number in session metadata')
      return
    }

    // Find the order
    const order = await getOrderByNumber(orderNumber)
    if (!order) {
      console.error(`Order not found: ${orderNumber}`)
      return
    }

    // Update payment status
    await updatePaymentStatus(order.id, 'paid', 'stripe')

    // Update order status to confirmed
    await updateOrderStatus(order.id, 'confirmed')

    console.log(`Order ${orderNumber} payment confirmed via Stripe`)

    // TODO: Send confirmation email to customer
    // TODO: Send notification to admin
    // TODO: Create invoice
    // TODO: Update inventory if applicable

  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handleCheckoutSessionExpired(session: any) {
  try {
    console.log('Processing expired checkout session:', session.id)

    const orderNumber = session.metadata?.order_number
    if (!orderNumber) return

    const order = await getOrderByNumber(orderNumber)
    if (!order) return

    // Update payment status to failed
    await updatePaymentStatus(order.id, 'failed')

    console.log(`Order ${orderNumber} payment expired`)

    // TODO: Send payment failure notification
    // TODO: Offer retry options

  } catch (error) {
    console.error('Error handling checkout session expired:', error)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log('Processing successful payment intent:', paymentIntent.id)

    const orderNumber = paymentIntent.metadata?.order_number
    if (!orderNumber) return

    const order = await getOrderByNumber(orderNumber)
    if (!order) return

    // Update payment status
    await updatePaymentStatus(order.id, 'paid', 'stripe')

    // Update order status
    await updateOrderStatus(order.id, 'confirmed')

    console.log(`Order ${orderNumber} payment intent succeeded`)

  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    console.log('Processing failed payment intent:', paymentIntent.id)

    const orderNumber = paymentIntent.metadata?.order_number
    if (!orderNumber) return

    const order = await getOrderByNumber(orderNumber)
    if (!order) return

    // Update payment status
    await updatePaymentStatus(order.id, 'failed')

    console.log(`Order ${orderNumber} payment intent failed`)

  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}

async function handlePaymentIntentCanceled(paymentIntent: any) {
  try {
    console.log('Processing canceled payment intent:', paymentIntent.id)

    const orderNumber = paymentIntent.metadata?.order_number
    if (!orderNumber) return

    const order = await getOrderByNumber(orderNumber)
    if (!order) return

    // Update payment status
    await updatePaymentStatus(order.id, 'failed')

    console.log(`Order ${orderNumber} payment intent canceled`)

  } catch (error) {
    console.error('Error handling payment intent canceled:', error)
  }
}
