import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { items, customerEmail, customerName, shippingAddress } = await request.json()

    // Pobierz aktualne ceny z bazy (nie ufaj cenom z frontendu!)
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name, price')
      .in('id', items.map(i => i.id))

    const lineItems = items.map(item => {
      const product = products.find(p => p.id === item.id)
      return {
        price_data: {
          currency: 'pln',
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      }
    })

    const totalAmount = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id)
      return sum + product.price * item.quantity
    }, 0)

    // Utwórz zamówienie w bazie
    const { data: order } = await supabaseAdmin
      .from('shop_orders')
      .insert({ customer_name: customerName, customer_email: customerEmail, shipping_address: shippingAddress, total_amount: totalAmount, status: 'pending' })
      .select().single()

    // Utwórz sesję Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sklep`,
      metadata: { order_id: order.id },
    })

    // Zapisz session ID
    await supabaseAdmin.from('shop_orders').update({ stripe_session_id: session.id }).eq('id', order.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
