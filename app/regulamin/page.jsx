import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const Section = ({ num, title, children }) => (
  <section style={{ marginBottom: '2.5rem' }}>
    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.15em' }}>§{num}</span>
      {title}
    </h2>
    <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.9, fontWeight: 300, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {children}
    </div>
  </section>
)

const P = ({ children }) => <p>{children}</p>

const Ol = ({ items }) => (
  <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ol>
)

export default function RegulaminPage() {
  return (
    <>
      <Nav />
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '8rem 2rem 6rem' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Dokumenty</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 0.95, marginBottom: '1.5rem' }}>
          Regulamin<br /><span style={{ color: 'var(--accent)' }}>serwisu</span>
        </h1>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '3rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <span>Wersja: 1.0</span>
          <span>Data wejścia w życie: 1 stycznia 2026 r.</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>

          <Section num="1" title="Postanowienia ogólne">
            <P>Niniejszy Regulamin określa zasady korzystania z usług świadczonych przez Print-Forge z siedzibą w Polsce, za pośrednictwem serwisu internetowego dostępnego pod adresem print-forge.pl, zwanego dalej „Serwisem".</P>
            <P>Właścicielem i operatorem Serwisu jest Print-Forge (dalej: „Usługodawca"). Kontakt: <Link href="mailto:hello@print-forge.pl" style={{ color: 'var(--accent)' }}>hello@print-forge.pl</Link>.</P>
            <P>Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu. Użytkownik, który nie akceptuje jego postanowień, powinien powstrzymać się od korzystania z Serwisu.</P>
          </Section>

          <Section num="2" title="Definicje">
            <Ol items={[
              'Usługodawca – Print-Forge, właściciel serwisu.',
              'Klient – osoba fizyczna, osoba prawna lub jednostka organizacyjna korzystająca z usług Serwisu.',
              'Zamówienie niestandardowe – usługa druku 3D z pliku przesłanego przez Klienta.',
              'Zamówienie sklepowe – zakup gotowego wyrobu z katalogu produktów Serwisu.',
              'Wycena – propozycja cenowa przygotowana przez Usługodawcę na podstawie pliku 3D Klienta.',
              'Płatność – transakcja realizowana przez zewnętrznego operatora płatności (Stripe).',
            ]} />
          </Section>

          <Section num="3" title="Zamówienia niestandardowe">
            <P>Usługa druku 3D na zamówienie polega na wydrukowaniu modelu 3D dostarczonego przez Klienta w wybranym materiale i kolorze.</P>
            <Ol items={[
              'Klient składa zapytanie poprzez formularz na stronie /zamow, dołączając plik 3D w formacie STL, OBJ, 3MF lub STEP.',
              'Usługodawca w ciągu 1 dnia roboczego przesyła bezpłatną wycenę na adres e-mail Klienta.',
              'Klient może zaakceptować wycenę, odrzucić ją lub złożyć kontrpropozycję (nie niższą niż 70% ceny wyjściowej).',
              'Zamówienie zostaje uruchomione po dokonaniu pełnej płatności przez Klienta.',
              'Usługodawca zastrzega sobie prawo do odmowy realizacji zamówienia, w szczególności dotyczącego treści niezgodnych z prawem, naruszających prawa osób trzecich lub techniczne możliwości produkcji.',
            ]} />
          </Section>

          <Section num="4" title="Sklep z gotowymi produktami">
            <P>Serwis udostępnia sklep z gotowymi wydrukami 3D dostępnymi od ręki.</P>
            <Ol items={[
              'Zamówienie zostaje złożone po dodaniu produktu do koszyka i zrealizowaniu płatności.',
              'Ceny produktów są cenami brutto (z podatkiem VAT) wyrażonymi w złotych polskich.',
              'Usługodawca zastrzega prawo do zmiany cen, wycofywania produktów ze sprzedaży oraz przeprowadzania i odwoływania promocji.',
              'Dostępność produktu wskazana na stronie jest orientacyjna. W przypadku braku możliwości realizacji Klient zostanie niezwłocznie poinformowany, a płatność zwrócona.',
            ]} />
          </Section>

          <Section num="5" title="Płatności">
            <P>Płatności w Serwisie obsługiwane są przez operatora Stripe Payments. Klient może dokonać płatności kartą Visa, Mastercard, American Express lub BLIK.</P>
            <Ol items={[
              'Realizacja zamówienia niestandardowego rozpoczyna się po zaksięgowaniu płatności.',
              'Usługodawca nie przechowuje danych karty płatniczej — są one przekazywane wyłącznie do operatora Stripe.',
              'W przypadku problemów z płatnością należy skontaktować się pod adresem hello@print-forge.pl.',
            ]} />
          </Section>

          <Section num="6" title="Dostawa">
            <Ol items={[
              'Zamówienia wysyłane są na terenie Polski kurierem lub za pośrednictwem Paczkomatu InPost.',
              'Czas dostawy wynosi zazwyczaj 1–3 dni robocze od nadania przesyłki.',
              'Koszt dostawy wskazywany jest przed finalizacją zamówienia.',
              'Możliwy jest odbiór osobisty — po wcześniejszym uzgodnieniu terminu.',
              'Usługodawca nie ponosi odpowiedzialności za opóźnienia wynikające z działania przewoźnika.',
            ]} />
          </Section>

          <Section num="7" title="Reklamacje i odstąpienie od umowy">
            <P>Klient będący konsumentem ma prawo odstąpić od umowy zakupu produktu ze sklepu w ciągu 14 dni od jego odbioru, bez podania przyczyny, z zastrzeżeniem ust. 2.</P>
            <Ol items={[
              'Prawo odstąpienia nie przysługuje dla zamówień niestandardowych (druk z pliku Klienta) — są to towary wykonane według specyfikacji konsumenta, nieprefabrykowane (art. 38 pkt 3 Ustawy o prawach konsumenta).',
              'Reklamacje dotyczące wadliwości produktu lub niezgodności wydruku z zamówieniem należy zgłosić w ciągu 14 dni od odbioru, przesyłając opis wady i dokumentację zdjęciową na adres hello@print-forge.pl.',
              'Usługodawca rozpatruje reklamację w ciągu 14 dni roboczych. Uwzględniona reklamacja skutkuje ponowieniem wydruku lub zwrotem płatności według wyboru Klienta.',
              'Reklamacje dotyczące uszkodzeń powstałych podczas dostawy należy zgłosić do przewoźnika oraz niezwłocznie poinformować Usługodawcę.',
            ]} />
          </Section>

          <Section num="8" title="Własność intelektualna i pliki 3D">
            <Ol items={[
              'Klient, przesyłając plik 3D, oświadcza, że posiada prawa do jego druku i dystrybucji wydruku.',
              'Usługodawca nie przenosi na siebie żadnych praw do przesłanego pliku — jest on wykorzystywany wyłącznie w celu realizacji zamówienia.',
              'Przesłane pliki są przechowywane przez czas niezbędny do realizacji zamówienia, a następnie usuwane z serwerów.',
              'Usługodawca zastrzega sobie prawo do odmowy realizacji zamówień naruszających prawa autorskie lub inne prawa własności intelektualnej osób trzecich.',
            ]} />
          </Section>

          <Section num="9" title="Odpowiedzialność">
            <Ol items={[
              'Usługodawca nie ponosi odpowiedzialności za błędy geometryczne w plikach dostarczonych przez Klienta, które nie zostały zgłoszone przed realizacją.',
              'Usługodawca nie odpowiada za przeznaczenie wydruków przez Klienta, w szczególności za szkody wynikające z użycia wydruków niezgodnie z właściwościami materiału.',
              'Odpowiedzialność Usługodawcy wobec Klientów niebędących konsumentami ograniczona jest do wartości zamówienia.',
            ]} />
          </Section>

          <Section num="10" title="Postanowienia końcowe">
            <P>Regulamin obowiązuje od dnia 1 stycznia 2026 r. Usługodawca zastrzega prawo do zmiany Regulaminu z 14-dniowym wyprzedzeniem publikując nową wersję w Serwisie.</P>
            <P>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeks Cywilny oraz Ustawa o prawach konsumenta.</P>
            <P>Sądem właściwym do rozstrzygania sporów jest sąd właściwy dla siedziby Usługodawcy, chyba że przepisy bezwzględne stanowią inaczej (ochrona konsumenta).</P>
            <P>Wszelkie pytania dotyczące Regulaminu prosimy kierować na adres <Link href="mailto:hello@print-forge.pl" style={{ color: 'var(--accent)' }}>hello@print-forge.pl</Link>.</P>
          </Section>

        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/polityka-prywatnosci" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.08em' }}>Polityka prywatności →</Link>
          <Link href="/faq" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>FAQ →</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
