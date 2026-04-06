async function send({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) return
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({ from: 'Print-Forge <noreply@print-forge.pl>', to, subject, html })
}

function base(content) {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;background:#0a0a0a;padding:40px 20px;min-height:100vh">
      <div style="max-width:560px;margin:0 auto;background:#111;border:1px solid #222;border-top:3px solid #ff4500;border-radius:2px;overflow:hidden">
        <div style="padding:28px 32px;border-bottom:1px solid #222">
          <span style="font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:3px;color:#ff4500">PRINT-FORGE</span>
        </div>
        <div style="padding:32px">
          ${content}
        </div>
        <div style="padding:20px 32px;border-top:1px solid #222;font-size:12px;color:#555;font-family:'Courier New',monospace">
          <a href="https://print-forge.pl" style="color:#555;text-decoration:none">print-forge.pl</a> — Druk 3D na zamówienie
        </div>
      </div>
    </div>
  `
}

function btn(text, href) {
  return `<a href="${href}" style="display:inline-block;margin-top:24px;background:#ff4500;color:#fff;text-decoration:none;padding:12px 28px;font-family:'Courier New',monospace;font-size:13px;letter-spacing:2px;text-transform:uppercase;border-radius:2px">${text}</a>`
}

function p(text) {
  return `<p style="color:#aaa;font-size:15px;line-height:1.7;margin:12px 0">${text}</p>`
}

function h(text) {
  return `<h2 style="color:#f0ece4;font-size:20px;font-weight:700;margin:0 0 16px">${text}</h2>`
}

function oid(id) {
  return `<p style="font-family:'Courier New',monospace;font-size:12px;color:#555;margin:0 0 20px">Zamówienie #${id.slice(0, 8).toUpperCase()}</p>`
}

function priceBox(amount) {
  return `<div style="background:#0a0a0a;border:1px solid #ff4500;border-radius:2px;padding:20px 24px;margin:20px 0;text-align:center"><span style="font-size:36px;font-weight:900;color:#ff4500;font-family:'Arial Black',Arial">${amount} zł</span></div>`
}

// ─── Zamówienie złożone ────────────────────────────────────────────────────

export async function sendCustomOrderConfirmation({ customerName, customerEmail, orderId }) {
  await send({
    to: customerEmail,
    subject: 'Przyjęliśmy Twoje zamówienie — Print-Forge',
    html: base(`
      ${h(`Cześć ${customerName}!`)}
      ${oid(orderId)}
      ${p('Otrzymaliśmy Twoje zamówienie customowego wydruku 3D.')}
      ${p('Przejrzymy Twój plik i odezwiemy się z <strong style="color:#f0ece4">wyceną w ciągu 2 godzin roboczych</strong>.')}
      ${p('Na razie nic więcej nie musisz robić.')}
    `),
  })
}

export async function sendAdminNotification({ orderId, customerName, customerEmail, fileName }) {
  if (!process.env.ADMIN_EMAIL) return
  await send({
    to: process.env.ADMIN_EMAIL,
    subject: `Nowe zamówienie #${orderId.slice(0, 8).toUpperCase()}`,
    html: base(`
      ${h('Nowe zamówienie customowe')}
      ${oid(orderId)}
      ${p(`<strong style="color:#f0ece4">Klient:</strong> ${customerName}`)}
      ${p(`<strong style="color:#f0ece4">E-mail:</strong> ${customerEmail}`)}
      ${p(`<strong style="color:#f0ece4">Plik:</strong> ${fileName || 'brak pliku'}`)}
      ${btn('Otwórz panel', `${process.env.NEXT_PUBLIC_BASE_URL}/admin`)}
    `),
  })
}

export async function sendShopOrderConfirmation({ customerName, customerEmail, orderId, totalAmount }) {
  await send({
    to: customerEmail,
    subject: 'Potwierdzenie płatności — Print-Forge',
    html: base(`
      ${h(`Dziękujemy, ${customerName}!`)}
      ${oid(orderId)}
      ${p('Płatność została potwierdzona. Zabieramy się do realizacji!')}
      ${p(`Kwota: <strong style="color:#ff4500">${totalAmount} zł</strong>`)}
      ${p('Gdy paczka zostanie wysłana, otrzymasz kolejną wiadomość z informacją o dostawie.')}
    `),
  })
}

export async function sendCustomOrderPaymentConfirmation({ customerName, customerEmail, orderId, totalAmount }) {
  await send({
    to: customerEmail,
    subject: 'Płatność potwierdzona — Print-Forge',
    html: base(`
      ${h(`Dziękujemy, ${customerName}!`)}
      ${oid(orderId)}
      ${p('Płatność za Twój wydruk 3D została potwierdzona.')}
      ${priceBox(totalAmount)}
      ${p('Rozpoczynamy druk — poinformujemy Cię, gdy paczka zostanie nadana.')}
    `),
  })
}

// ─── Negocjacje ────────────────────────────────────────────────────────────

