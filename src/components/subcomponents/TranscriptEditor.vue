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

// UI state
const isDownloadingSRT = ref(false)
const isDownloadingVideo = ref(false)
const downloadModal = ref(false)
const isSavingTranscript = ref(false)
const showSubtitleDropdown = ref(false)
const isMenuOpen = ref(false)

// Status toast
const showSaveStatus = ref(false)
const saveStatusMessage = ref('')
const isSaveError = ref(false)

// Video playback
const currentVideoTime = ref(0)
const videoDuration = ref(0)
const isVideoPlaying = ref(false)
const loopingSegment = ref(null)
const isLoopingSeek = ref(false)

// Transcript
const transcriptSegments = ref([])
const currentSegmentIndex = ref(-1)
const hasOriginalTranscription = ref(false)
const transcriptPanelRef = ref(null)
const segmentRefs = ref([])
const isInteracting = ref(false)

// Filename editing
const originalFilenameLocal = ref(props.originalFilename || '')
const isEditingFilename = ref(false)
const editedFilename = ref('')
const isSavingFilename = ref(false)
const filenameError = ref(null)
const filenameInput = ref(null)

// Modal
const selectedPresetId = ref('karaoke')

// ─── Caption Presets (new template's expanded set) ───────────
const captionPresets = [
  {
    id: 'tiktok',
    name: 'TikTok Style',
    description: 'Big bold text, 2-3 words at a time.',
    previewCss: {
      color: '#FFFFFF',
      textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
      background: 'transparent',
    },
    backendOpts: {
      karaoke: true,
      primaryColour: '&H0000FFFF&',
      secondaryColour: '&H00FFFFFF&',
      outlineColour: '&H00000000&',
      backColour: '&H00000000&',
      borderStyle: 1,
      outline: 6,
      fontSize: 120,
      alignment: 5,
      marginV: 0,
      shadow: 2,
    },
    maxWordsPerSegment: 3,
    overlapThreshold: 0.5,
  },
  {
    id: 'karaoke',
    name: 'Karaoke (Active)',
    description: 'Green highlight on spoken words.',
    previewCss: { color: '#9FE29E', textShadow: '2px 2px 0 #000', background: 'transparent' },
    backendOpts: {
      karaoke: true,
      primaryColour: '&H009EE29F&',
      secondaryColour: '&H00FFFFFF&',
      outlineColour: '&H00000000&',
      backColour: '&H00000000&',
      borderStyle: 1,
      outline: 4,
      fontSize: 72,
      alignment: 2,
      marginV: 120,
    },
    maxWordsPerSegment: 15,
    overlapThreshold: 1.5,
  },
  {
    id: 'classic',
    name: 'Classic White',
    description: 'Clean white text with outline.',
    previewCss: { color: '#FFFFFF', textShadow: '2px 2px 0 #000', background: 'transparent' },
    backendOpts: {
      karaoke: false,
      primaryColour: '&H00FFFFFF&',
      secondaryColour: '&H00FFFFFF&',
      outlineColour: '&H00000000&',
      backColour: '&H00000000&',
      borderStyle: 1,
      outline: 4,
      fontSize: 72,
      alignment: 2,
      marginV: 120,
    },
    maxWordsPerSegment: 15,
    overlapThreshold: 1.5,
  },
  {
    id: 'boxed',
    name: 'Boxed Background',
    description: 'White text on semi-transparent box.',
    previewCss: { color: '#FFFFFF', textShadow: 'none', background: 'rgba(0,0,0,0.6)' },
    backendOpts: {
      karaoke: false,
      primaryColour: '&H00FFFFFF&',
      secondaryColour: '&H00FFFFFF&',
      outlineColour: '&H00000000&',
      backColour: '&H80000000&',
      borderStyle: 3,
      outline: 0,
      fontSize: 64,
      alignment: 2,
      marginV: 120,
    },
    maxWordsPerSegment: 15,
    overlapThreshold: 1.5,
  },
]

// ─── Scaling Constants ───────────────────────────────────────
const REFERENCE_HEIGHT = 1920
const BASE_PREVIEW_FONT_PX = 32
const ASS_FONT_FACTOR = 0.0375

// ─── Computed ────────────────────────────────────────────────
const currentPreset = computed(() => {
  return captionPresets.find(p => p.id === selectedPresetId.value) || captionPresets[0]
})

const maxWordsPerSegment = computed(() => currentPreset.value?.maxWordsPerSegment ?? 15)
const segmentOverlapThreshold = computed(() => currentPreset.value?.overlapThreshold ?? 1.5)

const hasUnsavedChanges = computed(() => {
  return transcriptSegments.value.some(s => s.originalText !== s.text || s.isEditing)
})

