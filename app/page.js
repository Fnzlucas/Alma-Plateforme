'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Landing() {
  const [mode, setMode] = useState('login') // 'login' | 'reset'
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
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

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`
    })
    if (error) { setError(error.message); setLoading(false); return }
    setResetSent(true); setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0914',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif", padding: 20
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            fontSize: 28, fontWeight: 800, fontFamily: 'Manrope, sans-serif',
            letterSpacing: '-0.5px', color: '#fff'
          }}>
            Alma<span style={{ color: '#712ae2' }}>.</span>
            <span style={{
              background: 'linear-gradient(135deg,#3525cd,#712ae2)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>food</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
            Gestion & Inventaire
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '32px 28px',
          backdropFilter: 'blur(10px)'
        }}>
          {resetSent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>✉️</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>Email envoyé !</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
                Vérifiez votre boîte mail pour réinitialiser votre mot de passe.
              </div>
              <button onClick={() => { setMode('login'); setResetSent(false) }} style={lnkBtn}>
                ← Retour à la connexion
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  {mode === 'login' ? 'Connexion' : 'Mot de passe oublié'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  {mode === 'login' ? 'Accédez à votre espace de gestion' : 'Entrez votre email pour recevoir un lien'}
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
                  borderRadius: 8, padding: '10px 12px', color: '#fca5a5',
                  fontSize: 13, marginBottom: 16
                }}>{error}</div>
              )}

              <form onSubmit={mode === 'login' ? handleLogin : handleReset}
                    style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={lbl}>Email</label>
                  <input style={inp} type="email" placeholder="votre@email.fr"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                {mode === 'login' && (
                  <div>
                    <label style={lbl}>Mot de passe</label>
                    <input style={inp} type="password" placeholder="••••••••"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  </div>
                )}
                <button type="submit" disabled={loading} style={btnStyle}>
                  {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Envoyer le lien'}
                </button>
              </form>

              <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {mode === 'login' ? (
                  <button onClick={() => { setMode('reset'); setError('') }} style={lnkBtn}>
                    Mot de passe oublié ?
                  </button>
                ) : (
                  <button onClick={() => { setMode('login'); setError('') }} style={lnkBtn}>
                    ← Retour à la connexion
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
          Alma.co — Plateforme de gestion professionnelle
        </div>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }
const inp = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
const btnStyle = { padding: '12px 0', background: 'linear-gradient(135deg,#3525cd,#712ae2)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4, boxShadow: '0 4px 16px rgba(113,42,226,0.35)', width: '100%' }
const lnkBtn = { background: 'none', border: 'none', color: '#9d7ff5', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }
