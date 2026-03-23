import Stripe from 'stripe'
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICES = {
  solo: process.env.STRIPE_PRICE_SOLO,
  business: process.env.STRIPE_PRICE_BUSINESS,
  agence: process.env.STRIPE_PRICE_AGENCE,
}

export async function POST(request) {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { plan } = await request.json()
  const priceId = PRICES[plan]
  if (!priceId) return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    metadata: { user_id: session.user.id },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
```

Ensuite ajoute `stripe` dans `package.json` — cherche la ligne `"@supabase/ssr"` et ajoute juste après :
```
"stripe": "^14.0.0",
