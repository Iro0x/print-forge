export const STATUS_COLORS = {
  pending: '#ff4500', quoted: '#ff7c45', negotiating: '#f59e0b',
  paid: '#10b981', printing: '#8b5cf6', shipped: '#3b82f6',
  done: '#22c55e', cancelled: '#ef4444',
}

export const CUSTOM_STATUSES = ['pending', 'quoted', 'negotiating', 'paid', 'printing', 'shipped', 'done', 'cancelled']
export const SHOP_STATUSES = ['pending', 'paid', 'printing', 'shipped', 'done', 'cancelled']
export const MATERIALS = ['PLA', 'PETG', 'ABS', 'TPU', 'Żywica']

export const iStyle = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.6rem 0.9rem', borderRadius: '2px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }
export const lStyle = { display: 'block', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }
export const thStyle = { padding: '0.75rem 1rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
export const tdStyle = { padding: '0.75rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid var(--border)', color: 'var(--muted)', cursor: 'inherit' }

export function parseNegotiation(adminNote) {
  if (!adminNote) return null
  const priceMatch = adminNote.match(/\[KONTR-OFERTA: ([\d.]+) zł/)
  if (!priceMatch) return null
  const msgMatch = adminNote.match(/Wiadomość: ([^\]]+)\]/)
  return { price: parseFloat(priceMatch[1]), message: msgMatch?.[1] || null }
}
