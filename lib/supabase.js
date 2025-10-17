import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// IMPORTANT: Do not throw at module import time to avoid breaking builds when envs are missing.
// Always read environment variables lazily when creating a client.

const getEnv = () => ({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

export const getPublicClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getEnv()
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase public client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export const createClient = () => {
  const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getEnv()
  if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
    throw new Error('Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and one of SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  const isServer = typeof window === 'undefined'
  const keyToUse = isServer && supabaseServiceKey ? supabaseServiceKey : supabaseAnonKey
  return createSupabaseClient(supabaseUrl, keyToUse)
}
