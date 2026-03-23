'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
 
const MODULES = [
  { id: 'finances', icon: '📊', label: 'Finances & Trésorerie', desc: 'CA, dépenses, marges, flux de tréso' },
  { id: 'facturation', icon: '🧾', label: 'Facturation & Devis', desc: 'Factures, devis, relances auto' },
  { id: 'stocks', icon: '📦', label: 'Stocks & Inventaire', desc: 'Gestion produits, alertes rupture' },
  { id: 'crm', icon: '👥', label: 'CRM Clients', desc: 'Historique, suivi, relances' },
  { id: 'equipe', icon: '🏷️', label: 'Équipe & RH', desc: 'Plannings, congés, coûts employés' },
  { id: 'caisse', icon: '🖥️', label: 'Connexion Caisse', desc: 'SumUp, Square, Zettle...' },
  { id: 'calendrier', icon: '📅', label: 'Calendrier', desc: 'Événements, rdv, planning' },
  { id: 'rapports', icon: '📈', label: 'Rapports & Stats', desc: 'Analyses, exports PDF/Excel' },
  { id: 'km', icon: '🚗', label: 'Frais Kilométriques', desc: 'Suivi trajets, remboursements' },
  { id: 'amortissement', icon: '🔧', label: 'Amortissements', desc: 'Matériel, équipements' },
]
 
export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [business, setBusiness] = useState('')
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
 
  function toggleModule(id) {
    setModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }
 
  async function finish() {
    if (!business.trim()) return
    if (modules.length === 0) return
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    await fetch('/api/food-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'onboarding', value: { business, modules, done: true } })
    })
    router.push('/dashboard')
  }
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Inter+Tight:wght@700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #f7f8fa; }
        .mod-card { background: #fff; border: 1.5px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 12px; }
        .mod-card:hover { border-color: #1e3a6e; box-shadow: 0 2px 12px rgba(30,58,110,0.08); }
        .mod-card.selected { border-color: #1e3a6e; background: rgba(30,58,110,0.04); }
        .ob-input { width: 100%; padding: 14px 16px; background: #fff; border: 1.5px solid rgba(0,0,0,0.09); border-radius: 10px; color: #0f1729; font-size: 16px; font-family: inherit; outline: none; transition: all 0.15s; }
        .ob-input:focus { border-color: #1e3a6e; box-shadow: 0 0 0 3px rgba(30,58,110,0.08); }
        .ob-btn { width: 100%; padding: 14px; background: #1e3a6e; border: none; border-radius: 10px; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.15s; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ob-btn:hover:not(:disabled) { background: #152d57; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(30,58,110,0.3); }
        .ob-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ob-btn-ghost { width: 100%; padding: 14px; background: transparent; border: 1.5px solid rgba(0,0,0,0.09); border-radius: 10px; color: #4a5568; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .ob-btn-ghost:hover { border-color: #1e3a6e; color: #1e3a6e; }
      `}</style>
 
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 60, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#1e3a6e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 12L7 2L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 800, color: '#0f1729', letterSpacing: '-0.5px' }}>Alma<span style={{ color: '#1e3a6e' }}>.co</span></span>
        </div>
        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= s ? '#1e3a6e' : '#e4e8f0', color: step >= s ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, transition: 'all 0.3s' }}>{s}</div>
              {s < 3 && <div style={{ width: 32, height: 2, background: step > s ? '#1e3a6e' : '#e4e8f0', borderRadius: 2, transition: 'all 0.3s' }}/>}
            </div>
          ))}
        </div>
        <div style={{ width: 120 }}/>
      </nav>
 
      <div style={{ minHeight: '100vh', background: '#f7f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 40px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 15% 30%, rgba(30,58,110,0.04) 0%, transparent 60%)' }}/>
 
        <div style={{ width: '100%', maxWidth: step === 2 ? 680 : 480, margin: '0 auto', position: 'relative', zIndex: 1 }}>
 
          {/* STEP 1 — Nom business */}
          {step === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🏢</div>
                <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 32, fontWeight: 900, letterSpacing: '-1.2px', color: '#0f1729', marginBottom: 10 }}>Comment s'appelle<br/>votre entreprise ?</h1>
                <p style={{ fontSize: 15, color: '#4a5568' }}>Ce nom apparaîtra sur votre dashboard et vos documents.</p>
              </div>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16, padding: 32, boxShadow: '0 4px 32px rgba(30,58,110,0.08)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #1e3a6e, #2563eb)' }}/>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Nom de votre business</label>
                  <input className="ob-input" type="text" placeholder="ex: La Bonne Adresse, Tech Solutions..." value={business} onChange={e => setBusiness(e.target.value)} onKeyDown={e => e.key === 'Enter' && business.trim() && setStep(2)} autoFocus/>
                </div>
                <button className="ob-btn" onClick={() => setStep(2)} disabled={!business.trim()}>
                  Continuer
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                </button>
              </div>
            </div>
          )}
 
          {/* STEP 2 — Choix modules */}
          {step === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
                <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 32, fontWeight: 900, letterSpacing: '-1.2px', color: '#0f1729', marginBottom: 10 }}>Quels modules<br/>souhaitez-vous activer ?</h1>
                <p style={{ fontSize: 15, color: '#4a5568' }}>Choisissez au moins un module. Vous pourrez en ajouter plus tard.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {MODULES.map(m => (
                  <div key={m.id} className={`mod-card${modules.includes(m.id) ? ' selected' : ''}`} onClick={() => toggleModule(m.id)}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f1729' }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{m.desc}</div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${modules.includes(m.id) ? '#1e3a6e' : '#e4e8f0'}`, background: modules.includes(m.id) ? '#1e3a6e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                      {modules.includes(m.id) && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5"/></svg>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ob-btn-ghost" onClick={() => setStep(1)}>← Retour</button>
                <button className="ob-btn" onClick={() => setStep(3)} disabled={modules.length === 0} style={{ flex: 2 }}>
                  Continuer ({modules.length} module{modules.length > 1 ? 's' : ''})
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                </button>
              </div>
            </div>
          )}
 
          {/* STEP 3 — Confirmation */}
          {step === 3 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
                <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 32, fontWeight: 900, letterSpacing: '-1.2px', color: '#0f1729', marginBottom: 10 }}>Tout est prêt<br/>pour <span style={{ color: '#1e3a6e' }}>{business}</span> !</h1>
                <p style={{ fontSize: 15, color: '#4a5568' }}>Voici un récapitulatif de votre espace avant d'y accéder.</p>
              </div>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16, padding: 32, boxShadow: '0 4px 32px rgba(30,58,110,0.08)', position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #1e3a6e, #2563eb)' }}/>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Votre entreprise</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f1729' }}>{business}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Modules activés ({modules.length})</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {modules.map(id => {
                      const m = MODULES.find(x => x.id === id)
                      return <span key={id} style={{ background: 'rgba(30,58,110,0.07)', color: '#1e3a6e', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6 }}>{m?.icon} {m?.label}</span>
                    })}
                  </div>
                </div>
                <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.18)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l4 4 6-6"/></svg>
                  <span style={{ fontSize: 12.5, color: '#16a34a', fontWeight: 600 }}>7 jours gratuits · Aucun prélèvement avant J+7</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ob-btn-ghost" onClick={() => setStep(2)}>← Retour</button>
                <button className="ob-btn" onClick={finish} disabled={loading} style={{ flex: 2 }}>
                  {loading ? 'Création en cours...' : <>Accéder à mon espace <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></>}
                </button>
              </div>
            </div>
          )}
 
        </div>
      </div>
    </>
  )
}
