import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendCustomOrderConfirmation, sendAdminNotification } from '@/lib/email'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const customerName = formData.get('customer_name')
    const customerEmail = formData.get('customer_email')
    const customerPhone = formData.get('customer_phone')
    const technology = formData.get('technology')
    const material = formData.get('material')
    const color = formData.get('color')
    const quantity = formData.get('quantity')
    const notes = formData.get('notes')

    let filePath = null
    let fileName = null

    // Upload pliku do Supabase Storage
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      fileName = file.name
      filePath = `orders/${Date.now()}-${fileName}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('models')
        .upload(filePath, buffer, {
          contentType: file.type || 'application/octet-stream',
        })
      if (uploadError) throw uploadError
    }

    // Zapisz zamówienie w bazie
    const { data, error } = await supabaseAdmin
      .from('custom_orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        file_path: filePath,
        file_name: fileName,
        technology,
        material,
        color,
        quantity: parseInt(quantity),
        notes,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    // Wyślij e-maile (jeśli Resend skonfigurowany)
    await Promise.allSettled([
      sendCustomOrderConfirmation({ customerName, customerEmail, orderId: data.id }),
      sendAdminNotification({ orderId: data.id, customerName, customerEmail, fileName }),
    ])

    return NextResponse.json({ success: true, orderId: data.id })
  } catch (error) {
    console.error('Custom order error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
