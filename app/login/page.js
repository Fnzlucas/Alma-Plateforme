'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
 
export default function Login() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', password: '', entreprise: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const router = useRouter()
  const supabase = createClient()
 
  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) { setError('Email ou mot de passe incorrect.'); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }
 
  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { prenom: form.prenom, nom: form.nom, entreprise: form.entreprise },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
      }
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }
 
  async function handleReset(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/dashboard`
    })
    if (error) { setError(error.message); setLoading(false); return }
    setResetSent(true); setLoading(false)
  }
 
  const titles = {
    login: { title: 'Accédez à votre\nespace de pilotage.', sub: 'Votre entreprise vous attend.' },
    register: { title: "Pilotez votre activité\ndès aujourd'hui.", sub: '7 jours gratuits, sans engagement.' },
  }
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Inter+Tight:wght@700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: #f7f8fa; }
        .alma-input::placeholder { color: #94a3b8; }
        .alma-input:focus { border-color: #1e3a6e !important; outline: none; box-shadow: 0 0 0 3px rgba(30,58,110,0.08) !important; background: #fff !important; }
        .alma-btn:hover:not(:disabled) { background: #152d57 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(30,58,110,0.3) !important; }
        .alma-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .alma-tab { flex: none; padding: 9px 24px; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit; background: transparent; color: #94a3b8; white-space: nowrap; }
        .alma-tab.active { background: #fff; color: #0f1729; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .alma-forgot:hover { color: #1e3a6e !important; }
        .alma-nav-back:hover { color: #4a5568 !important; background: #f7f8fa !important; }
      `}</style>
 
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 60, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 52px', boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#1e3a6e', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(30,58,110,0.25)' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 12L7 2L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 800, color: '#0f1729', letterSpacing: '-0.5px' }}>Alma<span style={{ color: '#1e3a6e' }}>.co</span></span>
        </a>
        <a href="/" className="alma-nav-back" style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', textDecoration: 'none', padding: '6px 12px', borderRadius: 6, transition: 'all 0.12s' }}>← Retour à l'accueil</a>
      </nav>
 
      {/* PAGE */}
      <div style={{ minHeight: '100vh', background: '#f7f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 15% 30%, rgba(30,58,110,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 60%, rgba(37,99,235,0.04) 0%, transparent 55%)' }}/>
 
        <div style={{ width: '100%', maxWidth: 460, margin: '0 auto', position: 'relative', zIndex: 1 }}>
 
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(30,58,110,0.07)', border: '1px solid rgba(30,58,110,0.14)', padding: '5px 13px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, color: '#1e3a6e', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }}/>
              Accès sécurisé · Données chiffrées
            </div>
            <h1 style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 34, fontWeight: 900, letterSpacing: '-1.5px', color: '#0f1729', lineHeight: 1.15, marginBottom: 10, textAlign: 'center', whiteSpace: 'pre-line' }}>
              {titles[tab].title}
            </h1>
            <p style={{ fontSize: 15, color: '#4a5568', lineHeight: 1.6, textAlign: 'center' }}>{titles[tab].sub}</p>
          </div>
 
          {/* Card */}
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16, padding: 32, boxShadow: '0 4px 32px rgba(30,58,110,0.08), 0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #1e3a6e, #2563eb)' }}/>
 
            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', background: '#f0f2f6', borderRadius: 10, padding: 4, marginBottom: 24, gap: 2 }}>
              <button className={`alma-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setError(''); setResetMode(false); }}>Se connecter</button>
              <button className={`alma-tab${tab === 'register' ? ' active' : ''}`} onClick={() => { setTab('register'); setError(''); setResetMode(false); }}>Créer un compte</button>
            </div>
 
            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 11v.5"/></svg>
                {error}
              </div>
            )}
 
            {/* LOGIN */}
            {tab === 'login' && !resetMode && !resetSent && (
              <>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div><label style={lbl}>Email</label><input className="alma-input" style={inp} type="email" placeholder="votre@email.fr" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/></div>
                  <div><label style={lbl}>Mot de passe</label><input className="alma-input" style={inp} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required/></div>
                  <button className="alma-btn" type="submit" disabled={loading} style={btn}>
                    {loading ? 'Connexion...' : <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>Accéder à mon espace <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>}
                  </button>
                </form>
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <button className="alma-forgot" onClick={() => { setResetMode(true); setError(''); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit', transition: 'color 0.12s' }}>Mot de passe oublié ?</button>
                </div>
              </>
            )}
 
            {/* RESET */}
            {tab === 'login' && resetMode && !resetSent && (
              <>
                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div><label style={lbl}>Email</label><input className="alma-input" style={inp} type="email" placeholder="votre@email.fr" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/></div>
                  <button className="alma-btn" type="submit" disabled={loading} style={btn}>{loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}</button>
                </form>
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <button className="alma-forgot" onClick={() => { setResetMode(false); setError(''); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit' }}>← Retour à la connexion</button>
                </div>
              </>
            )}
 
            {/* RESET SENT */}
            {tab === 'login' && resetSent && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0f1729', marginBottom: 8 }}>Email envoyé !</div>
                <div style={{ fontSize: 13, color: '#4a5568', marginBottom: 24, lineHeight: 1.6 }}>Vérifiez votre boîte mail pour réinitialiser votre mot de passe.</div>
                <button className="alma-forgot" onClick={() => { setResetSent(false); setResetMode(false); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit' }}>← Retour à la connexion</button>
              </div>
            )}
 
            {/* REGISTER */}
            {tab === 'register' && (
              <>
                <div style={{ background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.18)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l4 4 6-6"/></svg>
                  <div>
                    <div style={{ fontSize: 12.5, color: '#16a34a', fontWeight: 600 }}>7 jours gratuits inclus</div>
                    <div style={{ fontSize: 11, color: '#4a5568', marginTop: 1 }}>Aucun prélèvement avant J+7 · Annulable à tout moment</div>
                  </div>
                </div>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={lbl}>Prénom</label><input className="alma-input" style={inp} type="text" placeholder="Jean" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required/></div>
                    <div><label style={lbl}>Nom</label><input className="alma-input" style={inp} type="text" placeholder="Dupont" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required/></div>
                  </div>
                  <div><label style={lbl}>Email professionnel</label><input className="alma-input" style={inp} type="email" placeholder="votre@email.fr" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/></div>
                  <div><label style={lbl}>Nom de votre entreprise</label><input className="alma-input" style={inp} type="text" placeholder="Ma Société SAS" value={form.entreprise} onChange={e => setForm({...form, entreprise: e.target.value})} required/></div>
                  <div><label style={lbl}>Mot de passe</label><input className="alma-input" style={inp} type="password" placeholder="8 caractères minimum" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={8}/></div>
                  <button className="alma-btn" type="submit" disabled={loading} style={btn}>
                    {loading ? 'Création...' : <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>Démarrer mon essai gratuit <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>}
                  </button>
                </form>
                <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                  En créant un compte, vous acceptez nos <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>CGU</a> et notre <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>politique de confidentialité</a>.
                </p>
              </>
            )}
          </div>
 
          {/* Trust */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
            {[['M3 8l4 4 6-6', 'SSL · Chiffré'], ['M8 2a6 6 0 100 12A6 6 0 008 2zm0 4v3l2 2', 'Données hébergées en EU'], ['M3 8l4 4 6-6', 'RGPD conforme']].map(([d, label], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#94a3b8' }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
                {label}
              </div>
            ))}
          </div>
 
        </div>
      </div>
    </>
  )
}
 
const lbl = { display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }
const inp = { width: '100%', padding: '12px 14px', background: '#f7f8fa', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 8, color: '#0f1729', fontSize: 14, transition: 'border-color 0.15s, box-shadow 0.15s', fontFamily: 'inherit', outline: 'none' }
const btn = { width: '100%', padding: '13px 0', textAlign: 'center', background: '#1e3a6e', border: 'none', borderRadius: 9, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4, boxShadow: '0 2px 8px rgba(30,58,110,0.25)', transition: 'all 0.15s', fontFamily: 'inherit' }
