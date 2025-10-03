<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import SegmentRow from './subcomponents/SegmentRow.vue';

const route = useRoute();
const router = useRouter();
const transaction = ref(null);
const loading = ref(true);
const unauthorized = ref(false);

// Video player reference
const videoPlayer = ref(null);

// UI state properties
const isDownloadingSRT = ref(false);
const isDownloadingVideo = ref(false);
const downloadModal = ref (true);
const isSavingTranscript = ref(false);
const saveStatus = ref(null);

// Video playback properties
const currentVideoTime = ref(0);
const videoDuration = ref(0);
const isVideoPlaying = ref(false);

// Transcript related
const transcriptSegments = ref([]);
const currentSegmentIndex = ref(-1);
const maxWordsPerSegment = ref(15);
const segmentOverlapThreshold = ref(1.5);
const hasOriginalTranscription = ref(false);

// Filename editing
const originalFilenameLocal = ref('');
const isEditingFilename = ref(false);
const editedFilename = ref('');
const isSavingFilename = ref(false);
const filenameError = ref(null);
const filenameInput = ref(null);

// API URL - you'll need to configure this based on your environment
const apiUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:8000');

const hasUnsavedChanges = computed(() => {
  return transcriptSegments.value.some(s => s.originalText !== s.text || s.isEditing);
});

// Watch for transaction changes to initialize editor
watch(transaction, (newTransaction) => {
  if (newTransaction) {
    originalFilenameLocal.value = newTransaction.original_filename || '';
    if (newTransaction.transcription_json) {
      hasOriginalTranscription.value = true;
      createTranscriptSegments(newTransaction.transcription_json);
    }
  }
}, { immediate: true, deep: true });

onMounted(async () => {
  loading.value = true;
  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    unauthorized.value = true;
    loading.value = false;
    return;
  }
  const userId = session.user.id;

  // Fetch the transaction by ID
  const { data, error } = await supabase
    .from('transactions')
    .select('*, videos(id, video_url)')
    .eq('id', route.params.id)
    .single();

  if (error || !data) {
    transaction.value = null;
    unauthorized.value = true;
  } else if (data.user_id !== userId) {
    unauthorized.value = true;
    transaction.value = null;
  } else {
    transaction.value = {
      ...data,
      video_url: data.videos?.video_url || null,
    };
  }
  loading.value = false;

  // Setup video events after component is mounted
  nextTick(() => {
    if (videoPlayer.value) {
      setupVideoEvents();
    }
  });
});

// Filename edit handlers
function startEditingFilename() {
  isEditingFilename.value = true;
  editedFilename.value = originalFilenameLocal.value || '';
  filenameError.value = null;
  nextTick(() => filenameInput.value?.focus());
}

function cancelEditingFilename() {
  isEditingFilename.value = false;
  editedFilename.value = '';
  filenameError.value = null;
}

