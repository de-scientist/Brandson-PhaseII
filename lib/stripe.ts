import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image?: string
  category: string
  metadata?: Record<string, string>
}

export interface LineItem {
  price_data: {
    currency: string
    product_data: {
      name: string
      description?: string
      images?: string[]
      metadata?: Record<string, string>
    }
    unit_amount: number
  }
  quantity: number
}

export interface CreateCheckoutSessionParams {
  items: LineItem[]
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}

// Sample product catalog - in production, this would come from a database
export const PRODUCT_CATALOG: Product[] = [
  {
    id: 'business-cards-basic',
    name: 'Business Cards - Basic Pack',
    description: '100 premium business cards with full-color printing',
    price: 2500, // KES 25.00 in cents
    currency: 'kes',
    category: 'printing',
    metadata: {
      type: 'business-cards',
      quantity: '100',
      paper: 'premium',
    },
  },
  {
    id: 'business-cards-premium',
    name: 'Business Cards - Premium Pack',
    description: '200 premium business cards with spot UV finish',
    price: 5500, // KES 55.00 in cents
    currency: 'kes',
    category: 'printing',
    metadata: {
      type: 'business-cards',
      quantity: '200',
      finish: 'spot-uv',
    },
  },
  {
    id: 'flyers-a5',
    name: 'Flyers - A5 Size',
    description: '500 A5 flyers with full-color printing',
    price: 8000, // KES 80.00 in cents
    currency: 'kes',
    category: 'printing',
    metadata: {
      type: 'flyers',
      size: 'a5',
      quantity: '500',
    },
  },
  {
    id: 'banners-vinyl',
    name: 'Vinyl Banner - 2m x 1m',
    description: 'Weather-resistant vinyl banner with eyelets',
    price: 3000, // KES 30.00 in cents
    currency: 'kes',
    category: 'signage',
    metadata: {
      type: 'banner',
      material: 'vinyl',
      size: '2m-x-1m',
    },
  },
  {
    id: 't-shirt-branding',
    name: 'T-Shirt Branding - Single',
    description: 'Custom printed t-shirt with your design',
    price: 1500, // KES 15.00 in cents
    currency: 'kes',
    category: 'branding',
    metadata: {
      type: 't-shirt',
      branding: 'custom-print',
      quantity: '1',
    },
  },
  {
    id: 'vehicle-branding-basic',
    name: 'Vehicle Branding - Basic Package',
    description: 'Basic car branding for doors and rear window',
    price: 15000, // KES 150.00 in cents
    currency: 'kes',
    category: 'branding',
    metadata: {
      type: 'vehicle-branding',
      coverage: 'basic',
      vehicle: 'standard-car',
    },
  },
  {
    id: 'logo-design-basic',
    name: 'Logo Design - Basic Package',
    description: 'Professional logo design with 3 concepts',
    price: 10000, // KES 100.00 in cents
    currency: 'kes',
    category: 'design',
    metadata: {
      type: 'logo-design',
      concepts: '3',
      revisions: '2',
    },
  },
  {
    id: 'brochure-a4',
    name: 'Brochure - A4 Tri-fold',
    description: '1000 A4 tri-fold brochures with full-color printing',
    price: 25000, // KES 250.00 in cents
    currency: 'kes',
    category: 'printing',
    metadata: {
      type: 'brochure',
      size: 'a4',
      fold: 'tri-fold',
      quantity: '1000',
    },
  },
]

/**
 * Get product by ID
 */
export function getProductById(productId: string): Product | undefined {
  return PRODUCT_CATALOG.find(product => product.id === productId)
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return PRODUCT_CATALOG.filter(product => product.category === category)
}

/**
 * Get all product categories
 */
export function getProductCategories(): string[] {
  const categories = PRODUCT_CATALOG.map(product => product.category)
  return [...new Set(categories)]
}

/**
 * Convert product to Stripe line item
 */
export function productToLineItem(product: Product, quantity: number = 1): LineItem {
  return {
    price_data: {
      currency: product.currency,
      product_data: {
        name: product.name,
        description: product.description,
        metadata: product.metadata || {},
      },
      unit_amount: product.price,
    },
    quantity,
  }
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: params.items,
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: {
        source: 'brandson-website',
        ...params.metadata,
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['KE'], // Only Kenya for now
      },
      phone_number_collection: {
        enabled: true,
      },
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return session
  } catch (error) {
    console.error('Stripe checkout session error:', error)
    throw new Error('Failed to create checkout session')
  }
}

/**
 * Retrieve checkout session
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session
  } catch (error) {
    console.error('Stripe session retrieval error:', error)
    throw new Error('Failed to retrieve checkout session')
  }
}

/**
 * Create payment intent for custom amounts
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'kes',
  metadata?: Record<string, string>
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        source: 'brandson-website',
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Stripe payment intent error:', error)
    throw new Error('Failed to create payment intent')
  }
}

/**
 * Handle Stripe webhook
 */
export async function handleStripeWebhook(
  payload: string,
  signature: string,
  webhookSecret: string
) {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    throw new Error('Invalid webhook signature')
  }

  return event
}

/**
 * Get customer payment methods
 */
export async function getCustomerPaymentMethods(customerId: string) {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    })

    return paymentMethods
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    throw new Error('Failed to fetch payment methods')
  }
}

/**
 * Create or retrieve customer
 */
export async function createOrRetrieveCustomer(email: string, name?: string) {
  try {
    // First, try to find existing customer
    const existingCustomers = await stripe.customers.list({ email, limit: 1 })
    
    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0]
    }

    // Create new customer if not found
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'brandson-website',
      },
    })

    return customer
  } catch (error) {
    console.error('Error creating/retrieving customer:', error)
    throw new Error('Failed to create or retrieve customer')
  }
}
