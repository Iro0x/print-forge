'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import ProductImageManager from '@/components/ProductImageManager'

const STATUS_COLORS = {
  pending: '#ff4500', quoted: '#ff7c45', negotiating: '#f59e0b',
  paid: '#10b981', printing: '#8b5cf6', shipped: '#3b82f6',
  done: '#22c55e', cancelled: '#ef4444',
}

const CUSTOM_STATUSES = ['pending', 'quoted', 'negotiating', 'paid', 'printing', 'shipped', 'done', 'cancelled']
const SHOP_STATUSES = ['pending', 'paid', 'printing', 'shipped', 'done', 'cancelled']
const TABS = ['📊 Statystyki', '📁 Customowe', '🛒 Sklepowe', '📦 Produkty', '🧵 Filamenty']

const MATERIALS = ['PLA', 'PETG', 'ABS', 'TPU', 'Żywica']

function parseNegotiation(adminNote) {
  if (!adminNote) return null
  const priceMatch = adminNote.match(/\[KONTR-OFERTA: ([\d.]+) zł/)
  if (!priceMatch) return null
  const msgMatch = adminNote.match(/Wiadomość: ([^\]]+)\]/)
  return { price: parseFloat(priceMatch[1]), message: msgMatch?.[1] || null }
}

const iStyle = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.6rem 0.9rem', borderRadius: '2px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }
const lStyle = { display: 'block', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }
const thStyle = { padding: '0.75rem 1rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const tdStyle = { padding: '0.75rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${color || 'var(--accent)'}`, padding: '1.5rem', borderRadius: '2px' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: color || 'var(--accent)', lineHeight: 1, marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.2rem' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span style={{ background: (STATUS_COLORS[status] || '#666') + '22', color: STATUS_COLORS[status] || '#666', padding: '0.2rem 0.6rem', borderRadius: '2px', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace" }}>
      {status}
    </span>
  )
}

function ModalWrap({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ padding: '2rem' }}>{children}</div>
      </div>
    </div>
  )
}

function ProductForm({ product, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'dekoracje',
    material: product?.material || 'PLA',
    stock_qty: product?.stock_qty || 0,
    is_active: product?.is_active ?? true,
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <ModalWrap title={product ? 'Edytuj produkt' : 'Nowy produkt'} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={lStyle}>Nazwa *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nazwa produktu" style={iStyle} />
        </div>
        <div>
          <label style={lStyle}>Opis</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Opis produktu..." style={{ ...iStyle, resize: 'vertical', minHeight: '80px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={lStyle}>Cena (zł) *</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="49.00" style={iStyle} />
          </div>
          <div>
            <label style={lStyle}>Stan magazynowy</label>
            <input type="number" value={form.stock_qty} onChange={e => set('stock_qty', e.target.value)} style={iStyle} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={lStyle}>Kategoria</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} style={iStyle}>
              <option value="dekoracje">Dekoracje</option>
              <option value="tech">Tech</option>
              <option value="organizery">Organizery</option>
            </select>
          </div>
          <div>
            <label style={lStyle}>Materiał</label>
            <select value={form.material} onChange={e => set('material', e.target.value)} style={iStyle}>
              {['PLA', 'PETG', 'ABS', 'TPU', 'Żywica'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input type="checkbox" id="active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }} />
          <label htmlFor="active" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Produkt aktywny (widoczny w sklepie)</label>
        </div>
        <button
          onClick={() => onSave(form, product?.id)}
          disabled={!form.name || !form.price || saving}
          style={{ background: form.name && form.price ? 'var(--accent)' : 'var(--muted)', color: 'white', border: 'none', padding: '0.85rem', fontSize: '0.85rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}
        >
          {saving ? 'Zapisywanie...' : product ? 'Zapisz zmiany' : 'Dodaj produkt'}
        </button>
      </div>
    </ModalWrap>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [custom, setCustom] = useState([])
  const [shop, setShop] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderType, setOrderType] = useState(null)
  const [showProductForm, setShowProductForm] = useState(null)
  const [filaments, setFilaments] = useState([])
  const [filamentForm, setFilamentForm] = useState({ color_name: '', color_hex: '#ff4500', material: 'PLA', notes: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [modalDraft, setModalDraft] = useState(null)

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders?type=custom').then(r => r.json()),
      fetch('/api/admin/orders?type=shop').then(r => r.json()),
      fetch('/api/admin/orders?type=products').then(r => r.json()),
      fetch('/api/admin/orders?type=stats').then(r => r.json()),
      fetch('/api/admin/filaments').then(r => r.json()),
    ]).then(([c, s, p, st, f]) => {
      setCustom(c.data || [])
      setShop(s.data || [])
      setProducts(p.data || [])
      setStats(st.data || {})
      setFilaments(f.data || [])
      setLoading(false)
    })
  }, [])

  const updateOrder = async (id, type, fields) => {
    setSaving(true)
    const res = await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, type, ...fields }) })
    const json = await res.json()
    if (json.data) {
      if (type === 'custom') setCustom(prev => prev.map(o => o.id === id ? json.data : o))
      else setShop(prev => prev.map(o => o.id === id ? json.data : o))
      if (selectedOrder?.id === id) setSelectedOrder(json.data)
      showToast('Zapisano ✓')
    } else showToast('Błąd ✗', false)
    setSaving(false)
  }

  const saveProduct = async (form, id) => {
    setSaving(true)
    const res = await fetch('/api/admin/products', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id ? { id, ...form } : form) })
    const json = await res.json()
    if (json.data) {
      if (id) setProducts(prev => prev.map(p => p.id === id ? json.data : p))
      else setProducts(prev => [json.data, ...prev])
      setShowProductForm(null)
      showToast(id ? 'Produkt zaktualizowany ✓' : 'Produkt dodany ✓')
    } else showToast('Błąd ✗', false)
    setSaving(false)
  }

  const deleteProduct = async (id) => {
    if (!confirm('Usunąć ten produkt?')) return
    const res = await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    const json = await res.json()
    if (json.success) { setProducts(prev => prev.filter(p => p.id !== id)); showToast('Usunięto ✓') }
  }

  const addFilament = async () => {
    if (!filamentForm.color_name || !filamentForm.material) return
    setSaving(true)
    const res = await fetch('/api/admin/filaments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filamentForm) })
    const json = await res.json()
    if (json.data) { setFilaments(prev => [...prev, json.data]); setFilamentForm({ color_name: '', color_hex: '#ff4500', material: 'PLA', notes: '' }); showToast('Filament dodany ✓') }
    else showToast('Błąd ✗', false)
    setSaving(false)
  }

  const toggleFilament = async (id, is_available) => {
    const res = await fetch('/api/admin/filaments', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_available }) })
    const json = await res.json()
    if (json.data) setFilaments(prev => prev.map(f => f.id === id ? json.data : f))
    else showToast('Błąd ✗', false)
  }

  const deleteFilament = async (id) => {
    if (!confirm('Usunąć ten filament?')) return
    const res = await fetch('/api/admin/filaments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    const json = await res.json()
    if (json.success) { setFilaments(prev => prev.filter(f => f.id !== id)); showToast('Usunięto ✓') }
    else showToast('Błąd ✗', false)
  }

  const acceptNegotiation = async (order, proposedPrice) => {
    setSaving(true)
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, type: 'custom', status: 'quoted', quoted_price: proposedPrice, accept_negotiation: true }),
    })
    const json = await res.json()
    if (json.data) {
      setCustom(prev => prev.map(o => o.id === order.id ? json.data : o))
      setSelectedOrder(json.data)
      setModalDraft({ status: json.data.status, quoted_price: json.data.quoted_price || '', admin_note: json.data.admin_note || '' })
      showToast('Zaakceptowano ofertę klienta — e-mail wysłany ✓')
    } else {
      showToast('Błąd ✗', false)
    }
    setSaving(false)
  }

  const openModal = (order, type) => {
    setSelectedOrder(order)
    setOrderType(type)
    setModalDraft({
      status: order.status,
      quoted_price: order.quoted_price || '',
      admin_note: order.admin_note || '',
    })
  }

  const saveModal = async () => {
    if (!selectedOrder || !modalDraft) return
    if (modalDraft.status === 'quoted' && !modalDraft.quoted_price) {
      showToast('Podaj kwotę wyceny przed ustawieniem statusu "quoted" ✗', false)
      return
    }
    setSaving(true)
    const fields = {}
    if (modalDraft.status !== selectedOrder.status) fields.status = modalDraft.status
    if (modalDraft.admin_note !== (selectedOrder.admin_note || '')) fields.admin_note = modalDraft.admin_note
    if (orderType === 'custom') {
      const newPrice = modalDraft.quoted_price ? parseFloat(modalDraft.quoted_price) : null
      if (newPrice && newPrice !== selectedOrder.quoted_price) {
        fields.quoted_price = newPrice
        // Jeśli ustawiono cenę a status nie był zmieniany ręcznie, auto-ustaw quoted
        if (!fields.status && selectedOrder.status === 'pending') fields.status = 'quoted'
      }
    }
    if (Object.keys(fields).length === 0) { showToast('Brak zmian do zapisania'); setSaving(false); return }
    await updateOrder(selectedOrder.id, orderType, fields)
    setSaving(false)
  }

  return (
    <>
      <Nav />

      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999, background: 'var(--surface2)', border: `1px solid ${toast.ok ? 'var(--accent)' : '#ef4444'}`, borderLeft: `3px solid ${toast.ok ? 'var(--accent)' : '#ef4444'}`, padding: '1rem 1.5rem', borderRadius: '2px', fontSize: '0.9rem' }}>
          <style>{`@keyframes sI { from { transform: translateX(120%); } to { transform: translateX(0); } }`}</style>
          {toast.msg}
        </div>
      )}

      {/* MODAL SZCZEGÓŁÓW ZAMÓWIENIA */}
      {selectedOrder && (
        <ModalWrap title={`Zamówienie #${selectedOrder.id.slice(0, 8)}...`} onClose={() => { setSelectedOrder(null); setModalDraft(null) }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '2px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Dane klienta</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div><span style={{ color: 'var(--muted)' }}>Imię: </span>{selectedOrder.customer_name}</div>
                <div><span style={{ color: 'var(--muted)' }}>E-mail: </span><a href={`mailto:${selectedOrder.customer_email}`} style={{ color: 'var(--accent)' }}>{selectedOrder.customer_email}</a></div>
                {selectedOrder.customer_phone && <div><span style={{ color: 'var(--muted)' }}>Tel: </span>{selectedOrder.customer_phone}</div>}
                <div><span style={{ color: 'var(--muted)' }}>Data: </span>{new Date(selectedOrder.created_at).toLocaleDateString('pl-PL')}</div>
                {selectedOrder.shipping_address && <div style={{ gridColumn: 'span 2' }}><span style={{ color: 'var(--muted)' }}>Adres: </span>{selectedOrder.shipping_address}</div>}
              </div>
            </div>

            {orderType === 'custom' && (
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '2px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Szczegóły druku</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div><span style={{ color: 'var(--muted)' }}>Technologia: </span>{selectedOrder.technology}</div>
                  <div><span style={{ color: 'var(--muted)' }}>Materiał: </span>{selectedOrder.material}</div>
                  <div><span style={{ color: 'var(--muted)' }}>Kolor: </span>{selectedOrder.color}</div>
                  <div><span style={{ color: 'var(--muted)' }}>Ilość: </span>{selectedOrder.quantity} szt.</div>
                  {selectedOrder.file_name && (
                    <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--muted)' }}>Plik: </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem' }}>{selectedOrder.file_name}</span>
                      {selectedOrder.file_path && (
                        <button
                          onClick={async () => {
                            const res = await fetch(`/api/admin/file?path=${encodeURIComponent(selectedOrder.file_path)}`)
                            const { url, error } = await res.json()
                            if (url) window.open(url, '_blank')
                            else showToast('Nie udało się pobrać pliku ✗', false)
                          }}
                          style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.25rem 0.75rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}
                        >
                          Pobierz ↓
                        </button>
                      )}
                    </div>
                  )}
                  {selectedOrder.notes && <div style={{ gridColumn: 'span 2' }}><span style={{ color: 'var(--muted)' }}>Uwagi: </span>{selectedOrder.notes}</div>}
                </div>
              </div>
            )}

            {orderType === 'custom' && selectedOrder.status === 'negotiating' && (() => {
              const neg = parseNegotiation(selectedOrder.admin_note)
              if (!neg) return null
              return (
                <div style={{ background: '#f59e0b15', border: '1px solid #f59e0b', padding: '1.25rem', borderRadius: '2px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: '#f59e0b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Kontroferta klienta</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--muted)' }}>Oryginalna wycena: </span>
                        <span style={{ textDecoration: 'line-through', color: 'var(--muted)' }}>{selectedOrder.quoted_price} zł</span>
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#f59e0b', lineHeight: 1 }}>{neg.price} zł</div>
                      {neg.message && (
                        <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>„{neg.message}"</div>
                      )}
                    </div>
                    <button
                      onClick={() => acceptNegotiation(selectedOrder, neg.price)}
                      disabled={saving}
                      style={{ background: saving ? 'var(--muted)' : '#10b981', color: 'white', border: 'none', padding: '0.7rem 1.25rem', fontSize: '0.78rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: saving ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {saving ? '...' : '✓ Zaakceptuj ofertę klienta'}
                    </button>
                  </div>
                </div>
              )
            })()}

            {modalDraft && (
              <>
                <div>
                  <label style={lStyle}>Status</label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {(orderType === 'custom' ? CUSTOM_STATUSES : SHOP_STATUSES).map(s => (
                      <button key={s} onClick={() => setModalDraft(d => ({ ...d, status: s }))} style={{ background: modalDraft.status === s ? (STATUS_COLORS[s] + '33') : 'transparent', border: `1px solid ${modalDraft.status === s ? STATUS_COLORS[s] : 'var(--border)'}`, color: modalDraft.status === s ? STATUS_COLORS[s] : 'var(--muted)', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>{s}</button>
                    ))}
                  </div>
                </div>

                {orderType === 'custom' && (
                  <div>
                    <label style={lStyle}>Wycena (zł)</label>
                    <input
                      type="number"
                      placeholder={selectedOrder.quoted_price ? `Obecna: ${selectedOrder.quoted_price} zł` : 'Kwota w zł...'}
                      value={modalDraft.quoted_price}
                      onChange={e => setModalDraft(d => ({ ...d, quoted_price: e.target.value }))}
                      style={iStyle}
                    />
                    {selectedOrder.quoted_price && <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>Obecna: <span style={{ color: 'var(--accent)' }}>{selectedOrder.quoted_price} zł</span></div>}
                  </div>
                )}

                <div>
                  <label style={lStyle}>Notatka wewnętrzna</label>
                  <textarea
                    value={modalDraft.admin_note}
                    onChange={e => setModalDraft(d => ({ ...d, admin_note: e.target.value }))}
                    placeholder="Notatki widoczne tylko dla Ciebie..."
                    style={{ ...iStyle, resize: 'vertical', minHeight: '80px' }}
                  />
                </div>

                <button
                  onClick={saveModal}
                  disabled={saving}
                  style={{ background: saving ? 'var(--muted)' : 'var(--accent)', color: 'white', border: 'none', padding: '0.85rem', fontSize: '0.85rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Zapisywanie...' : 'Zapisz zmiany →'}
                </button>
              </>
            )}
          </div>
        </ModalWrap>
      )}

      {showProductForm !== null && (
        <ProductForm product={showProductForm === 'new' ? null : showProductForm} onSave={saveProduct} onClose={() => setShowProductForm(null)} saving={saving} />
      )}

      <div style={{ padding: '8rem 4rem 6rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Panel administracyjny</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem' }}>Zarządzanie</h1>
          </div>
          <button
            onClick={logout}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.5rem 1rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer', marginTop: '0.25rem', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.target.style.borderColor = '#ef4444'; e.target.style.color = '#ef4444' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}
          >
            Wyloguj
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === i ? 'var(--accent)' : 'transparent'}`, color: activeTab === i ? 'var(--text)' : 'var(--muted)', padding: '0.75rem 1.5rem', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>{tab}</button>
          ))}
        </div>

        {loading ? <p style={{ color: 'var(--muted)' }}>Ładowanie...</p> : (
          <>
            {/* STATYSTYKI */}
            {activeTab === 0 && stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  <StatCard icon="💰" label="Przychód ze sklepu" value={`${stats.revenue} zł`} sub="tylko opłacone" color="#10b981" />
                  <StatCard icon="📁" label="Zamówienia customowe" value={stats.customTotal} sub={`${stats.pendingCustom} oczekujących`} color="#8b5cf6" />
                  <StatCard icon="🛒" label="Zamówienia sklepowe" value={stats.shopTotal} sub={`${stats.pendingShop} oczekujących`} color="#3b82f6" />
                  <StatCard icon="📅" label="W tym miesiącu" value={stats.ordersThisMonth} sub="łącznie wszystkie" color="#ff7c45" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em', marginBottom: '1rem' }}>Ostatnie zamówienia</div>
                  <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ background: 'var(--surface)' }}>{['Data', 'Klient', 'Typ', 'Status', 'Kwota'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                      <tbody>
                        {[...custom.slice(0, 5).map(o => ({ ...o, _type: 'custom' })), ...shop.slice(0, 5).map(o => ({ ...o, _type: 'shop' }))].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8).map(o => (
                          <tr key={o.id} style={{ background: 'var(--bg)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}>
                            <td style={tdStyle}>{new Date(o.created_at).toLocaleDateString('pl-PL')}</td>
                            <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{o.customer_name}</td>
                            <td style={tdStyle}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }}>{o._type}</span></td>
                            <td style={tdStyle}><StatusBadge status={o.status} /></td>
                            <td style={{ ...tdStyle, color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>{o.total_amount ? `${o.total_amount} zł` : o.quoted_price ? `${o.quoted_price} zł` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMOWE */}
            {activeTab === 1 && (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: 'var(--surface)' }}>{['Data', 'Klient', 'E-mail', 'Technologia', 'Plik', 'Status', 'Wycena', 'Akcje'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>
                    {custom.length === 0 && <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', padding: '3rem' }}>Brak zamówień</td></tr>}
                    {custom.map(o => (
                      <tr key={o.id} style={{ background: 'var(--bg)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}>
                        <td style={tdStyle}>{new Date(o.created_at).toLocaleDateString('pl-PL')}</td>
                        <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{o.customer_name}</td>
                        <td style={tdStyle}><a href={`mailto:${o.customer_email}`} style={{ color: 'var(--accent)' }}>{o.customer_email}</a></td>
                        <td style={tdStyle}>{o.technology} / {o.material}</td>
                        <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }}>{o.file_name || '—'}</td>
                        <td style={tdStyle}>
                          <select value={o.status} onChange={e => updateOrder(o.id, 'custom', { status: e.target.value })} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: STATUS_COLORS[o.status] || 'var(--text)', padding: '0.2rem 0.4rem', borderRadius: '2px', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace", cursor: 'pointer' }}>
                            {CUSTOM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>{o.quoted_price ? `${o.quoted_price} zł` : '—'}</td>
                        <td style={tdStyle}>
                          <button onClick={() => openModal(o, 'custom')} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>
                            Szczegóły →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SKLEPOWE */}
            {activeTab === 2 && (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: 'var(--surface)' }}>{['Data', 'Klient', 'E-mail', 'Adres', 'Kwota', 'Status', 'Akcje'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>
                    {shop.length === 0 && <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '3rem' }}>Brak zamówień</td></tr>}
                    {shop.map(o => (
                      <tr key={o.id} style={{ background: 'var(--bg)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}>
                        <td style={tdStyle}>{new Date(o.created_at).toLocaleDateString('pl-PL')}</td>
                        <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{o.customer_name}</td>
                        <td style={tdStyle}><a href={`mailto:${o.customer_email}`} style={{ color: 'var(--accent)' }}>{o.customer_email}</a></td>
                        <td style={{ ...tdStyle, fontSize: '0.8rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.shipping_address || '—'}</td>
                        <td style={{ ...tdStyle, color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>{o.total_amount} zł</td>
                        <td style={tdStyle}>
                          <select value={o.status} onChange={e => updateOrder(o.id, 'shop', { status: e.target.value })} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: STATUS_COLORS[o.status] || 'var(--text)', padding: '0.2rem 0.4rem', borderRadius: '2px', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace", cursor: 'pointer' }}>
                            {SHOP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={tdStyle}>
                          <button onClick={() => openModal(o, 'shop')} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>
                            Szczegóły →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PRODUKTY */}
            {activeTab === 3 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                  <button onClick={() => setShowProductForm('new')} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}>
                    + Nowy produkt
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
                  {products.map(product => (
                    <div key={product.id} style={{ background: 'var(--bg)' }}>
                      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer', flex: 1 }} onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}>
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
                          <button onClick={() => setShowProductForm(product)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>Edytuj</button>
                          <button onClick={() => deleteProduct(product.id)} style={{ background: 'transparent', border: '1px solid #ef444444', color: '#ef4444', padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>Usuń</button>
                          <span onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)} style={{ color: 'var(--accent)', fontSize: '1.2rem', cursor: 'pointer', transition: 'transform 0.2s', transform: expandedProduct === product.id ? 'rotate(180deg)' : 'none' }}>▾</span>
                        </div>
                      </div>
                      {expandedProduct === product.id && (
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Zdjęcia produktu</div>
                          <ProductImageManager product={product} onUpdate={(newImages) => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, images: newImages } : p))} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* FILAMENTY */}
            {activeTab === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Formularz dodawania */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent)', padding: '1.5rem', borderRadius: '2px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Dodaj filament</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 60px 2fr auto', gap: '0.75rem', alignItems: 'end' }}>
                    <div>
                      <label style={lStyle}>Nazwa koloru *</label>
                      <input value={filamentForm.color_name} onChange={e => setFilamentForm(p => ({ ...p, color_name: e.target.value }))} placeholder="np. Biały, Szary grafitowy..." style={iStyle} />
                    </div>
                    <div>
                      <label style={lStyle}>Materiał *</label>
                      <select value={filamentForm.material} onChange={e => setFilamentForm(p => ({ ...p, material: e.target.value }))} style={iStyle}>
                        {MATERIALS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lStyle}>Kolor</label>
                      <input type="color" value={filamentForm.color_hex} onChange={e => setFilamentForm(p => ({ ...p, color_hex: e.target.value }))} style={{ ...iStyle, padding: '0.35rem', cursor: 'pointer', height: '42px' }} />
                    </div>
                    <div>
                      <label style={lStyle}>Notatka</label>
                      <input value={filamentForm.notes} onChange={e => setFilamentForm(p => ({ ...p, notes: e.target.value }))} placeholder="Opcjonalnie..." style={iStyle} />
                    </div>
                    <button onClick={addFilament} disabled={!filamentForm.color_name || saving} style={{ background: filamentForm.color_name ? 'var(--accent)' : 'var(--surface2)', color: filamentForm.color_name ? 'white' : 'var(--muted)', border: 'none', padding: '0.75rem 1.25rem', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: filamentForm.color_name ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
                      + Dodaj
                    </button>
                  </div>
                </div>

                {/* Lista filamentów pogrupowana po materiale */}
                {MATERIALS.map(mat => {
                  const group = filaments.filter(f => f.material === mat)
                  if (group.length === 0) return null
                  return (
                    <div key={mat}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.05em', marginBottom: '0.75rem', color: 'var(--muted)' }}>{mat}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
                        {group.map(f => (
                          <div key={f.id} style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.25rem' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
                          >
                            {/* Próbka koloru */}
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: f.color_hex || '#888', border: '2px solid var(--border)', flexShrink: 0 }} />

                            {/* Nazwa */}
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 500, color: f.is_available ? 'var(--text)' : 'var(--muted)', textDecoration: f.is_available ? 'none' : 'line-through' }}>{f.color_name}</span>
                              {f.notes && <span style={{ marginLeft: '0.75rem', fontSize: '0.78rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>{f.notes}</span>}
                            </div>

                            {/* Status toggle */}
                            <button
                              onClick={() => toggleFilament(f.id, !f.is_available)}
                              style={{ background: f.is_available ? '#10b98122' : '#ef444422', color: f.is_available ? '#10b981' : '#ef4444', border: `1px solid ${f.is_available ? '#10b981' : '#ef4444'}`, padding: '0.25rem 0.75rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              {f.is_available ? 'Dostępny' : 'Niedostępny'}
                            </button>

                            {/* Usuń */}
                            <button onClick={() => deleteFilament(f.id)} style={{ background: 'transparent', border: '1px solid #ef444444', color: '#ef4444', padding: '0.25rem 0.6rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>Usuń</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {filaments.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
                    Brak filamentów. Dodaj pierwszy powyżej.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}