# 🖨️ PrintForge — Druk 3D na Zamówienie

Aplikacja e-commerce dla drukarni 3D zbudowana w Next.js + Supabase + Stripe.

## Szybki start

### 1. Zainstaluj zależności
```bash
npm install
```

### 2. Skonfiguruj zmienne środowiskowe
```bash
cp .env.local.example .env.local
# Uzupełnij wartości w .env.local
```

### 3. Skonfiguruj bazę danych
Wklej zawartość pliku `supabase-schema.sql` do Supabase → SQL Editor → Run

### 4. Uruchom lokalnie
```bash
npm run dev
# Otwórz http://localhost:3000
```

## Struktura
- `app/` — strony Next.js (App Router)
- `app/api/` — endpointy API
- `components/` — komponenty React
- `lib/` — klienty Supabase i Stripe

## Strony
- `/` — strona główna
- `/sklep` — sklep z gotowymi wydrukami
- `/zamow` — formularz zamówienia customowego
- `/sukces` — strona po płatności
- `/admin` — panel administracyjny

## Deploy
1. Wgraj projekt na GitHub
2. Połącz z Vercel (vercel.com)
3. Dodaj zmienne środowiskowe w Vercel
4. Deploy!
