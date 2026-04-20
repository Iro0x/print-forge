'use client'
import { useEffect, useState } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'
import OrderModal from '@/components/admin/OrderModal'
import { thStyle, tdStyle } from '@/lib/admin-shared'

function AdminToast({ toast }) {
  if (!toast) return null
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999, background: 'var(--surface2)', border: `1px solid ${toast.ok ? 'var(--accent)' : '#ef4444'}`, borderLeft: `3px solid ${toast.ok ? 'var(--accent)' : '#ef4444'}`, padding: '1rem 1.5rem', borderRadius: '2px', fontSize: '0.9rem' }}>
      <style>{`@keyframes sI { from { transform: translateX(120%); } to { transform: translateX(0); } }`}</style>
      {toast.msg}
    </div>
  )
}

export default function SklępowePage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    fetch('/api/admin/orders?type=shop').then(r => r.json()).then(json => {
      setOrders(json.data || [])
      setLoading(false)
    })
  }, [])

  return (
    <>
      <AdminToast toast={toast} />
      {selected && (
        <OrderModal
          order={selected}
          type="shop"
          onClose={() => setSelected(null)}
          onSuccess={updated => {
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
            setSelected(updated)
          }}
          showToast={showToast}
        />
      )}
      {loading ? <p style={{ color: 'var(--muted)' }}>Ładowanie...</p> : (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                {['Data', 'Klient', 'E-mail', 'Adres', 'Kwota', 'Status', 'Akcje'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '3rem' }}>Brak zamówień</td></tr>}
              {orders.map(o => (
                <tr key={o.id} style={{ background: 'var(--bg)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}>
                  <td style={tdStyle}>{new Date(o.created_at).toLocaleDateString('pl-PL')}</td>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{o.customer_name}</td>
                  <td style={tdStyle}><a href={`mailto:${o.customer_email}`} style={{ color: 'var(--accent)' }}>{o.customer_email}</a></td>
                  <td style={{ ...tdStyle, fontSize: '0.8rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.shipping_address || '—'}</td>
                  <td style={{ ...tdStyle, color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>{o.total_amount} zł</td>
                  <td style={tdStyle}><StatusBadge status={o.status} /></td>
                  <td style={tdStyle}>
                    <button onClick={() => setSelected(o)} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>
                      Szczegóły →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
