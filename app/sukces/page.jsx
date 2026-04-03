import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function SukcesPage() {
  return (
    <>
      <Nav />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '8rem 4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem' }}>✅</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: 'var(--accent)' }}>Płatność przyjęta!</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '500px', lineHeight: 1.8, fontWeight: 300 }}>
          Dziękujemy za zamówienie. Potwierdzenie zostało wysłane na Twój adres e-mail. Rozpoczynamy realizację — poinformujemy Cię o wysyłce.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <Link href="/sklep" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.85rem 2rem', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px', background: 'var(--accent)', color: 'white' }}>
            Wróć do sklepu
          </Link>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.85rem 2rem', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>
            Strona główna
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
