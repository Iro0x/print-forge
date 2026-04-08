import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    const { orderId } = await request.json()
    if (!orderId) return NextResponse.json({ error: 'Brak orderId' }, { status: 400 })

    // Pobierz zamówienie z bazy — cena zawsze z serwera, nigdy z frontendu
    const { data: order, error } = await supabaseAdmin
      .from('custom_orders')
      .select('id, customer_name, customer_email, quoted_price, status, file_name')
      .eq('id', orderId)
      .single()

    if (error || !order) return NextResponse.json({ error: 'Nie znaleziono zamówienia' }, { status: 404 })
    if (!['quoted', 'accepted'].includes(order.status)) return NextResponse.json({ error: 'Zamówienie nie oczekuje na płatność' }, { status: 409 })
    if (!order.quoted_price) return NextResponse.json({ error: 'Brak wyceny dla tego zamówienia' }, { status: 400 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: `Druk 3D — ${order.file_name || 'zamówienie niestandardowe'}`,
              description: `Zamówienie #${order.id.slice(0, 8).toUpperCase()}`,
            },
            unit_amount: Math.round(order.quoted_price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: order.customer_email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/wycena/${orderId}`,
      metadata: {
        order_id: order.id,
        order_type: 'custom',
      },
    })

    // Zapisz session ID w zamówieniu
    await supabaseAdmin
      .from('custom_orders')
      .update({ stripe_session_id: session.id })
      .eq('id', orderId)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Custom checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
