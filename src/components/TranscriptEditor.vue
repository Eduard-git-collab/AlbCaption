<script setup>
import { ref, onMounted, watch } from 'vue';
// Import the Supabase client - **** VERIFY THIS PATH ****
// Assuming supabaseClient.js is in src/lib/
import { supabase } from '../lib/supabaseClient.js';
// If supabaseClient.js is at root, use: import { supabase } from '../../supabaseClient.js';

// Define the props this component accepts from Upload.vue
const props = defineProps({
  videoPath: { // The path in Supabase Storage (e.g., 'user-uploads/123-video.mp4')
    type: String,
    required: true,
  },
  // Removed transcriptData prop - component will fetch its own
});

const videoUrl = ref(''); // Reactive variable to hold the final video URL
const fetchedSegments = ref([]); // Holds transcript data fetched from DB
const isLoading = ref(false); // Loading state for fetching transcript
const fetchError = ref(''); // Error state for fetching transcript
const STORAGE_BUCKET_NAME = 'videos'; // Match bucket name

// Function to fetch transcript data from the database
async function fetchTranscriptData() {
  if (!props.videoPath) {
    fetchError.value = "Video path is missing.";
    return;
  }
  console.log('[Editor] Fetching transcript for path:', props.videoPath);
  isLoading.value = true;
  fetchError.value = '';
  fetchedSegments.value = []; // Clear previous data

  try {
    const { data, error } = await supabase
      .from('transcripts') // Your table name
      .select('transcript_data') // Select only the transcript JSON column
      .eq('video_path', props.videoPath) // Find the row matching the video path
      .order('created_at', { ascending: false }) // Get the latest one if multiple exist
      .limit(1) // Ensure we only get one
      .maybeSingle(); // Expect only one row or null

    if (error) {
      throw error; // Throw DB errors
    }

    if (data && data.transcript_data) {
      console.log('[Editor] Fetched transcript data:', data.transcript_data);
      // Ensure it's an array before assigning
      fetchedSegments.value = Array.isArray(data.transcript_data) ? data.transcript_data : [];
    } else {
      console.warn('[Editor] No transcript data found in DB for path:', props.videoPath);
      fetchError.value = "Transcript data not found in database for this file.";
      fetchedSegments.value = []; // Ensure it's empty
    }
  } catch (error) {
    console.error('[Editor] Error fetching transcript data:', error);
    fetchError.value = `Failed to load transcript: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
}

// Function to get the public URL for the video
function getVideoUrl() {
   if (props.videoPath) {
       console.log('[Editor] Generating video URL for path:', props.videoPath);
       try {
            // Use getPublicUrl - assumes bucket is public or has public access policies for reads
            const { data } = supabase.storage.from(STORAGE_BUCKET_NAME).getPublicUrl(props.videoPath);
            if (data?.publicUrl) {
               console.log('[Editor] Generated Public URL:', data.publicUrl);
               videoUrl.value = data.publicUrl;
            } else {
                console.error('[Editor] Could not get public URL object for video:', props.videoPath);
                // Optionally try generating a signed URL if bucket isn't public - requires more setup
                // fetchError.value = "Could not generate video URL.";
             }
       } catch (error) {
            console.error('[Editor] Error getting public URL:', error);
            fetchError.value = `Error getting video URL: ${error.message}`;
        }
   } else { console.warn('[Editor] videoPath prop is missing for getUrl.'); }
}

// When the component is mounted OR when the videoPath prop changes,
// get the video URL and fetch the transcript data.
onMounted(() => {
  getVideoUrl();
  fetchTranscriptData();
});

// Watch for changes in the videoPath prop in case the component is reused
// This might happen if Upload.vue doesn't fully re-render
watch(() => props.videoPath, (newPath, oldPath) => {
  if (newPath && newPath !== oldPath) {
    console.log('[Editor] videoPath prop changed, refetching data...');
    getVideoUrl();
    fetchTranscriptData();
  }
});

// Placeholder for handling edits later (not saved in MVP)
function handleEdit(event, index) {
    console.log(`Edited segment ${index}:`, event.target.textContent);
    // TODO: Implement saving logic later
}

</script>

<template>
  <div class="editor-layout">
    <div class="editor-panel transcript-panel">
      <h2>Transcript</h2>
      <div v-if="isLoading" class="loading-indicator">Loading transcript...</div>
      <div v-else-if="fetchError" class="error-message">{{ fetchError }}</div>
      <div v-else-if="fetchedSegments.length > 0" class="transcript-content">
        <div v-for="(segment, index) in fetchedSegments" :key="index" class="transcript-segment">
          <span class="timestamp">{{ segment.timestamp }}</span>
          <p contenteditable="true" @blur="handleEdit($event, index)" spellcheck="false">{{ segment.text }}</p>
        </div>
      </div>
      <div v-else>
         <p>No transcript segments found.</p>
      </div>
    </div>

    <div class="editor-panel video-panel">
      <h2>Video Preview</h2>
      <div class="video-player-wrapper">
        <video v-if="videoUrl" :src="videoUrl" controls width="100%" :key="videoUrl"> Your browser does not support the video tag.
        </video>
        <div v-else class="video-loading">Generating video URL...</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles specific to TranscriptEditor */
.editor-layout { display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; margin-top: 2rem; }
.editor-panel { background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); padding: 20px; display: flex; flex-direction: column; overflow-y: auto; max-height: 70vh; }
.editor-panel h2 { font-size: 1.3rem; margin-top: 0; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #dee2e6; color: #333; }
.transcript-panel { flex: 1 1 50%; min-width: 300px; }
.video-panel { flex: 1 1 40%; min-width: 300px; max-height: none; }
.transcript-content { margin-top: 1rem; }
.transcript-segment { margin-bottom: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid #e9ecef; }
.transcript-segment:last-child { border-bottom: none; }
.transcript-segment .timestamp { font-size: 0.8rem; font-family: monospace; color: #6c757d; margin-bottom: 0.3rem; display: block; }
.transcript-segment p { line-height: 1.6; margin: 0; padding: 5px; border-radius: 4px; transition: background-color 0.2s ease; min-height: 1.6em; color: #212529; }
.transcript-segment p[contenteditable="true"]:focus { outline: none; background-color: #eef2ff; box-shadow: 0 0 0 2px #5e4ae3; }
.video-player-wrapper { width: 100%; aspect-ratio: 16 / 9; background-color: #000; border-radius: 8px; overflow: hidden; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; }
.video-player-wrapper video { display: block; width: 100%; height: 100%; }
.video-loading { color: #ccc; font-style: italic; }
.loading-indicator, .error-message { padding: 20px; text-align: center; font-style: italic; color: #6c757d; }
.error-message { color: #dc3545; font-weight: bold; }
</style>