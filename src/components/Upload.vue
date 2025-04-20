<template>
  <div v-if="!showEditor" class="upload-section-wrapper px-4 py-8"> <div class="flex flex-col items-center gap-4 max-w-lg mx-auto"> <h2 class="text-2xl font-semibold mb-4">Upload Your Audio/Video</h2> <label for="file-upload" class="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Select File (.wav, .mp3, .mp4)
      </label>
      <input
        id="file-upload"
        ref="fileInput"
        type="file"
        accept="video/mp4,audio/wav,audio/mpeg" @change="handleFileChange"
        class="hidden" />
       <p v-if="videoFile && !isUploading" class="text-sm text-gray-600 mt-2">Selected: {{ videoFile.name }}</p>

      <button
        @click="uploadVideo"
        class="px-6 py-2 bg-violet-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        :disabled="!videoFile || isUploading"
      >
        <span v-if="isUploading">Uploading & Processing...</span>
        <span v-else>Upload & Transcribe</span>
      </button>

      <div class="w-full max-w-md mt-4 text-center h-20">
          <div class="w-full h-3 bg-gray-300 rounded overflow-hidden mb-2" v-if="isUploading">
              <div
                  class="h-full bg-violet-500 transition-all duration-100 ease-linear"
                  :style="{ width: `${progress}%` }"
              ></div>
          </div>
          <p v-if="isUploading && processingMessage" class="text-sm text-gray-600">{{ processingMessage }}</p>

          <transition name="fade">
              <div
                  v-if="uploadSuccess && !isUploading && !showEditor"
                  class="inline-flex mt-2 items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow"
              >
                  <span>✅ Upload complete! Processing...</span>
              </div>
          </transition>

          <p v-if="uploadError" class="text-red-500 font-medium mt-2">{{ uploadError }}</p>
       </div>
       <p class="text-xs text-gray-500 mt-2">Max file size: {{ MAX_FILE_SIZE_MB }}MB</p>

      </div>
  </div>

  <div v-else-if="showEditor && videoPathForPlayer" class="editor-section-wrapper">
    <TranscriptEditor
      :video-path="videoPathForPlayer"
      />
    <div class="text-center my-6">
         <button @click="triggerFileInput" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
           Upload Another File
         </button>
     </div>
  </div>

  <div v-else-if="isUploading && uploadSuccess">
       <p class="text-center mt-8 text-gray-600">Loading Editor...</p>
   </div>

</template>

<script setup>

import { ref } from 'vue'
// *** IMPORTANT: Verify this path based on your structure ***
// If supabaseClient.js is in src/lib:
import { supabase } from '../lib/supabaseClient.js';
// If supabaseClient.js is at the root (less recommended):
// import { supabase } from '../../supabaseClient.js';

// Import the editor component
import TranscriptEditor from './TranscriptEditor.vue';

// --- Reactive Variables ---
const videoFile = ref(null)
const videoUrl = ref('') // URL for the preview *during* upload/processing maybe?
const uploadError = ref('')
const uploadSuccess = ref(false); // Primarily indicates storage upload success now
const processingMessage = ref(''); // Optional feedback message
const isUploading = ref(false); // Covers storage upload + function invocation
const fileInput = ref(null);
const progress = ref(0); // Simulated progress
const transcriptResult = ref(null);

// State for showing the editor and passing the path
const showEditor = ref(false);
const videoPathForPlayer = ref(''); // Will hold the storage path for the video

// --- Constants ---
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const STORAGE_BUCKET_NAME = 'videos';
const STORAGE_FOLDER_PATH = 'user-uploads';
const EDGE_FUNCTION_NAME = 'process-video';

// --- File Selection Handler ---
const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Reset states immediately on new file selection
    uploadError.value = '';
    uploadSuccess.value = false;
    videoUrl.value = '';
    videoFile.value = null;
    isUploading.value = false;
    progress.value = 0;
    showEditor.value = false; // Hide editor on new selection
    transcriptResult.value = null; // Keep this? Maybe remove if only editor fetches
    videoPathForPlayer.value = '';
    processingMessage.value = '';

    if (file) {
        if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) { // Allow audio too
            uploadError.value = 'Invalid file type. Please upload a video or audio file.';
            if (event.target) event.target.value = null;
            return;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            uploadError.value = `File is too large (max ${MAX_FILE_SIZE_MB}MB)`;
            if (event.target) event.target.value = null;
            return;
        }
        videoFile.value = file;
    } else {
       // No file selected
    }
    // Don't clear event.target.value here, allow re-selection if needed
};

