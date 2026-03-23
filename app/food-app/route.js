import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/')

  // Charger toutes les données de l'utilisateur
  const { data: rows } = await supabase
    .from('food_data')
    .select('key, value')
    .eq('user_id', session.user.id)

  const foodData = {}
  for (const row of rows || []) foodData[row.key] = row.value

  let html = readFileSync(join(process.cwd(), 'public', 'food-app.html'), 'utf8')

  // Injecter les données ET l'URL API directement dans le HTML
  const injection = `
<script>
window.__INIT_DATA__ = ${JSON.stringify(foodData)};
window.__API_BASE__ = '';
// Pré-hydrater localStorage avec les données Supabase
if (window.__INIT_DATA__) {
  Object.entries(window.__INIT_DATA__).forEach(([k,v]) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){}
  });
}
</script>`

  html = html.replace('<script>', injection + '\n<script>')

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}