// ─── Preview style helpers (from new template) ───────────────
function getVideoDimensions() {
  const videoEl = videoPlayer.value
  if (videoEl) {
    if (videoEl.videoWidth && videoEl.videoHeight) return { width: videoEl.videoWidth, height: videoEl.videoHeight }
    if (videoEl.clientWidth && videoEl.clientHeight) return { width: Math.round(videoEl.clientWidth), height: Math.round(videoEl.clientHeight) }
  }
  return { width: 1080, height: 1920 }
}

function computeScaledStyle(preset, videoWidth, videoHeight) {
  const backend = preset?.backendOpts || {}
  const isTiktok = preset?.id === 'tiktok'
  const previewFontPxRaw = Math.round(BASE_PREVIEW_FONT_PX * (videoHeight / REFERENCE_HEIGHT))
  const previewFontPx = Math.min(Math.max(previewFontPxRaw, 12), 128)
  const fontSizeAss = isTiktok
    ? Math.max(10, Math.round(videoHeight * ASS_FONT_FACTOR * 1.8))
    : Math.max(10, Math.round(videoHeight * ASS_FONT_FACTOR))
  const outline = Math.min(Math.max(Math.round((backend.outline ?? 4) * (videoHeight / REFERENCE_HEIGHT)), 0), 64)
  const marginV = Math.max(0, Math.round((backend.marginV ?? 120) * (videoHeight / REFERENCE_HEIGHT)))
  const shadow = Math.max(0, Math.round((backend.shadow ?? 0) * (videoHeight / REFERENCE_HEIGHT)))
  return {
    previewFontPx,
    fontSizeAss,
    outline,
    marginV,
    shadow,
    borderStyle: backend.borderStyle ?? 1,
    alignment: Number(backend.alignment ?? 2),
  }
}

const currentPreviewWrapperStyle = computed(() => {
  const preset = currentPreset.value
  const { width: vw, height: vh } = getVideoDimensions()
  const scaled = computeScaledStyle(preset, vw, vh)
  const horizMap = { 1: 'flex-start', 2: 'center', 3: 'flex-end', 4: 'flex-start', 5: 'center', 6: 'flex-end', 7: 'flex-start', 8: 'center', 9: 'flex-end' }
  const vertMap  = { 1: 'flex-end', 2: 'flex-end', 3: 'flex-end', 4: 'center', 5: 'center', 6: 'center', 7: 'flex-start', 8: 'flex-start', 9: 'flex-start' }
  const alignment = scaled.alignment || 2
  const paddingBottom = [1, 2, 3].includes(alignment) ? `${scaled.marginV}px` : undefined
  const paddingTop    = [7, 8, 9].includes(alignment) ? `${scaled.marginV}px` : undefined
  const middlePad     = [4, 5, 6].includes(alignment) ? `${Math.round(scaled.marginV / 2)}px` : undefined
  return {
    display: 'flex',
    justifyContent: horizMap[alignment] || 'center',
    alignItems: vertMap[alignment] || 'flex-end',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    paddingLeft: '4%',
    paddingRight: '4%',
    paddingBottom: paddingBottom ?? middlePad,
    paddingTop: paddingTop ?? middlePad,
  }
})

const currentPreviewCaptionStyle = computed(() => {
  const preset = currentPreset.value
  const { width: vw, height: vh } = getVideoDimensions()
  const scaled = computeScaledStyle(preset, vw, vh)
  const alignment = scaled.alignment || 2
  const textAlignMap = { 1: 'left', 2: 'center', 3: 'right', 4: 'left', 5: 'center', 6: 'right', 7: 'left', 8: 'center', 9: 'right' }
  const isBox    = scaled.borderStyle === 3
  const isTiktok = preset.id === 'tiktok'
  return {
    fontFamily: `'Poppins', sans-serif`,
    fontWeight: '900',
    fontSize: isTiktok ? `${Math.min(scaled.previewFontPx * 1.8, 64)}px` : `${scaled.previewFontPx}px`,
    textAlign: textAlignMap[alignment] || 'center',
    lineHeight: isTiktok ? '1.2' : '1.4',
    textTransform: isTiktok ? 'uppercase' : 'none',
    letterSpacing: isTiktok ? '2px' : 'normal',
    padding: isBox ? '8px 16px' : '0',
    borderRadius: isBox ? '6px' : '0',
    color: preset.previewCss.color,
    textShadow: preset.previewCss.textShadow || undefined,
    backgroundColor: preset.previewCss.background || 'transparent',
    maxWidth: isTiktok ? '80%' : '92%',
    whiteSpace: 'normal',
    wordBreak: isTiktok ? 'break-word' : 'normal',
    WebkitTextStroke: scaled.outline
      ? `${Math.max(1, Math.round(scaled.outline * (isTiktok ? 0.8 : 0.6)))}px rgba(0,0,0,0.85)`
      : 'none',
    boxSizing: 'border-box',
  }
})

