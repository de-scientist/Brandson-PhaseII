import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: "2024-06-20" })
  : null

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY in environment." },
      { status: 500 },
    )
  }

  const { lineItems, successUrl, cancelUrl } = await req.json()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { source: "brandson-site" },
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch {
    return NextResponse.json({ error: "StripeError" }, { status: 500 })
  }
}

