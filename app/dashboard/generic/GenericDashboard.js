'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
 
export default function GenericDashboard({ userId, userEmail, initialData, onboarding }) {
  const router = useRouter()
  const modules = onboarding?.modules || []
  const business = onboarding?.business || 'Mon Entreprise'
 
  useEffect(() => {
    // Hydrater localStorage avec les données Supabase
    const keys = [
      'inv_v1', 'prices', 'enc', 'couts',
      'factures', 'crm', 'docs', 'emp',
      'cal_events', 'amort', 'km',
    ]
    for (const key of keys) {
      if (initialData[key] !== undefined && initialData[key] !== null) {
        try { localStorage.setItem(key, JSON.stringify(initialData[key])) } catch(e) {}
      }
    }
  }, [initialData])
 
  return (
    <iframe
      src={`/generic-app?modules=${encodeURIComponent(JSON.stringify(modules))}&business=${encodeURIComponent(business)}`}
      style={{ width: '100vw', height: '100vh', border: 'none', display: 'block' }}
    />
  )
}
 
