<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import SegmentRow from '@/components/subcomponents/SegmentRow.vue';
import Timeline from '@/components/subcomponents/Timeline.vue';
import apiClient from '@/stores/apiClient';
import DownloadModal from './items/DownloadModal.vue';
import {useAlert} from '@/stores/useAlert';

// ─── Props ───────────────────────────────────────────────────
const props = defineProps({
  // When used as embedded component, pass these directly.
  // When used as a route-based page, these are omitted and data
  // is fetched from Supabase using the :id route param.
  apiUrl: {
    type: String,
    default: null,
  },
  processingId: {
    type: String,
    default: null,
  },
  videoUrl: {
    type: String,
    default: null,
  },
  originalTranscriptionJson: {
    type: Object,
    default: null,
  },
  originalFilename: {
    type: String,
    default: null,
  },
});

const { showAlert } = useAlert();

// True when the component is used in props/embedded mode
const isPropsMode = computed(() => !!props.processingId);

// ─── Constants ───────────────────────────────────────────────
const REFERENCE_HEIGHT = 1920;
const BASE_PREVIEW_FONT_PX = 32;
const ASS_FONT_FACTOR = 0.0375;
const FRAME_STEP = 1 / 30;
const SEEK_STEP = 5;
const VOLUME_STEP = 0.05;
const LG_BREAKPOINT = 1024;

const shortcutGroups = [
  {
    label: 'Playback',
    shortcuts: [
      { keys: 'Space / K', action: 'Play / Pause' },
      { keys: 'J', action: 'Reverse shuttle' },
      { keys: 'L', action: 'Forward shuttle' },
      { keys: ', / .', action: 'Frame step back / forward' },
      { keys: 'Shift + < / >', action: 'Playback speed' },
    ],
  },
  {
    label: 'Navigim',
    shortcuts: [
      { keys: '← / →', action: 'Seek ±5s' },
      { keys: 'Home / End', action: 'Jump to start / end' },
      { keys: '[ / ]', action: 'Prev / next segment' },
    ],
  },
  {
    label: 'Audio',
    shortcuts: [
      { keys: '↑ / ↓', action: 'Volume up / down' },
      { keys: 'M', action: 'Mute toggle' },
    ],
  },
  {
    label: 'Veprime',
    shortcuts: [
      { keys: 'Ctrl + S', action: 'Save segments' },
      { keys: 'Ctrl + C', action: 'Copy transcript' },
      { keys: 'Esc', action: 'Close modal' },
    ],
  },
];

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
];

// ─── Route & Page State ──────────────────────────────────────
const route = useRoute();
const loading = ref(true);
const unauthorized = ref(false);
const transaction = ref(null);

// Resolved apiUrl: props take priority, then env var, then fallback
const resolvedApiUrl = computed(
  () => props.apiUrl || import.meta.env.VITE_API_URL || 'http://localhost:3000'
);

const isDesktop = ref(window.innerWidth >= LG_BREAKPOINT);

// ─── Video Player ────────────────────────────────────────────
const videoPlayer = ref(null);
const currentVideoTime = ref(0);
const videoDuration = ref(0);
const isVideoPlaying = ref(false);
const loopingSegment = ref(null);
const isLoopingSeek = ref(false);
const playbackRate = ref(1);

// ─── Timeline ────────────────────────────────────────────────
const videoFrames = ref([]);
const framesLoading = ref(false);

// ─── Transcript ──────────────────────────────────────────────
const transcriptSegments = ref([]);
const currentSegmentIndex = ref(-1);
const hasOriginalTranscription = ref(false);
const isSavingTranscript = ref(false);
const segmentRefs = ref([]);
const transcriptPanelRef = ref(null);

// ─── Filename Editing ────────────────────────────────────────
const originalFilenameLocal = ref('');
const isEditingFilename = ref(false);
const editedFilename = ref('');
const isSavingFilename = ref(false);
const filenameError = ref(null);
const filenameInput = ref(null);

// ─── Download Modal ──────────────────────────────────────────
const downloadModal = ref(false);
const selectedPresetId = ref('karaoke');
const isDownloadingVideo = ref(false);

// ─── Status Messages ─────────────────────────────────────────
const showSaveStatus = ref(false);
const saveStatusMessage = ref('');
const isSaveError = ref(false);

// ─── Interaction Guard ───────────────────────────────────────
const isInteracting = ref(false);

function setInteracting(value) {
  isInteracting.value = value;
}

// ─── Shortcuts Panel ─────────────────────────────────────────
const showShortcuts = ref(false);

// ─── Computed: Presets ───────────────────────────────────────
const currentPreset = computed(() => {
  return captionPresets.find(p => p.id === selectedPresetId.value) || captionPresets[0];
});

const maxWordsPerSegment = computed(() => {
  return currentPreset.value?.maxWordsPerSegment ?? 15;
});

const segmentOverlapThreshold = computed(() => {
  return currentPreset.value?.overlapThreshold ?? 1.5;
});

