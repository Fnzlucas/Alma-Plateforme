import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import FoodDashboard from './food/FoodDashboard'

export default async function DashboardPage({ searchParams }) {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/')

  // Charger toutes les données food de l'utilisateur en une seule requête
  const { data: rows } = await supabase
    .from('food_data')
    .select('key, value')
    .eq('user_id', session.user.id)

  const foodData = {}
  for (const row of rows || []) foodData[row.key] = row.value

  // Vérifier si SumUp est connecté
  const sumupConnected = !!foodData.sumup_token?.access_token

  return (
    <FoodDashboard
      userId={session.user.id}
      userEmail={session.user.email}
      initialData={foodData}
      sumupConnected={sumupConnected}
      sumupStatus={searchParams?.sumup}
    />
  )
}
