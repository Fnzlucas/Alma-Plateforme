import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/')

  const { data: rows } = await supabase
    .from('food_data')
    .select('key, value')
    .eq('user_id', session.user.id)

  const foodData = {}
  for (const row of rows || []) foodData[row.key] = row.value

  let html = readFileSync(join(process.cwd(), 'public', 'food-app.html'), 'utf8')

  const injection = `<script>
// Données pré-chargées depuis Supabase
;(function(){
  const data = ${JSON.stringify(foodData)};
  Object.entries(data).forEach(([k,v])=>{
    try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){}
  });
  // Override dbSet/dbGet pour sauvegarder vers Supabase
  window.dbSet = async function(key, value){
    try{ await fetch('/api/food-data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,value})}); }catch(e){}
  };
  window.dbGet = async function(key){
    try{ const r=await fetch('/api/food-data?key='+key); const d=await r.json(); return d.value; }catch(e){ return null; }
  };
})();
</script>`

  html = html.replace('</head>', injection + '</head>')

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}
