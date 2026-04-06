import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

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
    const [custom, shop, products] = await Promise.all([
      supabaseAdmin.from('custom_orders').select('id, status, quoted_price, created_at'),
      supabaseAdmin.from('shop_orders').select('id, status, total_amount, created_at'),
      supabaseAdmin.from('products').select('id, name, price, stock_qty'),
    ])
    const revenue = (shop.data || []).filter(o => o.status === 'paid').reduce((s, o) => s + Number(o.total_amount), 0)
    const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0)
    const ordersThisMonth = [...(custom.data || []), ...(shop.data || [])].filter(o => new Date(o.created_at) >= thisMonth).length
    return NextResponse.json({
      data: {
        customTotal: custom.data?.length || 0,
        shopTotal: shop.data?.length || 0,
        revenue: revenue.toFixed(2),
        ordersThisMonth,
        pendingCustom: (custom.data || []).filter(o => o.status === 'pending').length,
        pendingShop: (shop.data || []).filter(o => o.status === 'pending').length,
        productsTotal: products.data?.length || 0,
      }
    })
  }
  return NextResponse.json({ data: [] })
}

export async function PATCH(request) {
  const { id, type, ...fields } = await request.json()
  const table = type === 'custom' ? 'custom_orders' : 'shop_orders'
  const { data, error } = await supabaseAdmin.from(table).update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}