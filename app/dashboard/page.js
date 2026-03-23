import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import FoodDashboard from './food/FoodDashboard'
import GenericDashboard from './generic/GenericDashboard'
 
const JEAN_PHILIPPE_EMAIL = 'jeanphilippeprofeti@gmail.com'
 
export default async function DashboardPage({ searchParams }) {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/')
 
  const { data: rows } = await supabase
    .from('food_data')
    .select('key, value')
    .eq('user_id', session.user.id)
 
  const foodData = {}
  for (const row of rows || []) foodData[row.key] = row.value
 
  // Nouveau client sans onboarding → rediriger
  if (!foodData.onboarding?.done && session.user.email !== JEAN_PHILIPPE_EMAIL) {
    redirect('/onboarding')
  }
 
  // Jean-Philippe → dashboard food complet
  if (session.user.email === JEAN_PHILIPPE_EMAIL) {
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
 
  // Nouveaux clients → dashboard générique
  return (
    <GenericDashboard
      userId={session.user.id}
      userEmail={session.user.email}
      initialData={foodData}
      onboarding={foodData.onboarding}
    />
  )
}
 
