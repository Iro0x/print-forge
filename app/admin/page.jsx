import { supabaseAdmin } from '@/lib/supabase'
import Nav from '@/components/Nav'

export const revalidate = 0

const STATUS_COLORS = {
  pending: '#ff4500', quoted: '#ff7c45', accepted: '#3b82f6',
  printing: '#8b5cf6', shipped: '#10b981', done: '#22c55e', paid: '#10b981',
}

async function getOrders() {
  const [custom, shop] = await Promise.all([
    supabaseAdmin.from('custom_orders').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('shop_orders').select('*').order('created_at', { ascending: false }),
  ])
  return { custom: custom.data || [], shop: shop.data || [] }
}

export default async function AdminPage() {
  const { custom, shop } = await getOrders()

  const tdStyle = { padding: '0.75rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }
  const thStyle = { padding: '0.75rem 1rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', borderBottom: '1px solid var(--border)' }

  return (
    <>
      <Nav />
      <div style={{ padding: '8rem 4rem 6rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Panel administracyjny</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', marginBottom: '3rem' }}>Zamówienia</h1>

        {/* CUSTOMOWE */}
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--accent)' }}>Customowe ({custom.length})</h2>
        <div style={{ overflowX: 'auto', marginBottom: '4rem', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                {['Data', 'Klient', 'E-mail', 'Materiał', 'Plik', 'Status', 'Wycena'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {custom.map(o => (
                <tr key={o.id} style={{ background: 'var(--bg)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
                >
                  <td style={tdStyle}>{new Date(o.created_at).toLocaleDateString('pl-PL')}</td>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{o.customer_name}</td>
                  <td style={tdStyle}>{o.customer_email}</td>
                  <td style={tdStyle}>{o.technology} / {o.material}</td>
                  <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }}>{o.file_name || '—'}</td>
                  <td style={tdStyle}>
                    <span style={{ background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status], padding: '0.2rem 0.6rem', borderRadius: '2px', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace" }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>
                    {o.quoted_price ? `${o.quoted_price} zł` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SKLEPOWE */}
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--accent)' }}>Sklepowe ({shop.length})</h2>
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                {['Data', 'Klient', 'E-mail', 'Kwota', 'Status płatności'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {shop.map(o => (
                <tr key={o.id} style={{ background: 'var(--bg)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
                >
                  <td style={tdStyle}>{new Date(o.created_at).toLocaleDateString('pl-PL')}</td>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{o.customer_name}</td>
                  <td style={tdStyle}>{o.customer_email}</td>
                  <td style={{ ...tdStyle, color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>{o.total_amount} zł</td>
                  <td style={tdStyle}>
                    <span style={{ background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status], padding: '0.2rem 0.6rem', borderRadius: '2px', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace" }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
