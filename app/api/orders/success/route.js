import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) return NextResponse.json({ error: 'Brak session_id' }, { status: 400 })

  // Sprawdź custom_orders
  const { data: customOrder } = await supabaseAdmin
    .from('custom_orders')
    .select('id, customer_name, customer_email, quoted_price, status, file_name')
    .eq('stripe_session_id', sessionId)
    .single()

  if (customOrder) {
    return NextResponse.json({ type: 'custom', order: customOrder })
  }

  // Sprawdź shop_orders
  const { data: shopOrder } = await supabaseAdmin
    .from('shop_orders')
    .select('id, customer_name, customer_email, total_amount, status')
    .eq('stripe_session_id', sessionId)
    .single()

  if (shopOrder) {
    return NextResponse.json({ type: 'shop', order: shopOrder })
  }

  return NextResponse.json({ error: 'Nie znaleziono zamówienia' }, { status: 404 })
}