export async function sendNegotiationNotification({ orderId, customerName, customerEmail, quotedPrice, proposedPrice, customerMessage }) {
  if (!process.env.ADMIN_EMAIL) return
  const reduction = (((quotedPrice - proposedPrice) / quotedPrice) * 100).toFixed(0)
  await send({
    to: process.env.ADMIN_EMAIL,
    subject: `Kontroferta #${orderId.slice(0, 8).toUpperCase()} — ${customerName}`,
    html: base(`
      ${h('Klient proponuje negocjację')}
      ${oid(orderId)}
      ${p(`<strong style="color:#f0ece4">Klient:</strong> ${customerName} (${customerEmail})`)}
      ${p(`<strong style="color:#f0ece4">Twoja wycena:</strong> ${quotedPrice} zł`)}
      ${p(`<strong style="color:#ff4500">Propozycja klienta:</strong> ${proposedPrice} zł <span style="color:#555">(redukcja ${reduction}%)</span>`)}
      ${customerMessage ? p(`<strong style="color:#f0ece4">Wiadomość:</strong> ${customerMessage}`) : ''}
      ${btn('Otwórz panel →', `${process.env.NEXT_PUBLIC_BASE_URL}/admin`)}
    `),
  })
}

export async function sendNegotiationAccepted({ customerName, customerEmail, orderId, agreedPrice }) {
  await send({
    to: customerEmail,
    subject: 'Zaakceptowaliśmy Twoją ofertę — Print-Forge',
    html: base(`
      ${h(`Dobra wiadomość, ${customerName}!`)}
      ${oid(orderId)}
      ${p('Zgodziliśmy się na Twoją proponowaną cenę:')}
      ${priceBox(agreedPrice)}
      ${p('Kliknij poniżej, aby przejść do płatności i sfinalizować zamówienie.')}
      ${btn('Przejdź do płatności →', `${process.env.NEXT_PUBLIC_BASE_URL}/wycena/${orderId}`)}
      ${p('<span style="color:#555;font-size:12px">Link jest unikalny dla Twojego zamówienia — nie udostępniaj go innym.</span>')}
    `),
  })
}

// ─── Zmiany statusu ────────────────────────────────────────────────────────

const STATUS_EMAILS = {
  quoted: ({ name, id, price }) => ({
    subject: 'Wycena Twojego zamówienia — Print-Forge',
    html: base(`
      ${h(`Cześć ${name}, mamy wycenę!`)}
      ${oid(id)}
      ${p('Przejrzeliśmy Twój model i przygotowaliśmy wycenę:')}
      ${priceBox(price)}
      ${p('Kliknij poniżej aby zaakceptować wycenę, zaproponować inną cenę lub anulować zamówienie.')}
      ${btn('Odpowiedz na wycenę →', `${process.env.NEXT_PUBLIC_BASE_URL}/wycena/${id}`)}
      ${p('<span style="color:#555;font-size:12px">Link jest ważny i unikalny dla Twojego zamówienia — nie udostępniaj go innym.</span>')}
    `),
  }),

  printing: ({ name, id }) => ({
    subject: 'Twój model jest drukowany — Print-Forge',
    html: base(`
      ${h('Drukujemy! 🖨️')}
      ${oid(id)}
      ${p(`Cześć ${name}, Twój model właśnie trafia na drukarkę.`)}
      ${p('Proces druku trwa zazwyczaj kilka godzin. Gdy paczka będzie gotowa do wysyłki, damy Ci znać.')}
    `),
  }),

  shipped: ({ name, id }) => ({
    subject: 'Paczka wysłana — Print-Forge',
    html: base(`
      ${h('Paczka w drodze! 📦')}
      ${oid(id)}
      ${p(`Cześć ${name}, Twoje zamówienie zostało właśnie nadane.`)}
      ${p('Dostawa InPost / Poczta Polska zazwyczaj zajmuje 1–2 dni robocze.')}
      ${p('Jeśli masz pytania dotyczące dostawy, odpowiedz na tę wiadomość.')}
    `),
  }),

  done: ({ name, id }) => ({
    subject: 'Zamówienie zakończone — Print-Forge',
    html: base(`
      ${h('Gotowe!')}
      ${oid(id)}
      ${p(`Cześć ${name}, Twoje zamówienie zostało oznaczone jako zakończone.`)}
      ${p('Dziękujemy za zaufanie. Jeśli jesteś zadowolony z wydruku, będziemy wdzięczni za polecenie nas znajomym!')}
    `),
  }),

  cancelled: ({ name, id }) => ({
    subject: 'Zamówienie anulowane — Print-Forge',
    html: base(`
      ${h('Zamówienie anulowane')}
      ${oid(id)}
      ${p(`Cześć ${name}, Twoje zamówienie zostało anulowane.`)}
      ${p('Jeśli to pomyłka lub masz pytania, odpowiedz na tę wiadomość — chętnie pomożemy.')}
    `),
  }),
}

export async function sendStatusEmail({ status, customerName, customerEmail, orderId, quotedPrice }) {
  const builder = STATUS_EMAILS[status]
  if (!builder) return
  const { subject, html } = builder({ name: customerName, id: orderId, price: quotedPrice })
  await send({ to: customerEmail, subject, html })
}