// ─── Watchers ────────────────────────────────────────────────
watch(selectedPresetId, (newId, oldId) => {
  const oldMax = captionPresets.find(p => p.id === oldId)?.maxWordsPerSegment ?? 15
  const newMax = captionPresets.find(p => p.id === newId)?.maxWordsPerSegment ?? 15
  if (oldMax !== newMax && hasOriginalTranscription.value) createTranscriptSegments()
})

watch(() => props.originalTranscriptionJson, (newJson) => {
  if (newJson) {
    hasOriginalTranscription.value = true
    createTranscriptSegments()
  }
}, { immediate: true, deep: true })

onMounted(() => {
  nextTick(() => {
    if (videoPlayer.value) setupVideoEvents()
  })
})

// ─── Status Toast ────────────────────────────────────────────
function showMessage(message, isError = false) {
  saveStatusMessage.value = message
  isSaveError.value = isError
  showSaveStatus.value = true
  setTimeout(() => {
    showSaveStatus.value = false
    saveStatusMessage.value = ''
    isSaveError.value = false
  }, 2500)
}

// ─── Filename editing ────────────────────────────────────────
function startEditingFilename() {
  isEditingFilename.value = true
  editedFilename.value = originalFilenameLocal.value || ''
  filenameError.value = null
  isInteracting.value = true
  nextTick(() => filenameInput.value?.focus())
}

function cancelEditingFilename() {
  isEditingFilename.value = false
  editedFilename.value = ''
  filenameError.value = null
  isInteracting.value = false
}

async function saveFilename() {
  if (!editedFilename.value.trim()) { filenameError.value = 'Filename cannot be empty'; return }
  if (!props.processingId) { filenameError.value = 'Processing ID not found'; return }
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
    isInteracting.value = false
    showMessage('Filename updated successfully')
  } catch (e) {
    filenameError.value = e.message
  } finally {
    isSavingFilename.value = false
  }
}

function handleFilenameKeydown(event) {
  if (event.key === 'Enter') saveFilename()
  else if (event.key === 'Escape') cancelEditingFilename()
}

// ─── Video events ────────────────────────────────────────────
function setupVideoEvents() {
  const video = videoPlayer.value
  if (!video) return
  video.addEventListener('loadedmetadata', () => { videoDuration.value = video.duration })
  video.addEventListener('durationchange',  () => { videoDuration.value = video.duration })
}

function onVideoTimeUpdate() {
  const video = videoPlayer.value
  if (!video) return
  currentVideoTime.value = video.currentTime
  if (loopingSegment.value && !video.paused && currentVideoTime.value >= loopingSegment.value.endTime) {
    isLoopingSeek.value = true
    video.currentTime = loopingSegment.value.startTime
    video.play()
  }
  updateCurrentSegment()
}

function onVideoSeeking() {
  if (isLoopingSeek.value) { isLoopingSeek.value = false }
  else { loopingSegment.value = null }
  updateCurrentSegment()
}

function togglePlayback() {
  const video = videoPlayer.value
  if (!video) return
  if (video.paused) { video.play() }
  else { video.pause(); loopingSegment.value = null }
}

