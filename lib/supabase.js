import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side client for components
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const createClient = () => {
  // On the server (API routes), prefer the Service Role key to bypass RLS for trusted operations
  const isServer = typeof window === 'undefined'
  const keyToUse = isServer && supabaseServiceKey ? supabaseServiceKey : supabaseAnonKey
  return createSupabaseClient(supabaseUrl, keyToUse)
}