const hasUnsavedChanges = computed(() => {
  return transcriptSegments.value.some(s => s.originalText !== s.text || s.isEditing);
});

// ─── Computed: Caption Preview Styles ────────────────────────
const currentPreviewWrapperStyle = computed(() => {
  const preset = currentPreset.value;
  const { width: vw, height: vh } = getVideoDimensions();
  const scaled = computeScaledStyle(preset, vw, vh);

  const horizMap = {
    1: 'flex-start', 2: 'center', 3: 'flex-end',
    4: 'flex-start', 5: 'center', 6: 'flex-end',
    7: 'flex-start', 8: 'center', 9: 'flex-end',
  };
  const vertMap = {
    1: 'flex-end', 2: 'flex-end', 3: 'flex-end',
    4: 'center', 5: 'center', 6: 'center',
    7: 'flex-start', 8: 'flex-start', 9: 'flex-start',
  };

  const alignment = scaled.alignment || 2;
  const paddingBottom = [1, 2, 3].includes(alignment) ? `${scaled.marginV}px` : undefined;
  const paddingTop = [7, 8, 9].includes(alignment) ? `${scaled.marginV}px` : undefined;
  const middlePad = [4, 5, 6].includes(alignment) ? `${Math.round(scaled.marginV / 2)}px` : undefined;

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
  };
});

const currentPreviewCaptionStyle = computed(() => {
  const preset = currentPreset.value;
  const { width: vw, height: vh } = getVideoDimensions();
  const scaled = computeScaledStyle(preset, vw, vh);

  const alignment = scaled.alignment || 2;
  const textAlignMap = {
    1: 'left', 2: 'center', 3: 'right',
    4: 'left', 5: 'center', 6: 'right',
    7: 'left', 8: 'center', 9: 'right',
  };

  const isBox = scaled.borderStyle === 3;
  const isTiktok = preset.id === 'tiktok';

  return {
    fontFamily: `'Poppins', sans-serif`,
    fontWeight: '900',
    fontSize: isTiktok
      ? `${Math.min(scaled.previewFontPx * 1.8, 64)}px`
      : `${scaled.previewFontPx}px`,
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
  };
});

// ─── Watchers ────────────────────────────────────────────────
watch(selectedPresetId, (newId, oldId) => {
  const oldMax = captionPresets.find(p => p.id === oldId)?.maxWordsPerSegment ?? 15;
  const newMax = captionPresets.find(p => p.id === newId)?.maxWordsPerSegment ?? 15;

  if (oldMax !== newMax && hasOriginalTranscription.value) {
    createTranscriptSegments();
  }
});

watch(transaction, (newTransaction) => {
  if (newTransaction) {
    originalFilenameLocal.value = newTransaction.original_filename || '';
    if (newTransaction.transcription_json) {
      hasOriginalTranscription.value = true;
      createTranscriptSegments(newTransaction.transcription_json);
    }
  }
}, { immediate: true, deep: true });

// ─── Lifecycle ───────────────────────────────────────────────
function handleResize() {
  isDesktop.value = window.innerWidth >= LG_BREAKPOINT;
}