function formatVideoTime(seconds) {
  if (isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function skipBackward(seconds) { loopingSegment.value = null; const v = videoPlayer.value; if (v) v.currentTime = Math.max(0, v.currentTime - seconds) }
function skipForward(seconds)  { loopingSegment.value = null; const v = videoPlayer.value; if (v) v.currentTime = Math.min(v.duration, v.currentTime + seconds) }

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }

// ─── Segments ────────────────────────────────────────────────
function createTranscriptSegments() {
  const json = props.originalTranscriptionJson
  if (!json || !json.results) return

  const currentMaxWords = maxWordsPerSegment.value
  const currentOverlapThreshold = segmentOverlapThreshold.value
  let allWords = []

  json.results.forEach(result => {
    if (result.words && Array.isArray(result.words)) {
      allWords.push(...result.words.map(word => ({
        text: word.word,
        startTime: extractTimeInSeconds(word.startOffset),
        endTime: extractTimeInSeconds(word.endOffset)
      })))
    }
  })

  if (allWords.length === 0 && json.results[0]?.alternatives?.[0]?.words) {
    allWords.push(...json.results[0].alternatives[0].words.map(word => ({
      text: word.word,
      startTime: extractTimeInSeconds(word.startTime),
      endTime: extractTimeInSeconds(word.endTime)
    })))
  }

  allWords.sort((a, b) => a.startTime - b.startTime)

  const segments = []
  let current = { words: [], startTime: 0, endTime: 0, text: '', originalText: '', editText: '', isEditing: false }

  for (const word of allWords) {
    if (current.words.length === 0) {
      current.startTime = word.startTime
      current.words.push(word)
    } else if (
      current.words.length >= currentMaxWords ||
      word.startTime - current.words[current.words.length - 1].endTime > currentOverlapThreshold
    ) {
      current.endTime = current.words[current.words.length - 1].endTime
      current.text = current.words.map(w => w.text).join(' ')
      current.originalText = current.text
      current.editText = current.text
      segments.push(current)
      current = { words: [word], startTime: word.startTime, endTime: 0, text: '', originalText: '', editText: '', isEditing: false }
    } else {
      current.words.push(word)
    }
  }

  if (current.words.length > 0) {
    current.endTime = current.words[current.words.length - 1].endTime
    current.text = current.words.map(w => w.text).join(' ')
    current.originalText = current.text
    current.editText = current.text
    segments.push(current)
  }

  transcriptSegments.value = segments
}

function reprocessSegments() {
  if (!hasOriginalTranscription.value) return
  if (hasUnsavedChanges.value && !confirm('You have unsaved changes. Reprocessing segments will discard these changes. Continue?')) return
  createTranscriptSegments()
  showMessage('Segments reprocessed with new settings')
}

function beginEdit(index) {
  transcriptSegments.value.forEach((s, idx) => {
    if (idx !== index && s.isEditing) { s.isEditing = false; s.editText = s.text }
  })
  transcriptSegments.value[index].isEditing = true
  transcriptSegments.value[index].editText = transcriptSegments.value[index].text
  isInteracting.value = true
}

function cancelEdit(index) {
  transcriptSegments.value[index].isEditing = false
  transcriptSegments.value[index].editText = transcriptSegments.value[index].text
  isInteracting.value = false
}

function playSegment(segment) {
  loopingSegment.value = null
  const video = videoPlayer.value
  if (!video) return
  video.currentTime = segment.startTime
  video.play()
}

function loopSegment(segment) {
  const video = videoPlayer.value
  if (!video) return
  loopingSegment.value = segment
  isLoopingSeek.value = true
  const END_BUFFER = 0.08
  video.ontimeupdate = null
  video.ontimeupdate = () => {
    if (!loopingSegment.value) return
    const segmentEnd = Math.min(segment.endTime, video.duration)
    if (video.currentTime >= segmentEnd - END_BUFFER) {
      video.currentTime = segment.startTime
      video.play()
    }
  }
  video.currentTime = segment.startTime
  video.play()
}

function playPreviousSegment() {
  loopingSegment.value = null
  if (currentSegmentIndex.value > 0) playSegment(transcriptSegments.value[currentSegmentIndex.value - 1])
}

function playNextSegment() {
  loopingSegment.value = null
  if (currentSegmentIndex.value < transcriptSegments.value.length - 1) playSegment(transcriptSegments.value[currentSegmentIndex.value + 1])
}

function updateCurrentSegment() {
  const time = currentVideoTime.value
  let newIndex = -1
  for (let i = 0; i < transcriptSegments.value.length; i++) {
    const s = transcriptSegments.value[i]
    if (time >= s.startTime && time <= s.endTime) { newIndex = i; break }
  }
  if (newIndex === -1) {
    for (let i = 0; i < transcriptSegments.value.length; i++) {
      if (time < transcriptSegments.value[i].startTime) break
      newIndex = i
    }
  }
  currentSegmentIndex.value = newIndex
  scrollToCurrentSegment()
}

function scrollToCurrentSegment() {
  if (currentSegmentIndex.value < 0 || isInteracting.value) return
  nextTick(() => {
    const el = segmentRefs.value[currentSegmentIndex.value]?.$el
    const container = transcriptPanelRef.value
    if (!el || !container) return
    const elRect = el.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const isVisible = elRect.top >= containerRect.top && elRect.bottom <= containerRect.bottom
    if (!isVisible) {
      const scrollTarget = el.offsetTop - container.offsetTop - (containerRect.height / 2) + (elRect.height / 2)
      container.scrollTo({ top: scrollTarget, behavior: 'smooth' })
    }
  })
}

function extractTimeInSeconds(timeObject) {
  if (!timeObject) return 0
  if (typeof timeObject === 'object') {
    const seconds = typeof timeObject.seconds === 'string' ? parseInt(timeObject.seconds) : timeObject.seconds || 0
    return seconds + ((timeObject.nanos || 0) / 1_000_000_000)
  }
  if (typeof timeObject === 'string') {
    if (timeObject.includes('s')) return parseFloat(timeObject.replace('s', ''))
    if (timeObject.includes(':')) {
      const parts = timeObject.split(':')
      if (parts.length === 3) return (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseFloat(parts[2])
      if (parts.length === 2) return (parseInt(parts[0]) * 60) + parseFloat(parts[1])
    }
    return parseFloat(timeObject)
  }
  return Number(timeObject) || 0
}

// ─── Save & Export ───────────────────────────────────────────
function rebuildTranscriptionJson() {
  if (!props.originalTranscriptionJson) return null
  const updatedJson = { text: transcriptSegments.value.map(s => s.text).join(' '), results: [] }
  transcriptSegments.value.forEach(segment => {
    const segmentWords = segment.text.split(/\s+/).filter(w => w.trim())
    const words = []
    let originalWordIndex = 0
    segmentWords.forEach((editedWord) => {
      const originalWord = segment.words[originalWordIndex] || segment.words[segment.words.length - 1]
      if (originalWord) {
        words.push({
          word: editedWord,
          startOffset: originalWord.startOffset || { seconds: Math.floor(originalWord.startTime || 0), nanos: Math.floor(((originalWord.startTime || 0) % 1) * 1e9) },
          endOffset:   originalWord.endOffset   || { seconds: Math.floor(originalWord.endTime   || 0), nanos: Math.floor(((originalWord.endTime   || 0) % 1) * 1e9) },
          confidence: originalWord.confidence || 0.9,
          speakerLabel: originalWord.speakerLabel || ''
        })
        originalWordIndex++
      }
    })
    if (words.length > 0) {
      updatedJson.results.push({ words, confidence: segment.words[0]?.confidence || 0.9, transcript: segment.text })
    }
  })
  return updatedJson
}

async function saveAllSegments() {
  if (!props.processingId) return
  isSavingTranscript.value = true
  try {
    transcriptSegments.value.forEach(s => { if (s.isEditing) { s.text = s.editText; s.isEditing = false } })
    const updatedTranscriptionJson = rebuildTranscriptionJson()
    await apiClient.post(`/update-transcription/${props.processingId}`, { transcription_json: updatedTranscriptionJson })
    transcriptSegments.value.forEach(s => { s.originalText = s.text })
    isInteracting.value = false
    showMessage('All segments saved successfully')
  } catch (e) {
    console.error('Error saving transcript:', e)
    showMessage(`Error: ${e.response?.data?.error || e.message || 'Failed to save transcript'}`, true)
  } finally {
    isSavingTranscript.value = false
  }
}

function saveSegment({ index, text }) {
  transcriptSegments.value[index].text = text
  transcriptSegments.value[index].isEditing = false
  isInteracting.value = false
  saveAllSegments()
}

async function downloadSubtitles(format) {
  if (!props.processingId) return
  if (hasUnsavedChanges.value) {
    showMessage('Please save all transcript edits before downloading the subtitle file.', true)
    return
  }
  isDownloadingSRT.value = true
  showSubtitleDropdown.value = false
  isMenuOpen.value = false
  try {
    const downloadUrl = `${props.apiUrl}/download-${format.toLowerCase()}/${props.processingId}?t=${Date.now()}`
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${originalFilenameLocal.value ? originalFilenameLocal.value.replace(/\.[^/.]+$/, '') : 'transcript'}.${format.toUpperCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e) {
    showMessage(`Failed to download subtitle file: ${e.message || 'Unknown error'}`, true)
  } finally {
    isDownloadingSRT.value = false
  }
}

function copyTranscript() {
  const fullText = transcriptSegments.value.map(s => s.text).join(' ')
  navigator.clipboard.writeText(fullText)
    .then(() => showMessage('Transkripti u kopjua'))
    .catch(() => showMessage('Kopjimi i transkriptit dështoi', true))
  isMenuOpen.value = false
}

function downloadEmbeddedCaptionsModalCall() {
  downloadModal.value = true
  selectedPresetId.value = 'tiktok'
  isMenuOpen.value = false
}

function closeDownloadModal() { downloadModal.value = false }

async function downloadWithSelectedStyle() {
  if (hasUnsavedChanges.value) {
    showMessage('Please save all transcript edits before downloading the video.', true)
    return
  }
  if (!props.videoUrl) {
    showMessage('Video URL is missing.', true)
    return
  }

  isDownloadingVideo.value = true
  showMessage('Duke përpunuar videon...')

  try {
    const preset = currentPreset.value
    const segments = transcriptSegments.value.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
      text: s.text,
      words: (s.words || []).map(w => ({ text: w.text, startTime: w.startTime, endTime: w.endTime }))
    }))

    const { width: outputWidth, height: outputHeight } = getVideoDimensions()
    const scaled = computeScaledStyle(preset, outputWidth, outputHeight)

    const stylePayload = {
      ...preset.backendOpts,
      fontSize: scaled.fontSizeAss,
      outline: scaled.outline,
      marginV: scaled.marginV,
      shadow: scaled.shadow,
      alignment: scaled.alignment,
      videoWidth: outputWidth,
      videoHeight: outputHeight,
    }

    const response = await apiClient.post('/render-captioned-video', {
      videoPath: props.videoUrl,
      transcript: { segments },
      style: stylePayload,
      output: { width: outputWidth, height: outputHeight },
    }, { responseType: 'blob' })

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
    setTimeout(() => showMessage('Video shkarkuar me sukses!'), 2500)
  } catch (error) {
    console.error('Error downloading video:', error)
    showMessage(`Gabim: ${error.message}`, true)
  } finally {
    isDownloadingVideo.value = false
  }
}
</script>

