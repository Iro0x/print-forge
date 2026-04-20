'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const mono = "'DM Mono', monospace"
const bebas = "'Bebas Neue', sans-serif"

const STEPS_CUSTOM = ['pending', 'quoted', 'accepted', 'paid', 'printing', 'shipped', 'done']
const STEPS_SHOP   = ['pending', 'paid', 'shipped', 'done']

const STEP_LABELS = {
  pending:     'Wycena',
  quoted:      'Wyceniono',
  accepted:    'Zaakceptowano',
  negotiating: 'Negocjacja',
  paid:        'Opłacono',
  printing:    'Druk',
  shipped:     'Wysłano',
  done:        'Gotowe',
}

function ProgressBar({ status, type }) {
  const steps = type === 'shop' ? STEPS_SHOP : STEPS_CUSTOM
  if (status === 'cancelled') return null
  const current = steps.indexOf(status === 'negotiating' ? 'accepted' : status)

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {steps.map((step, i) => {
          const done = i <= current
          const active = i === current
          return (
            <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: '9px', left: '50%', right: '-50%', height: '2px',
                  background: i < current ? 'var(--accent)' : '#222', zIndex: 0,
                }} />
              )}
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', zIndex: 1, flexShrink: 0,
                background: done ? 'var(--accent)' : '#222',
                border: `2px solid ${done ? 'var(--accent)' : '#333'}`,
                boxShadow: active ? '0 0 10px var(--accent)' : 'none',
              }} />
              <div style={{
                fontFamily: mono, fontSize: '0.55rem', color: done ? 'var(--accent)' : '#444',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.4rem',
                textAlign: 'center', lineHeight: 1.3,
              }}>
                {STEP_LABELS[step]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SledzenieTresc() {
  const searchParams = useSearchParams()
  const [input, setInput] = useState(searchParams.get('id') || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const trackById = async (id) => {
    setLoading(true); setResult(null); setError('')
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(id)}`)
      const json = await res.json()
      if (!json.found) setError('Nie znaleziono zamówienia o podanym ID. Sprawdź czy ID jest poprawne.')
      else setResult(json)
    } catch {
      setError('Błąd połączenia. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) trackById(id)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = input.trim()
    if (id) trackById(id)
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1.5rem' }}>

        <div style={{ fontFamily: mono, fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Śledzenie zamówienia</div>
        <h1 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1, marginBottom: '0.75rem' }}>Sprawdź status</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Wpisz ID zamówienia — znajdziesz je w e-mailu potwierdzającym lub w linku do wyceny.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            style={{
              flex: 1, minWidth: '220px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '0.85rem 1rem', borderRadius: '2px',
              fontSize: '0.9rem', fontFamily: mono, outline: 'none', letterSpacing: '0.04em',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? 'var(--muted)' : 'var(--accent)',
              color: 'white', border: 'none', padding: '0.85rem 2rem',
              fontSize: '0.8rem', fontFamily: mono, letterSpacing: '0.1em',
              textTransform: 'uppercase', borderRadius: '2px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s', whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Szukam...' : 'Sprawdź →'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: '#ef444415', border: '1px solid #ef4444', borderRadius: '2px', color: '#ef4444', fontFamily: mono, fontSize: '0.8rem' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${result.statusColor}`, borderRadius: '2px' }}>

            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: mono, fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Zamówienie #{result.id.slice(0, 8).toUpperCase()} · {result.type === 'custom' ? 'Niestandardowe' : 'Sklep'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.75rem' }}>{result.statusIcon}</span>
                <span style={{ fontFamily: bebas, fontSize: '1.8rem', color: result.statusColor, letterSpacing: '0.04em', lineHeight: 1 }}>
                  {result.statusLabel}
                </span>
              </div>
              <ProgressBar status={result.status} type={result.type} />
            </div>

            <div style={{ padding: '1.25rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(result.details).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--muted)', fontFamily: mono, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{key}</span>
                  <span style={{ color: 'var(--text)', fontFamily: mono, fontSize: '0.8rem' }}>{val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)', fontFamily: mono, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Data złożenia</span>
                <span style={{ color: 'var(--text)', fontFamily: mono, fontSize: '0.8rem' }}>
                  {new Date(result.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </div>
            </div>

            {result.type === 'custom' && result.status === 'quoted' && (
              <div style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border)', background: '#3b82f615' }}>
                <p style={{ fontFamily: mono, fontSize: '0.75rem', color: '#3b82f6', lineHeight: 1.6 }}>
                  📧 Masz nową wycenę! Sprawdź e-mail i kliknij link aby zaakceptować, negocjować lub odrzucić.
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

export default function SledzenieePage() {
  return (
    <>
      <Nav />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <SledzenieTresc />
      </Suspense>
      <Footer />
    </>
  )
}
