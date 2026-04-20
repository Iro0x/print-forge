'use client'
import { useState } from 'react'
import ModalWrap from './ModalWrap'
import StatusBadge from './StatusBadge'
import { STATUS_COLORS, CUSTOM_STATUSES, SHOP_STATUSES, iStyle, lStyle, parseNegotiation } from '@/lib/admin-shared'

export default function OrderModal({ order, type, onClose, onSuccess, showToast }) {
  const [draft, setDraft] = useState({
    status: order.status,
    quoted_price: order.quoted_price || '',
    admin_note: order.admin_note || '',
  })
  const [showStatusEdit, setShowStatusEdit] = useState(false)
  const [saving, setSaving] = useState(false)

  const saveModal = async () => {
    if (draft.status === 'quoted' && !draft.quoted_price) {
      showToast('Podaj kwotę wyceny przed ustawieniem statusu "quoted" ✗', false)
      return
    }
    setSaving(true)
    const fields = {}
    if (draft.status !== order.status) fields.status = draft.status
    if (draft.admin_note !== (order.admin_note || '')) fields.admin_note = draft.admin_note
    if (type === 'custom') {
      const newPrice = draft.quoted_price ? parseFloat(draft.quoted_price) : null
      if (newPrice && newPrice !== order.quoted_price) {
        fields.quoted_price = newPrice
        if (!fields.status && order.status === 'pending') fields.status = 'quoted'
      }
    }
    if (Object.keys(fields).length === 0) { showToast('Brak zmian do zapisania'); setSaving(false); return }
    const res = await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: order.id, type, ...fields }) })
    const json = await res.json()
    if (json.data) { onSuccess(json.data); showToast('Zapisano ✓') }
    else showToast('Błąd ✗', false)
    setSaving(false)
  }

  const acceptNegotiation = async (proposedPrice) => {
    setSaving(true)
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, type: 'custom', status: 'quoted', quoted_price: proposedPrice, accept_negotiation: true }),
    })
    const json = await res.json()
    if (json.data) {
      onSuccess(json.data)
      setDraft({ status: json.data.status, quoted_price: json.data.quoted_price || '', admin_note: json.data.admin_note || '' })
      showToast('Zaakceptowano ofertę klienta — e-mail wysłany ✓')
    } else showToast('Błąd ✗', false)
    setSaving(false)
  }

  const neg = type === 'custom' && order.status === 'negotiating' ? parseNegotiation(order.admin_note) : null

  return (
    <ModalWrap title={`Zamówienie #${order.id.slice(0, 8)}...`} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Dane klienta */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '2px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Dane klienta</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div><span style={{ color: 'var(--muted)' }}>Imię: </span>{order.customer_name}</div>
            <div><span style={{ color: 'var(--muted)' }}>E-mail: </span><a href={`mailto:${order.customer_email}`} style={{ color: 'var(--accent)' }}>{order.customer_email}</a></div>
            {order.customer_phone && <div><span style={{ color: 'var(--muted)' }}>Tel: </span>{order.customer_phone}</div>}
            <div><span style={{ color: 'var(--muted)' }}>Data: </span>{new Date(order.created_at).toLocaleDateString('pl-PL')}</div>
            {order.shipping_address && <div style={{ gridColumn: 'span 2' }}><span style={{ color: 'var(--muted)' }}>Adres: </span>{order.shipping_address}</div>}
            <div style={{ gridColumn: 'span 2', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--muted)' }}>ID śledzenia: </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.78rem', color: 'var(--text)' }}>{order.id}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(order.id); showToast('Skopiowano ID ✓') }}
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.1rem 0.5rem', fontSize: '0.65rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer', flexShrink: 0 }}
              >
                kopiuj
              </button>
            </div>
          </div>
        </div>

        {/* Szczegóły druku — tylko custom */}
        {type === 'custom' && (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '2px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Szczegóły druku</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div><span style={{ color: 'var(--muted)' }}>Technologia: </span>{order.technology}</div>
              <div><span style={{ color: 'var(--muted)' }}>Materiał: </span>{order.material}</div>
              <div><span style={{ color: 'var(--muted)' }}>Kolor: </span>{order.color}</div>
              <div><span style={{ color: 'var(--muted)' }}>Ilość: </span>{order.quantity} szt.</div>
              {order.file_name && (
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--muted)' }}>Plik: </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem' }}>{order.file_name}</span>
                  {order.file_path && (
                    <button
                      onClick={async () => {
                        const res = await fetch(`/api/admin/file?path=${encodeURIComponent(order.file_path)}`)
                        const { url } = await res.json()
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
              {order.notes && <div style={{ gridColumn: 'span 2' }}><span style={{ color: 'var(--muted)' }}>Uwagi: </span>{order.notes}</div>}
            </div>
          </div>
        )}

        {/* Kontroferta */}
        {neg && (
          <div style={{ background: '#f59e0b15', border: '1px solid #f59e0b', padding: '1.25rem', borderRadius: '2px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: '#f59e0b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Kontroferta klienta</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--muted)' }}>Oryginalna wycena: </span>
                  <span style={{ textDecoration: 'line-through', color: 'var(--muted)' }}>{order.quoted_price} zł</span>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#f59e0b', lineHeight: 1 }}>{neg.price} zł</div>
                {neg.message && <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>„{neg.message}"</div>}
              </div>
              <button
                onClick={() => acceptNegotiation(neg.price)}
                disabled={saving}
                style={{ background: saving ? 'var(--muted)' : '#10b981', color: 'white', border: 'none', padding: '0.7rem 1.25rem', fontSize: '0.78rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: saving ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
              >
                {saving ? '...' : '✓ Zaakceptuj ofertę klienta'}
              </button>
            </div>
          </div>
        )}

        {/* Status */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showStatusEdit ? '1rem' : 0 }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Aktualny status</div>
              <StatusBadge status={draft.status} />
            </div>
            <button
              onClick={() => setShowStatusEdit(v => !v)}
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.3rem 0.75rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer' }}
            >
              {showStatusEdit ? '▲ Ukryj' : '▾ Zmień status'}
            </button>
          </div>
          {showStatusEdit && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.25rem', borderTop: '1px solid var(--border)' }}>
              {(type === 'custom' ? CUSTOM_STATUSES : SHOP_STATUSES).map(s => (
                <button key={s} onClick={() => setDraft(d => ({ ...d, status: s }))} style={{ background: draft.status === s ? (STATUS_COLORS[s] + '33') : 'transparent', border: `1px solid ${draft.status === s ? STATUS_COLORS[s] : 'var(--border)'}`, color: draft.status === s ? STATUS_COLORS[s] : 'var(--muted)', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>{s}</button>
              ))}
            </div>
          )}
        </div>

        {/* Wycena — tylko custom */}
        {type === 'custom' && ['pending', 'quoted', 'negotiating'].includes(draft.status) && (
          <div>
            <label style={lStyle}>Wycena (zł)</label>
            <input
              type="number"
              placeholder={order.quoted_price ? `Obecna: ${order.quoted_price} zł` : 'Kwota w zł...'}
              value={draft.quoted_price}
              onChange={e => setDraft(d => ({ ...d, quoted_price: e.target.value }))}
              style={iStyle}
            />
            {order.quoted_price && <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>Obecna: <span style={{ color: 'var(--accent)' }}>{order.quoted_price} zł</span></div>}
          </div>
        )}

        {/* Notatka */}
        <div>
          <label style={lStyle}>Notatka wewnętrzna</label>
          <textarea
            value={draft.admin_note}
            onChange={e => setDraft(d => ({ ...d, admin_note: e.target.value }))}
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
      </div>
    </ModalWrap>
  )
}
