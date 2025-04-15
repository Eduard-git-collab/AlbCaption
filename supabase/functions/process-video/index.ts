// Import standard libraries and Supabase client
// Note: Using esm.sh for Deno compatibility with supabase-js v2
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts' // Standard CORS headers helper

console.log(`Function "process-video" booting up!`)

// --- IMPORTANT: Replace placeholders below! ---
// WARNING: Hardcoding keys like this is NOT recommended for production.
// We do it here for simplicity in the MVP. Later, use environment variables:
// e.g., const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
// e.g., const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const SUPABASE_URL = 'https://htoujjoglfzjvyovryuc.supabase.co' // <--- REPLACE THIS WITH YOUR ACTUAL URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0b3Vqam9nbGZ6anZ5b3ZyeXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjQ4OTksImV4cCI6MjA2MDI0MDg5OX0.vyzpeLggToGzSeVdHH3JcPL3lTSQa-kYAOYu6Pt6BXQ' // <--- REPLACE THIS WITH YOUR ACTUAL ANON KEY
// --- End Placeholders ---

serve(async (req) => {
  // This function handles requests invoked by supabase.functions.invoke

  // 1. Handle CORS preflight requests (standard procedure)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Initialize Supabase client *inside* the function
    // We need to pass the Authorization header from the original request
    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      // Pass the Authorization header from the invoking client (important!)
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 3. Get the filePath sent from the frontend request body
    // Ensure the frontend sends a JSON body like: { "filePath": "public/yourfile.mp4" }
    const payload = await req.json()
    const filePath = payload.filePath
    if (!filePath) {
      throw new Error('Missing "filePath" in the request body.')
    }
    console.log(`[${new Date().toISOString()}] Received request for file:`, filePath)

    // 4. Simulate processing delay (e.g., 3 seconds to mimic work)
    console.log('Simulating transcription processing...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    console.log('Simulated processing finished for:', filePath)

    // 5. Generate dummy/placeholder transcript data
    const dummyTranscript = [
      { timestamp: '0:00.100 --> 0:02.500', text: 'Ky është transkriptim shembull.' }, // Example Albanian
      { timestamp: '0:02.800 --> 0:05.000', text: 'This is dummy data.' },
      { timestamp: '0:05.500 --> 0:08.200', text: 'The Edge Function is working!' }
    ]

    // 6. Insert the dummy data into the 'transcripts' table
    console.log('Attempting to insert dummy transcript into DB...')
    const { data: insertData, error: insertError } = await supabaseClient
      .from('transcripts')
      .insert({
        video_path: filePath,       // The path of the video in Storage
        transcript_data: dummyTranscript // The dummy JSON data
       })
      .select() // Ask Supabase to return the inserted row(s)

    if (insertError) {
      console.error('Database insert error:', insertError)
      // Throwing an error here will be caught by the catch block below
      throw new Error(`Database error: ${insertError.message}`)
    }

    console.log('Successfully inserted dummy transcript into DB:', insertData)

    // 7. Return a success response to the frontend
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully processed (simulated) and saved dummy transcript for ${filePath}`,
        data: insertData // Send back the data that was inserted
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // HTTP status OK
      }
    )
  } catch (error) {
    // 8. Handle any errors that occurred during the process
    console.error('Error in Edge Function:', error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, // Use 400 for client errors, 500 for unexpected server errors
      }
    )
  }
})

/*
 * Deployment command reminder (run from project root in terminal):
 * supabase functions deploy process-video --no-verify-jwt
 *
 * Why --no-verify-jwt?
 * Because our frontend is calling this function using the ANON key, not a logged-in user's JWT.
 * If we implement user login later, we would remove this flag and Supabase would automatically
 * verify the user's JWT before running the function.
*/