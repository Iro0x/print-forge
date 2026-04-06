import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendNegotiationNotification } from '@/lib/email'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Brak ID' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('custom_orders')
    .select('id, customer_name, status, quoted_price, material, color, quantity, file_name, created_at')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Nie znaleziono zamówienia' }, { status: 404 })

  return NextResponse.json({ data })
}

export async function POST(request) {
  const { id, action, proposed_price, customer_message } = await request.json()

  if (!id || !action) return NextResponse.json({ error: 'Brak wymaganych pól' }, { status: 400 })

  const { data: order, error: fetchError } = await supabaseAdmin
    .from('custom_orders')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !order) return NextResponse.json({ error: 'Nie znaleziono zamówienia' }, { status: 404 })

  if (order.status !== 'quoted') {
    return NextResponse.json({ error: 'To zamówienie nie oczekuje już na odpowiedź.' }, { status: 409 })
  }

  let updateFields = {}

  if (action === 'accept') {
    updateFields = { status: 'accepted' }
  }

  else if (action === 'reject') {
    updateFields = { status: 'cancelled' }
  }

  else if (action === 'negotiate') {
    const minPrice = Math.ceil(order.quoted_price * 0.70)
    if (!proposed_price || proposed_price < minPrice) {
      return NextResponse.json({ error: `Minimalna możliwa oferta to ${minPrice} zł (70% wyceny).` }, { status: 400 })
    }

    const notePrefix = `[KONTR-OFERTA: ${proposed_price} zł${customer_message ? ` | Wiadomość: ${customer_message}` : ''}]\n`
    updateFields = {
      status: 'negotiating',
      admin_note: notePrefix + (order.admin_note || ''),
    }

    await sendNegotiationNotification({
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      quotedPrice: order.quoted_price,
      proposedPrice: proposed_price,
      customerMessage: customer_message,
    })
  }

  else {
    return NextResponse.json({ error: 'Nieznana akcja' }, { status: 400 })
  }

  const { error: updateError } = await supabaseAdmin
    .from('custom_orders')
    .update(updateFields)
    .eq('id', id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ ok: true, action })
}
