'use client'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Toast, { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Wszystkie', 'dekoracje', 'tech', 'organizery']
const CATEGORY_ICON = { dekoracje: '🏺', tech: '🎮', organizery: '🗂️' }
const SPECS = {
  dekoracje: [['Technologia', 'FDM'], ['Warstwa', '0.12 mm'], ['Wypełnienie', '20%'], ['Czas druku', '4–8h']],
  tech: [['Technologia', 'FDM'], ['Warstwa', '0.2 mm'], ['Wypełnienie', '40%'], ['Czas druku', '2–5h']],
  organizery: [['Technologia', 'FDM'], ['Warstwa', '0.2 mm'], ['Wypełnienie', '30%'], ['Czas druku', '3–6h']],
}

function StarRating({ rating }) {
  return (
    <span style={{ color: '#ff4500', fontSize: '0.9rem', letterSpacing: '2px' }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            fontSize: '1.5rem', cursor: 'pointer',
            color: star <= (hovered || value) ? '#ff4500' : 'var(--border)',
            transition: 'color 0.15s',
          }}
        >★</span>
      ))}
    </div>
  )
}

function ProductModal({ product, onClose, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('opis')
  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newReview, setNewReview] = useState({ author_name: '', rating: 5, text: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Pobierz opinie z bazy
  useEffect(() => {
    setLoadingReviews(true)
    supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews(data || [])
        setLoadingReviews(false)
      })
  }, [product.id])

  const handleSubmitReview = async () => {
    if (!newReview.author_name.trim() || !newReview.text.trim()) return
    setSubmitting(true)
    const { data, error } = await supabase
      .from('product_reviews')
      .insert({
        product_id: product.id,
        author_name: newReview.author_name.trim(),
        rating: newReview.rating,
        text: newReview.text.trim(),
      })
      .select()
      .single()

    if (!error && data) {
      setReviews(prev => [data, ...prev])
      setNewReview({ author_name: '', rating: 5, text: '' })
      setShowForm(false)
    }
    setSubmitting(false)
  }

  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 0

  const specs = SPECS[product.category] || SPECS.tech
  const icon = CATEGORY_ICON[product.category] || '📦'
  const hasImages = product.images && product.images.length > 0
  const [activeImage, setActiveImage] = useState(0)

  const tabStyle = (tab) => ({
    background: 'transparent', border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
    color: activeTab === tab ? 'var(--text)' : 'var(--muted)',
    padding: '0.75rem 1.25rem', fontSize: '0.8rem',
    fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em',
    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
  })

  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '0.65rem 0.9rem', borderRadius: '2px',
    fontSize: '0.9rem', outline: 'none',
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '1rem', paddingTop: 'max(1rem, env(safe-area-inset-top))', backdropFilter: 'blur(4px)',
        overflowY: 'auto',
      }}
    >
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px',
        width: '100%', maxWidth: '900px',
        position: 'relative', animation: 'slideUp 0.3s ease',
      }}>
        {/* ZAMKNIJ */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          color: 'var(--muted)', width: '36px', height: '36px', borderRadius: '50%',
          fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
        }}>✕</button>

        {/* GÓRNA SEKCJA */}
        <div className="modal-top-grid">
          {/* LEWA — zdjęcia */}
          <div className="modal-img-border" style={{ borderRight: '1px solid var(--border)' }}>
            {/* Główne zdjęcie */}
            <div style={{
              aspectRatio: '1', background: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            }}>
              {hasImages ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(255,69,0,0.08), transparent 70%)' }} />
                  <span style={{ fontSize: '8rem' }}>{icon}</span>
                </>
              )}
            </div>
            {/* Miniatury */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)' }}>
              {hasImages ? (
                product.images.map((url, i) => (
                  <div key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      aspectRatio: '1', overflow: 'hidden', cursor: 'pointer',
                      border: `2px solid ${activeImage === i ? 'var(--accent)' : 'transparent'}`,
                      transition: 'border-color 0.2s',
                    }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))
              ) : (
                <div style={{ aspectRatio: '1', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', gridColumn: 'span 4', color: 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '1rem' }}>
                  Brak zdjęć — dodaj w panelu admina
                </div>
              )}
            </div>
          </div>

          {/* PRAWA — info */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{product.category}</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '0.03em', lineHeight: 1, marginBottom: '0.5rem' }}>{product.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {reviews.length > 0 ? (
                  <>
                    <StarRating rating={avgRating} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
                      {avgRating}.0 ({reviews.length} {reviews.length === 1 ? 'opinia' : 'opinii'})
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>Brak opinii</span>
                )}
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--accent)', letterSpacing: '0.05em' }}>{product.price} zł</div>
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 300, borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>{product.description}</p>

            {/* Kolory */}
            <div>
              <div style={{ fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Kolor</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Biały', 'Czarny', 'Szary', 'Czerwony'].map(color => (
                  <div key={color} style={{
                    fontSize: '0.7rem', fontFamily: "'DM Mono', monospace",
                    border: '1px solid var(--border)', padding: '0.3rem 0.75rem',
                    borderRadius: '2px', color: 'var(--muted)', cursor: 'pointer',
                  }}>{color}</div>
                ))}
              </div>
            </div>

            {/* Ilość + koszyk */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'var(--bg)', border: 'none', color: 'var(--text)', width: '36px', height: '42px', fontSize: '1.1rem', cursor: 'pointer' }}>−</button>
                <span style={{ padding: '0 1rem', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', lineHeight: '42px' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ background: 'var(--bg)', border: 'none', color: 'var(--text)', width: '36px', height: '42px', fontSize: '1.1rem', cursor: 'pointer' }}>+</button>
              </div>
              <button
                onClick={() => { onAddToCart(product, qty); onClose() }}
                style={{
                  flex: 1, background: 'var(--accent)', color: 'white', border: 'none',
                  padding: '0 1.5rem', height: '42px', fontSize: '0.8rem', fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer',
                }}
              >Dodaj do koszyka →</button>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '0.8rem', color: 'var(--muted)' }}>
              📦 Dostawa 24–48h &nbsp;·&nbsp; 🔄 Zwrot 14 dni &nbsp;·&nbsp; 🇵🇱 Produkt z Polski
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {['opis', 'specyfikacja', 'opinie'].map(tab => (
              <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
                {tab === 'opis' ? 'Opis' : tab === 'specyfikacja' ? 'Specyfikacja' : `Opinie (${reviews.length})`}
              </button>
            ))}
          </div>

          <div style={{ padding: '2rem' }}>

            {/* OPIS */}
            {activeTab === 'opis' && (
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300, maxWidth: '600px' }}>
                <p style={{ marginBottom: '1rem' }}>{product.description}</p>
                <p style={{ marginBottom: '1rem' }}>Każdy model jest drukowany na zamówienie z najwyższej jakości filamentu. Dbamy o dokładność wymiarową i jakość powierzchni — każdy wydruk przechodzi kontrolę przed wysyłką.</p>
                <p>Produkt nadaje się do użytku domowego i biurowego. W przypadku pytań dotyczących customizacji rozmiarów lub kolorów — skontaktuj się z nami przez formularz zamówienia.</p>
              </div>
            )}

            {/* SPECYFIKACJA */}
            {activeTab === 'specyfikacja' && (
              <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '500px' }}>
                <tbody>
                  {[
                    ...specs,
                    ['Materiał', product.material || 'PLA'],
                    ['Dostępne kolory', 'Biały, Czarny, Szary, Czerwony'],
                    ['Kraj produkcji', 'Polska 🇵🇱'],
                  ].map(([key, val]) => (
                    <tr key={key}>
                      <td style={{ padding: '0.6rem 1rem 0.6rem 0', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', width: '40%' }}>{key}</td>
                      <td style={{ padding: '0.6rem 0', fontSize: '0.9rem', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* OPINIE */}
            {activeTab === 'opinie' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>

                {/* Podsumowanie */}
                {reviews.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '2px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', color: 'var(--accent)', lineHeight: 1 }}>{avgRating}.0</div>
                      <StarRating rating={avgRating} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem', fontFamily: "'DM Mono', monospace" }}>{reviews.length} opinii</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = reviews.filter(r => r.rating === star).length
                        const pct = reviews.length ? (count / reviews.length) * 100 : 0
                        return (
                          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace", width: '12px' }}>{star}</span>
                            <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)' }} />
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace", width: '16px' }}>{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Przycisk dodaj opinię */}
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    style={{
                      background: 'transparent', border: '1px solid var(--accent)',
                      color: 'var(--accent)', padding: '0.75rem 1.5rem',
                      fontSize: '0.8rem', fontFamily: "'DM Mono', monospace",
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      borderRadius: '2px', cursor: 'pointer', transition: 'all 0.2s',
                      alignSelf: 'flex-start',
                    }}
                  >+ Dodaj opinię</button>
                )}

                {/* Formularz opinii */}
                {showForm && (
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '2px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.05em' }}>Napisz opinię</div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Twoja ocena</div>
                      <StarPicker value={newReview.rating} onChange={v => setNewReview(p => ({ ...p, rating: v }))} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Imię *</div>
                      <input
                        placeholder="Jan K."
                        value={newReview.author_name}
                        onChange={e => setNewReview(p => ({ ...p, author_name: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Treść opinii *</div>
                      <textarea
                        placeholder="Podziel się swoją opinią..."
                        value={newReview.text}
                        onChange={e => setNewReview(p => ({ ...p, text: e.target.value }))}
                        style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={handleSubmitReview}
                        disabled={submitting || !newReview.author_name || !newReview.text}
                        style={{
                          background: submitting ? 'var(--muted)' : 'var(--accent)', color: 'white',
                          border: 'none', padding: '0.65rem 1.5rem', fontSize: '0.8rem',
                          fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em',
                          textTransform: 'uppercase', borderRadius: '2px',
                          cursor: submitting ? 'not-allowed' : 'pointer',
                        }}
                      >{submitting ? 'Wysyłanie...' : 'Opublikuj'}</button>
                      <button
                        onClick={() => setShowForm(false)}
                        style={{
                          background: 'transparent', border: '1px solid var(--border)',
                          color: 'var(--muted)', padding: '0.65rem 1.5rem',
                          fontSize: '0.8rem', fontFamily: "'DM Mono', monospace",
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          borderRadius: '2px', cursor: 'pointer',
                        }}
                      >Anuluj</button>
                    </div>
                  </div>
                )}

                {/* Ładowanie */}
                {loadingReviews && (
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontFamily: "'DM Mono', monospace" }}>Ładowanie opinii...</p>
                )}

                {/* Brak opinii */}
                {!loadingReviews && reviews.length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '2px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Brak opinii — bądź pierwszy!</p>
                  </div>
                )}

                {/* Lista opinii */}
                {reviews.map((review) => (
                  <div key={review.id} style={{ padding: '1.25rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>
                          {review.author_name[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{review.author_name}</div>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
                        {new Date(review.created_at).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7, fontWeight: 300 }}>{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SklepPage() {
  const { toast, show } = useToast()
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('Wszystkie')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', address: '' })

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true).then(({ data }) => {
      setProducts(data || [])
      setFiltered(data || [])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setFiltered(category === 'Wszystkie' ? products : products.filter(p => p.category === category))
  }, [category, products])

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty }]
    })
    show('Dodano do koszyka 🛒', `${product.name} ×${qty}`)
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email) { show('Brakuje danych', 'Podaj imię i e-mail.'); return }
    setCheckingOut(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ id: i.id, quantity: i.qty })),
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          shippingAddress: customerInfo.address,
        }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch { show('Błąd', 'Nie udało się rozpocząć płatności.') }
    finally { setCheckingOut(false) }
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '0.65rem 0.9rem', borderRadius: '2px',
    fontSize: '0.9rem', outline: 'none',
  }

  return (
    <>
      <Nav />
      <Toast toast={toast} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <div className="sklep-wrap">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>// Sklep</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>Gotowe wydruki</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                background: category === cat ? 'rgba(255,69,0,0.1)' : 'transparent',
                border: `1px solid ${category === cat ? 'var(--accent)' : 'var(--border)'}`,
                color: category === cat ? 'var(--accent)' : 'var(--muted)',
                padding: '0.4rem 1rem', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer',
              }}>{cat}</button>
            ))}
            {cartCount > 0 && (
              <button onClick={() => setShowCart(true)} style={{
                background: 'var(--accent)', color: 'white', border: 'none',
                padding: '0.4rem 1rem', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', marginLeft: '0.5rem', cursor: 'pointer',
              }}>🛒 Koszyk ({cartCount})</button>
            )}
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '4rem' }}>Ładowanie produktów...</p>
        ) : (
          <div className="products-grid">
            {filtered.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                style={{ background: 'var(--bg)', transition: 'background 0.3s', position: 'relative', cursor: 'pointer' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--surface)'
                  e.currentTarget.querySelector('.hover-overlay').style.opacity = '1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--bg)'
                  e.currentTarget.querySelector('.hover-overlay').style.opacity = '0'
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', borderBottom: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg)' }}>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                    />
                  ) : (
                    <span>{CATEGORY_ICON[product.category] || '📦'}</span>
                  )}
                  <div className="hover-overlay" style={{
                    position: 'absolute', inset: 0, background: 'rgba(255,69,0,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.25s',
                    fontFamily: "'DM Mono', monospace", fontSize: '0.8rem',
                    letterSpacing: '0.15em', textTransform: 'uppercase', color: 'white', fontWeight: 600,
                  }}>Zobacz szczegóły →</div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{product.category}</div>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{product.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300, marginBottom: '1rem', lineHeight: 1.6 }}>{product.description}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: 'var(--accent)' }}>{product.price} zł</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(product) }}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)',
                        background: 'transparent', color: 'var(--text)', fontSize: '1.2rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CART MODAL */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={e => { if (e.target === e.currentTarget) setShowCart(false) }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', marginBottom: '1.5rem' }}>Koszyk</h2>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.price} zł × {item.qty}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--accent)' }}>{(item.price * item.qty).toFixed(2)} zł</div>
                  <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem' }}>
              <span>Razem</span><span style={{ color: 'var(--accent)' }}>{cartTotal.toFixed(2)} zł</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <input placeholder="Imię i nazwisko *" value={customerInfo.name} onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              <input placeholder="E-mail *" type="email" value={customerInfo.email} onChange={e => setCustomerInfo(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
              <input placeholder="Adres dostawy" value={customerInfo.address} onChange={e => setCustomerInfo(p => ({ ...p, address: e.target.value }))} style={inputStyle} />
              <button onClick={handleCheckout} disabled={checkingOut} style={{ background: checkingOut ? 'var(--muted)' : 'var(--accent)', color: 'white', border: 'none', padding: '0.85rem 2rem', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}>
                {checkingOut ? 'Przekierowuję...' : 'Zapłać przez Stripe →'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}