import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// GET /api/food-data?key=sf_inv_v4
export async function GET(request) {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const key = new URL(request.url).searchParams.get('key')

  if (key) {
    // Récupérer une clé spécifique
    const { data } = await supabase
      .from('food_data')
      .select('value')
      .eq('user_id', session.user.id)
      .eq('key', key)
      .single()
    return NextResponse.json({ value: data?.value ?? null })
  } else {
    // Récupérer toutes les clés de l'utilisateur
    const { data } = await supabase
      .from('food_data')
      .select('key, value')
      .eq('user_id', session.user.id)
    const result = {}
    for (const row of data || []) result[row.key] = row.value
    return NextResponse.json(result)
  }
}

// POST /api/food-data — body: { key, value }
export async function POST(request) {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { key, value } = await request.json()
  if (!key) return NextResponse.json({ error: 'Clé manquante' }, { status: 400 })

  const { error } = await supabase
    .from('food_data')
    .upsert({
      user_id: session.user.id,
      key,
      value,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
