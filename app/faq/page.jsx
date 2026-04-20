'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const FAQS = [
  {
    section: 'Zamówienia i proces',
    items: [
      {
        q: 'Jak złożyć zamówienie na wydruk niestandardowy?',
        a: 'Przejdź do strony „Zamów" i prześlij plik 3D (STL, OBJ, 3MF lub STEP). Wypełnij formularz — wybierz materiał, kolor i liczbę sztuk. W ciągu kilku godzin roboczych otrzymasz bezpłatną wycenę na podany e-mail.',
      },
      {
        q: 'Jakie formaty plików akceptujecie?',
        a: 'Akceptujemy pliki STL, OBJ, 3MF oraz STEP. Plik powinien być watertight (bez dziur w siatce). Jeśli nie masz pewności co do poprawności pliku, prześlij go — sprawdzimy i poinformujemy o ewentualnych problemach.',
      },
      {
        q: 'Jak długo trwa realizacja zamówienia?',
        a: 'Wycena: do 24 godzin roboczych. Realizacja po akceptacji wyceny: zazwyczaj 2–5 dni roboczych w zależności od złożoności modelu, wybranego materiału i bieżącego obłożenia. O każdym etapie informujemy e-mailem.',
      },
      {
        q: 'Czy mogę zamówić wiele sztuk?',
        a: 'Tak. W formularzu zamówienia podaj żądaną liczbę sztuk. Przy większych seriach (10+ szt.) możemy zaproponować korzystniejszą cenę jednostkową — napisz do nas.',
      },
      {
        q: 'Co jeśli mój plik ma błędy geometryczne?',
        a: 'Poinformujemy Cię o wykrytych problemach przed wycenią. Proste naprawy (zamknięcie siatki, usunięcie duplikatów) wykonujemy bezpłatnie. Bardziej złożone modyfikacje projektowe wyceniamy indywidualnie.',
      },
    ],
  },
  {
    section: 'Materiały i kolory',
    items: [
      {
        q: 'Jakie materiały oferujecie?',
        a: 'Drukujemy w PLA, PLA+, PLA Matte, PLA Silk, PLA Silk+, PLA Tough+, PETG, PETG HF, ABS, ASA, TPU (95A), PA (Nylon), PLA-CF, PETG-CF oraz PC. Oferujemy też druk z żywicy (resin) w różnych typach. Pełna lista dostępnych kolorów widoczna jest w formularzu zamówienia.',
      },
      {
        q: 'Który materiał wybrać do swojego projektu?',
        a: 'PLA/PLA+ to dobry wybór do modeli dekoracyjnych i prototypów — łatwy w druku, duży wybór kolorów. PETG sprawdzi się w częściach narażonych na wilgoć. ABS i ASA są odporne na temperaturę i UV (zewnętrze). TPU to materiał elastyczny — uszczelki, etui, protezy. PA i CF-Composites do obciążonych mechanicznie elementów. Chętnie doradzimy — napisz do nas.',
      },
      {
        q: 'Nie widzę koloru, który mnie interesuje. Co zrobić?',
        a: 'W formularzu zamówienia zaznacz opcję „Nie widzę odpowiedniego filamentu" i opisz interesujący Cię materiał oraz kolor. Sprawdzimy dostępność lub zaproponujemy najbliższy odpowiednik.',
      },
      {
        q: 'Czy oferujecie druk wielokolorowy?',
        a: 'Tak, mamy dostęp do drukarki z systemem AMS (automatyczna zmiana filamentu). Druk wielokolorowy jest możliwy dla wybranych materiałów — napisz do nas z opisem projektu, a wycenimy indywidualnie.',
      },
    ],
  },
  {
    section: 'Płatności i ceny',
    items: [
      {
        q: 'Jak obliczana jest cena wydruku?',
        a: 'Cena zależy od objętości zużytego materiału (filament), czasu druku, rodzaju materiału oraz ewentualnych kosztów post-processingu. Wycena jest zawsze bezpłatna i nie zobowiązuje do złożenia zamówienia.',
      },
      {
        q: 'Czy mogę negocjować cenę?',
        a: 'Tak. Po otrzymaniu wyceny możesz zaproponować kontrę — wystarczy skorzystać z opcji „Negocjuj" dostępnej w e-mailu z wyceną. Minimalny próg negocjacji to 70% oryginalnej ceny.',
      },
      {
        q: 'Jakie metody płatności akceptujecie?',
        a: 'Płatności obsługujemy przez Stripe — akceptujemy karty Visa, Mastercard, American Express oraz BLIK. Płatność następuje po akceptacji wyceny przez klienta.',
      },
      {
        q: 'Czy wystawiacie faktury VAT?',
        a: 'Tak. Aby otrzymać fakturę VAT, podaj dane firmy w uwagach do zamówienia lub skontaktuj się z nami e-mailem po złożeniu zamówienia.',
      },
    ],
  },
  {
    section: 'Dostawa i reklamacje',
    items: [
      {
        q: 'Czy oferujecie wysyłkę?',
        a: 'Tak, wysyłamy na terenie całej Polski za pośrednictwem kuriera lub Paczkomatu InPost. Koszt dostawy ustalany jest indywidualnie i doliczany do wyceny. Możliwy jest też odbiór osobisty.',
      },
      {
        q: 'Jak mogę śledzić moje zamówienie?',
        a: 'Po złożeniu zamówienia otrzymujesz unikalny identyfikator. Wpisz go w polu „Śledź zamówienie" na stronie głównej, aby zobaczyć aktualny status. Każda zmiana statusu jest też przesyłana na Twój e-mail.',
      },
      {
        q: 'Co w przypadku wadliwego wydruku?',
        a: 'Jeśli wydruk jest niezgodny z zamówieniem lub posiada wady produkcyjne, prosimy o kontakt w ciągu 14 dni od odbioru przesyłając zdjęcia. Bezpłatnie ponowimy wydruk lub zwrócimy płatność. Szczegóły w Regulaminie.',
      },
    ],
  },
]

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', background: 'none', border: 'none', padding: '1.25rem 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontSize: '0.95rem', fontWeight: 500, color: open ? 'var(--accent)' : 'var(--text)', lineHeight: 1.5, transition: 'color 0.2s' }}>{q}</span>
        <span style={{ color: 'var(--accent)', fontSize: '1.1rem', flexShrink: 0, marginTop: '0.1rem', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300 }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <>
      <Nav />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 2rem 6rem' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Pomoc</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 0.95, marginBottom: '1rem' }}>
          Często zadawane<br /><span style={{ color: 'var(--accent)' }}>pytania</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.7, marginBottom: '4rem', maxWidth: '520px' }}>
          Nie znalazłeś odpowiedzi? <Link href="mailto:hello@print-forge.pl" style={{ color: 'var(--accent)' }}>Napisz do nas</Link> — odpowiemy w ciągu jednego dnia roboczego.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {FAQS.map(section => (
            <div key={section.section}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '24px', height: '1px', background: 'var(--accent)' }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.68rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{section.section}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {section.items.map(item => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', padding: '1.5rem 2rem', borderRadius: '2px' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.68rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Masz inne pytanie?</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Napisz na <Link href="mailto:hello@print-forge.pl" style={{ color: 'var(--accent)' }}>hello@print-forge.pl</Link>.
          </p>
          <Link href="/zamow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent)', color: 'white', padding: '0.7rem 1.5rem', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none' }}>
            Złóż zamówienie →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
