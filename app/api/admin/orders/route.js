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

    return NextResponse.json({ data: [] })
}