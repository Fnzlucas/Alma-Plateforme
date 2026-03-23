'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function FoodDashboard({ userId, userEmail, initialData, sumupConnected, sumupStatus }) {
  const containerRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Montrer message SumUp si redirigé depuis OAuth
  useEffect(() => {
    if (sumupStatus === 'connected') setSyncMsg('SumUp connecté avec succès !')
    if (sumupStatus === 'error') setSyncMsg('Erreur de connexion SumUp. Réessayez.')
  }, [sumupStatus])

  useEffect(() => {
    if (!containerRef.current || loaded) return

    // 1. Hydrate localStorage avec les données Supabase
    const keys = [
      'sf_inv_v4', 'cm_inv_v1',
      'sf_prices', 'cm_prices',
      'sf_enc', 'cm_enc',
      'sf_couts', 'cm_couts',
      'sf_factures', 'cm_factures',
      'sf_crm', 'cm_crm',
      'docs_sf', 'docs_cm',
      'emp_sf', 'emp_cm',
      'cal_events', 'cm_amort', 'cm_km',
    ]
    for (const key of keys) {
      if (initialData[key] !== undefined && initialData[key] !== null) {
        try {
          localStorage.setItem(key, JSON.stringify(initialData[key]))
        } catch(e) {}
      }
    }

    // 2. Exposer dbSet / dbGet globaux pour que le JS food les utilise
    window.dbSet = async (key, value) => {
      try {
        await fetch('/api/food-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      } catch(e) { console.warn('dbSet error:', e) }
    }

    window.dbGet = async (key) => {
      try {
        const res = await fetch(`/api/food-data?key=${key}`)
        const data = await res.json()
        return data.value
      } catch(e) { return null }
    }

    // 3. Exposer info user et fonctions logout/SumUp
    window.__FOOD_USER__ = { id: userId, email: userEmail }

    window.foodLogout = async () => {
      await supabase.auth.signOut()
      router.push('/')
    }

    window.foodConnectSumup = () => {
      window.location.href = '/api/sumup/connect'
    }

    window.foodSyncSumup = async (world) => {
      setSyncing(true)
      setSyncMsg('Synchronisation SumUp en cours...')
      try {
        const res = await fetch('/api/sumup/sync?days=30')
        const data = await res.json()
        if (!data.connected) {
          setSyncMsg('SumUp non connecté. Cliquez sur "Connecter SumUp".')
          setSyncing(false)
          return
        }
        // Injecter les transactions dans les encaissements du world actuel
        const w = world || 'sf'
        const existing = JSON.parse(localStorage.getItem(w + '_enc') || '[]')
        // Dédupliquer par ID SumUp
        const existingIds = new Set(existing.filter(e => e.id).map(e => e.id))
        const newTx = data.transactions.filter(t => !existingIds.has(t.id))
        if (newTx.length > 0) {
          const merged = [...newTx, ...existing]
          localStorage.setItem(w + '_enc', JSON.stringify(merged))
          window.dbSet(w + '_enc', merged)
          // Rafraîchir les stats si la fonction existe
          if (typeof window.renderStats === 'function') window.renderStats(w)
          if (typeof window.renderDash === 'function') window.renderDash(w)
        }
        setSyncMsg(`✓ ${newTx.length} nouvelle(s) transaction(s) importée(s) depuis SumUp`)
      } catch(e) {
        setSyncMsg('Erreur lors de la synchronisation.')
      }
      setSyncing(false)
      setTimeout(() => setSyncMsg(''), 4000)
    }

    setLoaded(true)
  }, [initialData, loaded, userId, userEmail, supabase, router])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>

      {/* Barre SumUp / messages */}
      {syncMsg && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: syncMsg.startsWith('✓') || syncMsg.includes('succès') ? '#dcfce7' : '#fee2e2',
          color: syncMsg.startsWith('✓') || syncMsg.includes('succès') ? '#16a34a' : '#dc2626',
          padding: '10px 20px', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          fontFamily: "'Inter',system-ui,sans-serif",
        }}>
          <span>{syncMsg}</span>
          <button onClick={() => setSyncMsg('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'inherit' }}>
            ×
          </button>
        </div>
      )}

      {/* Le dashboard food chargé via iframe pour isolation CSS/JS complète */}
      <iframe
        src="/food-app"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          marginTop: syncMsg ? 40 : 0,
        }}
        onLoad={(e) => {
          // Injecter les fonctions globales dans l'iframe
          const iframeWindow = e.target.contentWindow
          if (!iframeWindow) return
          iframeWindow.dbSet = window.dbSet
          iframeWindow.dbGet = window.dbGet
          iframeWindow.__FOOD_USER__ = window.__FOOD_USER__
          iframeWindow.foodLogout = window.foodLogout
          iframeWindow.foodConnectSumup = window.foodConnectSumup
          iframeWindow.foodSyncSumup = window.foodSyncSumup
          // Hydrater le localStorage de l'iframe
          for (const key of Object.keys(initialData)) {
            if (initialData[key] !== null) {
              try {
                iframeWindow.localStorage.setItem(key, JSON.stringify(initialData[key]))
              } catch(e) {}
            }
          }
          // Recharger l'app avec les données
          if (typeof iframeWindow.init === 'function') iframeWindow.init()
        }}
      />
    </div>
  )
}
