import { createClient } from '@supabase/supabase-js'

// Klient z pełnymi uprawnieniami — TYLKO w API routes!
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)