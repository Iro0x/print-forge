'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1.25rem 4rem',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.3s',
    }}>
      <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.9rem', letterSpacing: '0.05em' }}>
        <span style={{ color: 'var(--accent)' }}>Print</span>Forge
      </Link>
      <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }}>
        {[
          { href: '/#uslugi', label: 'Usługi' },
          { href: '/zamow', label: 'Zamów' },
          { href: '/sklep', label: 'Sklep' },
          { href: '/zamow', label: 'Wycena', cta: true },
        ].map(link => (
          <li key={link.label}>
            <Link href={link.href} style={{
              color: link.cta ? 'white' : 'var(--muted)',
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              fontWeight: 500, transition: 'color 0.2s',
              background: link.cta ? 'var(--accent)' : 'transparent',
              padding: link.cta ? '0.5rem 1.25rem' : '0',
              borderRadius: '2px',
            }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
