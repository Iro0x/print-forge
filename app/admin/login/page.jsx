'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'Błąd logowania')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo / nagłówek */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            lineHeight: 1,
          }}>
            PRINT-FORGE
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginTop: '0.4rem',
          }}>
            Panel administracyjny
          </div>
        </div>

        {/* Karta logowania */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderTop: '3px solid var(--accent)',
          borderRadius: '2px',
          padding: '2rem',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.7rem',
                fontFamily: "'DM Mono', monospace",
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}>
                Hasło
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                required
                style={{
                  width: '100%',
                  background: 'var(--bg)',
                  border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
                  color: 'var(--text)',
                  padding: '0.75rem 1rem',
                  borderRadius: '2px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { if (!error) e.target.style.borderColor = 'var(--accent)' }}
                onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : 'var(--border)' }}
              />
              {error && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.78rem',
                  color: '#ef4444',
                  fontFamily: "'DM Mono', monospace",
                }}>
                  ✕ {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                background: loading || !password ? 'var(--surface2)' : 'var(--accent)',
                color: loading || !password ? 'var(--muted)' : 'white',
                border: 'none',
                padding: '0.85rem',
                fontSize: '0.8rem',
                fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                cursor: loading || !password ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