onMounted(async () => {
  window.addEventListener('keydown', handleGlobalKeydown);
  window.addEventListener('resize', handleResize);

  loading.value = true;

  if (isPropsMode.value) {
    // ── Props mode: data is passed in directly, no Supabase fetch needed ──
    transaction.value = {
      processing_id: props.processingId,
      video_url: props.videoUrl,
      original_filename: props.originalFilename,
      transcription_json: props.originalTranscriptionJson,
    };
    loading.value = false;
  } else {
    // ── Route mode: fetch data from Supabase using :id param ──
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      unauthorized.value = true;
      loading.value = false;
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*, videos(id, video_url)')
      .eq('id', route.params.id)
      .single();

    if (error || !data) {
      unauthorized.value = true;
      transaction.value = null;
    } else {
      transaction.value = {
        ...data,
        video_url: data.videos?.video_url || null,
      };
    }

    loading.value = false;
  }

  nextTick(() => {
    if (videoPlayer.value) {
      setupVideoEvents();
      videoPlayer.value.addEventListener('loadedmetadata', extractVideoFrames);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  window.removeEventListener('resize', handleResize);
});

// ─── Keyboard: Global Shortcuts (desktop only) ──────────────
function handleGlobalKeydown(event) {
  if (!isDesktop.value) return;
  if (isInteracting.value) return;

  const tag = event.target?.tagName?.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || event.target?.isContentEditable) return;

  const video = videoPlayer.value;
  if (!video) return;

  switch (event.code) {
    case 'Space':
    case 'KeyK':
      event.preventDefault();
      video.paused ? video.play() : video.pause();
      playbackRate.value = 1;
      video.playbackRate = 1;
      break;

    case 'KeyJ':
      event.preventDefault();
      playbackRate.value = Math.max(playbackRate.value - 1, -4);
      if (playbackRate.value < 0) {
        video.pause();
        video.currentTime = Math.max(0, video.currentTime + playbackRate.value * 0.1);
      } else {
        video.playbackRate = playbackRate.value || 1;
      }
      break;
    case 'KeyL':
      event.preventDefault();
      playbackRate.value = Math.min(playbackRate.value + 1, 4);
      video.playbackRate = Math.max(playbackRate.value, 0.25);
      video.play();
      break;

    case 'Comma':
      event.preventDefault();
      if (event.shiftKey) {
        video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
        playbackRate.value = video.playbackRate;
      } else {
        video.pause();
        video.currentTime = Math.max(0, video.currentTime - FRAME_STEP);
      }
      break;
    case 'Period':
      event.preventDefault();
      if (event.shiftKey) {
        video.playbackRate = Math.min(4, video.playbackRate + 0.25);
        playbackRate.value = video.playbackRate;
      } else {
        video.pause();
        video.currentTime = Math.min(video.duration, video.currentTime + FRAME_STEP);
      }
      break;

    case 'ArrowLeft':
      event.preventDefault();
      video.currentTime = Math.max(0, video.currentTime - SEEK_STEP);
      break;
    case 'ArrowRight':
      event.preventDefault();
      video.currentTime = Math.min(video.duration, video.currentTime + SEEK_STEP);
      break;

    case 'ArrowUp':
      event.preventDefault();
      video.volume = Math.min(1, video.volume + VOLUME_STEP);
      break;
    case 'ArrowDown':
      event.preventDefault();
      video.volume = Math.max(0, video.volume - VOLUME_STEP);
      break;

    case 'KeyM':
      event.preventDefault();
      video.muted = !video.muted;
      break;

    case 'Home':
      event.preventDefault();
      video.currentTime = 0;
      break;
    case 'End':
      event.preventDefault();
      video.currentTime = video.duration;
      break;

    case 'BracketLeft':
      event.preventDefault();
      playPreviousSegment();
      break;
    case 'BracketRight':
      event.preventDefault();
      playNextSegment();
      break;

    case 'KeyS':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        saveAllSegments();
      }
      break;

    case 'KeyC':
      if ((event.ctrlKey || event.metaKey) && !window.getSelection()?.toString()) {
        event.preventDefault();
        copyTranscript();
      }
      break;

    case 'Escape':
      if (showShortcuts.value) {
        showShortcuts.value = false;
      } else if (downloadModal.value) {
        closeDownloadModal();
      }
      break;
  }
}

// ─── Helpers ─────────────────────────────────────────────────
function showMessage(message, isError = false) {
  saveStatusMessage.value = message;
  isSaveError.value = isError;
  showSaveStatus.value = true;
  setTimeout(() => {
    showSaveStatus.value = false;
    saveStatusMessage.value = '';
    isSaveError.value = false;
  }, 2500);
}

function extractTimeInSeconds(timeObject) {
  if (!timeObject) return 0;

  if (typeof timeObject === 'object') {
    const seconds = typeof timeObject.seconds === 'string'
      ? parseInt(timeObject.seconds)
      : timeObject.seconds || 0;
    const nanos = timeObject.nanos || 0;
    return seconds + (nanos / 1_000_000_000);
  }

  if (typeof timeObject === 'string') {
    if (timeObject.includes('s')) return parseFloat(timeObject.replace('s', ''));
    if (timeObject.includes(':')) {
      const parts = timeObject.split(':');
      if (parts.length === 3) return (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseFloat(parts[2]);
      if (parts.length === 2) return (parseInt(parts[0]) * 60) + parseFloat(parts[1]);
    }
    return parseFloat(timeObject);
  }

  return Number(timeObject) || 0;
}

// ─── Video Setup ─────────────────────────────────────────────
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
  if (!video) return;

  currentVideoTime.value = video.currentTime;

  if (loopingSegment.value && !video.paused && currentVideoTime.value >= loopingSegment.value.endTime) {
    isLoopingSeek.value = true;
    video.currentTime = loopingSegment.value.startTime;
    video.play();
  }

  updateCurrentSegment();
}

function onVideoSeeking() {
  if (isLoopingSeek.value) {
    isLoopingSeek.value = false;
  } else {
    loopingSegment.value = null;
  }
  updateCurrentSegment();
}

// ─── Timeline Seek ───────────────────────────────────────────
function handleTimelineSeek(timeInSeconds) {
  loopingSegment.value = null;
  const video = videoPlayer.value;
  if (!video) return;
  video.currentTime = timeInSeconds;
}

// ─── Frame Extraction ────────────────────────────────────────
async function extractVideoFrames() {
  if (!videoPlayer.value) return;

  framesLoading.value = true;
  const video = videoPlayer.value;

  const hiddenVideo = document.createElement('video');
  hiddenVideo.crossOrigin = 'anonymous';
  hiddenVideo.muted = true;
  hiddenVideo.style.display = 'none';
  document.body.appendChild(hiddenVideo);
  hiddenVideo.src = video.currentSrc || video.src;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  try {
    await new Promise((resolve, reject) => {
      hiddenVideo.addEventListener('loadedmetadata', resolve, { once: true });
      hiddenVideo.addEventListener('error', reject, { once: true });
      hiddenVideo.load();
    });

    const duration = hiddenVideo.duration;
    const frameCount = 20;
    const frames = [];
    canvas.width = 160;
    canvas.height = 90;

    for (let i = 0; i < frameCount; i++) {
      hiddenVideo.currentTime = Math.min((duration / frameCount) * i, duration - 0.1);
      await new Promise((resolve) => {
        hiddenVideo.addEventListener('seeked', resolve, { once: true });
      });
      ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL('image/jpeg', 0.6));
    }

    videoFrames.value = frames;
  } catch (error) {
    console.error('Error extracting video frames:', error);
  } finally {
    document.body.removeChild(hiddenVideo);
    framesLoading.value = false;
  }
}

