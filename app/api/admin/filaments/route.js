import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('filaments')
    .select('*')
    .order('material')
    .order('color_name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data || [] })
}

export async function POST(request) {
  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('filaments')
    .insert({ ...body, is_available: body.is_available ?? true })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PATCH(request) {
  const { id, ...fields } = await request.json()
  const { data, error } = await supabaseAdmin
    .from('filaments')
    .update(fields)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(request) {
  const { id } = await request.json()
  const { error } = await supabaseAdmin.from('filaments').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
