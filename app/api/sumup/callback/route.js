import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?sumup=error`)

  // Échanger le code contre un token
  const res = await fetch('https://api.sumup.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SUMUP_CLIENT_ID,
      client_secret: process.env.SUMUP_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/sumup/callback`,
      code,
    }),
  })

  const token = await res.json()
  if (!token.access_token) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?sumup=error`)

  // Sauvegarder le token dans food_data
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?sumup=auth`)

  await supabase.from('food_data').upsert({
    user_id: session.user.id,
    key: 'sumup_token',
    value: {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: Date.now() + (token.expires_in || 3600) * 1000,
    },
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id,key' })

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?sumup=connected`)
}