// ─── Video Scaling ───────────────────────────────────────────
function getVideoDimensions() {
  const videoEl = videoPlayer.value;
  if (videoEl) {
    if (videoEl.videoWidth && videoEl.videoHeight) {
      return { width: videoEl.videoWidth, height: videoEl.videoHeight };
    }
    if (videoEl.clientWidth && videoEl.clientHeight) {
      return { width: Math.round(videoEl.clientWidth), height: Math.round(videoEl.clientHeight) };
    }
  }
  return { width: 1080, height: 1920 };
}

function computeScaledStyle(preset, videoWidth, videoHeight) {
  const backend = preset?.backendOpts || {};
  const isTiktok = preset?.id === 'tiktok';

  const previewFontPxRaw = Math.round(BASE_PREVIEW_FONT_PX * (videoHeight / REFERENCE_HEIGHT));
  const previewFontPx = Math.min(Math.max(previewFontPxRaw, 12), 128);

  const fontSizeAss = isTiktok
    ? Math.max(10, Math.round(videoHeight * ASS_FONT_FACTOR * 1.8))
    : Math.max(10, Math.round(videoHeight * ASS_FONT_FACTOR));

  const outline = Math.min(Math.max(Math.round((backend.outline ?? 4) * (videoHeight / REFERENCE_HEIGHT)), 0), 64);
  const marginV = Math.max(0, Math.round((backend.marginV ?? 120) * (videoHeight / REFERENCE_HEIGHT)));
  const shadow = Math.max(0, Math.round((backend.shadow ?? 0) * (videoHeight / REFERENCE_HEIGHT)));

  return {
    previewFontPx,
    fontSizeAss,
    outline,
    marginV,
    shadow,
    borderStyle: backend.borderStyle ?? 1,
    alignment: Number(backend.alignment ?? 2),
    previewCss: preset?.previewCss ?? {},
  };
}

// ─── Filename Editing ────────────────────────────────────────
function startEditingFilename() {
  isEditingFilename.value = true;
  editedFilename.value = originalFilenameLocal.value || '';
  filenameError.value = null;
  setInteracting(true);
  nextTick(() => filenameInput.value?.focus());
}

function cancelEditingFilename() {
  isEditingFilename.value = false;
  editedFilename.value = '';
  filenameError.value = null;
  setInteracting(false);
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
    await apiClient.post(
      `/update-filename/${transaction.value.processing_id}`,
      { original_filename: editedFilename.value.trim() }
    );

    // In route mode, also persist to Supabase
    if (!isPropsMode.value) {
      const { error } = await supabase
        .from('transactions')
        .update({
          original_filename: editedFilename.value.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.value.id);

      if (error) throw error;
    }

    originalFilenameLocal.value = editedFilename.value.trim();
    transaction.value.original_filename = editedFilename.value.trim();
    isEditingFilename.value = false;
    editedFilename.value = '';
    setInteracting(false);
    showAlert('success', 'Emri i ri u ruajt me sukses');
  } catch (e) {
    filenameError.value = e.response?.data?.message || e.message;
  } finally {
    isSavingFilename.value = false;
  }
}

function handleFilenameKeydown(event) {
  if (event.key === 'Enter') saveFilename();
  else if (event.key === 'Escape') cancelEditingFilename();
}

