import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

async function refreshToken(refresh_token) {
  const res = await fetch('https://api.sumup.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.SUMUP_CLIENT_ID,
      client_secret: process.env.SUMUP_CLIENT_SECRET,
      refresh_token,
    }),
  })
  return res.json()
}

export async function GET(request) {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Récupérer le token SumUp
  const { data: tokenRow } = await supabase
    .from('food_data')
    .select('value')
    .eq('user_id', session.user.id)
    .eq('key', 'sumup_token')
    .single()

  if (!tokenRow?.value?.access_token) {
    return NextResponse.json({ error: 'SumUp non connecté', connected: false })
  }

  let token = tokenRow.value

  // Rafraîchir si expiré
  if (Date.now() > token.expires_at - 60000) {
    const newToken = await refreshToken(token.refresh_token)
    if (newToken.access_token) {
      token = {
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token || token.refresh_token,
        expires_at: Date.now() + (newToken.expires_in || 3600) * 1000,
      }
      await supabase.from('food_data').upsert({
        user_id: session.user.id, key: 'sumup_token',
        value: token, updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,key' })
    }
  }

  // Récupérer les transactions des 30 derniers jours
  const params = new URLSearchParams()
  const searchParams = new URL(request.url).searchParams
  const days = parseInt(searchParams.get('days') || '30')
  const from = new Date(); from.setDate(from.getDate() - days)
  params.set('oldest_date', from.toISOString().split('T')[0])
  params.set('newest_date', new Date().toISOString().split('T')[0])
  params.set('limit', '100')

  const txRes = await fetch(`https://api.sumup.com/v0.1/me/transactions/history?${params}`, {
    headers: { Authorization: `Bearer ${token.access_token}` }
  })

  if (!txRes.ok) {
    return NextResponse.json({ error: 'Erreur SumUp API', status: txRes.status }, { status: 502 })
  }

  const txData = await txRes.json()
  const transactions = txData.items || []

  // Formater pour la plateforme food
  // Chaque transaction devient un encaissement
  const encaissements = transactions
    .filter(tx => tx.status === 'SUCCESSFUL')
    .map(tx => ({
      id: tx.id,
      montant: parseFloat(tx.amount),
      mode: mapPaymentType(tx.payment_type),
      date: tx.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0],
      description: tx.product_summary || '',
      source: 'sumup',
    }))

  return NextResponse.json({
    connected: true,
    transactions: encaissements,
    total: encaissements.reduce((s, t) => s + t.montant, 0),
    count: encaissements.length,
    period_days: days,
    last_sync: new Date().toISOString(),
  })
}

function mapPaymentType(type) {
  const map = {
    'CASH': 'especes',
    'CARD': 'cb',
    'RECURRING': 'cb',
    'MOTO': 'cb',
    'BOLD': 'cb',
  }
  return map[type] || 'cb'
}
