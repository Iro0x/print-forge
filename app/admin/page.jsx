'use client'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import ProductImageManager from '@/components/ProductImageManager'

const STATUS_COLORS = {
  pending: '#ff4500', quoted: '#ff7c45', accepted: '#3b82f6',
  printing: '#8b5cf6', shipped: '#10b981', done: '#22c55e', paid: '#10b981',
}

const TABS = ['Zamówienia customowe', 'Zamówienia sklepowe', 'Produkty i zdjęcia']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [custom, setCustom] = useState([])
  const [shop, setShop] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedProduct, setExpandedProduct] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders?type=custom').then(r => r.json()),
      fetch('/api/admin/orders?type=shop').then(r => r.json()),
      fetch('/api/admin/orders?type=products').then(r => r.json()),
    ]).then(([c, s, p]) => {
      setCustom(c.data || [])
      setShop(s.data || [])
      setProducts(p.data || [])
      setLoading(false)
    })
  }, [])

  const thStyle = { padding: '0.75rem 1rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', borderBottom: '1px solid var(--border)' }
  const tdStyle = { padding: '0.75rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }

  return (
    <>
      <Nav />
      <div style={{ padding: '8rem 4rem 6rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Panel administracyjny</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', marginBottom: '2rem' }}>Zarządzanie</h1>

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem', gap: '0' }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} style={{
              background: 'transparent', border: 'none',
              borderBottom: `2px solid ${activeTab === i ? 'var(--accent)' : 'transparent'}`,
              color: activeTab === i ? 'var(--text)' : 'var(--muted)',
              padding: '0.75rem 1.5rem', fontSize: '0.8rem',
              fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
            }}>{tab}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Ładowanie...</p>
        ) : (
          <>
            {/* TAB: CUSTOMOWE */}
            {activeTab === 0 && (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface)' }}>
                      {['Data', 'Klient', 'E-mail', 'Materiał', 'Plik', 'Status', 'Wycena'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {custom.length === 0 && (
                      <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: '3rem' }}>Brak zamówień</td></tr>
                    )}
                    {custom.map(o => (
                      <tr key={o.id}
                        style={{ background: 'var(--bg)', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
                      >
                        <td style={tdStyle}>{new Date(o.created_at).toLocaleDateString('pl-PL')}</td>
                        <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{o.customer_name}</td>
                        <td style={tdStyle}>{o.customer_email}</td>
                        <td style={tdStyle}>{o.technology} / {o.material}</td>
                        <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }}>{o.file_name || '—'}</td>
                        <td style={tdStyle}>
                          <span style={{ background: (STATUS_COLORS[o.status] || '#666') + '22', color: STATUS_COLORS[o.status] || '#666', padding: '0.2rem 0.6rem', borderRadius: '2px', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace" }}>
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
            )}

            {/* TAB: SKLEPOWE */}
            {activeTab === 1 && (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface)' }}>
                      {['Data', 'Klient', 'E-mail', 'Kwota', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {shop.length === 0 && (
                      <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', padding: '3rem' }}>Brak zamówień</td></tr>
                    )}
                    {shop.map(o => (
                      <tr key={o.id}
                        style={{ background: 'var(--bg)', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
                      >
                        <td style={tdStyle}>{new Date(o.created_at).toLocaleDateString('pl-PL')}</td>
                        <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 500 }}>{o.customer_name}</td>
                        <td style={tdStyle}>{o.customer_email}</td>
                        <td style={{ ...tdStyle, color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem' }}>{o.total_amount} zł</td>
                        <td style={tdStyle}>
                          <span style={{ background: (STATUS_COLORS[o.status] || '#666') + '22', color: STATUS_COLORS[o.status] || '#666', padding: '0.2rem 0.6rem', borderRadius: '2px', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace" }}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: PRODUKTY I ZDJĘCIA */}
            {activeTab === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
                {products.map(product => (
                  <div key={product.id} style={{ background: 'var(--bg)' }}>
                    {/* Nagłówek produktu */}
                    <div
                      onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                      style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {/* Miniatura */}
                        <div style={{ width: '48px', height: '48px', borderRadius: '2px', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                          {product.images?.[0]
                            ? <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : { dekoracje: '🏺', tech: '🎮', organizery: '🗂️' }[product.category] || '📦'
                          }
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>{product.name}</div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)' }}>
                            {product.category} · {product.price} zł · {product.images?.length || 0} zdjęć
                          </div>
                        </div>
                      </div>
                      <span style={{ color: 'var(--accent)', fontSize: '1.2rem', transition: 'transform 0.2s', transform: expandedProduct === product.id ? 'rotate(180deg)' : 'none' }}>▾</span>
                    </div>

                    {/* Manager zdjęć */}
                    {expandedProduct === product.id && (
                      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                          Zdjęcia produktu
                        </div>
                        <ProductImageManager
                          product={product}
                          onUpdate={(newImages) => {
                            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, images: newImages } : p))
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}