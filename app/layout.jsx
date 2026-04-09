import './globals.css'
import Cursor from '@/components/Cursor'

export const metadata = {
  title: 'Print-Forge — Druk 3D na Zamówienie',
  description: 'Profesjonalny druk 3D: customowe wydruki z Twojego pliku oraz gotowe modele ze sklepu. Warszawa i cała Polska.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Cursor />
      </body>
    </html>
  )
}
