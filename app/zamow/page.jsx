'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FileUpload from '@/components/FileUpload'
import Toast, { useToast } from '@/components/Toast'

export default function ZamowPage() {
  const { toast, show } = useToast()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filaments, setFilaments] = useState([])
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    material: '', color: '', quantity: 1, notes: '',
  })
  const [requestFilament, setRequestFilament] = useState(false)
  const [filamentRequest, setFilamentRequest] = useState({ brand: '', material: '', color_name: '', color_hex: '#ff4500' })

  useEffect(() => {
    fetch('/api/filaments').then(r => r.json()).then(json => {
      const data = json.data || []
      setFilaments(data)
      if (data.length > 0) {
        const firstMaterial = data[0].material
        const firstColor = data.find(f => f.material === firstMaterial)
        setForm(prev => ({ ...prev, material: firstMaterial, color: firstColor?.color_name || '' }))
      }
    })
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    if (name === 'material') {
      const firstColor = filaments.find(f => f.material === value)
      setForm(prev => ({ ...prev, material: value, color: firstColor?.color_name || '' }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const materials = [...new Set(filaments.map(f => f.material))]
  const colorsForMaterial = filaments.filter(f => f.material === form.material)

  const handleSubmit = async () => {
    if (!form.customer_name || !form.customer_email) { show('Błąd ⚠️', 'Imię i e-mail są wymagane.'); return }
    if (requestFilament && !filamentRequest.material) { show('Błąd ⚠️', 'Podaj przynajmniej rodzaj filamentu.'); return }
    setLoading(true)
    try {
      const data = new FormData()
      if (file) data.append('file', file)

      let finalNotes = form.notes
      if (requestFilament) {
        const parts = [
          filamentRequest.brand && `Marka: ${filamentRequest.brand}`,
          filamentRequest.material && `Materiał: ${filamentRequest.material}`,
          filamentRequest.color_name && `Kolor: ${filamentRequest.color_name} (${filamentRequest.color_hex})`,
        ].filter(Boolean).join(', ')
        const tag = `[PROŚBA O FILAMENT: ${parts}]`
        finalNotes = finalNotes ? `${tag}\n\n${finalNotes}` : tag
      }

      Object.entries({ ...form, notes: finalNotes }).forEach(([k, v]) => data.append(k, v))
      const res = await fetch('/api/orders/custom', { method: 'POST', body: data })
      const json = await res.json()
      if (json.success) {
        show('Zamówienie przyjęte! 🚀', 'Skontaktujemy się w ciągu kilku godzin roboczych.')
        const firstMaterial = filaments[0]?.material || ''
        const firstColor = filaments.find(f => f.material === firstMaterial)?.color_name || ''
        setForm({ customer_name: '', customer_email: '', customer_phone: '', material: firstMaterial, color: firstColor, quantity: 1, notes: '' })
        setRequestFilament(false)
        setFilamentRequest({ brand: '', material: '', color_name: '', color_hex: '#ff4500' })
        setFile(null)
      } else {
        show('Błąd ⚠️', json.error || 'Coś poszło nie tak.')
      }
    } catch {
      show('Błąd ⚠️', 'Nie udało się wysłać zamówienia.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '0.75rem 1rem', borderRadius: '2px',
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace",
    color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem',
  }

  return (
    <>
      <Nav />
      <Toast toast={toast} />
      <div className="zamow-wrap">
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Zamówienie niestandardowe</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 4vw, 4rem)', marginBottom: '3rem' }}>Prześlij swój projekt</h1>

        <div className="zamow-layout">
          {/* UPLOAD */}
          <div>
            <FileUpload onFileSelect={setFile} />
            <div style={{ marginTop: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', padding: '1rem 1.25rem', borderRadius: '2px', fontSize: '0.85rem', color: 'var(--muted)' }}>
              ℹ️ Cena zależy od objętości modelu i wybranego materiału. Wycena <strong style={{ color: 'var(--accent)' }}>bezpłatna, w ciągu kilku godzin</strong>.
            </div>
          </div>

          {/* FORM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-row-2">
              <div>
                <label style={labelStyle}>Imię i nazwisko *</label>
                <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Jan Kowalski" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>E-mail *</label>
                <input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} placeholder="jan@firma.pl" style={inputStyle} />
              </div>
            </div>
            <div className="form-row-2">
              <div>
                <label style={labelStyle}>Telefon</label>
                <input name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="+48 000 000 000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Liczba sztuk</label>
                <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
            <div className="form-row-2">
              <div>
                <label style={labelStyle}>Materiał</label>
                <select name="material" value={form.material} onChange={handleChange} style={inputStyle} disabled={materials.length === 0}>
                  {materials.length === 0
                    ? <option>Ładowanie...</option>
                    : materials.map(m => <option key={m}>{m}</option>)
                  }
                </select>
              </div>
              <div>
                <label style={labelStyle}>Kolor</label>
                <select name="color" value={form.color} onChange={handleChange} style={inputStyle} disabled={colorsForMaterial.length === 0}>
                  {colorsForMaterial.length === 0
                    ? <option>Brak kolorów</option>
                    : colorsForMaterial.map(f => (
                        <option key={f.id} value={f.color_name}>
                          {f.color_name}
                        </option>
                      ))
                  }
                </select>
              </div>
            </div>

            {/* Podgląd wybranego koloru */}
            {form.color && (() => {
              const selected = filaments.find(f => f.material === form.material && f.color_name === form.color)
              if (!selected?.color_hex) return null
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: selected.color_hex, border: '2px solid var(--border)', flexShrink: 0 }} />
                  {selected.material} · {selected.color_name}
                </div>
              )
            })()}

            {/* Prośba o nowy filament */}
            <div style={{ background: 'var(--surface)', border: `1px solid ${requestFilament ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '2px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.1rem', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={requestFilament}
                  onChange={e => setRequestFilament(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>Nie widzę odpowiedniego filamentu</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace", marginTop: '0.15rem' }}>Opisz filament, który Cię interesuje — sprawdzimy dostępność</div>
                </div>
              </label>

              {requestFilament && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <div className="form-row-2">
                    <div>
                      <label style={labelStyle}>Marka filamentu</label>
                      <input
                        value={filamentRequest.brand}
                        onChange={e => setFilamentRequest(p => ({ ...p, brand: e.target.value }))}
                        placeholder="np. Bambu Lab, eSUN, Prusament..."
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Rodzaj / materiał *</label>
                      <input
                        value={filamentRequest.material}
                        onChange={e => setFilamentRequest(p => ({ ...p, material: e.target.value }))}
                        placeholder="np. PLA Silk+, PETG, TPU 95A..."
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div>
                      <label style={labelStyle}>Nazwa koloru</label>
                      <input
                        value={filamentRequest.color_name}
                        onChange={e => setFilamentRequest(p => ({ ...p, color_name: e.target.value }))}
                        placeholder="np. Silk Gold, Matte Black..."
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Przybliżony kolor</label>
                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={filamentRequest.color_hex}
                          onChange={e => setFilamentRequest(p => ({ ...p, color_hex: e.target.value }))}
                          style={{ ...inputStyle, width: '52px', padding: '0.3rem', cursor: 'pointer', height: '48px', flexShrink: 0 }}
                        />
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: filamentRequest.color_hex, border: '1px solid var(--border)', flexShrink: 0 }} />
                            {filamentRequest.color_hex}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Uwagi / specyfikacja</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Opisz wymagania: tolerancje, przeznaczenie, wykończenie..." style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} />
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{
              background: loading ? 'var(--muted)' : 'var(--accent)', color: 'white', border: 'none',
              padding: '0.85rem 2rem', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em',
              textTransform: 'uppercase', borderRadius: '2px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            }}>
              {loading ? 'Wysyłanie...' : 'Wyślij zapytanie o wycenę →'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
