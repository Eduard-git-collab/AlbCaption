<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import SegmentRow from './SegmentRow.vue'
import apiClient from '@/stores/apiClient'

const props = defineProps({
  apiUrl: { type: String, required: true },
  processingId: { type: String, required: true },
  videoUrl: { type: String, default: null },
  originalTranscriptionJson: { type: Object, default: null },
  originalFilename: { type: String, default: '' }
})

const videoPlayer = ref(null)

// UI state properties
const isDownloadingSRT = ref(false)
const isDownloadingVideo = ref(false)
const downloadModal = ref(false)
const isSavingTranscript = ref(false)
const saveStatus = ref(null)
const showSubtitleDropdown = ref(false)

// Video playback properties
const currentVideoTime = ref(0)
const videoDuration = ref(0)
const isVideoPlaying = ref(false)

// Transcript related
const transcriptSegments = ref([])
const currentSegmentIndex = ref(-1)
const maxWordsPerSegment = ref(15)
const segmentOverlapThreshold = ref(1.5)
const hasOriginalTranscription = ref(false)

// Filename editing
const originalFilenameLocal = ref(props.originalFilename || '')
const isEditingFilename = ref(false)
const editedFilename = ref('')
const isSavingFilename = ref(false)
const filenameError = ref(null)
const filenameInput = ref(null)

// Modal State
const selectedPresetId = ref('karaoke')

// --- PRESETS CONFIGURATION ---
// Aligned with transcriptToAss backend logic
const captionPresets = [
  {
    id: 'karaoke',
    name: 'Karaoke (Active)',
    description: 'Green highlight on spoken words.',
    previewCss: { color: '#9FE29E', textShadow: '2px 2px 0 #000', background: 'transparent' },
    backendOpts: {
      karaoke: true,
      primaryColour: '&H009EE29F&',   // Active Word (Green)
      secondaryColour: '&H00FFFFFF&', // Inactive Word (White)
      outlineColour: '&H00000000&',   // Black Outline
      backColour: '&H00000000&',
      borderStyle: 1, // Outline
      outline: 4,
      fontSize: 72
    }
  },
  {
    id: 'classic',
    name: 'Classic White',
    description: 'Clean white text with outline.',
    previewCss: { color: '#FFFFFF', textShadow: '2px 2px 0 #000', background: 'transparent' },
    backendOpts: {
      karaoke: false,
      primaryColour: '&H00FFFFFF&',   // White
      secondaryColour: '&H00FFFFFF&',
      outlineColour: '&H00000000&',   // Black
      backColour: '&H00000000&',
      borderStyle: 1, // Outline
      outline: 4,
      fontSize: 72
    }
  },
  {
    id: 'boxed',
    name: 'Boxed Background',
    description: 'White text on semi-transparent box.',
    previewCss: { color: '#FFFFFF', textShadow: 'none', background: 'rgba(0,0,0,0.6)' },
    backendOpts: {
      karaoke: false,
      primaryColour: '&H00FFFFFF&',   // White
      secondaryColour: '&H00FFFFFF&',
      outlineColour: '&H00000000&',
      backColour: '&H80000000&',      // Semi-transparent Black
      borderStyle: 3, // Opaque Box
      outline: 0,
      fontSize: 64
    }
  }
]

const hasUnsavedChanges = computed(() => {
  return transcriptSegments.value.some(s => s.originalText !== s.text || s.isEditing)
})

// Computed Preview Style
const currentPreviewStyle = computed(() => {
  const preset = captionPresets.find(p => p.id === selectedPresetId.value) || captionPresets[0];
  return {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '900',
    fontSize: '32px',
    textAlign: 'center',
    lineHeight: '1.4',
    padding: preset.backendOpts.borderStyle === 3 ? '8px 16px' : '0',
    borderRadius: preset.backendOpts.borderStyle === 3 ? '6px' : '0',
    color: preset.previewCss.color,
    textShadow: preset.previewCss.textShadow,
    backgroundColor: preset.previewCss.background,
    position: 'absolute',
    bottom: '30px', 
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    whiteSpace: 'normal'
  };
});

watch(() => props.originalTranscriptionJson, (newJson) => {
  if (newJson) {
    hasOriginalTranscription.value = true
    createTranscriptSegments()
  }
}, { immediate: true, deep: true })

onMounted(() => {
  nextTick(() => {
    if (videoPlayer.value) {
      setupVideoEvents()
    }
  })
})

