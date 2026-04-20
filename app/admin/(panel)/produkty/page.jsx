'use client'
import { useEffect, useState } from 'react'
import ProductForm from '@/components/admin/ProductForm'
import ProductImageManager from '@/components/ProductImageManager'

function AdminToast({ toast }) {
  if (!toast) return null
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999, background: 'var(--surface2)', border: `1px solid ${toast.ok ? 'var(--accent)' : '#ef4444'}`, borderLeft: `3px solid ${toast.ok ? 'var(--accent)' : '#ef4444'}`, padding: '1rem 1.5rem', borderRadius: '2px', fontSize: '0.9rem' }}>
      <style>{`@keyframes sI { from { transform: translateX(120%); } to { transform: translateX(0); } }`}</style>
      {toast.msg}
    </div>
  )
}

export default function ProduktyPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [showForm, setShowForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    fetch('/api/admin/orders?type=products').then(r => r.json()).then(json => {
      setProducts(json.data || [])
      setLoading(false)
    })
  }, [])

  const saveProduct = async (form, id) => {
    setSaving(true)
    const res = await fetch('/api/admin/products', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id ? { id, ...form } : form) })
    const json = await res.json()
    if (json.data) {
      if (id) setProducts(prev => prev.map(p => p.id === id ? json.data : p))
      else setProducts(prev => [json.data, ...prev])
      setShowForm(null)
      showToast(id ? 'Produkt zaktualizowany ✓' : 'Produkt dodany ✓')
    } else showToast('Błąd ✗', false)
    setSaving(false)
  }

  const deleteProduct = async (id) => {
    if (!confirm('Usunąć ten produkt?')) return
    const res = await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    const json = await res.json()
    if (json.success) { setProducts(prev => prev.filter(p => p.id !== id)); showToast('Usunięto ✓') }
    else showToast('Błąd ✗', false)
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>Ładowanie...</p>

  return (
    <>
      <AdminToast toast={toast} />
      {showForm !== null && (
        <ProductForm product={showForm === 'new' ? null : showForm} onSave={saveProduct} onClose={() => setShowForm(null)} saving={saving} />
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={() => setShowForm('new')} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}>
          + Nowy produkt
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
        {products.map(product => (
          <div key={product.id} style={{ background: 'var(--bg)' }}>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer', flex: 1 }} onClick={() => setExpanded(expanded === product.id ? null : product.id)}>
                <div style={{ width: '48px', height: '48px', borderRadius: '2px', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  {product.images?.[0] ? <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : { dekoracje: '🏺', tech: '🎮', organizery: '🗂️' }[product.category] || '📦'}
                </div>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>{product.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)' }}>
                    {product.category} · {product.price} zł · {product.stock_qty} szt. · {product.images?.length || 0} zdjęć
                    {!product.is_active && <span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>· ukryty</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => setShowForm(product)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>Edytuj</button>
                <button onClick={() => deleteProduct(product.id)} style={{ background: 'transparent', border: '1px solid #ef444444', color: '#ef4444', padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>Usuń</button>
                <span onClick={() => setExpanded(expanded === product.id ? null : product.id)} style={{ color: 'var(--accent)', fontSize: '1.2rem', cursor: 'pointer', transition: 'transform 0.2s', transform: expanded === product.id ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>
            </div>
            {expanded === product.id && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Zdjęcia produktu</div>
                <ProductImageManager product={product} onUpdate={newImages => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, images: newImages } : p))} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
