'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image' 

const LINKS = [
  { href: '/#uslugi', label: 'Usługi' },
  { href: '/zamow', label: 'Zamów' },
  { href: '/sklep', label: 'Sklep' },
  { href: '/sledzenie', label: 'Śledź' },
  { href: '/zamow', label: 'Wycena', cta: true },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <style>{`
        .site-nav { padding: 1.25rem 4rem; }
        .nav-list { display: flex; gap: 2.5rem; list-style: none; }
        .nav-burger { display: none; background: none; border: none; padding: 0.25rem; flex-direction: column; gap: 5px; }
        @media (max-width: 768px) {
          .site-nav { padding: 1rem 1.5rem; }
          .nav-list { display: none; }
          .nav-burger { display: flex; }
        }
      `}</style>

      <nav className="site-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: scrolled || open ? '1px solid var(--border)' : '1px solid transparent',
        background: open ? 'rgba(10,10,10,0.98)' : scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled || open ? 'blur(12px)' : 'none',
        transition: 'all 0.3s',
      }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.9rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.6rem' }} onClick={() => setOpen(false)}>
          <Image src="/logomark.svg" width={50} height={50} alt="Print-Forge logomark" />
          <span><span style={{ color: 'var(--accent)' }}>Print</span><span style={{ color: 'var(--text)' }}>-Forge</span></span>
        </Link>

        <ul className="nav-list">
          {LINKS.map(link => (
            <li key={link.label}>
              <Link href={link.href} style={{
                color: link.cta ? 'white' : 'var(--muted)',
                fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                fontWeight: 500, transition: 'color 0.2s',
                background: link.cta ? 'var(--accent)' : 'transparent',
                padding: link.cta ? '0.5rem 1.25rem' : '0',
                borderRadius: '2px',
              }}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}>
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'var(--text)', transition: 'transform 0.3s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'var(--text)', transition: 'opacity 0.3s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'var(--text)', transition: 'transform 0.3s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(10,10,10,0.98)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '2.5rem',
        }}>
          {LINKS.map(link => (
            <Link key={link.label} href={link.href} onClick={() => setOpen(false)} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '3rem', letterSpacing: '0.05em',
              color: link.cta ? 'var(--accent)' : 'var(--text)',
            }}>{link.label}</Link>
          ))}
        </div>
      )}
    </>
  )
}
