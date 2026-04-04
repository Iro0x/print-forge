export default function Home() {
    return (
        <>
            <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0a; color: #f0ece4; font-family: 'DM Sans', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2.5rem' }}>
                    <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,69,0,0.3)', borderRadius: '50%', animation: 'rotate 8s linear infinite' }} />
                    <div style={{ position: 'absolute', inset: '15px', border: '1px solid rgba(255,69,0,0.15)', borderRadius: '50%', animation: 'rotate 5s linear infinite reverse' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🖨️</div>
                </div>

                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#ff4500', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          // Już wkrótce
                </div>

                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 400, letterSpacing: '0.05em', marginBottom: '1rem', lineHeight: 1 }}>
                    Print<span style={{ color: '#ff4500' }}>Forge</span>
                </h1>

                <p style={{ color: '#666', fontSize: '1rem', fontWeight: 300, lineHeight: 1.8, maxWidth: '420px', margin: '0 auto 2.5rem' }}>
                    Pracujemy nad czymś wyjątkowym.<br />
                    Profesjonalny druk 3D — już wkrótce dostępny.
                </p>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#111', border: '1px solid #222', borderLeft: '3px solid #ff4500', padding: '1rem 1.5rem', borderRadius: '2px', animation: 'pulse 3s ease-in-out infinite' }}>
                    <span style={{ fontSize: '1.1rem' }}>⚙️</span>
                    <span style={{ fontSize: '0.85rem', color: '#888', fontFamily: 'monospace', letterSpacing: '0.05em' }}>Strona w trakcie budowy — dziękujemy za cierpliwość</span>
                </div>

                <div style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#444', fontFamily: 'monospace' }}>
                    Kontakt: <a href="mailto:hello@printforge.pl" style={{ color: '#ff4500', textDecoration: 'none' }}>hello@printforge.pl</a>
                </div>
            </div>
        </>
    )
}