// Filename edit handlers
function startEditingFilename() {
  isEditingFilename.value = true
  editedFilename.value = originalFilenameLocal.value || ''
  filenameError.value = null
  nextTick(() => filenameInput.value?.focus())
}

function cancelEditingFilename() {
  isEditingFilename.value = false
  editedFilename.value = ''
  filenameError.value = null
}

async function saveFilename() {
  if (!editedFilename.value.trim()) {
    filenameError.value = 'Filename cannot be empty'
    return
  }
  if (!props.processingId) {
    filenameError.value = 'Processing ID not found'
    return
  }
  isSavingFilename.value = true
  filenameError.value = null
  try {
    const response = await fetch(`${props.apiUrl}/update-filename/${props.processingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_filename: editedFilename.value.trim() })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update filename')
    }
    originalFilenameLocal.value = editedFilename.value.trim()
    isEditingFilename.value = false
    editedFilename.value = ''
    saveStatus.value = { type: 'text-green-600', message: 'Filename updated successfully' }
    setTimeout(() => { saveStatus.value = null }, 3000)
  } catch (e) {
    console.error('Error updating filename:', e)
    filenameError.value = e.message
  } finally {
    isSavingFilename.value = false
  }
}

function handleFilenameKeydown(event) {
  if (event.key === 'Enter') saveFilename()
  else if (event.key === 'Escape') cancelEditingFilename()
}

// Video events and controls
function setupVideoEvents() {
  const video = videoPlayer.value
  if (!video) return
  video.addEventListener('loadedmetadata', () => {
    videoDuration.value = video.duration
  })
  video.addEventListener('durationchange', () => {
    videoDuration.value = video.duration
  })
}

function onVideoTimeUpdate() {
  const video = videoPlayer.value
  if (video) {
    currentVideoTime.value = video.currentTime
    updateCurrentSegment()
  }
}

function onVideoSeeking() {
  updateCurrentSegment()
}

function togglePlayback() {
  const video = videoPlayer.value
  if (!video) return
  if (video.paused) video.play()
  else video.pause()
}

function formatVideoTime(seconds) {
  if (isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function skipBackward(seconds) {
  const video = videoPlayer.value
  if (!video) return
  video.currentTime = Math.max(0, video.currentTime - seconds)
}

function skipForward(seconds) {
  const video = videoPlayer.value
  if (!video) return
  video.currentTime = Math.min(video.duration, video.currentTime + seconds)
}

// Segments creation and controls
function createTranscriptSegments() {
  const json = props.originalTranscriptionJson
  if (!json || !json.results) return

  let allWords = []

  json.results.forEach(result => {
    if (result.words && Array.isArray(result.words)) {
      const wordsFromResult = result.words.map(word => ({
        text: word.word,
        startTime: extractTimeInSeconds(word.startOffset),
        endTime: extractTimeInSeconds(word.endOffset)
      }))
      allWords = [...allWords, ...wordsFromResult]
    }
  })

  if (allWords.length === 0 && json.results[0] && json.results[0].alternatives) {
    json.results.forEach(result => {
      if (result.alternatives && result.alternatives[0] && result.alternatives[0].words) {
        const wordsFromAlternative = result.alternatives[0].words.map(word => ({
          text: word.word,
          startTime: extractTimeInSeconds(word.startTime),
          endTime: extractTimeInSeconds(word.endTime)
        }))
        allWords = [...allWords, ...wordsFromAlternative]
      }
    })
  }

  allWords.sort((a, b) => a.startTime - b.startTime)

  const segments = []
  let currentSegment = {
    words: [],
    startTime: 0,
    endTime: 0,
    text: '',
    originalText: '',
    editText: '',
    isEditing: false
  }

  for (const word of allWords) {
    if (currentSegment.words.length === 0) {
      currentSegment.startTime = word.startTime
      currentSegment.words.push(word)
    } else if (
      currentSegment.words.length >= maxWordsPerSegment.value ||
      word.startTime - currentSegment.words[currentSegment.words.length - 1].endTime > segmentOverlapThreshold.value
    ) {
      currentSegment.endTime = currentSegment.words[currentSegment.words.length - 1].endTime
      currentSegment.text = currentSegment.words.map(w => w.text).join(' ')
      currentSegment.originalText = currentSegment.text
      currentSegment.editText = currentSegment.text
      segments.push(currentSegment)

      currentSegment = {
        words: [word],
        startTime: word.startTime,
        endTime: 0,
        text: '',
        originalText: '',
        editText: '',
        isEditing: false
      }
    } else {
      currentSegment.words.push(word)
    }
  }

  if (currentSegment.words.length > 0) {
    currentSegment.endTime = currentSegment.words[currentSegment.words.length - 1].endTime
    currentSegment.text = currentSegment.words.map(w => w.text).join(' ')
    currentSegment.originalText = currentSegment.text
    currentSegment.editText = currentSegment.text
    segments.push(currentSegment)
  }

  transcriptSegments.value = segments
}

function reprocessSegments() {
  if (!hasOriginalTranscription.value) return
  if (hasUnsavedChanges.value) {
    if (!confirm('You have unsaved changes. Reprocessing segments will discard these changes. Continue?')) {
      return
    }
  }
  createTranscriptSegments()
  saveStatus.value = { type: 'text-blue-600', message: 'Segments reprocessed with new settings' }
  setTimeout(() => { saveStatus.value = null }, 3000)
}

function beginEdit(index) {
  transcriptSegments.value.forEach((s, idx) => {
    if (idx !== index && s.isEditing) {
      s.isEditing = false
      s.editText = s.text
    }
  })
  transcriptSegments.value[index].isEditing = true
  transcriptSegments.value[index].editText = transcriptSegments.value[index].text
}

function cancelEdit(index) {
  transcriptSegments.value[index].isEditing = false
  transcriptSegments.value[index].editText = transcriptSegments.value[index].text
}

function playSegment(segment) {
  const video = videoPlayer.value
  if (!video) return
  video.currentTime = segment.startTime
  video.play()
}

function playPreviousSegment() {
  if (currentSegmentIndex.value > 0) {
    playSegment(transcriptSegments.value[currentSegmentIndex.value - 1])
  }
}

function playNextSegment() {
  if (currentSegmentIndex.value < transcriptSegments.value.length - 1) {
    playSegment(transcriptSegments.value[currentSegmentIndex.value + 1])
  }
}

function updateCurrentSegment() {
  const currentTime = currentVideoTime.value
  let newIndex = -1

  for (let i = 0; i < transcriptSegments.value.length; i++) {
    const s = transcriptSegments.value[i]
    if (currentTime >= s.startTime && currentTime <= s.endTime) {
      newIndex = i
      break
    }
  }
  if (newIndex === -1) {
    for (let i = 0; i < transcriptSegments.value.length; i++) {
      if (currentTime < transcriptSegments.value[i].startTime) {
        break
      }
      newIndex = i
    }
  }
  currentSegmentIndex.value = newIndex
  scrollToCurrentSegment()
}

function scrollToCurrentSegment() {
  nextTick(() => {
    if (currentSegmentIndex.value >= 0) {
      const segments = document.querySelectorAll('.mb-4.border.border-gray-200.rounded-md')
      if (segments && segments[currentSegmentIndex.value]) {
        segments[currentSegmentIndex.value].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  })
}

function extractTimeInSeconds(timeObject) {
  if (!timeObject) return 0
  if (typeof timeObject === 'object') {
    const seconds = typeof timeObject.seconds === 'string' ? parseInt(timeObject.seconds) : timeObject.seconds || 0
    const nanos = timeObject.nanos || 0
    return seconds + (nanos / 1_000_000_000)
  } else if (typeof timeObject === 'string') {
    if (timeObject.includes('s')) return parseFloat(timeObject.replace('s', ''))
    if (timeObject.includes(':')) {
      const parts = timeObject.split(':')
      let seconds = 0
      if (parts.length === 3) {
        seconds = (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseFloat(parts[2])
      } else if (parts.length === 2) {
        seconds = (parseInt(parts[0]) * 60) + parseFloat(parts[1])
      }
      return seconds
    }
    return parseFloat(timeObject)
  }
  return Number(timeObject) || 0
}

// Save and export
function rebuildTranscriptionJson() {
  if (!props.originalTranscriptionJson) return null

  const updatedJson = {
    text: transcriptSegments.value.map(s => s.text).join(' '),
    results: []
  }

  transcriptSegments.value.forEach(segment => {
    const segmentWords = segment.text.split(/\s+/).filter(w => w.trim())
    const words = []
    let originalWordIndex = 0
    
    segmentWords.forEach((editedWord) => {
      const originalWord = segment.words[originalWordIndex] || segment.words[segment.words.length - 1]
      
      if (originalWord) {
        words.push({
          word: editedWord,
          startOffset: originalWord.startOffset || {
            seconds: Math.floor(originalWord.startTime || 0),
            nanos: Math.floor(((originalWord.startTime || 0) % 1) * 1e9)
          },
          endOffset: originalWord.endOffset || {
            seconds: Math.floor(originalWord.endTime || 0),
            nanos: Math.floor(((originalWord.endTime || 0) % 1) * 1e9)
          },
          confidence: originalWord.confidence || 0.9,
          speakerLabel: originalWord.speakerLabel || ""
        })
        originalWordIndex++
      }
    })

    if (words.length > 0) {
      updatedJson.results.push({
        words: words,
        confidence: segment.words[0]?.confidence || 0.9,
        transcript: segment.text
      })
    }
  })

  return updatedJson
}

async function saveAllSegments() {
  if (!props.processingId) return
  isSavingTranscript.value = true
  saveStatus.value = null
  try {
    transcriptSegments.value.forEach((s) => {
      if (s.isEditing) {
        s.text = s.editText
        s.isEditing = false
      }
    })
    const fullText = transcriptSegments.value.map(s => s.text).join(' ')
    const updatedTranscriptionJson = rebuildTranscriptionJson()

    const response = await fetch(`${props.apiUrl}/update-transcript/${props.processingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: fullText,
        transcription_json: updatedTranscriptionJson
      })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to save transcript')
    }
    transcriptSegments.value.forEach(s => { s.originalText = s.text })
    saveStatus.value = { type: 'text-green-600', message: 'All segments saved successfully' }
    setTimeout(() => { saveStatus.value = null }, 3000)
  } catch (e) {
    console.error('Error saving transcript:', e)
    saveStatus.value = { type: 'text-red-600', message: `Failed to save transcript: ${e.message}` }
  } finally {
    isSavingTranscript.value = false
  }
}

