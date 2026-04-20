'use client'
import { usePathname, useRouter } from 'next/navigation'

const TABS = [
  { label: '📊 Statystyki', href: '/admin/statystyki' },
  { label: '📁 Customowe', href: '/admin/customowe' },
  { label: '🛒 Sklepowe', href: '/admin/sklepowe' },
  { label: '📦 Produkty', href: '/admin/produkty' },
  { label: '🧵 Filamenty', href: '/admin/filamenty' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Panel administracyjny</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem' }}>Zarządzanie</h1>
        </div>
        <button
          onClick={logout}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.5rem 1rem', fontSize: '0.7rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer', marginTop: '0.25rem', transition: 'border-color 0.15s, color 0.15s' }}
          onMouseEnter={e => { e.target.style.borderColor = '#ef4444'; e.target.style.color = '#ef4444' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}
        >
          Wyloguj
        </button>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const isActive = pathname.startsWith(tab.href)
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`, color: isActive ? 'var(--text)' : 'var(--muted)', padding: '0.75rem 1.5rem', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </>
  )
}
