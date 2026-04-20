'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const mono = "'DM Mono', monospace"
const bebas = "'Bebas Neue', sans-serif"

const btnPrimary = {
  display: 'inline-flex', alignItems: 'center',
  padding: '0.85rem 2rem', fontSize: '0.85rem', fontWeight: 500,
  letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px',
  background: 'var(--accent)', color: 'white', textDecoration: 'none',
}
const btnOutline = {
  ...btnPrimary,
  background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)',
}

function SukcesContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [state, setState] = useState('loading') // 'loading' | 'custom' | 'shop' | 'unconfirmed' | 'error'
  const [order, setOrder] = useState(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!sessionId) { setState('error'); return }

    let tries = 0
    const maxTries = 8

    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/success?session_id=${sessionId}`)
        const json = await res.json()

        if (json.type) {
          setOrder(json.order)
          setState(json.type)
          return
        }
      } catch {}

      tries++
      setAttempts(tries)

      // Webhook może być opóźniony — odpytuj co 2s, max 8 razy (16s)
      if (tries < maxTries) {
        setTimeout(poll, 2000)
      } else {
        setState('unconfirmed')
      }
    }

    poll()
  }, [sessionId])

  if (state === 'loading') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <div style={{ width: '48px', height: '48px', border: '2px solid var(--border)', borderTop: '2px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontFamily: mono, fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Weryfikowanie płatności{attempts > 0 ? ` (${attempts})` : ''}...
        </p>
      </div>
    )
  }

  if (state === 'custom') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🖨️</div>
          <div style={{ fontFamily: mono, fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>// Płatność przyjęta</div>
          <h1 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--accent)', lineHeight: 1, marginBottom: '2rem' }}>Zaczynamy drukować!</h1>

          {order && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '2px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ fontFamily: mono, fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Szczegóły zamówienia</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Zamówienie</span>
                  <span style={{ fontFamily: mono, fontSize: '0.8rem' }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                {order.file_name && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Plik</span>
                    <span style={{ fontFamily: mono, fontSize: '0.8rem' }}>{order.file_name}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)' }}>Zapłacono</span>
                  <span style={{ fontFamily: bebas, fontSize: '1.3rem', color: 'var(--accent)' }}>{order.quoted_price} zł</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', padding: '1rem 1.25rem', borderRadius: '2px', textAlign: 'left', marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Potwierdzenie zostało wysłane na Twój adres e-mail.<br />
            Gdy paczka zostanie nadana, otrzymasz kolejną wiadomość z informacją o dostawie.
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/" style={btnPrimary}>Strona główna</Link>
            <Link href="/zamow" style={btnOutline}>Nowe zamówienie</Link>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'shop') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📦</div>
          <div style={{ fontFamily: mono, fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>// Płatność przyjęta</div>
          <h1 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--accent)', lineHeight: 1, marginBottom: '2rem' }}>Dziękujemy!</h1>

          {order && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '2px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ fontFamily: mono, fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Szczegóły zamówienia</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Zamówienie</span>
                  <span style={{ fontFamily: mono, fontSize: '0.8rem' }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Klient</span>
                  <span>{order.customer_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)' }}>Łącznie</span>
                  <span style={{ fontFamily: bebas, fontSize: '1.3rem', color: 'var(--accent)' }}>{order.total_amount} zł</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', padding: '1rem 1.25rem', borderRadius: '2px', textAlign: 'left', marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Potwierdzenie zostało wysłane na Twój adres e-mail.<br />
            Poinformujemy Cię, gdy paczka zostanie nadana.
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/sklep" style={btnPrimary}>Wróć do sklepu</Link>
            <Link href="/" style={btnOutline}>Strona główna</Link>
          </div>
        </div>
      </div>
    )
  }

  // Timeout — płatność przeszła w Stripe, ale webhook jeszcze nie zaktualizował statusu
  if (state === 'unconfirmed') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '520px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⏳</div>
          <h1 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--accent)', lineHeight: 1, marginBottom: '1.5rem' }}>Weryfikacja w toku</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '1.5rem' }}>
            Płatność została złożona, ale potwierdzenie z systemu płatności jeszcze nie dotarło.
          </p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid #f59e0b', padding: '1rem 1.25rem', borderRadius: '2px', textAlign: 'left', marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Sprawdź skrzynkę e-mail — potwierdzenie powinno dotrzeć w ciągu kilku minut. Możesz też śledzić status zamówienia za pomocą ID z wiadomości.
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/sledzenie" style={btnPrimary}>Śledź zamówienie</Link>
            <Link href="/" style={btnOutline}>Strona główna</Link>
          </div>
        </div>
      </div>
    )
  }

  // Brak session_id — ktoś wszedł bezpośrednio pod adres
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '500px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>❌</div>
        <h1 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#ef4444', lineHeight: 1, marginBottom: '1.5rem' }}>Nie znaleziono płatności</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '2rem' }}>
          Nie możemy zweryfikować tej płatności. Jeśli dokonałeś zakupu, sprawdź e-mail lub skontaktuj się z nami.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/sledzenie" style={btnPrimary}>Śledź zamówienie</Link>
          <Link href="/" style={btnOutline}>Strona główna</Link>
        </div>
      </div>
    </div>
  )
}

export default function SukcesPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '2px solid var(--border)', borderTop: '2px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }>
        <SukcesContent />
      </Suspense>
      <Footer />
    </>
  )
}
