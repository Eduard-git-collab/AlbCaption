import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase Project URL
const supabaseUrl = 'https://htoujjoglfzjvyovryuc.supabase.co'
// Replace with your actual Supabase anon Key (public)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0b3Vqam9nbGZ6anZ5b3ZyeXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjQ4OTksImV4cCI6MjA2MDI0MDg5OX0.vyzpeLggToGzSeVdHH3JcPL3lTSQa-kYAOYu6Pt6BXQ'

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)