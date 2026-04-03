import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendCustomOrderConfirmation({ customerName, customerEmail, orderId }) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: 'PrintForge <noreply@printforge.pl>',
    to: customerEmail,
    subject: 'Przyjęliśmy Twoje zamówienie — PrintForge',
    html: `
      <h2>Cześć ${customerName}!</h2>
      <p>Otrzymaliśmy Twoje zamówienie (nr <strong>${orderId}</strong>).</p>
      <p>Skontaktujemy się z Tobą w ciągu <strong>2 godzin roboczych</strong> z wyceną.</p>
      <br/><p>Pozdrawiamy,<br/>Zespół PrintForge</p>
    `,
  })
}

export async function sendAdminNotification({ orderId, customerName, customerEmail, fileName }) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) return
  await resend.emails.send({
    from: 'PrintForge <noreply@printforge.pl>',
    to: process.env.ADMIN_EMAIL,
    subject: `🖨️ Nowe zamówienie #${orderId}`,
    html: `
      <h2>Nowe zamówienie customowe!</h2>
      <p><strong>Klient:</strong> ${customerName} (${customerEmail})</p>
      <p><strong>Plik:</strong> ${fileName || 'brak pliku'}</p>
      <p><strong>ID:</strong> ${orderId}</p>
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin">Otwórz panel admina →</a></p>
    `,
  })
}

export async function sendShopOrderConfirmation({ customerName, customerEmail, orderId, totalAmount }) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: 'PrintForge <noreply@printforge.pl>',
    to: customerEmail,
    subject: 'Potwierdzenie płatności — PrintForge',
    html: `
      <h2>Dziękujemy za zakup, ${customerName}!</h2>
      <p>Płatność dla zamówienia <strong>#${orderId}</strong> została potwierdzona.</p>
      <p>Kwota: <strong>${totalAmount} zł</strong></p>
      <p>Rozpoczynamy realizację. Poinformujemy Cię o wysyłce.</p>
      <br/><p>Pozdrawiamy,<br/>Zespół PrintForge</p>
    `,
  })
}
