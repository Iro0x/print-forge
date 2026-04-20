'use client'
import { useState } from 'react'
import ModalWrap from './ModalWrap'
import { iStyle, lStyle } from '@/lib/admin-shared'

export default function ProductForm({ product, onSave, onClose, saving }) {
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
