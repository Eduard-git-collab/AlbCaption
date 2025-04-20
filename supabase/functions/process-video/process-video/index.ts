// === START OF index.ts (V2 Update) ===
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import * as djwt from 'djwt'; // Resolved via import_map.json
console.log(`Function "process-video" (V2) booting up! Reading secrets...`);
// --- Get Credentials (Remains the same) ---
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const googleProjectId = Deno.env.get('GOOGLE_PROJECT_ID') ?? '';
const googleClientEmail = Deno.env.get('GOOGLE_CLIENT_EMAIL') ?? '';
const googlePrivateKey = (Deno.env.get('GOOGLE_PRIVATE_KEY') ?? '').replace(/\\n/g, '\n');
// --- End Credentials ---
// Helper function blobToBase64 (Remains the same)
async function blobToBase64(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  return encode(uint8Array);
}
// Helper function getGoogleAccessToken (Remains the same)
async function getGoogleAccessToken() {
  console.log("Attempting to generate Google Cloud access token...");
  if (!googleClientEmail || !googlePrivateKey) throw new Error("Missing Google Cloud client_email or private_key in secrets.");
  const scope = "https://www.googleapis.com/auth/cloud-platform";
  const aud = "https://oauth2.googleapis.com/token";
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: googleClientEmail,
    sub: googleClientEmail,
    aud: aud,
    iat: now,
    exp: now + 3500,
    scope: scope
  };
  try {
    const privateKeyData = googlePrivateKey.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace(/\n/g, "");
    const binaryDer = Uint8Array.from(atob(privateKeyData), (c)=>c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey("pkcs8", binaryDer, {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256"
    }, true, [
      "sign"
    ]);
    const jwt = await djwt.create({
      alg: "RS256",
      typ: "JWT"
    }, claims, cryptoKey);
    console.log("JWT generated successfully.");
    const tokenResponse = await fetch(aud, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt
      })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Failed to get access token:", tokenData);
      throw new Error(`Failed to exchange JWT for access token: ${tokenData.error_description || 'Unknown error'}`);
    }
    console.log("Google Cloud access token obtained successfully.");
    return tokenData.access_token;
  } catch (error) {
    console.error("Error during JWT signing or token exchange:", error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}
// Helper function formatTimestamp (Remains the same)
function formatTimestamp(timeString) {
  if (!timeString) return 'N/A';
  try {
    const seconds = parseFloat(timeString.replace('s', ''));
    return seconds.toFixed(3);
  } catch (e) {
    return 'N/A';
  }
}
// --- Main Function Handler ---
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  let filePath = '';
  const requestTimestamp = new Date().toISOString();
  try {
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    const payload = await req.json();
    filePath = payload.filePath;
    if (!filePath) throw new Error('Missing "filePath" in request body.');
    console.log(`[${requestTimestamp}] Received request for file:`, filePath);
    if (!googleProjectId || !googleClientEmail || !googlePrivateKey) throw new Error('Server configuration error: Missing Google Cloud credentials.');
    console.log(`[${requestTimestamp}] Downloading audio from Storage path: ${filePath}`);
    const { data: blobData, error: downloadError } = await supabaseClient.storage.from('videos').download(filePath);
    if (downloadError || !blobData) throw new Error(downloadError?.message || `Failed to download file: ${filePath}`);
    console.log(`[${requestTimestamp}] Successfully downloaded file: ${filePath}, size: ${blobData.size} bytes`);
    console.log(`[${requestTimestamp}] Converting audio to Base64...`);
    const base64Audio = await blobToBase64(blobData);
    console.log(`[${requestTimestamp}] Audio converted to Base64 (length approx):`, base64Audio.length);
    const accessToken = await getGoogleAccessToken();
    // --- Use Google STT API V2 Endpoint ---
    const GOOGLE_CLOUD_REGION = 'europe-west4'; // <<< CHANGE to Netherlands
    // V2 endpoint requires Project ID and Region, uses 'recognizers/_:recognize' for default/inline config
    // Correct V2 Endpoint definition:
    const GOOGLE_STT_API_ENDPOINT_V2 = `https://${GOOGLE_CLOUD_REGION}-speech.googleapis.com/v2/projects/${googleProjectId}/locations/${GOOGLE_CLOUD_REGION}/recognizers/_:recognize`;
    // --- End V2 Endpoint ---
    // --- CORRECTED V2 Request Body (Structure) ---
    const requestBody = {
      config: {
        languageCodes: [
          'sq-AL'
        ],
        model: 'chirp_2',
        features: {
          enableAutomaticPunctuation: true,
          enableWordTimeOffsets: true // Get timestamps
        },
        // Config for audio format (assuming WAV/LINEAR16/16k)
        explicitDecodingConfig: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          audioChannelCount: 1
        }
      },
      // V2 recognize method expects 'content' at the top level, not inside 'audio'
      content: base64Audio // <<< Base64 string directly here
    };
    // --- End CORRECTED V2 Request Body ---
    console.log(`[${requestTimestamp}] Sending request to Google STT API V2 endpoint: ${GOOGLE_STT_API_ENDPOINT_V2}`);
    const response = await fetch(GOOGLE_STT_API_ENDPOINT_V2, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    console.log(`[${requestTimestamp}] Google STT API V2 Response Status:`, response.status, response.statusText);
    const responseData = await response.json();
    if (!response.ok) {
      console.error(`[${requestTimestamp}] Google STT API V2 Error Response Body:`, responseData);
      throw new Error(`Google STT API V2 request failed: ${response.statusText} - ${responseData?.error?.message || 'Check STT API Error Response Body log'}`);
    }
    // --- API Call Successful ---
    console.log(`[${requestTimestamp}] Google STT API V2 Success Response (showing first result):`, responseData.results?.[0]?.alternatives?.[0]);
    // Parse REAL transcript (V2 response structure might be slightly different, but often similar)
    // Let's assume 'results[].alternatives[].transcript' and '...words[]' still exist for now
    const realTranscriptData = responseData.results?.map((result)=>{
      const alternative = result.alternatives?.[0];
      const words = alternative?.words;
      let startTime = 'N/A';
      let endTime = 'N/A';
      if (words && words.length > 0) {
        startTime = formatTimestamp(words[0].startTime);
        endTime = formatTimestamp(words[words.length - 1].endTime);
      }
      return {
        timestamp: `${startTime} --> ${endTime}`,
        text: alternative?.transcript || ''
      };
    }) || [];
    if (realTranscriptData.length === 0) console.warn(`[${requestTimestamp}] Google STT V2 returned success but with no transcript segments.`);
    console.log(`[${requestTimestamp}] Parsed real transcript data (V2):`, realTranscriptData);
    // Insert REAL transcript data (DB logic remains the same)
    console.log(`[${requestTimestamp}] Attempting to insert REAL transcript into DB...`);
    const { data: insertData, error: insertError } = await supabaseClient.from('transcripts').insert({
      video_path: filePath,
      transcript_data: realTranscriptData
    }).select();
    if (insertError) throw new Error(`Database error: ${insertError.message}`);
    console.log(`[${requestTimestamp}] Successfully inserted REAL transcript into DB:`, insertData);
    // Return success
    console.log(`[${requestTimestamp}] Successfully processed ${filePath}. Returning success.`);
    return new Response(JSON.stringify({
      success: true,
      message: `Successfully transcribed (V2)...`,
      data: insertData
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error(`[${requestTimestamp}] Error processing ${filePath || 'unknown file'}:`, error.message);
    console.error("Full error object:", error);
    console.log(`[${requestTimestamp}] Returning error response.`);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: error.message.includes('authenticate') || error.message.includes('Google STT API request failed') ? 401 : error.message.includes('Database') ? 500 : 400
    });
  }
}) // === END OF FINAL index.ts (V2 Update) ===
;
