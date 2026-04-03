'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}></div>
        <div className={styles.heroLeft}>
          <div className={styles.heroTag}>Druk 3D Premium · Polska</div>
          <h1 className={styles.heroTitle}>
            Twój pomysł<em>w trzech wymiarach</em>
          </h1>
          <p className={styles.heroDesc}>
            Zamieniamy pliki STL, OBJ i 3MF w precyzyjne obiekty. Customowy druk na zamówienie
            lub gotowe modele ze sklepu — szybko, solidnie, bez kompromisów.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/zamow" className={styles.btnPrimary}>▲ Prześlij plik</Link>
            <Link href="/sklep" className={styles.btnOutline}>Przeglądaj sklep</Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroVisual}>
            <div className={styles.orbitRing1}><div className={styles.orbitDot}></div></div>
            <div className={styles.orbitRing2}><div className={styles.orbitDot}></div></div>
            <div className={styles.orbitRing3}><div className={styles.orbitDot}></div></div>
            <div className={styles.centerIcon}>🖨️</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.stat}><div className={styles.statNum}>2400+</div><div className={styles.statLabel}>Zrealizowanych projektów</div></div>
        <div className={styles.stat}><div className={styles.statNum}>48h</div><div className={styles.statLabel}>Średni czas realizacji</div></div>
        <div className={styles.stat}><div className={styles.statNum}>12</div><div className={styles.statLabel}>Dostępnych materiałów</div></div>
        <div className={styles.stat}><div className={styles.statNum}>98%</div><div className={styles.statLabel}>Zadowolonych klientów</div></div>
      </div>

      {/* USŁUGI */}
      <section className={styles.services}>
        <div className={styles.sectionTag}>// Oferta</div>
        <h2 className={styles.sectionTitle}>Co oferujemy</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <span className={styles.serviceBadge}>Najpopularniejsze</span>
            <span className={styles.serviceIcon}>📁</span>
            <h3>Druk na zamówienie</h3>
            <p>Masz projekt? Prześlij plik, wybierz materiał i parametry — resztą zajmiemy się my.</p>
            <ul className={styles.serviceFeatures}>
              <li>Obsługujemy STL, OBJ, 3MF, STEP</li>
              <li>FDM, SLA, SLS — wybierz technologię</li>
              <li>Ponad 12 materiałów w palecie kolorów</li>
              <li>Wycena w ciągu 2 godzin</li>
            </ul>
            <Link href="/zamow" className={styles.btnPrimary}>Wyślij projekt →</Link>
          </div>
          <div className={styles.serviceCard}>
            <span className={styles.serviceIcon}>🛒</span>
            <h3>Gotowe wydruki</h3>
            <p>Wybierz spośród naszej kolekcji gotowych modeli — od dekoracji po części zamienne.</p>
            <ul className={styles.serviceFeatures}>
              <li>Kilkadziesiąt modeli w katalogu</li>
              <li>Różne kolory i warianty materiałów</li>
              <li>Dostawa 24–48h od zamówienia</li>
              <li>Odbiór osobisty — Warszawa</li>
            </ul>
            <Link href="/sklep" className={styles.btnOutline}>Przeglądaj sklep →</Link>
          </div>
        </div>
      </section>

      {/* PROCES */}
      <section className={styles.process}>
        <div className={styles.sectionTag}>// Jak to działa</div>
        <h2 className={styles.sectionTitle}>Cztery kroki do wydruku</h2>
        <div className={styles.processSteps}>
          {[
            { num: '01', icon: '📤', title: 'Prześlij plik', desc: 'Wyślij model 3D w formacie STL, OBJ, 3MF lub STEP.' },
            { num: '02', icon: '💬', title: 'Wycena', desc: 'W ciągu 2 godzin przesyłamy wycenę. Bez ukrytych opłat.' },
            { num: '03', icon: '🖨️', title: 'Druk', desc: 'Po akceptacji rozpoczynamy produkcję z kontrolą jakości.' },
            { num: '04', icon: '📦', title: 'Dostawa', desc: 'Wysyłka kurierem lub odbiór w Warszawie — gratis.' },
          ].map(step => (
            <div key={step.num} className={styles.step}>
              <div className={styles.stepNum}>{step.num}</div>
              <span className={styles.stepIcon}>{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className={styles.ctaSection}>
        <div>
          <h2>Gotowy żeby wydrukować swój pomysł?</h2>
          <p>Prześlij plik, a my wrócimy z wyceną w dwie godziny. Bez zobowiązań.</p>
        </div>
        <Link href="/zamow" className={styles.btnWhite}>Zacznij teraz →</Link>
      </div>

      <Footer />
    </>
  )
}
