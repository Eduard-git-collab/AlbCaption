// === START OF index.ts (with Extractor Service Call) ===
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import * as djwt from 'djwt';
import { extname } from "https://deno.land/std@0.168.0/path/mod.ts"; // Import extname

console.log(`Function "process-video" (V2/Extractor) booting up! Reading secrets...`)

// --- Get Credentials & Config ---
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const googleProjectId = Deno.env.get('GOOGLE_PROJECT_ID') ?? ''
const googleClientEmail = Deno.env.get('GOOGLE_CLIENT_EMAIL') ?? ''
const googlePrivateKey = (Deno.env.get('GOOGLE_PRIVATE_KEY') ?? '').replace(/\\n/g, '\n');
const extractorServiceUrl = Deno.env.get('EXTRACTOR_SERVICE_URL'); // Get new secret
// --- End Credentials & Config ---

// Helper functions (blobToBase64, getGoogleAccessToken, formatTimestamp - remain the same)
async function blobToBase64(blob: Blob): Promise<string> { /* ... same as before ... */ }
async function getGoogleAccessToken(): Promise<string> { /* ... same as before ... */ }
function formatTimestamp(timeString: string | undefined): string { /* ... same as before ... */ }


// --- Main Function Handler ---
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }

  let inputFilePath = ''; // Renamed for clarity
  const requestTimestamp = new Date().toISOString();
  let audioFilePath = ''; // Path to the audio data (extracted or original)

  try {
    // Basic validation of secrets needed early
    if (!googleProjectId || !googleClientEmail || !googlePrivateKey) throw new Error('Server configuration error: Missing Google Cloud credentials.');
    if (!extractorServiceUrl) throw new Error('Server configuration error: Missing Extractor Service URL.');

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: req.headers.get('Authorization')! } } });
    const payload = await req.json();
    inputFilePath = payload.filePath; // Path from the initial upload (could be video or audio)
    if (!inputFilePath) throw new Error('Missing "filePath" in request body.');
    console.log(`[${requestTimestamp}] Received request for file:`, inputFilePath);

    // --- Check File Type and Call Extractor if Necessary ---
    const fileExtension = extname(inputFilePath).toLowerCase();
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv']; // Add more if needed
    const audioExtensions = ['.wav', '.mp3', '.ogg', '.flac', '.m4a', '.aac']; // Add more if needed

    if (videoExtensions.includes(fileExtension)) {
        console.log(`[${requestTimestamp}] Video file detected. Calling extractor service at: ${extractorServiceUrl}`);

        const extractorResponse = await fetch(`${extractorServiceUrl}/extract-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // TODO: Add authentication header later if Cloud Run service is secured
            },
            body: JSON.stringify({ videoPath: inputFilePath }) // Send original video path
        });

        console.log(`[${requestTimestamp}] Extractor service response status:`, extractorResponse.status);
        const extractorData = await extractorResponse.json();

        if (!extractorResponse.ok || !extractorData.success || !extractorData.audioPath) {
            console.error('Extractor service error:', extractorData);
            throw new Error(`Audio extraction failed: ${extractorData.error || 'Unknown extractor error'}`);
        }

        audioFilePath = extractorData.audioPath; // Use the path returned by the extractor
        console.log(`[${requestTimestamp}] Extracted audio path received: ${audioFilePath}`);

    } else if (audioExtensions.includes(fileExtension)) {
        console.log(`[${requestTimestamp}] Audio file detected. Processing directly.`);
        audioFilePath = inputFilePath; // Process the original audio file
    } else {
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
    // --- End File Type Check ---


    // --- Process the AUDIO file (original or extracted) ---
    console.log(`[${requestTimestamp}] Downloading audio from Storage path: ${audioFilePath}`);
    const { data: blobData, error: downloadError } = await supabaseClient.storage.from('videos').download(audioFilePath);
    if (downloadError || !blobData) throw new Error(downloadError?.message || `Failed to download audio file: ${audioFilePath}`);
    console.log(`[${requestTimestamp}] Successfully downloaded audio file: ${audioFilePath}, size: ${blobData.size} bytes`);

    // --- Base64, Auth, STT Call (using audio data) ---
    console.log(`[${requestTimestamp}] Converting audio to Base64...`);
    const base64Audio = await blobToBase64(blobData);
    console.log(`[${requestTimestamp}] Audio converted to Base64 (length approx):`, base64Audio.length);

    const accessToken = await getGoogleAccessToken();
    const GOOGLE_CLOUD_REGION = 'europe-west4';
    const GOOGLE_STT_API_ENDPOINT_V2 = `https://<span class="math-inline">\{GOOGLE\_CLOUD\_REGION\}\-speech\.googleapis\.com/v2/projects/</span>{googleProjectId}/locations/${GOOGLE_CLOUD_REGION}/recognizers/_:recognize`;

    const requestBody = {
      config: {
        languageCodes: ['sq-AL'], model: 'chirp_2',
        features: { enableAutomaticPunctuation: true, enableWordTimeOffsets: true },
        // Use auto-detect now, assuming extractor outputs a compatible format (like WAV)
        // If extractor guarantees LINEAR16/16k, could switch back to explicit
        autoDecodingConfig: {}
      },
      content: base64Audio
    };

    console.log(`[${requestTimestamp}] Sending request to Google STT API V2 endpoint...`);
    const response = await fetch(GOOGLE_STT_API_ENDPOINT_V2, { /* ... fetch options ... */ body: JSON.stringify(requestBody) });
    console.log(`[${requestTimestamp}] Google STT API V2 Response Status:`, response.status, response.statusText);
    const responseData = await response.json();
    if (!response.ok) { /* ... error handling ... */ throw new Error(`Google STT API V2 request failed: ...`); }
    console.log(`[${requestTimestamp}] Google STT API V2 Success Response ...`);

    // --- Parse & Save Transcript ---
    const realTranscriptData = responseData.results?.map(result => { /* ... same parsing logic ... */ });
    console.log(`[${requestTimestamp}] Parsed real transcript data (V2):`, realTranscriptData);

    console.log(`[${requestTimestamp}] Attempting to insert REAL transcript into DB...`);
    // Link transcript to the ORIGINAL input file path, not the extracted audio path
    const { data: insertData, error: insertError } = await supabaseClient
      .from('transcripts')
      .insert({ video_path: inputFilePath, transcript_data: realTranscriptData })
      .select();
    if (insertError) throw new Error(`Database error: ${insertError.message}`);
    console.log(`[${requestTimestamp}] Successfully inserted REAL transcript into DB for ${inputFilePath}:`, insertData);

    // Return success
    console.log(`[${requestTimestamp}] Successfully processed ${inputFilePath}. Returning success.`);
    // Return the *original* path in the data field for consistency? Or the inserted data?
    // Let's return the inserted data record which includes the original path.
    return new Response( JSON.stringify({ success: true, message: `Successfully transcribed (V2)...`, data: insertData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    // Error handling remains the same, logs requestTimestamp and relevant file path
    console.error(`[${requestTimestamp}] Error processing ${inputFilePath || 'unknown file'}:`, error.message);
    console.error("Full error object:", error);
    console.log(`[${requestTimestamp}] Returning error response.`);
    return new Response( /* ... error response ... */);
  }
})