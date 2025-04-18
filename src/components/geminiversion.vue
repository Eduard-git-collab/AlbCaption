<!-- <script setup>
/*
import { ref } from 'vue';
import { supabase } from '../lib/supabase/supabaseClient';

// Reactive variables
const selectedFile = ref(null);
const showOrientationModal = ref(false);
const selectedOrientation = ref('');
const fileInputRef = ref(null);
const isUploading = ref(false); // Combined state for storage upload + function invoke
const uploadError = ref('');
const uploadSuccess = ref('');

// --- Constants ---
const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const STORAGE_BUCKET_NAME = 'videos'; // Must match the bucket name in Supabase
const EDGE_FUNCTION_NAME = 'process-video'; // Name of our deployed function

// --- CORRECTED uploadVideoAndProcess Function ---
// === START OF CORRECTED FUNCTION TO PASTE ===
async function uploadVideoAndProcess(file, orientation) {
  if (!file) return;

  isUploading.value = true;
  uploadError.value = '';
  uploadSuccess.value = '';
  let filePath = ''; // Declare filePath with let *before* the try block

  try {
    // --- Step 1: Upload to Storage ---
    // Assign the value inside the try block using CORRECT backticks and ${} syntax
    filePath = `public/${Date.now()}-${file.name}`; // <<< CORRECT ASSIGNMENT

    // Log the correctly constructed path
   console.log(`[Frontend] Uploading to bucket '${STORAGE_BUCKET_NAME}' at path '${filePath}'...`);
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from(STORAGE_BUCKET_NAME)
      .upload(filePath, file, { // Use the filePath variable
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) {
      console.error('[Frontend] Supabase storage upload error:', storageError);
      throw new Error(storageError.message || 'Failed to upload file to storage.');
    }
    console.log('[Frontend] Storage upload successful:', storageData);

    // --- Step 2: Invoke Edge Function ---
    console.log(`[Frontend] Invoking Edge Function '${EDGE_FUNCTION_NAME}'...`);
    uploadSuccess.value = `Upload complete. Starting processing...`; // Update UI feedback earlier

    const { data: functionData, error: functionError } = await supabase.functions.invoke(
      EDGE_FUNCTION_NAME,
      {
        body: { filePath: filePath } // Use the filePath variable
      }
    )

    if (functionError) {
      console.error('[Frontend] Edge Function invocation error:', functionError);
      const errorMsg = functionError.context?.error?.message || functionError.message || 'Processing failed.';
      throw new Error(`Edge Function error: ${errorMsg}`);
    }

    console.log('[Frontend] Edge Function response:', functionData);
    uploadSuccess.value = `File processed (simulated) successfully for: ${file.name}!`;

  } catch (err) {
    console.error('[Frontend] uploadVideoAndProcess error:', err);
    uploadError.value = `Error: ${err.message}`;
  } finally {
    isUploading.value = false;
  }
}
// === END OF CORRECTED FUNCTION TO PASTE ===


// --- Other Helper Functions ---
function triggerFileInput() {
  selectedFile.value = null;
  selectedOrientation.value = '';
  isUploading.value = false;
  uploadError.value = '';
  uploadSuccess.value = '';
  showOrientationModal.value = true;
}

function handleOrientationSelect(orientation) {
  selectedOrientation.value = orientation;
  showOrientationModal.value = false;
  fileInputRef.value?.click();
}

async function handleFileChange(event) {
  const file = event.target.files[0];
  uploadError.value = '';
  uploadSuccess.value = '';

  if (file) {
    selectedFile.value = file;
    console.log('[Frontend] File Selected:', file.name, 'Size:', file.size);
    console.log('[Frontend] Selected Orientation:', selectedOrientation.value);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      console.error('[Frontend] File exceeds max size:', MAX_FILE_SIZE_MB, 'MB');
      uploadError.value = `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
      resetFileInput();
      return;
    }

    // Call the upload function
    await uploadVideoAndProcess(file, selectedOrientation.value || 'unknown');

  }
   resetFileInput();
}


function closeModal() {
    showOrientationModal.value = false;
}

function resetFileInput() {
    if (fileInputRef.value) {
        fileInputRef.value.value = null;
    }
}

*/
</script>

