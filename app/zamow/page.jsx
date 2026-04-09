'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FileUpload from '@/components/FileUpload'
import Toast, { useToast } from '@/components/Toast'

export default function ZamowPage() {
  const { toast, show } = useToast()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    technology: 'FDM', material: 'PLA', color: 'Biały', quantity: 1, notes: '',
  })

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.customer_name || !form.customer_email) { show('Błąd ⚠️', 'Imię i e-mail są wymagane.'); return }
    setLoading(true)
    try {
      const data = new FormData()
      if (file) data.append('file', file)
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      const res = await fetch('/api/orders/custom', { method: 'POST', body: data })
      const json = await res.json()
      if (json.success) {
        show('Zamówienie przyjęte! 🚀', 'Skontaktujemy się w ciągu 2 godzin roboczych.')
        setForm({ customer_name: '', customer_email: '', customer_phone: '', technology: 'FDM', material: 'PLA', color: 'Biały', quantity: 1, notes: '' })
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
              ℹ️ Cena zależy od objętości modelu i wybranego materiału. Wycena <strong style={{ color: 'var(--accent)' }}>bezpłatna, w ciągu 2 godzin</strong>.
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
                <label style={labelStyle}>Technologia</label>
                <select name="technology" value={form.technology} onChange={handleChange} style={inputStyle}>
                  <option>FDM</option><option>SLA</option><option>SLS</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Materiał</label>
                <select name="material" value={form.material} onChange={handleChange} style={inputStyle}>
                  <option>PLA</option><option>PETG</option><option>ABS</option><option>TPU</option><option>Żywica standardowa</option><option>Żywica ABS-like</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Kolor</label>
              <select name="color" value={form.color} onChange={handleChange} style={inputStyle}>
                {['Biały','Czarny','Szary','Czerwony','Niebieski','Zielony','Żółty','Transparentny','Inny — dopiszę w uwagach'].map(c => <option key={c}>{c}</option>)}
              </select>
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
