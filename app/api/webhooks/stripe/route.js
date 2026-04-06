import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendShopOrderConfirmation, sendCustomOrderPaymentConfirmation, sendCustomOrderPaidAdminNotification } from '@/lib/email'

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderType = session.metadata?.order_type

    if (orderType === 'custom') {
      // Używamy order_id z metadata — niezawodne, nie zależy od stripe_session_id w bazie
      const orderId = session.metadata?.order_id
      if (!orderId) return NextResponse.json({ received: true })

      const { data: order } = await supabaseAdmin
        .from('custom_orders')
        .update({ status: 'paid', stripe_session_id: session.id, paid_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single()

      if (order) {
        await Promise.allSettled([
          sendCustomOrderPaymentConfirmation({
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            orderId: order.id,
            totalAmount: order.quoted_price,
          }),
          sendCustomOrderPaidAdminNotification({
            orderId: order.id,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            fileName: order.file_name,
            totalAmount: order.quoted_price,
          }),
        ])
      }
    } else {
      const { data: order } = await supabaseAdmin
        .from('shop_orders')
        .update({ status: 'paid', stripe_payment_status: session.payment_status, paid_at: new Date().toISOString() })
        .eq('stripe_session_id', session.id)
        .select()
        .single()

      if (order) {
        await sendShopOrderConfirmation({
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          orderId: order.id,
          totalAmount: order.total_amount,
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
