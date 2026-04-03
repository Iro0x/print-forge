'use client'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Toast, { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Wszystkie', 'dekoracje', 'tech', 'organizery']

export default function SklepPage() {
  const { toast, show } = useToast()
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('Wszystkie')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [showCart, setShowCart] = useState(false)
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

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    show('Dodano do koszyka 🛒', product.name)
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

  const inputStyle = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.65rem 0.9rem', borderRadius: '2px', fontSize: '0.9rem', outline: 'none' }

  return (
    <>
      <Nav />
      <Toast toast={toast} />

      <div style={{ paddingTop: '8rem', padding: '8rem 4rem 6rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>// Sklep</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>Gotowe wydruki</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                background: category === cat ? 'rgba(255,69,0,0.1)' : 'transparent',
                border: `1px solid ${category === cat ? 'var(--accent)' : 'var(--border)'}`,
                color: category === cat ? 'var(--accent)' : 'var(--muted)',
                padding: '0.4rem 1rem', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px',
              }}>{cat}</button>
            ))}
            {cartCount > 0 && (
              <button onClick={() => setShowCart(true)} style={{
                background: 'var(--accent)', color: 'white', border: 'none',
                padding: '0.4rem 1rem', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', marginLeft: '1rem',
              }}>🛒 Koszyk ({cartCount})</button>
            )}
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '4rem' }}>Ładowanie produktów...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
            {filtered.map(product => (
              <div key={product.id} style={{ background: 'var(--bg)', transition: 'background 0.3s', position: 'relative' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
              >
                <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', borderBottom: '1px solid var(--border)' }}>
                  {product.category === 'dekoracje' ? '🏺' : product.category === 'tech' ? '🎮' : '🗂️'}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{product.category}</div>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{product.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300, marginBottom: '1rem', lineHeight: 1.6 }}>{product.description}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: 'var(--accent)' }}>
                      {product.price} zł
                    </div>
                    <button onClick={() => addToCart(product)} style={{
                      width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)',
                      background: 'transparent', color: 'var(--text)', fontSize: '1.2rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={e => { if (e.target === e.currentTarget) setShowCart(false) }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2.5rem', width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', marginBottom: '1.5rem' }}>Koszyk</h2>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.price} zł × {item.qty}</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: 'var(--accent)' }}>{(item.price * item.qty).toFixed(2)} zł</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem' }}>
              <span>Razem</span><span style={{ color: 'var(--accent)' }}>{cartTotal.toFixed(2)} zł</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <input placeholder="Imię i nazwisko *" value={customerInfo.name} onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              <input placeholder="E-mail *" type="email" value={customerInfo.email} onChange={e => setCustomerInfo(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
              <input placeholder="Adres dostawy" value={customerInfo.address} onChange={e => setCustomerInfo(p => ({ ...p, address: e.target.value }))} style={inputStyle} />
              <button onClick={handleCheckout} disabled={checkingOut} style={{ background: checkingOut ? 'var(--muted)' : 'var(--accent)', color: 'white', border: 'none', padding: '0.85rem 2rem', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px' }}>
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
