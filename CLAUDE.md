# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (uses Turbopack)
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite is configured.

## Architecture

**Next.js 16 App Router** project for a Polish 3D printing business. All pages use inline styles (no CSS modules except `app/page.module.css`). No TypeScript.

### Path alias
`@/` maps to the project root (configured in `jsconfig.json`).

### Data flow
- **Client pages** use `@/lib/supabase` (browser client, anon key) — only for reading public data like products and submitting reviews.
- **API routes** use `@/lib/supabase-admin` (service role key, bypasses RLS) — for all writes and admin reads. Never import `supabase-admin` in client components.
- **Emails** go through `@/lib/email.js` using Resend, lazily imported to avoid initialization errors. All email functions are async and silently skip if `RESEND_API_KEY` is unset.

### Admin auth
`middleware.js` protects all `/admin/*` routes by checking the `admin_token` cookie against the `ADMIN_TOKEN` env var. Login is handled by `/api/admin/login` (POST sets cookie, DELETE clears it). No JWT or session table — token comparison is direct string equality.

### Custom order flow
1. Customer submits form at `/zamow` → `POST /api/orders/custom` (uploads file to Supabase Storage bucket `order-files`, inserts into `custom_orders`)
2. Admin sets `quoted_price` + status `quoted` in dashboard → triggers `sendStatusEmail` which emails the customer a quote link `/wycena/[id]`
3. Customer accepts / negotiates / rejects at `/wycena/[id]` → `POST /api/orders/quote` (actions: `accept`, `reject`, `negotiate`; negotiate enforces 70% minimum of quoted price)
4. Admin progresses through statuses (`accepted → printing → shipped → done`); each status change in `PATCH /api/admin/orders` calls `sendStatusEmail`

### Shop order flow
Customer adds products → cart modal → `POST /api/checkout` creates a Stripe Checkout session → Stripe redirects to `/sukces` on success → `POST /api/webhooks/stripe` confirms payment and sends confirmation email.

### Key API routes
| Route | Purpose |
|---|---|
| `POST /api/orders/custom` | Submit custom order with file upload |
| `GET/POST /api/orders/quote` | Customer views/responds to quote |
| `GET/PATCH /api/orders` | Public order status reads |
| `POST /api/checkout` | Create Stripe session |
| `POST /api/webhooks/stripe` | Stripe payment webhook |
| `GET/PATCH /api/admin/orders` | Admin order management + status emails |
| `POST/PATCH/DELETE /api/admin/products` | Product CRUD |
| `GET/POST/PATCH/DELETE /api/admin/filaments` | Filament inventory |
| `GET /api/admin/file` | Generate signed URL for customer-uploaded files |
| `POST/DELETE /api/admin/login` | Admin auth |

### Supabase tables
`custom_orders`, `shop_orders`, `products`, `filaments`, `product_reviews`

### Supabase storage buckets
- `order-files` — customer 3D model uploads (private, accessed via signed URLs from `/api/admin/file`)
- `product-images` — product photos (public)

### `lib/email.js` exports
`sendCustomOrderConfirmation`, `sendAdminNotification`, `sendShopOrderConfirmation`, `sendStatusEmail`, `sendNegotiationNotification`

`sendStatusEmail` handles statuses: `quoted`, `printing`, `shipped`, `done`, `cancelled`.
