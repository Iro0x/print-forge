'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/admin/StatusBadge'
import { thStyle, tdStyle } from '@/lib/admin-shared'

function StatCard({ icon, label, value, sub, color, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => onClick && setHovered(true)} onMouseLeave={() => setHovered(false)} role={onClick ? 'button' : undefined} style={{ background: hovered ? 'var(--surface2, #2a2a2a)' : 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${color || 'var(--accent)'}`, padding: '1.5rem', borderRadius: '2px', cursor: onClick ? 'pointer' : 'default', transition: 'background 0.15s' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: color || 'var(--accent)', lineHeight: 1, marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.2rem' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>{sub}</div>}
    </div>
  )
}

export default function StatystykiPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders?type=stats').then(r => r.json()),
      fetch('/api/admin/orders?type=custom').then(r => r.json()),
      fetch('/api/admin/orders?type=shop').then(r => r.json()),
    ]).then(([st, c, s]) => {
      setStats(st.data || {})
      const custom = (c.data || []).slice(0, 5).map(o => ({ ...o, _type: 'custom' }))
      const shop = (s.data || []).slice(0, 5).map(o => ({ ...o, _type: 'shop' }))
      setRecent([...custom, ...shop].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8))
      setLoading(false)
    })
  }, [])

  if (loading) return <p style={{ color: 'var(--muted)' }}>Ładowanie...</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <StatCard icon="💰" label="Przychód ze sklepu" value={`${stats.revenue} zł`} sub="tylko opłacone" color="#10b981" />
        <StatCard icon="📁" label="Zamówienia customowe" value={stats.customTotal} sub={`${stats.pendingCustom} oczekujących`} color="#8b5cf6" onClick={() => router.push('/admin/customowe')} />
        <StatCard icon="🛒" label="Zamówienia sklepowe" value={stats.shopTotal} sub={`${stats.pendingShop} oczekujących`} color="#3b82f6" onClick={() => router.push('/admin/sklepowe')} />
        <StatCard icon="📅" label="W tym miesiącu" value={stats.ordersThisMonth} sub="łącznie wszystkie" color="#ff7c45" />
      </div>

      <div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em', marginBottom: '1rem' }}>Ostatnie zamówienia</div>
        <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                {['Data', 'Klient', 'Typ', 'Status', 'Kwota'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {recent.map(o => (
                <tr key={o.id} role="button" style={{ background: 'var(--bg)', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2, #2a2a2a)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'} onClick={() => router.push(`/admin/${o._type === 'custom' ? 'customowe' : 'sklepowe'}`)}>
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
  )
}
