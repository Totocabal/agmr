'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AGMRLogo from '@/components/ui/AGMRLogo'
import Icon from '@/components/ui/Icon'
import { createClient } from '@/lib/supabase-client'

export default function AdminLoginClient() {
  const [email, setEmail] = useState("admin@agmr.fr")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("Email ou mot de passe incorrect.")
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <AGMRLogo size={52}/>
        <div style={{ fontSize: "0.74rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 6, fontWeight: 600, marginTop: 24 }}>
          Back-office
        </div>
        <h2 style={{ fontSize: "1.8rem", marginBottom: 8 }}>Connexion administrateur</h2>
        <p style={{ color: "var(--ink-mute)", marginBottom: 24, fontSize: "0.96rem" }}>
          Espace réservé aux administrateurs.
        </p>
        {error && (
          <div style={{ background: "var(--accent-tint)", border: "1px solid var(--accent-soft)", borderRadius: "var(--r-sm)", padding: "12px 16px", marginBottom: 16, fontSize: "0.92rem", color: "var(--accent-deep)" }}>
            {error}
          </div>
        )}
        <div className="form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Votre mot de passe"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={loading}
            style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}
          >
            <Icon name="lock" size={15}/>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  )
}
