'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

function getReductionInfo(quoted, proposed) {
  if (!proposed || isNaN(proposed)) return null
  const reduction = ((quoted - proposed) / quoted) * 100
  const minPrice = Math.ceil(quoted * 0.70)

  if (proposed < minPrice) {
    return {
      type: 'error',
      text: `Minimalna oferta to ${minPrice} zł. Nie możemy rozpatrzyć redukcji powyżej 30%.`,
    }
  }
  if (reduction > 20) {
    return {
      type: 'warning',
      text: `Redukcja ${reduction.toFixed(0)}% to bardzo niska szansa na akceptację. Sugerujemy ofertę między ${Math.ceil(quoted * 0.80)} zł a ${Math.ceil(quoted * 0.90)} zł (redukcja 10–20%).`,
    }
  }
  if (reduction > 10) {
    return {
      type: 'info',
      text: `Redukcja ${reduction.toFixed(0)}% — najczęściej akceptowany przedział. Dobra propozycja.`,
    }
  }
  return {
    type: 'success',
    text: `Redukcja ${reduction.toFixed(0)}% — wysoka szansa na akceptację.`,
  }
}

const HINT_COLORS = {
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  success: '#10b981',
}

export default function WycenaPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [view, setView] = useState('main') // 'main' | 'negotiate' | 'done'
  const [proposedPrice, setProposedPrice] = useState('')
  const [customerMessage, setCustomerMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [doneAction, setDoneAction] = useState(null)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    fetch(`/api/orders/quote?id=${id}`)
      .then(r => r.json())
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true)
        else setOrder(data)
        setLoading(false)
      })
  }, [id])

  const submit = async (action, extra = {}) => {
    setSubmitting(true)
    setSubmitError('')

    if (action === 'accept') {
      const res = await fetch('/api/checkout/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id }),
      })
      const json = await res.json()
      if (json.url) {
        window.location.href = json.url
      } else {
        setSubmitError(json.error || 'Nie udało się uruchomić płatności.')
        setSubmitting(false)
      }
      return
    }

    const res = await fetch('/api/orders/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action, ...extra }),
    })
    const json = await res.json()
    if (json.ok) {
      setDoneAction(action)
      setView('done')
    } else {
      setSubmitError(json.error || 'Wystąpił błąd. Spróbuj ponownie.')
    }
    setSubmitting(false)
  }

  const hint = getReductionInfo(order?.quoted_price, parseFloat(proposedPrice))
  const canSubmitNegotiate = proposedPrice && hint && hint.type !== 'error'

  const mono = "'DM Mono', monospace"
  const bebas = "'Bebas Neue', sans-serif"

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontFamily: mono }}>
      Ładowanie...
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', color: '#f0ece4', maxWidth: '400px' }}>
        <div style={{ fontFamily: bebas, fontSize: '4rem', color: '#ff4500', lineHeight: 1 }}>404</div>
        <p style={{ color: '#666', marginTop: '1rem', fontFamily: mono, fontSize: '0.85rem' }}>Nie znaleziono zamówienia.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '3rem 1.5rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* Logo */}
        <div style={{ marginBottom: '2.5rem' }}>
          <a href="/" style={{ fontFamily: bebas, fontSize: '1.8rem', letterSpacing: '3px', color: '#ff4500', textDecoration: 'none' }}>PRINT-FORGE</a>
        </div>

        {/* Karta */}
        <div style={{ background: '#111', border: '1px solid #222', borderTop: '3px solid #ff4500', borderRadius: '2px' }}>

          {/* Nagłówek */}
          <div style={{ padding: '1.75rem 2rem', borderBottom: '1px solid #222' }}>
            <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#ff4500', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Zamówienie #{id.slice(0, 8).toUpperCase()}
            </div>
            <div style={{ fontFamily: bebas, fontSize: '1.8rem', color: '#f0ece4', letterSpacing: '0.05em' }}>
              {view === 'done' ? 'Dziękujemy za odpowiedź' : `Wycena dla ${order.customer_name}`}
            </div>
          </div>

          <div style={{ padding: '2rem' }}>

            {/* WIDOK: GOTOWE */}
            {view === 'done' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {doneAction === 'accept' && (
                  <>
                    <div style={{ background: '#10b98115', border: '1px solid #10b981', borderRadius: '2px', padding: '1.25rem', color: '#10b981', fontFamily: mono, fontSize: '0.85rem' }}>
                      ✓ Wycena zaakceptowana. Skontaktujemy się z Tobą wkrótce w celu finalizacji zamówienia.
                    </div>
                  </>
                )}
                {doneAction === 'reject' && (
                  <div style={{ background: '#ef444415', border: '1px solid #ef4444', borderRadius: '2px', padding: '1.25rem', color: '#ef4444', fontFamily: mono, fontSize: '0.85rem' }}>
                    Zamówienie zostało anulowane. Jeśli to pomyłka, napisz do nas na adres kontakt@print-forge.pl.
                  </div>
                )}
                {doneAction === 'negotiate' && (
                  <div style={{ background: '#f59e0b15', border: '1px solid #f59e0b', borderRadius: '2px', padding: '1.25rem', color: '#f59e0b', fontFamily: mono, fontSize: '0.85rem' }}>
                    Propozycja wysłana. Odpowiemy w ciągu 24 godzin roboczych.
                  </div>
                )}
              </div>
            )}

            {/* WIDOK: NEGOCJACJA */}
            {view === 'negotiate' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Nasza wycena
                  </div>
                  <div style={{ fontFamily: bebas, fontSize: '2.5rem', color: '#ff4500', lineHeight: 1 }}>
                    {order.quoted_price} zł
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: mono, fontSize: '0.65rem', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Twoja propozycja (zł) *
                  </label>
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={e => setProposedPrice(e.target.value)}
                    placeholder={`min. ${Math.ceil(order.quoted_price * 0.70)} zł`}
                    style={{ width: '100%', background: '#0a0a0a', borderWidth: '1px', borderStyle: 'solid', borderColor: hint?.type === 'error' ? '#ef4444' : '#333', color: '#f0ece4', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                  {hint && (
                    <div style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', background: HINT_COLORS[hint.type] + '15', border: `1px solid ${HINT_COLORS[hint.type]}`, borderRadius: '2px', color: HINT_COLORS[hint.type], fontSize: '0.8rem', fontFamily: mono, lineHeight: 1.5 }}>
                      {hint.text}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: mono, fontSize: '0.65rem', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Wiadomość (opcjonalnie)
                  </label>
                  <textarea
                    value={customerMessage}
                    onChange={e => setCustomerMessage(e.target.value)}
                    placeholder="Możesz napisać dlaczego proponujesz tę cenę..."
                    rows={3}
                    style={{ width: '100%', background: '#0a0a0a', borderWidth: '1px', borderStyle: 'solid', borderColor: '#333', color: '#f0ece4', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                {submitError && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: mono }}>{submitError}</div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => submit('negotiate', { proposed_price: parseFloat(proposedPrice), customer_message: customerMessage })}
                    disabled={!canSubmitNegotiate || submitting}
                    style={{ flex: 1, background: canSubmitNegotiate ? '#ff4500' : '#222', color: canSubmitNegotiate ? 'white' : '#555', border: 'none', padding: '0.85rem', fontFamily: mono, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: canSubmitNegotiate ? 'pointer' : 'not-allowed' }}
                  >
                    {submitting ? 'Wysyłanie...' : 'Wyślij propozycję →'}
                  </button>
                  <button
                    onClick={() => setView('main')}
                    style={{ background: 'transparent', border: '1px solid #333', color: '#666', padding: '0.85rem 1.25rem', fontFamily: mono, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}
                  >
                    Wróć
                  </button>
                </div>
              </div>
            )}

            {/* WIDOK: GŁÓWNY */}
            {view === 'main' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {order.status !== 'quoted' ? (
                  <div style={{ background: '#333', borderRadius: '2px', padding: '1.25rem', color: '#aaa', fontFamily: mono, fontSize: '0.85rem' }}>
                    To zamówienie nie oczekuje już na odpowiedź. Aktualny status: <strong style={{ color: '#f0ece4' }}>{order.status}</strong>
                  </div>
                ) : (
                  <>
                    {/* Szczegóły zamówienia */}
                    <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '2px', padding: '1.25rem' }}>
                      <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#ff4500', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Szczegóły zamówienia</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem', color: '#aaa' }}>
                        <div><span style={{ color: '#555' }}>Materiał: </span>{order.material}</div>
                        <div><span style={{ color: '#555' }}>Kolor: </span>{order.color}</div>
                        <div><span style={{ color: '#555' }}>Ilość: </span>{order.quantity} szt.</div>
                        {order.file_name && <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#555' }}>Plik: </span><span style={{ fontFamily: mono, fontSize: '0.8rem' }}>{order.file_name}</span></div>}
                      </div>
                    </div>

                    {/* Kwota wyceny */}
                    <div style={{ textAlign: 'center', padding: '1.5rem', background: '#0a0a0a', border: '1px solid #ff450033', borderRadius: '2px' }}>
                      <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Wycena</div>
                      <div style={{ fontFamily: bebas, fontSize: '3.5rem', color: '#ff4500', lineHeight: 1 }}>{order.quoted_price} zł</div>
                    </div>

                    {/* Przyciski akcji */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <button
                        onClick={() => submit('accept')}
                        disabled={submitting}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '1rem', fontFamily: mono, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}
                      >
                        {submitting ? '...' : '✓ Akceptuję wycenę'}
                      </button>
                      <button
                        onClick={() => setView('negotiate')}
                        style={{ background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '1rem', fontFamily: mono, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}
                      >
                        ↕ Negocjuj cenę
                      </button>
                      <button
                        onClick={() => { if (confirm('Czy na pewno chcesz anulować zamówienie?')) submit('reject') }}
                        style={{ background: 'transparent', border: '1px solid #333', color: '#555', padding: '0.75rem', fontFamily: mono, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}
                      >
                        Odrzuć / Anuluj
                      </button>
                    </div>

                    {submitError && (
                      <div style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: mono }}>{submitError}</div>
                    )}
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontFamily: mono, fontSize: '0.7rem', color: '#333' }}>
          <a href="/" style={{ color: '#555', textDecoration: 'none' }}>print-forge.pl</a>
        </div>
      </div>
    </div>
  )
}