// ─── Transcript Segment Creation ─────────────────────────────
function createTranscriptSegments(transcriptionJson = null) {
  const json = transcriptionJson || transaction.value?.transcription_json;
  if (!json || !json.results) return;

  const currentMaxWords = maxWordsPerSegment.value;
  const currentOverlapThreshold = segmentOverlapThreshold.value;

  let allWords = [];
  json.results.forEach(result => {
    if (result.words && Array.isArray(result.words)) {
      allWords.push(
        ...result.words.map(word => ({
          text: word.word,
          startTime: extractTimeInSeconds(word.startOffset),
          endTime: extractTimeInSeconds(word.endOffset),
        }))
      );
    }
  });

  if (allWords.length === 0 && json.results[0]?.alternatives?.[0]?.words) {
    allWords.push(
      ...json.results[0].alternatives[0].words.map(word => ({
        text: word.word,
        startTime: extractTimeInSeconds(word.startTime),
        endTime: extractTimeInSeconds(word.endTime),
      }))
    );
  }

  allWords.sort((a, b) => a.startTime - b.startTime);

  const segments = [];
  let current = { words: [], startTime: 0, endTime: 0, text: '', originalText: '', editText: '', isEditing: false };

  for (const word of allWords) {
    if (current.words.length === 0) {
      current.startTime = word.startTime;
      current.words.push(word);
    } else if (
      current.words.length >= currentMaxWords ||
      word.startTime - current.words[current.words.length - 1].endTime > currentOverlapThreshold
    ) {
      current.endTime = current.words[current.words.length - 1].endTime;
      current.text = current.words.map(w => w.text).join(' ');
      current.originalText = current.text;
      current.editText = current.text;
      segments.push(current);

      current = { words: [word], startTime: word.startTime, endTime: 0, text: '', originalText: '', editText: '', isEditing: false };
    } else {
      current.words.push(word);
    }
  }

  if (current.words.length > 0) {
    current.endTime = current.words[current.words.length - 1].endTime;
    current.text = current.words.map(w => w.text).join(' ');
    current.originalText = current.text;
    current.editText = current.text;
    segments.push(current);
  }

  transcriptSegments.value = segments;
}

function reprocessSegments() {
  if (!hasOriginalTranscription.value) return;
  if (hasUnsavedChanges.value && !confirm('Unsaved changes will be lost. Continue?')) return;
  createTranscriptSegments();
  showAlert('success','Segmentet u përpunuan përsëri');
}

// ─── Transcript Editing ──────────────────────────────────────
function beginEdit(index) {
  transcriptSegments.value.forEach((s, idx) => {
    if (idx !== index && s.isEditing) {
      s.isEditing = false;
      s.editText = s.text;
    }
  });
  transcriptSegments.value[index].isEditing = true;
  transcriptSegments.value[index].editText = transcriptSegments.value[index].text;
  setInteracting(true);
}

function saveSegment({ index, text }) {
  transcriptSegments.value[index].text = text;
  transcriptSegments.value[index].isEditing = false;
  setInteracting(false);
  saveAllSegments();
}

function cancelEdit(index) {
  transcriptSegments.value[index].isEditing = false;
  transcriptSegments.value[index].editText = transcriptSegments.value[index].text;
  setInteracting(false);
}

// ─── Transcript Save & Rebuild ───────────────────────────────
function rebuildTranscriptionJson() {
  if (!transaction.value?.transcription_json) return null;

  const updatedJson = {
    text: transcriptSegments.value.map(s => s.text).join(' '),
    results: [],
  };

  transcriptSegments.value.forEach(segment => {
    const segmentWords = segment.text.split(/\s+/).filter(w => w.trim());
    const words = [];
    let originalWordIndex = 0;

    segmentWords.forEach((editedWord) => {
      const originalWord = segment.words[originalWordIndex] || segment.words[segment.words.length - 1];
      if (originalWord) {
        words.push({
          word: editedWord,
          startOffset: originalWord.startOffset || {
            seconds: Math.floor(originalWord.startTime || 0),
            nanos: Math.floor(((originalWord.startTime || 0) % 1) * 1e9),
          },
          endOffset: originalWord.endOffset || {
            seconds: Math.floor(originalWord.endTime || 0),
            nanos: Math.floor(((originalWord.endTime || 0) % 1) * 1e9),
          },
          confidence: originalWord.confidence || 0.9,
          speakerLabel: originalWord.speakerLabel || '',
        });
        originalWordIndex++;
      }
    });

    if (words.length > 0) {
      updatedJson.results.push({
        words,
        confidence: segment.words[0]?.confidence || 0.9,
        transcript: segment.text,
      });
    }
  });

  return updatedJson;
}

