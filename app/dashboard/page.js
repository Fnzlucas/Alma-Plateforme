import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import FoodDashboard from './food/FoodDashboard'

const JEAN_PHILIPPE_EMAIL = 'email-de-jean-philippe@gmail.com'

export default async function DashboardPage({ searchParams }) {
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

  // Si pas encore fait l'onboarding → rediriger
  if (!foodData.onboarding?.done && session.user.email !== JEAN_PHILIPPE_EMAIL) {
    redirect('/onboarding')
  }

  // Jean-Philippe → dashboard food
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

  // Nouveaux clients → dashboard générique (à construire)
  return (
    <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>
      <h1>Bienvenue {foodData.onboarding?.business} !</h1>
      <p>Votre dashboard arrive très bientôt.</p>
    </div>
  )
}
