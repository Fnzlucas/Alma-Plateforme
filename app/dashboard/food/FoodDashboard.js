'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FoodDashboard({ userId, userEmail, initialData }) {
  const router = useRouter()

  useEffect(() => {
    // Hydrater localStorage avec les données Supabase
    const keys = [
      'sf_inv_v4','cm_inv_v1','sf_prices','cm_prices',
      'sf_enc','cm_enc','sf_couts','cm_couts',
      'sf_factures','cm_factures','sf_crm','cm_crm',
      'docs_sf','docs_cm','emp_sf','emp_cm',
      'cal_events','cm_amort','cm_km',
    ]
    for (const key of keys) {
      if (initialData[key] !== undefined && initialData[key] !== null) {
        try { localStorage.setItem(key, JSON.stringify(initialData[key])) } catch(e) {}
      }
    }
  }, [initialData])

  return (
    <iframe
      src="/food-app"
      style={{ width: '100vw', height: '100vh', border: 'none', display: 'block' }}
    />
  )
}
