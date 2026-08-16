import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// createClient throws on malformed URLs (e.g. an untouched .env placeholder),
// which would crash the app at import time — validate before constructing.
const isUsableUrl = typeof supabaseUrl === 'string' && /^https?:\/\/.+/i.test(supabaseUrl.trim())

if (!isUsableUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials are missing or invalid. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

export const supabase =
  isUsableUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl.trim(), supabaseAnonKey.trim())
    : null
