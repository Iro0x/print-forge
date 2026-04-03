import { createClient } from '@supabase/supabase-js'

// Klient po stronie przeglądarki
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)