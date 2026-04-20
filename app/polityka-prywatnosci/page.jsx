import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const Section = ({ num, title, children }) => (
  <section style={{ marginBottom: '2.5rem' }}>
    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.15em' }}>{num}.</span>
      {title}
    </h2>
    <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.9, fontWeight: 300, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {children}
    </div>
  </section>
)

const P = ({ children }) => <p>{children}</p>

const Ul = ({ items }) => (
  <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
)

const Table = ({ rows }) => (
  <div style={{ overflowX: 'auto', borderRadius: '2px', border: '1px solid var(--border)' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
      <thead>
        <tr style={{ background: 'var(--surface)' }}>
          {['Cel przetwarzania', 'Podstawa prawna', 'Okres przechowywania'].map(h => (
            <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>{r[0]}</td>
            <td style={{ padding: '0.75rem 1rem' }}>{r[1]}</td>
            <td style={{ padding: '0.75rem 1rem' }}>{r[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function PolitykaPrywatnosci() {
  return (
    <>
      <Nav />
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '8rem 2rem 6rem' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Dokumenty</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 0.95, marginBottom: '1.5rem' }}>
          Polityka<br /><span style={{ color: 'var(--accent)' }}>prywatności</span>
        </h1>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '3rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <span>Wersja: 1.0</span>
          <span>Data wejścia w życie: 1 stycznia 2026 r.</span>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', padding: '1.25rem 1.5rem', borderRadius: '2px', marginBottom: '2.5rem', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7 }}>
          Niniejsza Polityka Prywatności opisuje, jakie dane osobowe zbieramy, w jakim celu je przetwarzamy oraz jakie prawa przysługują Ci jako osobie, której dane dotyczą. Dokument jest zgodny z Rozporządzeniem (UE) 2016/679 (RODO/GDPR).
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>

          <Section num="1" title="Administrator danych">
            <P>Administratorem Twoich danych osobowych jest Print-Forge z siedzibą w Polsce (dalej: „Administrator").</P>
            <P>Kontakt w sprawach ochrony danych osobowych: <Link href="mailto:hello@print-forge.pl" style={{ color: 'var(--accent)' }}>hello@print-forge.pl</Link></P>
          </Section>

          <Section num="2" title="Jakie dane zbieramy">
            <P>W zależności od rodzaju usługi możemy zbierać następujące kategorie danych:</P>
            <Ul items={[
              'Dane identyfikacyjne: imię i nazwisko',
              'Dane kontaktowe: adres e-mail, numer telefonu',
              'Dane adresowe: adres dostawy (jeżeli podany)',
              'Dane transakcyjne: informacje o złożonych zamówieniach, historii płatności (bez danych karty — te przechowuje wyłącznie Stripe)',
              'Pliki 3D: modele przesłane w celu realizacji zamówienia niestandardowego',
              'Dane techniczne: adres IP, typ przeglądarki, dane logowania pozyskiwane automatycznie podczas korzystania z Serwisu',
            ]} />
            <P>Nie zbieramy danych szczególnej kategorii (danych wrażliwych) w rozumieniu art. 9 RODO.</P>
          </Section>

          <Section num="3" title="Cele i podstawy przetwarzania">
            <Table rows={[
              ['Realizacja zamówień i obsługa klienta', 'Art. 6 ust. 1 lit. b RODO — wykonanie umowy', 'Do czasu wygaśnięcia roszczeń (5 lat od realizacji)'],
              ['Płatności przez Stripe', 'Art. 6 ust. 1 lit. b RODO — wykonanie umowy', 'Zgodnie z polityką Stripe'],
              ['Wysyłka wiadomości e-mail o statusie zamówienia', 'Art. 6 ust. 1 lit. b RODO — wykonanie umowy', 'Czas trwania zamówienia'],
              ['Przechowywanie dokumentacji księgowej', 'Art. 6 ust. 1 lit. c RODO — obowiązek prawny', '5 lat od wystawienia dokumentu'],
              ['Analityka i bezpieczeństwo Serwisu', 'Art. 6 ust. 1 lit. f RODO — uzasadniony interes', 'Do 12 miesięcy'],
            ]} />
          </Section>

          <Section num="4" title="Odbiorcy danych">
            <P>Twoje dane mogą być przekazywane następującym kategoriom odbiorców:</P>
            <Ul items={[
              'Stripe Payments Europe Ltd — operator płatności. Polityka prywatności Stripe: stripe.com/privacy',
              'Supabase Inc. — dostawca infrastruktury bazodanowej i storage (serwery w UE)',
              'Resend Inc. — dostawca usługi wysyłki e-maili transakcyjnych',
              'Firmy kurierskie i InPost — w zakresie niezbędnym do realizacji dostawy',
              'Organy publiczne — wyłącznie na podstawie przepisów prawa',
            ]} />
            <P>Nie sprzedajemy danych osobowych podmiotom trzecim w celach marketingowych.</P>
          </Section>

          <Section num="5" title="Przekazywanie danych poza EOG">
            <P>Niektórzy z naszych dostawców (np. Stripe, Supabase, Resend) mogą przetwarzać dane na serwerach poza Europejskim Obszarem Gospodarczym. W takich przypadkach przekazanie odbywa się na podstawie standardowych klauzul umownych (SCC) zatwierdzonych przez Komisję Europejską, co zapewnia odpowiedni poziom ochrony danych.</P>
          </Section>

          <Section num="6" title="Twoje prawa">
            <P>Na podstawie RODO przysługują Ci następujące prawa:</P>
            <Ul items={[
              'Prawo dostępu do danych (art. 15 RODO) — możesz zażądać kopii przetwarzanych danych',
              'Prawo do sprostowania (art. 16 RODO) — możesz poprawić nieprawidłowe dane',
              'Prawo do usunięcia (art. 17 RODO) — „prawo do bycia zapomnianym" gdy dane nie są już potrzebne',
              'Prawo do ograniczenia przetwarzania (art. 18 RODO)',
              'Prawo do przenoszenia danych (art. 20 RODO)',
              'Prawo sprzeciwu (art. 21 RODO) — wobec przetwarzania opartego na uzasadnionym interesie',
              'Prawo do wniesienia skargi do Prezesa UODO (uodo.gov.pl) jeśli uważasz, że przetwarzanie narusza RODO',
            ]} />
            <P>Aby skorzystać z praw, skontaktuj się pod adresem: <Link href="mailto:hello@print-forge.pl" style={{ color: 'var(--accent)' }}>hello@print-forge.pl</Link>. Odpowiemy w ciągu 30 dni.</P>
          </Section>

          <Section num="7" title="Pliki cookie i dane techniczne">
            <P>Serwis korzysta z niezbędnych plików cookie służących do obsługi sesji i bezpieczeństwa (np. cookie uwierzytelniające panel admina). Nie stosujemy cookies marketingowych ani śledzących firm trzecich.</P>
            <P>Dane techniczne (logi serwera, adresy IP) przetwarzamy wyłącznie w celu zapewnienia bezpieczeństwa i stabilności Serwisu i przechowujemy je przez maksymalnie 12 miesięcy.</P>
          </Section>

          <Section num="8" title="Bezpieczeństwo danych">
            <P>Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych przed nieuprawnionym dostępem, utratą lub zniszczeniem:</P>
            <Ul items={[
              'Szyfrowanie połączeń (HTTPS/TLS)',
              'Kontrola dostępu oparta na tokenach uwierzytelniających',
              'Przechowywanie plików 3D w prywatnym buckecie z dostępem przez podpisane URL o ograniczonym czasie ważności',
              'Dane kart płatniczych nigdy nie trafiają na nasze serwery — są obsługiwane wyłącznie przez Stripe',
            ]} />
          </Section>

          <Section num="9" title="Zmiany polityki prywatności">
            <P>Zastrzegamy prawo do aktualizacji niniejszej Polityki Prywatności. O istotnych zmianach będziemy informować poprzez ogłoszenie w Serwisie. Data ostatniej aktualizacji jest wskazana na górze dokumentu.</P>
          </Section>

        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/regulamin" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.08em' }}>Regulamin →</Link>
          <Link href="/faq" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>FAQ →</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