<template>
  <div class="relative h-screen w-screen flex flex-col font-poppins">

    <!-- ── Status Toast ──────────────────────────────────────── -->
    <div v-if="showSaveStatus" class="absolute inset-x-0 top-0 flex justify-center z-[100] pointer-events-none">
      <div
        class="border rounded-lg px-4 py-3 fixed top-4 mx-4 animate-fade-in-down shadow-lg"
        role="alert"
        :class="isSaveError
          ? 'bg-red-100 border-red-400 text-red-700'
          : 'bg-green-100 border-green-400 text-green-700'"
      >
        <span class="font-bold mr-1">{{ isSaveError ? 'Error!' : 'Success!' }}</span>
        <span>{{ saveStatusMessage }}</span>
      </div>
    </div>

    <!-- ── Header ────────────────────────────────────────────── -->
    <div class="w-full sticky top-0 left-0 right-0 z-40 flex-shrink-0">
      <div class="flex justify-between items-center bg-gray-50/80 backdrop-blur-sm border-y border-primary/10 px-3 py-2 lg:px-4 lg:py-3">

        <!-- Download button -->
        <div
          @click="downloadEmbeddedCaptionsModalCall"
          class="bg-primary font-poppins text-white px-3 py-1.5 lg:px-4 lg:py-2 text-sm rounded-md hover:bg-secondary cursor-pointer hover:text-primary duration-300 transition-all flex-shrink-0"
        >
          Shkarko
        </div>

        <!-- Filename -->
        <div class="flex-1 flex items-center justify-center gap-2 min-w-0 px-2">
          <div class="min-w-0">
            <h1
              v-if="!isEditingFilename"
              class="text-primary text-kollektif text-lg md:text-xl lg:text-2xl truncate"
            >
              {{ originalFilenameLocal }}
            </h1>
            <input
              ref="filenameInput"
              v-else
              v-model="editedFilename"
              @blur="cancelEditingFilename"
              @keydown="handleFilenameKeydown"
              @focus="isInteracting = true"
              class="border border-gray-300 rounded px-2 py-1 text-sm lg:text-base w-full text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              autofocus
            />
          </div>
          <!-- Edit / Save icon -->
          <div class="flex-shrink-0">
            <svg
              v-if="isEditingFilename"
              @click="saveFilename"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5 text-primary hover:text-secondary transition-all duration-200 cursor-pointer"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
            </svg>
            <svg
              v-else
              @click="startEditingFilename"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5 text-primary hover:text-secondary transition-all duration-200 cursor-pointer"
            >
              <path d="M3 17.25V21h3.75l11.39-11.39-3.75-3.75L3 17.25zm15.6-10.79l1.44 1.44c.39.39.39 1.02 0 1.41l-1.44 1.44-3.75-3.75 1.44-1.44c.39-.39 1.02-.39 1.41 0z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <!-- Desktop action buttons -->
        <div class="hidden md:flex items-center space-x-2 flex-shrink-0">
          <button
            @click="copyTranscript"
            class="px-3 py-1.5 text-xs bg-secondary text-primary rounded hover:bg-[#7ED089] transition-colors flex items-center"
          >
            <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Kopjo
          </button>

          <!-- Subtitle dropdown -->
          <div class="relative">
            <button
              @click="showSubtitleDropdown = !showSubtitleDropdown"
              class="px-3 py-1.5 text-xs bg-secondary text-primary rounded hover:bg-[#7ED089] transition-colors flex items-center"
              :disabled="isDownloadingSRT || hasUnsavedChanges"
              :class="{ 'opacity-50 cursor-not-allowed': isDownloadingSRT || hasUnsavedChanges }"
            >
              <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {{ isDownloadingSRT ? 'Downloading...' : 'Shkarko Titra' }}
            </button>
            <div v-if="showSubtitleDropdown" class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50">
              <button @click="downloadSubtitles('srt')" class="w-full text-left px-4 py-2 text-xs text-primary hover:bg-[#F4F9F7] transition-colors border-b border-gray-100">SRT</button>
              <button @click="downloadSubtitles('vtt')" class="w-full text-left px-4 py-2 text-xs text-primary hover:bg-[#F4F9F7] transition-colors">VTT</button>
            </div>
          </div>

          <button
            v-if="hasUnsavedChanges"
            @click="saveAllSegments"
            class="px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-[#033027] transition-colors flex items-center"
            :disabled="isSavingTranscript"
          >
            <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Ruaj të gjitha
          </button>
        </div>

        <!-- Mobile hamburger -->
        <div class="md:hidden flex-shrink-0">
          <button @click="toggleMenu" class="p-2 rounded-md bg-secondary text-primary hover:bg-secondary/70 cursor-pointer duration-200 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div v-if="isMenuOpen" class="absolute right-2 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <a @click="copyTranscript"                class="cursor-pointer block px-4 py-2 text-sm text-primary hover:bg-gray-100">Kopjo</a>
            <a @click="downloadSubtitles('srt')"      class="cursor-pointer block px-4 py-2 text-sm text-primary hover:bg-gray-100">Shkarko SRT</a>
            <a @click="downloadSubtitles('vtt')"      class="cursor-pointer block px-4 py-2 text-sm text-primary hover:bg-gray-100">Shkarko VTT</a>
            <a @click="downloadEmbeddedCaptionsModalCall" class="cursor-pointer block px-4 py-2 text-sm text-primary hover:bg-gray-100">Shkarko me Titra</a>
            <a v-if="hasUnsavedChanges" @click="saveAllSegments" class="cursor-pointer block px-4 py-2 text-sm text-white bg-primary hover:bg-[#033027]">Ruaj të gjitha</a>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Main Content ──────────────────────────────────────── -->
    <div class="w-full flex-1 min-h-0 bg-gray-50/50">

      <!-- Mobile: stacked -->
      <div class="flex flex-col h-full lg:hidden">
        <!-- Video -->
        <div class="flex-shrink-0 h-[38vh]">
          <video
            ref="videoPlayer"
            class="w-full h-full bg-black object-contain"
            controls
            playsinline
            webkit-playsinline
            @timeupdate="onVideoTimeUpdate"
            @play="isVideoPlaying = true"
            @pause="isVideoPlaying = false"
            @seeking="onVideoSeeking"
            :src="videoUrl"
          />
        </div>

        <!-- Custom controls (mobile) -->
        <div class="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <button @click="skipBackward(5)" class="text-xs font-medium text-primary px-2 py-1 hover:bg-[#F4F9F7] rounded">-5s</button>
          <button @click="togglePlayback" class="p-1.5 rounded-full bg-white shadow hover:bg-[#F4F9F7]">
            <svg v-if="isVideoPlaying" class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7-.75a.75.75 0 00-.75.75v13.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-1.5z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
            </svg>
          </button>
          <div class="text-xs font-medium text-gray-600">{{ formatVideoTime(currentVideoTime) }} / {{ formatVideoTime(videoDuration) }}</div>
          <button @click="skipForward(5)" class="text-xs font-medium text-primary px-2 py-1 hover:bg-[#F4F9F7] rounded">+5s</button>
        </div>

        <!-- Segment nav (mobile) -->
        <div class="flex-shrink-0 flex justify-between px-4 py-1 bg-white border-b border-gray-200">
          <button @click="playPreviousSegment" class="text-sm font-medium text-primary px-3 py-1 border border-gray-200 rounded hover:bg-[#F4F9F7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentSegmentIndex <= 0">Para</button>
          <button @click="playNextSegment"     class="text-sm font-medium text-primary px-3 py-1 border border-gray-200 rounded hover:bg-[#F4F9F7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentSegmentIndex >= transcriptSegments.length - 1">Pas</button>
        </div>

        <!-- Segments -->
        <div ref="transcriptPanelRef" class="flex-1 min-h-0 overflow-y-auto scroll-smooth">
          <SegmentRow
            v-for="(segment, index) in transcriptSegments"
            :ref="el => { if (el) segmentRefs[index] = el }"
            :key="index"
            :index="index"
            :segment="segment"
            :current-video-time="currentVideoTime"
            :is-current="currentSegmentIndex === index"
            @play="playSegment"
            @loop="loopSegment"
            @begin-edit="beginEdit"
            @save="saveSegment"
            @cancel-edit="cancelEdit"
          />
        </div>
      </div>

      <!-- Desktop: side-by-side -->
      <div class="hidden lg:flex w-full h-full rounded-r-lg border-2 border-gray-200">

        <!-- Transcript panel -->
        <div ref="transcriptPanelRef" class="w-1/3 xl:w-[30%] h-full border-r-2 border-r-gray-200 overflow-y-auto scroll-smooth">
          <SegmentRow
            v-for="(segment, index) in transcriptSegments"
            :ref="el => { if (el) segmentRefs[index] = el }"
            :key="index"
            :index="index"
            :segment="segment"
            :current-video-time="currentVideoTime"
            :is-current="currentSegmentIndex === index"
            @play="playSegment"
            @loop="loopSegment"
            @begin-edit="beginEdit"
            @save="saveSegment"
            @cancel-edit="cancelEdit"
          />
        </div>

        <!-- Video panel -->
        <div class="w-2/3 xl:w-[70%] h-full flex flex-col">
          <video
            ref="videoPlayer"
            class="w-full flex-1 min-h-0 bg-transparent"
            controls
            playsinline
            webkit-playsinline
            @timeupdate="onVideoTimeUpdate"
            @play="isVideoPlaying = true"
            @pause="isVideoPlaying = false"
            @seeking="onVideoSeeking"
            :src="videoUrl"
          />

          <!-- Desktop segment nav -->
          <div class="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-[#FBFCFB] border-t border-gray-200">
            <button @click="playPreviousSegment" class="text-sm font-medium text-primary px-3 py-1.5 bg-white border border-gray-100 hover:bg-[#F4F9F7] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentSegmentIndex <= 0">Para</button>
            <div class="text-xs font-medium text-gray-500">{{ formatVideoTime(currentVideoTime) }} / {{ formatVideoTime(videoDuration) }}</div>
            <button @click="playNextSegment"     class="text-sm font-medium text-primary px-3 py-1.5 bg-white border border-gray-100 hover:bg-[#F4F9F7] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentSegmentIndex >= transcriptSegments.length - 1">Pas</button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- ── Download Modal ──────────────────────────────────────── -->
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="downloadModal"
        class="fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-4 font-poppins"
      >
        <div class="w-full lg:max-w-4xl xl:max-w-5xl bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

          <!-- Modal Header -->
          <div class="bg-primary px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 class="text-lg lg:text-xl font-bold text-white">Shkarko videon me titra</h2>
              <p class="text-white/60 text-xs mt-0.5">Zgjidhni një stil për titrat tuaja</p>
            </div>
            <button @click="closeDownloadModal" class="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-hidden flex flex-col lg:flex-row">

            <!-- Preset list -->
            <div class="w-full lg:w-5/12 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto p-3 lg:p-4 space-y-2 lg:space-y-3">
              <div
                v-for="preset in captionPresets"
                :key="preset.id"
                @click="selectedPresetId = preset.id"
                class="group cursor-pointer p-3 lg:p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md bg-white"
                :class="selectedPresetId === preset.id ? 'border-secondary ring-1 ring-secondary/30' : 'border-transparent hover:border-gray-200'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-primary text-sm lg:text-base">{{ preset.name }}</span>
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

            <!-- Preview -->
            <div class="w-full lg:w-7/12 bg-[#1a1a1a] relative flex items-center justify-center p-4 lg:p-8 overflow-hidden">
              <div class="relative w-full aspect-[9/16] max-h-[40vh] lg:max-h-[60vh] bg-black shadow-2xl rounded-lg overflow-hidden border border-white/10">
                <div :style="currentPreviewWrapperStyle">
                  <div :style="currentPreviewCaptionStyle">
                    Këtu shfaqen titrat<br>për videon tuaj
                  </div>
                </div>
                <div class="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-bold">PREVIEW</div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-4 py-3 lg:px-6 lg:py-4 border-t border-gray-200 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              @click="closeDownloadModal"
              class="px-4 py-2 lg:px-6 lg:py-2.5 text-sm text-gray-600 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              :disabled="isDownloadingVideo"
            >
              Anulo
            </button>
            <button
              @click="downloadWithSelectedStyle"
              class="px-4 py-2 lg:px-6 lg:py-2.5 text-sm bg-secondary text-primary font-bold rounded-lg hover:bg-[#8cd68b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow transition-all"
              :disabled="isDownloadingVideo"
            >
              <svg v-if="isDownloadingVideo" class="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDownloadingVideo ? 'Duke shkarkuar...' : 'Shkarko Videon' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
input[type="range"] { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 5px; outline: none; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #052B28; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #052B28; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>