async function saveFilename() {
  if (!editedFilename.value.trim()) {
    filenameError.value = 'Filename cannot be empty';
    return;
  }
  if (!transaction.value?.processing_id) {
    filenameError.value = 'Processing ID not found';
    return;
  }

  isSavingFilename.value = true;
  filenameError.value = null;

  try {
    // Update in your API
    const response = await fetch(`${apiUrl.value}/update-filename/${transaction.value.processing_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_filename: editedFilename.value.trim() })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update filename');
    }

    // Update in Supabase
    const { error } = await supabase
      .from('transactions')
      .update({ 
        original_filename: editedFilename.value.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.value.id);

    if (error) throw error;

    originalFilenameLocal.value = editedFilename.value.trim();
    transaction.value.original_filename = editedFilename.value.trim();
    isEditingFilename.value = false;
    editedFilename.value = '';
    saveStatus.value = { type: 'text-green-600', message: 'Filename updated successfully' };
    setTimeout(() => { saveStatus.value = null; }, 3000);
  } catch (e) {
    console.error('Error updating filename:', e);
    filenameError.value = e.message;
  } finally {
    isSavingFilename.value = false;
  }
}

function handleFilenameKeydown(event) {
  if (event.key === 'Enter') saveFilename();
  else if (event.key === 'Escape') cancelEditingFilename();
}

// Video events and controls
function setupVideoEvents() {
  const video = videoPlayer.value;
  if (!video) return;
  
  video.addEventListener('loadedmetadata', () => {
    videoDuration.value = video.duration;
  });
  video.addEventListener('durationchange', () => {
    videoDuration.value = video.duration;
  });
}

function onVideoTimeUpdate() {
  const video = videoPlayer.value;
  if (video) {
    currentVideoTime.value = video.currentTime;
    updateCurrentSegment();
  }
}

function onVideoSeeking() {
  updateCurrentSegment();
}

function togglePlayback() {
  const video = videoPlayer.value;
  if (!video) return;
  if (video.paused) video.play();
  else video.pause();
}

function formatVideoTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function skipBackward(seconds) {
  const video = videoPlayer.value;
  if (!video) return;
  video.currentTime = Math.max(0, video.currentTime - seconds);
}

function skipForward(seconds) {
  const video = videoPlayer.value;
  if (!video) return;
  video.currentTime = Math.min(video.duration, video.currentTime + seconds);
}

// Segments creation and controls
function createTranscriptSegments(transcriptionJson = null) {
  const json = transcriptionJson || transaction.value?.transcription_json;
  if (!json || !json.results) return;

  let allWords = [];

  json.results.forEach(result => {
    if (result.words && Array.isArray(result.words)) {
      const wordsFromResult = result.words.map(word => ({
        text: word.word,
        startTime: extractTimeInSeconds(word.startOffset),
        endTime: extractTimeInSeconds(word.endOffset)
      }));
      allWords = [...allWords, ...wordsFromResult];
    }
  });

  if (allWords.length === 0 && json.results[0] && json.results[0].alternatives) {
    json.results.forEach(result => {
      if (result.alternatives && result.alternatives[0] && result.alternatives[0].words) {
        const wordsFromAlternative = result.alternatives[0].words.map(word => ({
          text: word.word,
          startTime: extractTimeInSeconds(word.startTime),
          endTime: extractTimeInSeconds(word.endTime)
        }));
        allWords = [...allWords, ...wordsFromAlternative];
      }
    });
  }

  allWords.sort((a, b) => a.startTime - b.startTime);

  const segments = [];
  let currentSegment = {
    words: [],
    startTime: 0,
    endTime: 0,
    text: '',
    originalText: '',
    editText: '',
    isEditing: false
  };

  for (const word of allWords) {
    if (currentSegment.words.length === 0) {
      currentSegment.startTime = word.startTime;
      currentSegment.words.push(word);
    } else if (
      currentSegment.words.length >= maxWordsPerSegment.value ||
      word.startTime - currentSegment.words[currentSegment.words.length - 1].endTime > segmentOverlapThreshold.value
    ) {
      currentSegment.endTime = currentSegment.words[currentSegment.words.length - 1].endTime;
      currentSegment.text = currentSegment.words.map(w => w.text).join(' ');
      currentSegment.originalText = currentSegment.text;
      currentSegment.editText = currentSegment.text;
      segments.push(currentSegment);

      currentSegment = {
        words: [word],
        startTime: word.startTime,
        endTime: 0,
        text: '',
        originalText: '',
        editText: '',
        isEditing: false
      };
    } else {
      currentSegment.words.push(word);
    }
  }

  if (currentSegment.words.length > 0) {
    currentSegment.endTime = currentSegment.words[currentSegment.words.length - 1].endTime;
    currentSegment.text = currentSegment.words.map(w => w.text).join(' ');
    currentSegment.originalText = currentSegment.text;
    currentSegment.editText = currentSegment.text;
    segments.push(currentSegment);
  }

  transcriptSegments.value = segments;
}

function reprocessSegments() {
  if (!hasOriginalTranscription.value) return;
  if (hasUnsavedChanges.value) {
    if (!confirm('You have unsaved changes. Reprocessing segments will discard these changes. Continue?')) {
      return;
    }
  }
  createTranscriptSegments();
  saveStatus.value = { type: 'text-blue-600', message: 'Segments reprocessed with new settings' };
  setTimeout(() => { saveStatus.value = null; }, 3000);
}

function beginEdit(index) {
  transcriptSegments.value.forEach((s, idx) => {
    if (idx !== index && s.isEditing) {
      s.isEditing = false;
      s.editText = s.text;
    }
  });
  transcriptSegments.value[index].isEditing = true;
  transcriptSegments.value[index].editText = transcriptSegments.value[index].text;
}

function saveSegment({ index, text }) {
  transcriptSegments.value[index].text = text;
  transcriptSegments.value[index].isEditing = false;
}

function cancelEdit(index) {
  transcriptSegments.value[index].isEditing = false;
  transcriptSegments.value[index].editText = transcriptSegments.value[index].text;
}

function playSegment(segment) {
  const video = videoPlayer.value;
  if (!video) return;
  video.currentTime = segment.startTime;
  video.play();
}

function playPreviousSegment() {
  if (currentSegmentIndex.value > 0) {
    playSegment(transcriptSegments.value[currentSegmentIndex.value - 1]);
  }
}

function playNextSegment() {
  if (currentSegmentIndex.value < transcriptSegments.value.length - 1) {
    playSegment(transcriptSegments.value[currentSegmentIndex.value + 1]);
  }
}

function updateCurrentSegment() {
  const currentTime = currentVideoTime.value;
  let newIndex = -1;

  for (let i = 0; i < transcriptSegments.value.length; i++) {
    const s = transcriptSegments.value[i];
    if (currentTime >= s.startTime && currentTime <= s.endTime) {
      newIndex = i;
      break;
    }
  }
  if (newIndex === -1) {
    for (let i = 0; i < transcriptSegments.value.length; i++) {
      if (currentTime < transcriptSegments.value[i].startTime) {
        break;
      }
      newIndex = i;
    }
  }
  currentSegmentIndex.value = newIndex;
  scrollToCurrentSegment();
}

function scrollToCurrentSegment() {
  nextTick(() => {
    if (currentSegmentIndex.value >= 0) {
      const segments = document.querySelectorAll('.mb-4.border.border-gray-200.rounded-md');
      if (segments && segments[currentSegmentIndex.value]) {
        segments[currentSegmentIndex.value].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });
}

function extractTimeInSeconds(timeObject) {
  if (!timeObject) return 0;
  if (typeof timeObject === 'object') {
    const seconds = typeof timeObject.seconds === 'string' ? parseInt(timeObject.seconds) : timeObject.seconds || 0;
    const nanos = timeObject.nanos || 0;
    return seconds + (nanos / 1_000_000_000);
  } else if (typeof timeObject === 'string') {
    if (timeObject.includes('s')) return parseFloat(timeObject.replace('s', ''));
    if (timeObject.includes(':')) {
      const parts = timeObject.split(':');
      let seconds = 0;
      if (parts.length === 3) {
        seconds = (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseFloat(parts[2]);
      } else if (parts.length === 2) {
        seconds = (parseInt(parts[0]) * 60) + parseFloat(parts[1]);
      }
      return seconds;
    }
    return parseFloat(timeObject);
  }
  return Number(timeObject) || 0;
}

async function downloadSRT() {
  if (!transaction.value?.processing_id) return;
  
  if (hasUnsavedChanges.value) {
    saveStatus.value = { type: 'text-red-600', message: 'Please save all transcript edits before downloading the SRT file.' };
    setTimeout(() => { saveStatus.value = null; }, 2500);
    return;
  }

  isDownloadingSRT.value = true;
  
  try {
    const downloadUrl = `${apiUrl.value}/download-srt/${transaction.value.processing_id}?t=${Date.now()}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${originalFilenameLocal.value ? originalFilenameLocal.value.replace(/\.[^/.]+$/, '') : 'transcript'}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('SRT download error:', e);
    saveStatus.value = { type: 'text-red-600', message: `Failed to download SRT file: ${e.message || 'Unknown error'}` };
  } finally {
    isDownloadingSRT.value = false;
  }
}

function copyTranscript() {
  const fullText = transcriptSegments.value.map(s => s.text).join(' ');
  navigator.clipboard.writeText(fullText)
    .then(() => {
      saveStatus.value = { type: 'text-blue-600', message: 'Transcript copied to clipboard' };
      setTimeout(() => { saveStatus.value = null; }, 2000);
    })
    .catch(err => {
      console.error('Could not copy text: ', err);
      saveStatus.value = { type: 'text-red-600', message: 'Failed to copy transcript' };
    });
}

const downloadEmbeddedCaptionsModal = () =>{
  downloadModal.value = true
}

const closeDownloadModal = () =>{
  downloadModal.value = false
}

function buildTranscriptForRender() {
  return {
    segments: transcriptSegments.value.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
      text: s.text,
      words: (s.words || []).map(w => ({
        text: w.text,
        startTime: w.startTime,
        endTime: w.endTime
      }))
    }))
  };
}