<template>
  <div class="upload-component">
    <h2>Upload Your Video</h2>
    <p class="upload-hint">Max file size: {{ MAX_FILE_SIZE_MB }}MB (Free tier).</p>

    <button @click="triggerFileInput" class="btn btn-primary btn-large" :disabled="isUploading">
      <span v-if="isUploading">Uploading...</span>
      <span v-else>Choose a Video</span>
    </button>

    <input
      type="file"
      ref="fileInputRef"
      @change="handleFileChange"
      accept="video/*"
      style="display: none;"
      :disabled="isUploading"
    />

    <div v-if="isUploading" class="feedback-area uploading">
        Working on it... Please wait.
        <div class="spinner"></div>
    </div>
     <div v-if="uploadSuccess" class="feedback-area success">
         {{ uploadSuccess }}
     </div>
     <div v-if="uploadError" class="feedback-area error">
         {{ uploadError }}
     </div>

    <div v-if="selectedFile && !isUploading && !uploadSuccess && !uploadError" class="file-info">
      Selected: {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB) - Orientation: {{ selectedOrientation || 'N/A' }}
    </div>

    <div v-if="showOrientationModal" class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close-btn">&times;</span>
        <h3>Select Video Orientation</h3>
        <div class="orientation-buttons">
          <button @click="handleOrientationSelect('vertical')" class="btn btn-secondary">Vertical</button>
          <button @click="handleOrientationSelect('horizontal')" class="btn btn-secondary">Horizontal</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Styles specific to this component */
.upload-component {
  padding: 80px 20px;
  text-align: center;
  background-color: #ffffff;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}
.upload-hint { color: #888; margin-bottom: 2rem; font-size: 0.9rem; }
.file-info {
  margin-top: 1.5rem; font-size: 0.9rem; color: #555;
  padding: 10px; background-color: #f8f9fa; border-radius: 6px;
  display: inline-block;
}

/* Feedback Area Styles */
 .feedback-area {
    margin-top: 1.5rem;
    padding: 15px;
    border-radius: 8px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 400px; /* Limit width */
    margin-left: auto;
    margin-right: auto;
 }
 .feedback-area.uploading { color: #495057; background-color: #e9ecef; border: 1px solid #ced4da;}
 .feedback-area.success { color: #155724; background-color: #d4edda; border: 1px solid #c3e6cb;}
 .feedback-area.error { color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb;}

/* Basic Spinner */
.spinner {
    border: 3px solid rgba(0, 0, 0, 0.1);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border-left-color: var(--primary-color, #5e4ae3); /* Use primary color if defined */
    animation: spin 1s ease infinite;
    margin-left: 10px; /* Space from text */
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}


/* Modal styles from previous step (ensure they are present) */
.modal { position: fixed; z-index: 1010; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; }
.modal-content { background-color: #fff; padding: 30px 40px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); width: 90%; max-width: 400px; position: relative; text-align: center; }
.modal-content h3 { margin-top: 0; margin-bottom: 1.5rem; color: #333;}
.close-btn { position: absolute; top: 10px; right: 15px; color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; line-height: 1; }
.close-btn:hover { color: #333; }
.orientation-buttons { display: flex; justify-content: center; gap: 20px; margin-top: 1rem; }

/* Basic Button Styles (Refine later with global styles) */
.btn { display: inline-block; padding: 10px 20px; font-size: 1rem; font-weight: 500; text-align: center; border: 1px solid transparent; border-radius: 8px; cursor: pointer; transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 3px 6px rgba(0,0,0,0.08); }
.btn-primary { background-color: #5e4ae3; color: white; border: none;}
.btn-primary:hover:not(:disabled) { background-color: #4a38c3; }
.btn-secondary { background-color: #f8f9fa; color: #333; border-color: #dee2e6;}
.btn-secondary:hover:not(:disabled) { background-color: #e9ecef; }
.btn-large { padding: 15px 30px; font-size: 1.1rem;}
</style> -->