function saveSegment({ index, text }) {
  transcriptSegments.value[index].text = text;
  transcriptSegments.value[index].isEditing = false;
  saveAllSegments();
}

async function downloadSubtitles(format) {
  if (!props.processingId) return
  if (hasUnsavedChanges.value) {
    saveStatus.value = { type: 'text-red-600', message: 'Please save all transcript edits before downloading the subtitle file.' }
    setTimeout(() => { saveStatus.value = null }, 2500)
    return
  }
  isDownloadingSRT.value = true
  showSubtitleDropdown.value = false
  try {
    const downloadUrl = `${props.apiUrl}/download-${format.toLowerCase()}/${props.processingId}?t=${Date.now()}`
    const link = document.createElement('a')
    link.href = downloadUrl
    const extension = format.toUpperCase()
    link.download = `${originalFilenameLocal.value ? originalFilenameLocal.value.replace(/\.[^/.]+$/, '') : 'transcript'}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e) {
    console.error('Subtitle download error:', e)
    saveStatus.value = { type: 'text-red-600', message: `Failed to download subtitle file: ${e.message || 'Unknown error'}` }
  } finally {
    isDownloadingSRT.value = false
  }
}

function copyTranscript() {
  const fullText = transcriptSegments.value.map(s => s.text).join(' ')
  navigator.clipboard.writeText(fullText)
    .then(() => {
      saveStatus.value = { type: 'text-blue-600', message: 'Transkripti u kopjua' }
      setTimeout(() => { saveStatus.value = null }, 2000)
    })
    .catch(err => {
      console.error('Could not copy text: ', err)
      saveStatus.value = { type: 'text-red-600', message: 'Kopjimi i transkriptit dështoi' }
    })
}

function downloadEmbeddedCaptionsModalCall() {
  downloadModal.value = true
  selectedPresetId.value = 'karaoke'
}

function closeDownloadModal() {
  downloadModal.value = false
}

async function downloadWithSelectedStyle() {
  if (hasUnsavedChanges.value) {
    saveStatus.value = { type: 'text-red-600', message: 'Please save all transcript edits before downloading the video.' }
    setTimeout(() => { saveStatus.value = null }, 2500)
    return
  }
  if (!props.videoUrl) {
    saveStatus.value = { type: 'text-red-600', message: 'Video URL is missing.' }
    setTimeout(() => { saveStatus.value = null }, 2500)
    return
  }
  
  isDownloadingVideo.value = true
  saveStatus.value = { type: 'text-blue-600', message: 'Duke përpunuar videon...' }
  
  try {
    const preset = captionPresets.find(p => p.id === selectedPresetId.value) || captionPresets[0];

    // Build transcript segments array directly (include words for karaoke)
    const segments = transcriptSegments.value.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
      text: s.text,
      words: (s.words || []).map(w => ({
        text: w.text,
        startTime: w.startTime,
        endTime: w.endTime
      }))
    }))

    // Determine source video dimensions
    let outputWidth = 1080 // Default vertical assumption if missing
    let outputHeight = 1920
    const videoEl = videoPlayer.value
    if (videoEl) {
      if (videoEl.videoWidth && videoEl.videoHeight) {
        outputWidth = videoEl.videoWidth
        outputHeight = videoEl.videoHeight
      } else if (videoEl.clientWidth && videoEl.clientHeight) {
        outputWidth = Math.round(videoEl.clientWidth)
        outputHeight = Math.round(videoEl.clientHeight)
      }
    }

    const response = await apiClient.post(
      `/render-captioned-video`,
      {
        videoPath: props.videoUrl,
        transcript: {
          segments: segments
        },
        style: {
            ...preset.backendOpts,
            videoWidth: outputWidth,
            videoHeight: outputHeight
        },
        output: {
          width: outputWidth,
          height: outputHeight
        }
      },
      {
        responseType: 'blob'
      }
    )

    const blob = response.data
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const baseName = (props.originalFilename || 'video').replace(/\.[^/.]+$/, '')
    link.href = url
    link.download = `${baseName}-captioned.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    closeDownloadModal()
    saveStatus.value = { type: 'text-green-600', message: 'Video shkarkuar me sukses!' }
    setTimeout(() => { saveStatus.value = null }, 2500)
  } catch (error) {
    console.error('Error downloading video:', error)
    saveStatus.value = { type: 'text-red-600', message: `Gabim: ${error.message}` }
  } finally {
    isDownloadingVideo.value = false
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto font-poppins">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Transcript Panel -->
      <div class="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-100px)]">
        <div class="bg-[#FBFCFB] border-b border-gray-200 px-4 py-3 flex justify-between items-center shrink-0">
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

            <!-- Subtitle Download Dropdown -->
            <div class="relative">
              <button 
                @click="showSubtitleDropdown = !showSubtitleDropdown"
                class="px-2 py-1 text-xs bg-secondary text-primary rounded hover:bg-[#7ED089] transition-colors flex items-center"
                :disabled="isDownloadingSRT || hasUnsavedChanges"
                :class="{ 'opacity-50 cursor-not-allowed': isDownloadingSRT || hasUnsavedChanges }"
              >
                <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {{ isDownloadingSRT ? 'Downloading...' : 'Shkarko Titra' }}
              </button>
              
              <div 
                v-if="showSubtitleDropdown"
                class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50"
              >
                <button
                  @click="downloadSubtitles('srt')"
                  class="w-full text-left px-4 py-2 text-xs text-primary hover:bg-[#F4F9F7] transition-colors border-b border-gray-100 last:border-b-0"
                >
                  SRT
                </button>
                <button
                  @click="downloadSubtitles('vtt')"
                  class="w-full text-left px-4 py-2 text-xs text-primary hover:bg-[#F4F9F7] transition-colors"
                >
                  VTT
                </button>
              </div>
            </div>

            <button
              @click="downloadEmbeddedCaptionsModalCall"
              class="px-2 py-1 text-xs bg-secondary text-primary rounded hover:bg-[#7ED089] transition-colors flex items-center"
              :disabled="isDownloadingVideo || hasUnsavedChanges"
              :class="{ 'opacity-50 cursor-not-allowed': isDownloadingVideo || hasUnsavedChanges }"
            >
              {{ isDownloadingVideo ? 'Downloading...' : 'Shkarko me titra' }}
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

        <div class="p-4 flex-1 overflow-y-auto">
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

      <!-- Video Panel -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col gap-4">
        <div class="bg-[#FBFCFB] border-b border-gray-200 px-4 py-3">
          <div v-if="!isEditingFilename" class="flex items-center justify-between">
            <h2 class="text-lg text-kollektif-bold text-primary truncate pr-2">{{ originalFilenameLocal }}</h2>
            <button 
              @click="startEditingFilename"
              class="ml-2 shrink-0 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-[#033027] transition-colors"
            >
              Edito
            </button>
          </div>
          <div v-else class="flex items-center gap-2">
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
              class="px-2 py-1 bg-secondary text-primary rounded hover:bg-[#7ED089] text-xs"
            >
              Ruaj
            </button>
            <button
              @click="cancelEditingFilename"
              :disabled="isSavingFilename"
              class="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
            >
              Anulo
            </button>
          </div>
          <p v-if="filenameError" class="text-red-600 text-xs mt-1 font-poppins">
            {{ filenameError }}
          </p>
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
              :src="videoUrl"
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
                -5s
              </button>
            </div>
            
            <div class="text-xs font-medium text-gray-600">
              {{ formatVideoTime(currentVideoTime) }} / {{ formatVideoTime(videoDuration) }}
            </div>
            
            <button 
              @click="skipForward(5)"
              class="flex items-center text-xs font-medium text-primary px-2 py-1 hover:bg-[#F4F9F7] rounded"
            >
              +5s
            </button>
          </div>
          
          <div class="mt-2 flex justify-between">
            <button 
              @click="playPreviousSegment"
              class="flex items-center text-sm font-medium text-primary px-3 py-1.5 bg-[#FBFCFB] border border-gray-100 hover:bg-[#F4F9F7] rounded transition-colors"
              :disabled="currentSegmentIndex <= 0"
              :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex <= 0 }"
            >
              Para
            </button>
            <button 
              @click="playNextSegment"
              class="flex items-center text-sm font-medium text-primary px-3 py-1.5 bg-[#FBFCFB] border border-gray-100 hover:bg-[#F4F9F7] rounded transition-colors"
              :disabled="currentSegmentIndex >= transcriptSegments.length - 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex >= transcriptSegments.length - 1 }"
            >
              Pas
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>  
  
  <!-- Download Embedded Captions Modal -->
  <teleport to="body">
    <transition name="fade">
      <div 
        v-if="downloadModal" 
        class="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center p-4 font-poppins"
      >
        <!-- Modal -->
        <div class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="bg-primary px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 class="text-xl font-bold text-white">Shkarko videon me titra</h2>
              <p class="text-white/60 text-xs mt-0.5">Zgjidhni një stil për titrat tuaja</p>
            </div>
            <button
              @click="closeDownloadModal"
              class="text-white hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-hidden flex flex-col lg:flex-row">
            
            <!-- Left: Presets List -->
            <div class="w-full lg:w-5/12 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 space-y-3">
              <div 
                v-for="preset in captionPresets"
                :key="preset.id"
                @click="selectedPresetId = preset.id"
                class="group cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md bg-white"
                :class="selectedPresetId === preset.id 
                  ? 'border-secondary ring-1 ring-secondary/30' 
                  : 'border-transparent hover:border-gray-200'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-primary">{{ preset.name }}</span>
                  <div 
                    class="w-4 h-4 rounded-full border flex items-center justify-center"
                    :class="selectedPresetId === preset.id ? 'border-secondary bg-secondary' : 'border-gray-300'"
                  >
                    <div v-if="selectedPresetId === preset.id" class="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                </div>
                <p class="text-xs text-gray-500">{{ preset.description }}</p>
              </div>
            </div>

            <!-- Right: Preview -->
            <div class="w-full lg:w-7/12 bg-[#1a1a1a] relative flex items-center justify-center p-8 overflow-hidden">
              <div class="relative w-full aspect-[9/16] max-h-[60vh] bg-black shadow-2xl rounded-lg overflow-hidden border border-white/10">
                <!-- Preview background image -->
                <img 
                  src="https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=2070&auto=format&fit=crop" 
                  class="w-full h-full object-cover opacity-50"
                  alt="Video Preview" 
                />
                
                <!-- Computed Style Preview -->
                <div :style="currentPreviewStyle">
                  Këtu shfaqen titrat<br>për videon tuaj
                </div>
                
                <div class="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-bold">
                  PREVIEW
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              @click="closeDownloadModal"
              class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              :disabled="isDownloadingVideo"
            >
              Anulo
            </button>
            <button
              @click="downloadWithSelectedStyle"
              class="px-4 py-2 text-sm bg-secondary text-primary rounded hover:bg-[#7dd87b] disabled:opacity-50 font-medium flex items-center gap-2"
              :disabled="isDownloadingVideo"
            >
              <svg v-if="isDownloadingVideo" class="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDownloadingVideo ? 'Duke shkarkuar...' : 'Shkarko videon' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>