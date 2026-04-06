import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendStatusEmail, sendNegotiationAccepted } from '@/lib/email'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'custom') {
        const { data } = await supabaseAdmin.from('custom_orders').select('*').order('created_at', { ascending: false })
        return NextResponse.json({ data: data || [] })
    }
    if (type === 'shop') {
        const { data } = await supabaseAdmin.from('shop_orders').select('*').order('created_at', { ascending: false })
        return NextResponse.json({ data: data || [] })
    }
    if (type === 'products') {
        const { data } = await supabaseAdmin.from('products').select('*').order('created_at', { ascending: false })
        return NextResponse.json({ data: data || [] })
    }

    if (type === 'stats') {
        const [{ data: customOrders }, { data: shopOrders }] = await Promise.all([
            supabaseAdmin.from('custom_orders').select('id, status, created_at'),
            supabaseAdmin.from('shop_orders').select('id, status, total_amount, created_at'),
        ])

        const custom = customOrders || []
        const shop = shopOrders || []

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        const revenue = shop
            .filter(o => o.status === 'paid' || o.status === 'done')
            .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)
            .toFixed(2)

        const data = {
            revenue,
            customTotal: custom.length,
            pendingCustom: custom.filter(o => o.status === 'pending').length,
            shopTotal: shop.length,
            pendingShop: shop.filter(o => o.status === 'pending').length,
            ordersThisMonth: [
                ...custom.filter(o => o.created_at >= startOfMonth),
                ...shop.filter(o => o.created_at >= startOfMonth),
            ].length,
        }

        return NextResponse.json({ data })
    }

    return NextResponse.json({ data: [] })
}

export async function PATCH(request) {
    const { id, type, accept_negotiation, ...fields } = await request.json()

    if (!id || !type) {
        return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })
    }

    const table = type === 'custom' ? 'custom_orders' : 'shop_orders'
    const { data, error } = await supabaseAdmin
        .from(table)
        .update(fields)
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (accept_negotiation) {
        await sendNegotiationAccepted({
            customerName: data.customer_name,
            customerEmail: data.customer_email,
            orderId: data.id,
            agreedPrice: data.quoted_price,
        })
    } else if (fields.status) {
        await sendStatusEmail({
            status: fields.status,
            customerName: data.customer_name,
            customerEmail: data.customer_email,
            orderId: data.id,
            quotedPrice: fields.quoted_price ?? data.quoted_price,
        })
    }

    return NextResponse.json({ data })
}