import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const CUSTOM_STATUS_LABELS = {
  pending:     { label: 'Oczekuje na wycenę',            color: '#f59e0b', icon: '⏳' },
  quoted:      { label: 'Wycena wysłana — sprawdź e-mail', color: '#3b82f6', icon: '📧' },
  accepted:    { label: 'Zaakceptowane — oczekuje na płatność', color: '#8b5cf6', icon: '✅' },
  negotiating: { label: 'Negocjacja w toku',             color: '#f59e0b', icon: '💬' },
  paid:        { label: 'Opłacone — przygotowujemy',     color: '#10b981', icon: '💳' },
  printing:    { label: 'W trakcie druku',               color: '#8b5cf6', icon: '🖨️' },
  shipped:     { label: 'Wysłane — w drodze do Ciebie',  color: '#3b82f6', icon: '📦' },
  done:        { label: 'Zakończone',                    color: '#10b981', icon: '🎉' },
  cancelled:   { label: 'Anulowane',                     color: '#ef4444', icon: '❌' },
}

const SHOP_STATUS_LABELS = {
  pending:  { label: 'Oczekuje na płatność', color: '#f59e0b', icon: '⏳' },
  paid:     { label: 'Opłacone — pakujemy',  color: '#10b981', icon: '💳' },
  shipped:  { label: 'Wysłane — w drodze',   color: '#3b82f6', icon: '📦' },
  done:     { label: 'Zakończone',           color: '#10b981', icon: '🎉' },
  cancelled:{ label: 'Anulowane',            color: '#ef4444', icon: '❌' },
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')?.trim()

  if (!id) return NextResponse.json({ error: 'Brak ID zamówienia' }, { status: 400 })

  // Szukaj w custom_orders
  const { data: custom } = await supabaseAdmin
    .from('custom_orders')
    .select('id, status, created_at, file_name, quantity, material')
    .eq('id', id)
    .single()

  if (custom) {
    const info = CUSTOM_STATUS_LABELS[custom.status] || { label: custom.status, color: '#666', icon: '❓' }
    return NextResponse.json({
      found: true,
      type: 'custom',
      id: custom.id,
      status: custom.status,
      statusLabel: info.label,
      statusColor: info.color,
      statusIcon: info.icon,
      createdAt: custom.created_at,
      details: {
        'Plik': custom.file_name || '—',
        'Ilość': custom.quantity ? `${custom.quantity} szt.` : '—',
        'Materiał': custom.material || '—',
      },
    })
  }

  // Szukaj w shop_orders
  const { data: shop } = await supabaseAdmin
    .from('shop_orders')
    .select('id, status, created_at, total_amount')
    .eq('id', id)
    .single()

  if (shop) {
    const info = SHOP_STATUS_LABELS[shop.status] || { label: shop.status, color: '#666', icon: '❓' }
    return NextResponse.json({
      found: true,
      type: 'shop',
      id: shop.id,
      status: shop.status,
      statusLabel: info.label,
      statusColor: info.color,
      statusIcon: info.icon,
      createdAt: shop.created_at,
      details: {
        'Kwota': `${shop.total_amount} zł`,
      },
    })
  }

  return NextResponse.json({ found: false })
}
