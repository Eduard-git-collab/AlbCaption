import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // Enable session persistence
    autoRefreshToken: true,      // Automatically refresh tokens
    detectSessionInUrl: true,    // Check for OAuth redirects
    storageKey: 'supabase_auth', // Storage key for the session
  }
})