async function saveAllSegments() {
  if (!transaction.value?.processing_id) {
    showMessage('Processing ID not found', true);
    return;
  }

  isSavingTranscript.value = true;

  try {
    const updatedJson = rebuildTranscriptionJson();
    if (!updatedJson) throw new Error('Failed to rebuild transcription JSON');

    await apiClient.post(
      `/update-transcription/${transaction.value.processing_id}`,
      { transcription_json: updatedJson }
    );

    if (!isPropsMode.value) {
      // Route mode: re-fetch the canonical data from Supabase
      const { data: updatedTransaction, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('processing_id', transaction.value.processing_id)
        .single();

      if (fetchError) throw new Error(`Failed to fetch updated data: ${fetchError.message}`);

      if (updatedTransaction) {
        transaction.value = { ...updatedTransaction, video_url: transaction.value.video_url };
        if (updatedTransaction.transcription_json) {
          createTranscriptSegments(updatedTransaction.transcription_json);
        }
      }
    } else {
      // Props mode: update local transaction state directly from rebuilt JSON
      transaction.value = { ...transaction.value, transcription_json: updatedJson };
      createTranscriptSegments(updatedJson);
    }

    transcriptSegments.value.forEach(segment => {
      segment.isEditing = false;
    });

    showAlert('success', 'Transkripti u ruajt me sukses');
  } catch (error) {
    console.error('Error:', error);
    showAlert('error', `${error.message}`);
  } finally {
    isSavingTranscript.value = false;
  }
}

// ─── Playback & Navigation ───────────────────────────────────
function playSegment(segment) {
  loopingSegment.value = null;
  const video = videoPlayer.value;
  if (!video) return;
  video.currentTime = segment.startTime;
  video.play();
}

function loopSegment(segment) {
  const video = videoPlayer.value;
  if (!video) return;

  loopingSegment.value = segment;
  isLoopingSeek.value = true;

  const END_BUFFER = 0.08;

  video.ontimeupdate = null;
  video.ontimeupdate = () => {
    if (!loopingSegment.value) return;
    const segmentEnd = Math.min(segment.endTime, video.duration);
    if (video.currentTime >= segmentEnd - END_BUFFER) {
      video.currentTime = segment.startTime;
      video.play();
    }
  };

  video.currentTime = segment.startTime;
  video.play();
}

function playPreviousSegment() {
  loopingSegment.value = null;
  if (currentSegmentIndex.value > 0) {
    playSegment(transcriptSegments.value[currentSegmentIndex.value - 1]);
  }
}

function playNextSegment() {
  loopingSegment.value = null;
  if (currentSegmentIndex.value < transcriptSegments.value.length - 1) {
    playSegment(transcriptSegments.value[currentSegmentIndex.value + 1]);
  }
}

function updateCurrentSegment() {
  const time = currentVideoTime.value;
  let newIndex = -1;

  for (let i = 0; i < transcriptSegments.value.length; i++) {
    const s = transcriptSegments.value[i];
    if (time >= s.startTime && time <= s.endTime) {
      newIndex = i;
      break;
    }
  }

  if (newIndex === -1) {
    for (let i = 0; i < transcriptSegments.value.length; i++) {
      if (time < transcriptSegments.value[i].startTime) break;
      newIndex = i;
    }
  }

  currentSegmentIndex.value = newIndex;
  scrollToCurrentSegment();
}

function scrollToCurrentSegment() {
  if (currentSegmentIndex.value < 0) return;
  if (isInteracting.value) return;

  nextTick(() => {
    const el = segmentRefs.value[currentSegmentIndex.value]?.$el;
    const container = transcriptPanelRef.value;
    if (!el || !container) return;

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const isVisible =
      elRect.top >= containerRect.top &&
      elRect.bottom <= containerRect.bottom;

    if (!isVisible) {
      const scrollTarget = el.offsetTop - container.offsetTop - (containerRect.height / 2) + (elRect.height / 2);
      container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
  });
}

// ─── Subtitle Downloads ──────────────────────────────────────
async function handleSubtitleDownload({ format, maxChars, minSeconds, gapBetweenFrames, subtitleStyle }) {
  if (!transaction.value?.processing_id) return

  if (hasUnsavedChanges.value) {
    showAlert('warning', 'Ju lutemi ruani të gjitha ndryshimet e transkriptit para se të shkarkoni.');
    return
  }

  try {
    const params = new URLSearchParams({
      maxChars,
      minSeconds,
      gapBetweenFrames,
      subtitleStyle,
      t: Date.now(),
    })

    const downloadUrl = `${resolvedApiUrl.value}/download-${format.toLowerCase()}/${transaction.value.processing_id}?${params}`
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${
      originalFilenameLocal.value
        ? originalFilenameLocal.value.replace(/\.[^/.]+$/, '')
        : 'transcript'
    }.${format.toUpperCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    closeDownloadModal()
  } catch (e) {
    console.error('Download error:', e)
    showAlert('error', `Shkarkimi dështoi: ${e.message || 'Gabim i panjohur'}`);
  }
}


function copyTranscript() {
  const fullText = transcriptSegments.value.map(s => s.text).join(' ');
  navigator.clipboard.writeText(fullText)
    .then(() => showAlert('success', 'Transkripti u kopjua'))
    .catch(() => showAlert('error', 'Kopjimi dështoi'));
}

// ─── Embedded Captions Download ──────────────────────────────
function downloadEmbeddedCaptionsModalCall() {
  downloadModal.value = true;
}

function closeDownloadModal() {
  downloadModal.value = false;
}

async function downloadWithSelectedStyle() {
  if (hasUnsavedChanges.value) {
    showAlert('warning', 'Ju lutemi ruani të gjitha ndryshimet e transkriptit para se të shkarkoni videon.');
    return;
  }
  if (!transaction.value?.video_url) {
    showAlert('warning', 'URL e videos mungon.');
    return;
  }

  isDownloadingVideo.value = true;
  showAlert('warning', 'Përgatitja e videos me titra të integruar, ju lutemi prisni...');

  try {
    const preset = currentPreset.value;

    const segments = transcriptSegments.value.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
      text: s.text,
      words: (s.words || []).map(w => ({
        text: w.text,
        startTime: w.startTime,
        endTime: w.endTime,
      })),
    }));

    const { width: outputWidth, height: outputHeight } = getVideoDimensions();
    const scaled = computeScaledStyle(preset, outputWidth, outputHeight);

    const stylePayload = {
      ...preset.backendOpts,
      fontSize: scaled.fontSizeAss,
      outline: scaled.outline,
      marginV: scaled.marginV,
      shadow: scaled.shadow,
      alignment: scaled.alignment,
      videoWidth: outputWidth,
      videoHeight: outputHeight,
    };

    const response = await apiClient.post('/render-captioned-video', {
      videoPath: transaction.value.video_url,
      transcript: { segments },
      style: stylePayload,
      output: { width: outputWidth, height: outputHeight },
    }, { responseType: 'blob' });

    const blob = response.data;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const baseName = (transaction.value.original_filename || 'video').replace(/\.[^/.]+$/, '');
    link.href = url;
    link.download = `${baseName}-captioned.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    closeDownloadModal();
    setTimeout(() => showAlert('success', 'Video shkarkuar me sukses!'), 2500);
  } catch (error) {
    console.error('Error downloading video:', error);
    showAlert('error', `Gabim: ${error.message}`);
  } finally {
    isDownloadingVideo.value = false;
  }
}

</script>

<template>
  <div class="relative h-screen w-screen flex flex-col">
    <!-- Status Message -->
    <div v-if="showSaveStatus" class="absolute inset-x-0 top-0 flex justify-center z-[100]">
      <div
        class="border rounded-lg px-4 py-3 fixed top-4 mx-4 animate-fade-in-down"
        role="alert"
        :class="isSaveError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'"
      >
        <div v-if="isSaveError" class="flex gap-1">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline">{{ saveStatusMessage }}</span>
        </div>
        <div v-else>
          <strong class="font-bold">Success!</strong>
          <span class="block sm:inline">{{ saveStatusMessage }}</span>
        </div>
      </div>
    </div>

    <div class="w-full sticky top-0 z-40 bg-white 2xl:border-b-4 border-b border-gray-200">
  <div class="flex items-center gap-3 px-5 4xl:h-22 2xl:h-20 xl:h-17 lg:h-14">

    <!-- LEFT: back -->
    <RouterLink
      to="/dashboard"
      class="4xl:text-3xl 2xl:text-xl lg:text-lg inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md px-2.5 py-1.5 transition-colors flex-shrink-0"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
      Kthehu
    </RouterLink>

    <div class="w-px h-5 bg-gray-200 flex-shrink-0"></div>

    <!-- CENTER: filename -->
    <div class="flex-1 flex items-center gap-2 min-w-0">
      <template v-if="!isEditingFilename">
        <span class="4xl:text-3xl 2xl:text-xl lg:text-lg font-medium text-gray-900 truncate">{{ originalFilenameLocal }}</span>
        <button
          @click="startEditingFilename"
          class="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z"/>
          </svg>
        </button>
      </template>
      <template v-else>
        <input
          ref="filenameInput"
          v-model="editedFilename"
          @blur="cancelEditingFilename"
          @keydown="handleFilenameKeydown"
          @focus="setInteracting(true)"
          class="flex-1 4xl:text-3xl 2xl:text-xl lg:text-lg font-medium text-gray-900 bg-transparent border-0 border-b-2 border-primary outline-none min-w-0 pb-px"
        />
        <button
          @mousedown.prevent="saveFilename"
          @keydown.prevent.enter="saveFilename"
          class="w-6 h-6 flex items-center justify-center rounded text-primary flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </button>
        <button
          @mousedown.prevent="cancelEditingFilename"
          class="w-6 h-6 flex items-center justify-center rounded text-gray-400 flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </template>
    </div>

    <!-- RIGHT: actions -->
    <div
      class="flex items-center gap-2 flex-shrink-0 transition-opacity"
      :class="isEditingFilename ? 'opacity-30 pointer-events-none' : 'opacity-100'"
    >

      <div class="w-px h-5 bg-gray-200"></div>

      <button
        @click="downloadEmbeddedCaptionsModalCall"
        class="4xl:text-3xl 2xl:text-xl lg:text-lg inline-flex items-center gap-1.5 font-medium text-white bg-primary rounded-md px-3.5 py-1.5 hover:bg-primary/90 transition-colors"
      >
        Shkarko Titrat
      </button>
    </div>

  </div>
</div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-24 text-xl text-[#92a3bb]">
      Duke mbledhur të dhënat e transkriptit
    </div>

    <!-- Unauthorized (route mode only) -->
    <div v-else-if="unauthorized" class="text-center py-24 text-red-400 text-xl">
      Ky veprim është i pa autorizuar.
      <RouterLink to='/signin' class="bg-primary text-white text-xl p-3">Auth</RouterLink>
    </div>

    <!-- Main Content -->
    <div v-else-if="transaction" class="w-full flex-1 min-h-0 p-2 bg-gray-50/50">

      <!-- ═══ MOBILE / TABLET: Stacked vertical layout (<lg) ═══ -->
      <div class="w-full h-full flex flex-col lg:hidden">

        <!-- Video -->
        <div class="relative flex-shrink-0 h-[35vh] md:h-[45vh]">
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
            :src="transaction.video_url"
          />
        </div>

        <!-- Timeline -->
        <div class="flex-shrink-0">
          <Timeline
            :current-time="currentVideoTime"
            :duration="videoDuration"
            :video-frames="videoFrames"
            :frames-loading="framesLoading"
            @seek="handleTimelineSeek"
          />
        </div>

        <!-- Segments -->
        <div ref="transcriptPanelRef" class="flex-1 min-h-0 overflow-y-auto scroll-smooth border-t border-gray-200">
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

      <!-- ═══ DESKTOP: Side-by-side layout (lg+) ═══ -->
      <div class="hidden lg:flex w-full h-full rounded-r-lg border-2 border-gray-200">

        <!-- Transcript Panel -->
        <div ref="transcriptPanelRef" class="w-1/3 xl:w-[30%] 4xl:w-[28%] h-full border-r-2 border-r-gray-200 overflow-y-auto scroll-smooth">
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

        <!-- Video Panel -->
        <div class="w-2/3 xl:w-[70%] 4xl:w-[72%] h-full flex flex-col relative">
          <video
            ref="videoPlayer"
            class="w-full h-full bg-transparent"
            playsinline
            webkit-playsinline
            @timeupdate="onVideoTimeUpdate"
            @play="isVideoPlaying = true"
            @pause="isVideoPlaying = false"
            @seeking="onVideoSeeking"
            :src="transaction.video_url"
          />

          <!-- Shortcuts Button (desktop only) -->
          <div class="absolute top-3 right-3 z-10">
            <button
              @click="showShortcuts = !showShortcuts"
              class="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-white/40"
              :class="showShortcuts ? 'bg-black/70 border-white/40' : ''"
              title="Keyboard shortcuts"
            >
              <span class="text-sm xl:text-base font-bold">?</span>
            </button>

            <transition name="shortcuts">
              <div
                v-if="showShortcuts"
                class="absolute top-10 xl:top-11 right-0 w-64 xl:w-72 bg-black/85 backdrop-blur-md rounded-lg border border-white/15 shadow-2xl overflow-hidden"
              >
                <div class="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                  <span class="text-white/90 text-xs font-bold uppercase tracking-wider">Veprime Tastiere</span>
                  <button @click="showShortcuts = false" class="text-white/40 hover:text-white/80 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/>
                    </svg>
                  </button>
                </div>
                <div class="max-h-80 overflow-y-auto py-1">
                  <div v-for="group in shortcutGroups" :key="group.label" class="px-3 py-1.5">
                    <p class="text-[10px] xl:text-[11px] font-bold uppercase tracking-wider text-secondary/80 mb-1">{{ group.label }}</p>
                    <div
                      v-for="shortcut in group.shortcuts"
                      :key="shortcut.keys"
                      class="flex items-center justify-between py-0.5"
                    >
                      <span class="text-white/50 text-[11px] xl:text-xs">{{ shortcut.action }}</span>
                      <kbd class="text-[10px] xl:text-[11px] bg-white/10 text-white/80 px-1.5 py-0.5 rounded font-mono border border-white/10">{{ shortcut.keys }}</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-24 text-[#92a3bb]">Transaction not found.</div>

    <!-- Timeline (desktop only — mobile has it inline above) -->
    <div class="hidden lg:block">
      <Timeline
        v-if="transaction && !loading"
        :current-time="currentVideoTime"
        :duration="videoDuration"
        :video-frames="videoFrames"
        :frames-loading="framesLoading"
        @seek="handleTimelineSeek"
      />
    </div>
  </div>
    <transition name="fade">
      <DownloadModal
        v-if="downloadModal"
        :segments="transcriptSegments"
        @close="closeDownloadModal"
        @download="handleSubtitleDownload"
      />
    </transition>
</template>

<style scoped>
input[type="range"] { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 5px; outline: none; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #052B28; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #052B28; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.shortcuts-enter-active { transition: all 0.2s ease-out; }
.shortcuts-leave-active { transition: all 0.15s ease-in; }
.shortcuts-enter-from { opacity: 0; transform: translateY(-8px) scale(0.95); }
.shortcuts-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }
</style>