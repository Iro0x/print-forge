import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path) return NextResponse.json({ error: 'Brak ścieżki pliku' }, { status: 400 })

  const { data, error } = await supabaseAdmin.storage
    .from('order-files')
    .createSignedUrl(path, 60 * 60) // 1 godzina

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ url: data.signedUrl })
}
