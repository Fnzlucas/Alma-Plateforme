import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICES = {
  solo: process.env.STRIPE_PRICE_SOLO,
  business: process.env.STRIPE_PRICE_BUSINESS,
  agence: process.env.STRIPE_PRICE_AGENCE,
}

export async function POST(request) {
  const { plan, email } = await request.json()
  const priceId = PRICES[plan]
  if (!priceId) return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