async function downloadEmbeddedCaptions() {
  if (hasUnsavedChanges.value) {
    saveStatus.value = { type: 'text-red-600', message: 'Please save all transcript edits before downloading the video.' };
    setTimeout(() => { saveStatus.value = null }, 2500);
    return;
  }
  if (!props.videoUrl) {
    saveStatus.value = { type: 'text-red-600', message: 'Video URL is missing.' };
    setTimeout(() => { saveStatus.value = null }, 2500);
    return;
  }
  isDownloadingVideo.value = true;
  try {
    const transcript = buildTranscriptForRender();
    const res = await fetch(`${props.apiUrl}/render-captioned-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoPath: props.videoUrl,
        transcript,
        style: { fontName: 'Noto Sans', fontSize: 72, outline: 6, borderStyle: 1, alignment: 2, karaoke: true },
        output: { width: 1080, height: 1920 }
      })
    });
    if (!res.ok) {
      let err = {};
      try { err = await res.json(); } catch {}
      throw new Error(err.error || `Render failed (${res.status})`);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const base = (props.originalFilename || '').replace(/\.[^/.]+$/, '') || 'video';
    a.href = url;
    a.download = `${base}-captioned.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    saveStatus.value = { type: 'text-green-600', message: 'Video downloaded successfully' };
    setTimeout(() => { saveStatus.value = null }, 3000);
  } catch (e) {
    console.error(e);
    saveStatus.value = { type: 'text-red-600', message: e.message || 'Unknown error' };
  } finally {
    isDownloadingVideo.value = false;
  }
}

</script>

<template>
  <div class="min-h-screen text-white font-poppins p-6">
    <div class="container mx-auto">
      <div v-if="loading" class="text-center py-24 text-xl text-[#92a3bb]">
        Loading transaction details...
      </div>
      <div v-else-if="unauthorized" class="text-center py-24 text-red-400 text-xl">
        Unauthorized. You do not have permission to view this transaction.
      </div>
      <div v-else-if="transaction" class="max-w-6xl mx-auto font-poppins">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- Transcript Panel -->
          <div class="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-[#FBFCFB] border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h2 class="text-lg text-kollektif-bold text-primary">Segmentet e transkriptuara</h2>
              <div class="flex space-x-2">
                <button 
                  @click="copyTranscript" 
                  class="px-2 py-1 text-xs bg-secondary text-primary rounded hover:bg-[#7ED089] transition-colors flex items-center"
                >
                  <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Kopjo
                </button>
                <button 
                  @click="downloadSRT" 
                  class="px-2 py-1 text-xs bg-secondary text-primary rounded hover:bg-[#7ED089] transition-colors flex items-center"
                  :disabled="isDownloadingSRT || hasUnsavedChanges"
                  :class="{ 'opacity-50 cursor-not-allowed': isDownloadingSRT || hasUnsavedChanges }"
                >
                  <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {{ isDownloadingSRT ? 'Downloading...' : 'Shkarko SRT/VTT' }}
                </button>

                <!--Download embedded captions (burned-in) -->
                <button
                  @click="downloadEmbeddedCaptionsModal"
                  class="px-2 py-1 text-xs bg-secondary text-primary rounded hover:bg-[#7ED089] transition-colors flex items-center"
                  :disabled="isDownloadingVideo || hasUnsavedChanges"
                  :class="{ 'opacity-50 cursor-not-allowed': isDownloadingVideo || hasUnsavedChanges }"
                >
                  {{ isDownloadingVideo ? 'Downloading...' : 'Download embedded captions' }}
                </button>

                <button 
                  v-if="hasUnsavedChanges"
                  @click="saveAllSegments" 
                  class="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-[#033027] transition-colors flex items-center"
                  :disabled="isSavingTranscript"
                >
                  <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Ruaj të gjitha
                </button>
              </div>
            </div>

            <!-- Transcript Segments -->
            <div class="p-4">
              <div class="h-[calc(100vh-250px)] overflow-y-auto">
                <SegmentRow
                  v-for="(segment, index) in transcriptSegments"
                  :key="index"
                  :index="index"
                  :segment="segment"
                  :current-video-time="currentVideoTime"
                  :is-current="currentSegmentIndex === index"
                  @play="playSegment"
                  @begin-edit="beginEdit"
                  @save="saveSegment"
                  @cancel-edit="cancelEdit"
                />
                <p v-if="saveStatus" class="text-sm mt-2" :class="saveStatus.type">
                  {{ saveStatus.message }}
                </p>
              </div>
            </div>
          </div>

          <!-- Video Panel -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-[#FBFCFB] border-b border-gray-200 px-4 py-3">
              <!-- Display mode -->
              <div v-if="!isEditingFilename" class="flex items-center justify-between">
                <h2 class="text-lg text-kollektif-bold text-primary">{{ originalFilenameLocal }}</h2>
                <button 
                  @click="startEditingFilename"
                  class="ml-2 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-[#033027] transition-colors"
                >
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edito
                </button>
              </div>
              <!-- Edit mode -->
              <div v-else class="space-y-2">
                <div class="flex items-center space-x-2">
                  <input
                    ref="filenameInput"
                    v-model="editedFilename"
                    @keydown="handleFilenameKeydown"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 font-poppins"
                    placeholder="Enter filename"
                  />
                  <button
                    @click="saveFilename"
                    :disabled="isSavingFilename"
                    class="px-3 py-2 bg-secondary text-primary rounded hover:bg-[#7ED089] disabled:opacity-50 transition-colors text-sm"
                  >
                    <svg v-if="isSavingFilename" class="w-4 h-4 inline mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {{ isSavingFilename ? 'Duke u ruajtur...' : 'Ruaj' }}
                  </button>
                  <button
                    @click="cancelEditingFilename"
                    :disabled="isSavingFilename"
                    class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors text-sm"
                  >
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Anulo
                  </button>
                </div>
                <p v-if="filenameError" class="text-red-600 text-sm flex items-center font-poppins">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  {{ filenameError }}
                </p>
              </div>
            </div>

            <div class="p-4">
              <!-- Video Player -->
              <div class="relative aspect-video bg-black rounded overflow-hidden">
                <video 
                  ref="videoPlayer" 
                  class="w-full h-full object-contain"
                  controls
                  @timeupdate="onVideoTimeUpdate"
                  @play="isVideoPlaying = true"
                  @pause="isVideoPlaying = false"
                  @seeking="onVideoSeeking"
                  :src="transaction.video_url"
                ></video>
              </div>

              <!-- Custom Video Controls -->
              <div class="mt-4 flex items-center justify-between px-2 py-2 bg-[#FBFCFB] rounded">
                <div class="flex items-center space-x-3">
                  <button 
                    @click="togglePlayback" 
                    class="p-1.5 rounded-full bg-white shadow hover:bg-[#F4F9F7]"
                  >
                    <svg v-if="isVideoPlaying" class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7-.75a.75.75 0 00-.75.75v13.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-1.5z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    @click="skipBackward(5)"
                    class="flex items-center text-xs font-medium text-primary px-2 py-1 hover:bg-[#F4F9F7] rounded"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"></path>
                    </svg>
                    5s
                  </button>
                </div>
                
                <div class="text-xs font-medium text-gray-600">
                  {{ formatVideoTime(currentVideoTime) }} / {{ formatVideoTime(videoDuration) }}
                </div>
                
                <button 
                  @click="skipForward(5)"
                  class="flex items-center text-xs font-medium text-primary px-2 py-1 hover:bg-[#F4F9F7] rounded"
                >
                  5s
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Segment Controls -->
              <div class="mt-4 flex justify-between">
                <button 
                  @click="playPreviousSegment"
                  class="flex items-center text-sm font-medium text-primary px-3 py-1.5 bg-[#FBFCFB] hover:bg-[#F4F9F7] rounded transition-colors"
                  :disabled="currentSegmentIndex <= 0"
                  :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex <= 0 }"
                >
                  <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Para
                </button>
                <button 
                  @click="playNextSegment"
                  class="flex items-center text-sm font-medium text-primary px-3 py-1.5 bg-[#FBFCFB] hover:bg-[#F4F9F7] rounded transition-colors"
                  :disabled="currentSegmentIndex >= transcriptSegments.length - 1"
                  :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex >= transcriptSegments.length - 1 }"
                >
                  Pas
                  <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Segment settings -->
            <div class="mt-4 px-4 pb-4">
              <div class="border border-gray-200 rounded-md p-3">
                <h3 class="text-sm text-kollektif-bold text-primary mb-2">Segmentation Settings</h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs text-gray-600 mb-1 font-poppins">Max words per segment</label>
                    <div class="flex items-center">
                      <input 
                        type="range" 
                        v-model.number="maxWordsPerSegment"
                        min="5" 
                        max="30" 
                        step="1"
                        class="w-full h-2 bg-[#FBFCFB] rounded-lg appearance-none cursor-pointer"
                      />
                      <span class="ml-2 text-sm font-medium w-8 text-gray-700 font-poppins">{{ maxWordsPerSegment }}</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 mb-1 font-poppins">Pause threshold (seconds)</label>
                    <div class="flex items-center">
                      <input 
                        type="range" 
                        v-model.number="segmentOverlapThreshold"
                        min="0.5" 
                        max="3" 
                        step="0.1"
                        class="w-full h-2 bg-[#FBFCFB] rounded-lg appearance-none cursor-pointer"
                      />
                      <span class="ml-2 text-sm font-medium w-8 text-gray-700 font-poppins">{{ segmentOverlapThreshold.toFixed(1) }}</span>
                    </div>
                  </div>
                  <button 
                    @click="reprocessSegments"
                    class="w-full px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-[#033027] transition-colors mt-2"
                    :disabled="!hasOriginalTranscription"
                  >
                    Reprocess Segments
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-24 text-[#92a3bb]">
        Transaction not found.
      </div>
    </div>
  </div>
  <teleport to="body">
    <div 
      v-if="downloadModal" 
      class="fixed inset-0 z-[1000] flex items-center justify-center">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/30 backdrop-blur-sm"
      @click="closeDownloadModal"
    />
    <!-- Content wrapper -->
    <div class="w-full h-full md:w-[1020px] md:h-[595px] px-4 md:px-8 py-6 relative z-10">
      <div class="w-full h-full bg-white relative rounded-xl shadow-xl overflow-hidden">
        <!-- Close button -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer z-20"
          @click="closeDownloadModal"
          aria-label="Mbyll"
        >
          ✕
        </button>
      </div>
      </div>
    </div>
  </teleport> 
</template>

<style scoped>
/* Range inputs */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 5px;  
  outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%; 
  background: #052B28;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #052B28;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style>