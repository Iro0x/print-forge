import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '4rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.9rem', display: 'inline-block', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--accent)' }}>Print</span>Forge
          </Link>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.7, maxWidth: '220px' }}>
            Profesjonalny druk 3D dla hobbystów, projektantów i firm. Warszawa i cała Polska.
          </p>
        </div>
        {[
          { title: 'Usługi', links: [{ href: '/zamow', label: 'Druk na zamówienie' }, { href: '/sklep', label: 'Sklep z wydrukami' }] },
          { title: 'Informacje', links: [{ href: '#', label: 'FAQ' }, { href: '#', label: 'Regulamin' }, { href: '#', label: 'Polityka prywatności' }] },
          { title: 'Kontakt', links: [{ href: 'mailto:hello@print-forge.pl', label: 'hello@print-forge.pl' }, { href: 'tel:+48123456789', label: '+48 123 456 789' }] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1.25rem' }}>{col.title}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {col.links.map(l => (
                <li key={l.label}><Link href={l.href} style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 300 }}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
        <span>© 2026 Print-Forge. Wszelkie prawa zastrzeżone.</span>
        <span>Made with ♥ in Poland</span>
      </div>
    </footer>
  )
}
