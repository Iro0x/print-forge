'use client'
import { useEffect, useState, useMemo } from 'react'
import { iStyle, lStyle, MATERIALS } from '@/lib/admin-shared'
import { FILAMENT_CATALOG, CATALOG_BRANDS } from '@/lib/filament-catalog'

function AdminToast({ toast }) {
  if (!toast) return null
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999, background: 'var(--surface2)', border: `1px solid ${toast.ok ? 'var(--accent)' : '#ef4444'}`, borderLeft: `3px solid ${toast.ok ? 'var(--accent)' : '#ef4444'}`, padding: '1rem 1.5rem', borderRadius: '2px', fontSize: '0.9rem' }}>
      <style>{`@keyframes sI { from { transform: translateX(120%); } to { transform: translateX(0); } }`}</style>
      {toast.msg}
    </div>
  )
}

export default function FilamentyPage() {
  const [filaments, setFilaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ color_name: '', color_hex: '#ff4500', material: 'PLA', notes: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [catalogBrand, setCatalogBrand] = useState(CATALOG_BRANDS[0])
  const [catalogMaterial, setCatalogMaterial] = useState('Wszystkie')

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    fetch('/api/admin/filaments').then(r => r.json()).then(json => {
      setFilaments(json.data || [])
      setLoading(false)
    })
  }, [])

  const addFilament = async () => {
    if (!form.color_name || !form.material) return
    setSaving(true)
    const res = await fetch('/api/admin/filaments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const json = await res.json()
    if (json.data) { setFilaments(prev => [...prev, json.data]); setForm({ color_name: '', color_hex: '#ff4500', material: 'PLA', notes: '' }); showToast('Filament dodany ✓') }
    else showToast('Błąd ✗', false)
    setSaving(false)
  }

  const saveEdit = async () => {
    if (!editing.color_name || !editing.material) return
    setSaving(true)
    const res = await fetch('/api/admin/filaments', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
    const json = await res.json()
    if (json.data) { setFilaments(prev => prev.map(f => f.id === json.data.id ? json.data : f)); setEditing(null); showToast('Zapisano ✓') }
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

  const addFromCatalog = async (entry) => {
    const already = filaments.some(f => f.color_name === entry.color_name && f.material === entry.material)
    if (already) { showToast('Ten filament już istnieje na liście', false); return }
    setSaving(true)
    const res = await fetch('/api/admin/filaments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ color_name: entry.color_name, color_hex: entry.color_hex, material: entry.material, notes: entry.notes }) })
    const json = await res.json()
    if (json.data) { setFilaments(prev => [...prev, json.data]); showToast(`Dodano: ${entry.color_name} ✓`) }
    else showToast('Błąd ✗', false)
    setSaving(false)
  }

  const catalogFiltered = useMemo(() => FILAMENT_CATALOG.filter(f =>
    f.brand === catalogBrand && (catalogMaterial === 'Wszystkie' || f.material === catalogMaterial)
  ), [catalogBrand, catalogMaterial])

  const catalogMaterials = useMemo(() => ['Wszystkie', ...new Set(FILAMENT_CATALOG.filter(f => f.brand === catalogBrand).map(f => f.material))], [catalogBrand])

  if (loading) return <p style={{ color: 'var(--muted)' }}>Ładowanie...</p>

  return (
    <>
      <AdminToast toast={toast} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Formularz dodawania */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent)', padding: '1.5rem', borderRadius: '2px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Dodaj filament</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 60px 2fr auto', gap: '0.75rem', alignItems: 'end' }}>
            <div>
              <label style={lStyle}>Nazwa koloru *</label>
              <input value={form.color_name} onChange={e => setForm(p => ({ ...p, color_name: e.target.value }))} placeholder="np. Biały, Szary grafitowy..." style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Materiał *</label>
              <select value={form.material} onChange={e => setForm(p => ({ ...p, material: e.target.value }))} style={iStyle}>
                {MATERIALS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={lStyle}>Kolor</label>
              <input type="color" value={form.color_hex} onChange={e => setForm(p => ({ ...p, color_hex: e.target.value }))} style={{ ...iStyle, padding: '0.35rem', cursor: 'pointer', height: '42px' }} />
            </div>
            <div>
              <label style={lStyle}>Notatka</label>
              <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Opcjonalnie..." style={iStyle} />
            </div>
            <button onClick={addFilament} disabled={!form.color_name || saving} style={{ background: form.color_name ? 'var(--accent)' : 'var(--surface2)', color: form.color_name ? 'white' : 'var(--muted)', border: 'none', padding: '0.75rem 1.25rem', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: form.color_name ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
              + Dodaj
            </button>
          </div>
        </div>

        {/* Katalog popularnych filamentów */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '2px' }}>
          <button
            onClick={() => setCatalogOpen(v => !v)}
            style={{ width: '100%', background: 'var(--surface)', border: 'none', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: 'var(--text)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Katalog filamentów</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)' }}>Bambu Lab · Sunlu · Elegoo</span>
            </div>
            <span style={{ color: 'var(--muted)', transition: 'transform 0.2s', transform: catalogOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
          </button>

          {catalogOpen && (
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)' }}>
              {/* Filtry */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {CATALOG_BRANDS.map(b => (
                  <button key={b} onClick={() => { setCatalogBrand(b); setCatalogMaterial('Wszystkie') }} style={{ background: catalogBrand === b ? 'var(--accent)' : 'transparent', color: catalogBrand === b ? 'white' : 'var(--muted)', border: `1px solid ${catalogBrand === b ? 'var(--accent)' : 'var(--border)'}`, padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>
                    {b}
                  </button>
                ))}
                <div style={{ width: '1px', background: 'var(--border)', margin: '0 0.25rem' }} />
                {catalogMaterials.map(m => (
                  <button key={m} onClick={() => setCatalogMaterial(m)} style={{ background: catalogMaterial === m ? 'var(--surface2)' : 'transparent', color: catalogMaterial === m ? 'var(--text)' : 'var(--muted)', border: `1px solid ${catalogMaterial === m ? 'var(--border)' : 'transparent'}`, padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>
                    {m}
                  </button>
                ))}
              </div>

              {/* Siatka filamentów */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
                {catalogFiltered.map((entry, i) => {
                  const exists = filaments.some(f => f.color_name === entry.color_name && f.material === entry.material)
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: exists ? 'var(--surface)' : 'var(--bg)', border: '1px solid var(--border)', borderRadius: '2px', opacity: exists ? 0.5 : 1 }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: entry.color_hex, border: '2px solid var(--border)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.color_name}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>{entry.material} · {entry.notes}</div>
                      </div>
                      <button
                        onClick={() => addFromCatalog(entry)}
                        disabled={exists || saving}
                        title={exists ? 'Już dodany' : 'Dodaj do listy'}
                        style={{ background: exists ? 'transparent' : 'var(--accent)', color: exists ? 'var(--muted)' : 'white', border: exists ? '1px solid var(--border)' : 'none', width: '26px', height: '26px', borderRadius: '2px', cursor: exists ? 'default' : 'pointer', fontSize: '0.85rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {exists ? '✓' : '+'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Lista pogrupowana po materiale */}
        {MATERIALS.map(mat => {
          const group = filaments.filter(f => f.material === mat)
          if (group.length === 0) return null
          return (
            <div key={mat}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '0.05em', marginBottom: '0.75rem', color: 'var(--muted)' }}>{mat}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
                {group.map(f => editing?.id === f.id ? (
                  <div key={f.id} style={{ background: 'var(--surface)', padding: '0.9rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', borderLeft: '3px solid var(--accent)' }}>
                    <input value={editing.color_name} onChange={e => setEditing(p => ({ ...p, color_name: e.target.value }))} placeholder="Nazwa koloru" style={{ ...iStyle, flex: '2', minWidth: '120px' }} />
                    <select value={editing.material} onChange={e => setEditing(p => ({ ...p, material: e.target.value }))} style={{ ...iStyle, flex: '1', minWidth: '80px' }}>
                      {MATERIALS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <input type="color" value={editing.color_hex || '#888888'} onChange={e => setEditing(p => ({ ...p, color_hex: e.target.value }))} style={{ ...iStyle, width: '52px', padding: '0.25rem', cursor: 'pointer', height: '42px', flexShrink: 0 }} />
                    <input value={editing.notes || ''} onChange={e => setEditing(p => ({ ...p, notes: e.target.value }))} placeholder="Notatka" style={{ ...iStyle, flex: '2', minWidth: '100px' }} />
                    <button onClick={saveEdit} disabled={saving} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.4rem 0.9rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Zapisz</button>
                    <button onClick={() => setEditing(null)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.4rem 0.7rem', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>✕</button>
                  </div>
                ) : (
                  <div key={f.id} style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.25rem' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: f.color_hex || '#888', border: '2px solid var(--border)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 500, color: f.is_available ? 'var(--text)' : 'var(--muted)', textDecoration: f.is_available ? 'none' : 'line-through' }}>{f.color_name}</span>
                      {f.notes && <span style={{ marginLeft: '0.75rem', fontSize: '0.78rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>{f.notes}</span>}
                    </div>
                    <button onClick={() => setEditing({ id: f.id, color_name: f.color_name, color_hex: f.color_hex || '#888888', material: f.material, notes: f.notes || '' })} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.25rem 0.75rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", borderRadius: '2px', cursor: 'pointer' }}>Edytuj</button>
                    <button onClick={() => toggleFilament(f.id, !f.is_available)} style={{ background: f.is_available ? '#10b98122' : '#ef444422', color: f.is_available ? '#10b981' : '#ef4444', border: `1px solid ${f.is_available ? '#10b981' : '#ef4444'}`, padding: '0.25rem 0.75rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {f.is_available ? 'Dostępny' : 'Niedostępny'}
                    </button>
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
    </>
  )
}