// --- Upload and Process Function ---
const uploadVideo = async () => {
    if (!videoFile.value) {
        uploadError.value = "Please select a file first.";
        return;
    }

    // Reset states for new upload attempt
    isUploading.value = true;
    progress.value = 0;
    uploadSuccess.value = false;
    uploadError.value = '';
    videoUrl.value = ''; // Clear preview from previous upload
    showEditor.value = false;
    transcriptResult.value = null; // Reset this too
    videoPathForPlayer.value = '';
    processingMessage.value = 'Starting upload...';

    // --- Remove progress simulation for clarity ---
    // const fakeProgress = setInterval(() => { ... }, 150);

    const file = videoFile.value;
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${STORAGE_FOLDER_PATH}/${fileName}`;

    try {
        // === Step 1: Upload to Storage ===
        console.log(`[Frontend] Uploading to bucket '${STORAGE_BUCKET_NAME}' at path '${filePath}'...`);
        processingMessage.value = `Uploading ${file.name}...`;

        const { data: storageData, error: storageError } = await supabase.storage
            .from(STORAGE_BUCKET_NAME)
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

        // clearInterval(fakeProgress); // Remove if progress removed
        progress.value = 100; // Show full bar

        if (storageError) throw new Error(`Storage Error: ${storageError.message}`);
        console.log('[Frontend] Storage upload successful:', storageData);
        uploadSuccess.value = true; // Show checkmark for UPLOAD success

        // === Step 2: Invoke Edge Function ===
        console.log(`[Frontend] Invoking Edge Function '${EDGE_FUNCTION_NAME}'...`);
        processingMessage.value = `Upload complete. Processing transcript...`;

        const { data: functionData, error: functionError } = await supabase.functions.invoke(
            EDGE_FUNCTION_NAME,
            { body: { filePath: filePath } } // Pass the correct filePath variable
        );

        if (functionError) {
            const errorMsg = functionError.context?.error?.message || functionError.message || 'Edge function failed.';
            throw new Error(`Processing Error: ${errorMsg}`);
        }

        console.log('[Frontend] Edge Function response:', functionData);

        if (!functionData?.success || !functionData.data || !functionData.data[0]) {
            throw new Error(`Processing Error: ${functionData?.error || 'Function returned success:false or invalid data.'}`);
        }

        // === Step 3: Handle SUCCESSFUL processing ===
        // We don't need the transcript data here anymore, editor fetches it.
        // Just need the path to pass as a prop.
        videoPathForPlayer.value = functionData.data[0].video_path; // Get path confirmed by function

        if (videoPathForPlayer.value) {
            console.log('[Frontend] Processing successful, showing editor for path:', videoPathForPlayer.value);
            processingMessage.value = "Processing complete!";
            uploadSuccess.value = false; // Hide initial checkmark now editor will show
            showEditor.value = true; // <<< Trigger editor display
        } else {
            throw new Error('Processing succeeded but video path is missing in response.');
        }

    } catch (error) {
        // clearInterval(fakeProgress); // Remove if progress removed
        uploadError.value = error.message || "An unknown error occurred.";
        console.error('[Frontend] Error in uploadVideo:', error);
        uploadSuccess.value = false;
        showEditor.value = false;
    } finally {
        isUploading.value = false;
        progress.value = 0; // Reset progress bar

        // Clear the file input element visually ONLY if successful OR error occurred
        // Keep videoFile ref if needed for retry logic? Let's clear for now.
         if (fileInput.value) {
             fileInput.value.value = '';
         }
         videoFile.value = null;

        // Hide success message shortly after editor appears or if error
        if (uploadSuccess.value && !uploadError.value) {
             // This timeout might hide it too early if editor takes time to load.
             // Consider removing this timeout and managing messages differently.
            // setTimeout(() => { uploadSuccess.value = false; }, 1000);
        }
    }
}

// Function to trigger a new file selection (resets state)
function triggerFileInput() {
    uploadError.value = ''; uploadSuccess.value = false; videoUrl.value = '';
    videoFile.value = null; isUploading.value = false; progress.value = 0;
    showEditor.value = false; transcriptResult.value = null; videoPathForPlayer.value = '';
    processingMessage.value = '';
    fileInput.value?.click(); // Directly click hidden input
}

// We don't need the separate handleOrientationSelect or closeModal if the modal isn't used in template
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
