<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import SegmentRow from '@/components/subcomponents/SegmentRow.vue';
import apiClient from '@/stores/apiClient'
import ProcessingOverlay from '@/components/subcomponents/ProcessingOverlay.vue';

const route = useRoute();
const router = useRouter();
const isMenuOpen = ref(false);
const transaction = ref(null);
const loading = ref(true);
const unauthorized = ref(false);

// Video player reference
const videoPlayer = ref(null);
const loopingSegment = ref(null);
const isLoopingSeek = ref(false);

// UI state properties
const isDownloadingSRT = ref(false);
const isDownloadingVideo = ref(false);
const downloadModal = ref(false);
const isSavingTranscript = ref(false);
const showSubtitleDropdown = ref(false);

// Modal State
const selectedPresetId = ref('karaoke');

// Message/Alert state
const showSaveStatus = ref(false);
const saveStatusMessage = ref('');
const isSaveError = ref(false);

// Video playback properties
const currentVideoTime = ref(0);
const videoDuration = ref(0);
const isVideoPlaying = ref(false);

// Transcript related
const transcriptSegments = ref([]);
const currentSegmentIndex = ref(-1);
const hasOriginalTranscription = ref(false);

// Filename editing
const originalFilenameLocal = ref('');
const isEditingFilename = ref(false);
const editedFilename = ref('');
const isSavingFilename = ref(false);
const filenameError = ref(null);
const filenameInput = ref(null);

// Processing overlay (embedding download)
const overlay = ref(null);
const processingState = ref(null);
const processingStep = ref(null);

// --- PRESETS CONFIGURATION ---
const captionPresets = [
  {
    id: 'tiktok',
    name: 'TikTok Style',
    description: 'Big bold text, 2-3 words at a time.',
    previewCss: { 
      color:  '#FFFFFF', 
      textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000', 
      background: 'transparent' 
    },
    backendOpts:  {
      karaoke: true,
      primaryColour: '&H0000FFFF&',   // Active Word (Yellow) - BGR format
      secondaryColour: '&H00FFFFFF&', // Inactive Word (White)
      outlineColour: '&H00000000&',   // Black Outline
      backColour: '&H00000000&',
      borderStyle: 1,
      outline: 6,
      fontSize: 120,
      alignment: 5,      // Center of screen (middle)
      marginV: 0,
      shadow: 2
    },
    maxWordsPerSegment: 3,
    overlapThreshold: 0.5
  },
  {
    id: 'karaoke',
    name: 'Karaoke (Active)',
    description: 'Green highlight on spoken words.',
    previewCss: { color: '#9FE29E', textShadow: '2px 2px 0 #000', background: 'transparent' },
    backendOpts:  {
      karaoke: true,
      primaryColour: '&H009EE29F&',   // Active Word (Green) - BGR format
      secondaryColour: '&H00FFFFFF&', // Inactive Word (White)
      outlineColour:  '&H00000000&',   // Black Outline
      backColour: '&H00000000&',
      borderStyle:  1,
      outline: 4,
      fontSize: 72,
      alignment: 2,
      marginV: 120
    },
    maxWordsPerSegment: 15,
    overlapThreshold:  1.5
  },
  {
    id: 'classic',
    name: 'Classic White',
    description: 'Clean white text with outline.',
    previewCss: { color: '#FFFFFF', textShadow: '2px 2px 0 #000', background: 'transparent' },
    backendOpts:  {
      karaoke: false,
      primaryColour: '&H00FFFFFF&',
      secondaryColour: '&H00FFFFFF&',
      outlineColour: '&H00000000&',
      backColour:  '&H00000000&',
      borderStyle: 1,
      outline: 4,
      fontSize: 72,
      alignment: 2,
      marginV: 120
    },
    maxWordsPerSegment:  15,
    overlapThreshold: 1.5
  },
  {
    id:  'boxed',
    name: 'Boxed Background',
    description: 'White text on semi-transparent box.',
    previewCss: { color: '#FFFFFF', textShadow: 'none', background: 'rgba(0,0,0,0.6)' },
    backendOpts: {
      karaoke: false,
      primaryColour: '&H00FFFFFF&',
      secondaryColour:  '&H00FFFFFF&',
      outlineColour: '&H00000000&',
      backColour: '&H80000000&',
      borderStyle: 3,
      outline: 0,
      fontSize: 64,
      alignment: 2,
      marginV: 120
    },
    maxWordsPerSegment: 15,
    overlapThreshold: 1.5
  }
];

// API URL
const apiUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:3000');

// Computed: current preset
const currentPreset = computed(() => {
  return captionPresets.find(p => p.id === selectedPresetId.value) || captionPresets[0];
});

// Computed: max words per segment based on preset
const maxWordsPerSegment = computed(() => {
  return currentPreset.value?.maxWordsPerSegment ??  15;
});

// Computed: overlap threshold based on preset
const segmentOverlapThreshold = computed(() => {
  return currentPreset.value?.overlapThreshold ??  1.5;
});

const hasUnsavedChanges = computed(() => {
  return transcriptSegments.value.some(s => s.originalText !== s.text || s.isEditing);
});

// Constants for scaling
const REFERENCE_HEIGHT = 1920;
const BASE_PREVIEW_FONT_PX = 32;
const ASS_FONT_FACTOR = 0.0375;

// Compute the video dimensions used for scaling
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

// Computes scaled style values for a preset given video dimensions
function computeScaledStyle(preset, videoWidth, videoHeight) {
  const backend = preset?.backendOpts || {};
  const borderStyle = backend.borderStyle ??  1;
  const baseOutline = backend.outline ?? 4;
  const baseMarginV = backend.marginV ??  120;
  const baseShadow = backend.shadow ??  0;
  const baseFontSizeAss = backend.fontSize ?? Math.round(videoHeight * ASS_FONT_FACTOR);

  const isTiktok = preset?.id === 'tiktok';

  // Preview font (CSS px) scaled from baseline preview size
  const previewFontPxRaw = Math.round(BASE_PREVIEW_FONT_PX * (videoHeight / REFERENCE_HEIGHT));
  const previewFontPx = Math.min(Math.max(previewFontPxRaw, 12), 128);

  // ASS font size - larger for TikTok style
  const fontSizeAss = isTiktok 
    ? Math.max(10, Math.round(videoHeight * ASS_FONT_FACTOR * 1.8))
    : Math.max(10, Math.round(videoHeight * ASS_FONT_FACTOR));

  // Outline scaled proportionally
  const outline = Math.min(Math.max(Math.round(baseOutline * (videoHeight / REFERENCE_HEIGHT)), 0), 64);

  // marginV scaled (vertical margin)
  const marginV = Math.max(0, Math.round(baseMarginV * (videoHeight / REFERENCE_HEIGHT)));

  // shadow scaled
  const shadow = Math.max(0, Math.round(baseShadow * (videoHeight / REFERENCE_HEIGHT)));

  return {
    previewFontPx,
    fontSizeAss,
    outline,
    marginV,
    shadow,
    borderStyle,
    alignment: Number(backend.alignment ??  2),
    previewCss: preset?.previewCss ??  {}
  };
}

// Computed Preview Wrapper Style
const currentPreviewWrapperStyle = computed(() => {
  const preset = currentPreset.value;
  const { width: vw, height:  vh } = getVideoDimensions();
  const scaled = computeScaledStyle(preset, vw, vh);

  const horizMap = {
    1: 'flex-start', 2: 'center', 3: 'flex-end',
    4: 'flex-start', 5: 'center', 6: 'flex-end',
    7: 'flex-start', 8: 'center', 9: 'flex-end'
  };
  const vertMap = {
    1: 'flex-end', 2: 'flex-end', 3: 'flex-end',
    4: 'center', 5: 'center', 6: 'center',
    7: 'flex-start', 8: 'flex-start', 9: 'flex-start'
  };

  const alignment = scaled.alignment || 2;
  const paddingBottom = [1,2,3].includes(alignment) ? `${scaled.marginV}px` : undefined;
  const paddingTop = [7,8,9].includes(alignment) ? `${scaled.marginV}px` : undefined;
  const middlePad = [4,5,6].includes(alignment) ? `${Math.round(scaled.marginV / 2)}px` : undefined;

  return {
    display: 'flex',
    justifyContent: horizMap[alignment] || 'center',
    alignItems: vertMap[alignment] || 'flex-end',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    paddingLeft: '4%',
    paddingRight: '4%',
    paddingBottom:  paddingBottom ??  middlePad,
    paddingTop: paddingTop ?? middlePad
  };
});

// Computed Caption Style
const currentPreviewCaptionStyle = computed(() => {
  const preset = currentPreset.value;
  const { width: vw, height:  vh } = getVideoDimensions();
  const scaled = computeScaledStyle(preset, vw, vh);

  const alignment = scaled.alignment || 2;
  const textAlignMap = {
    1: 'left', 2: 'center', 3: 'right',
    4: 'left', 5: 'center', 6: 'right',
    7: 'left', 8: 'center', 9: 'right'
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
    lineHeight: isTiktok ?  '1.2' : '1.4',
    textTransform: isTiktok ? 'uppercase' : 'none',
    letterSpacing: isTiktok ?  '2px' : 'normal',
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
    boxSizing: 'border-box'
  };
});

// Helper function to show status message
const showMessage = (message, isError = false) => {
  saveStatusMessage.value = message;
  isSaveError.value = isError;
  showSaveStatus.value = true;
  setTimeout(() => {
    showSaveStatus.value = false;
    saveStatusMessage.value = '';
    isSaveError.value = false;
  }, 2500);
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Watch for preset changes to re-segment
watch(selectedPresetId, (newId, oldId) => {
  const oldPreset = captionPresets.find(p => p.id === oldId);
  const newPreset = captionPresets.find(p => p.id === newId);
  
  const oldMax = oldPreset?.maxWordsPerSegment ??  15;
  const newMax = newPreset?.maxWordsPerSegment ?? 15;
  
  if (oldMax !== newMax && hasOriginalTranscription.value) {
    createTranscriptSegments();
  }
});

// Watch for transaction changes
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

  nextTick(() => {
    if (videoPlayer.value) {
      setupVideoEvents();
    }
  });
});

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
  if (! transaction.value?.processing_id) {
    filenameError.value = 'Processing ID not found';
    return;
  }

  isSavingFilename.value = true;
  filenameError.value = null;

  try {
    const response = await apiClient.post(
      `/update-filename/${transaction.value.processing_id}`,
      { original_filename: editedFilename.value.trim() }
    );

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
    showMessage('Filename updated successfully');
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
    
    // Loop Logic
    if (loopingSegment.value && !video.paused) {
      if (currentVideoTime.value >= loopingSegment.value.endTime) {
        isLoopingSeek.value = true;
        video.currentTime = loopingSegment.value.startTime;
        video.play();
      }
    }

    updateCurrentSegment();
  }
}

function onVideoSeeking() {
  if (isLoopingSeek.value) {
    // If seeking was triggered by our loop logic, just reset flag
    isLoopingSeek.value = false;
  } else {
    // If seeking was manual, clear the loop
    loopingSegment.value = null;
  }
  updateCurrentSegment();
}

function togglePlayback() {
  const video = videoPlayer.value;
  if (! video) return;
  if (video.paused) {
    video.play();
  } else {
    video.pause();
    loopingSegment.value = null; // Clear loop on pause
  }
}

function formatVideoTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function skipBackward(seconds) {
  loopingSegment.value = null; // Clear loop
  const video = videoPlayer.value;
  if (!video) return;
  video.currentTime = Math.max(0, video.currentTime - seconds);
}

function skipForward(seconds) {
  loopingSegment.value = null; // Clear loop
  const video = videoPlayer.value;
  if (!video) return;
  video.currentTime = Math.min(video.duration, video.currentTime + seconds);
}

function createTranscriptSegments(transcriptionJson = null) {
  const json = transcriptionJson || transaction.value?.transcription_json;
  if (!json || !json.results) return;

  // Get current max words and overlap threshold (reactive based on preset)
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
        text:  word.word,
        startTime: extractTimeInSeconds(word.startTime),
        endTime: extractTimeInSeconds(word.endTime),
      }))
    );
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
    isEditing:  false,
  };

  for (const word of allWords) {
    if (currentSegment.words.length === 0) {
      currentSegment.startTime = word.startTime;
      currentSegment.words.push(word);
    } else if (
      currentSegment.words.length >= currentMaxWords ||
      word.startTime - currentSegment.words[currentSegment.words.length - 1].endTime > currentOverlapThreshold
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
        isEditing: false,
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
  if (hasUnsavedChanges.value && !confirm('Unsaved changes will be lost.Continue? ')) return;
  createTranscriptSegments();
  showMessage('Segments reprocessed');
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
        words: words,
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

    await apiClient.post(`/update-transcription/${transaction.value.processing_id}`, { transcription_json: updatedJson });

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
      transcriptSegments.value.forEach(segment => {
        segment.isEditing = false;
      });
    }

    showMessage('Transcription saved successfully');
  } catch (error) {
    console.error('Error:', error);
    showMessage(`Error:  ${error.message}`, true);
  } finally {
    isSavingTranscript.value = false;
  }
}

function saveSegment({ index, text }) {
  transcriptSegments.value[index].text = text;
  transcriptSegments.value[index].isEditing = false;
  saveAllSegments();
}

function cancelEdit(index) {
  transcriptSegments.value[index].isEditing = false;
  transcriptSegments.value[index].editText = transcriptSegments.value[index].text;
}

function playSegment(segment) {
  // Regular play: clear any loop
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

  const END_BUFFER = 0.08; // smooth loop buffer (seconds)

  // Remove previous listener to avoid stacking
  video.ontimeupdate = null;

  video.ontimeupdate = () => {
    if (!loopingSegment.value) return;

    const duration = video.duration;
    const segmentEnd = Math.min(segment.endTime, duration);

    // Jump back BEFORE the video naturally ends
    if (video.currentTime >= segmentEnd - END_BUFFER) {
      video.currentTime = segment.startTime;
      video.play();
    }
  };

  // Start loop
  video.currentTime = segment.startTime;
  video.play();
}

function playPreviousSegment() {
  loopingSegment.value = null;
  if (currentSegmentIndex.value > 0) playSegment(transcriptSegments.value[currentSegmentIndex.value - 1]);
}

function playNextSegment() {
  loopingSegment.value = null;
  if (currentSegmentIndex.value < transcriptSegments.value.length - 1) playSegment(transcriptSegments.value[currentSegmentIndex.value + 1]);
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

    if (timeObject.includes(': ')) {
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

async function downloadSubtitles(format) {
  if (!transaction.value?.processing_id) return;

  if (hasUnsavedChanges.value) {
    showMessage('Please save all transcript edits before downloading.', true);
    return;
  }

  isDownloadingSRT.value = true;
  showSubtitleDropdown.value = false;

  try {
    const downloadUrl = `${apiUrl.value}/download-${format.toLowerCase()}/${transaction.value.processing_id}? t=${Date.now()}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${originalFilenameLocal.value ?  originalFilenameLocal.value.replace(/\.[^/.]+$/, '') : 'transcript'}.${format.toUpperCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('Download error:', e);
    showMessage(`Failed to download:  ${e.message || 'Unknown error'}`, true);
  } finally {
    isDownloadingSRT.value = false;
  }

  isMenuOpen.value = false;
}

function copyTranscript() {
  const fullText = transcriptSegments.value.map(s => s.text).join(' ');
  navigator.clipboard.writeText(fullText)
    .then(() => showMessage('Transkripti u kopjua'))
    .catch(err => showMessage('Kopjimi dështoi', true));
  isMenuOpen.value = false;
}

function downloadEmbeddedCaptionsModalCall() {
  downloadModal.value = true;
  selectedPresetId.value = 'tiktok'; // Default to TikTok style
  isMenuOpen.value = false;
}

function closeDownloadModal() {
  downloadModal.value = false;
}

async function downloadWithSelectedStyle() {
  if (hasUnsavedChanges.value) { 
    showMessage('Please save all transcript edits before downloading the video.', true); 
    return; 
  }
  if (!transaction.value?.video_url) { 
    showMessage('Video URL is missing.', true); 
    return; 
  }
  
  isDownloadingVideo.value = true;
  showMessage('Duke përpunuar videon...');

  processingState.value = 'embedding';
  processingStep.value = null;
  await nextTick();
  overlay.value?.start();
  
  try {
    const preset = currentPreset.value;
    
    const segments = transcriptSegments.value.map(s => ({
      startTime: s.startTime,
      endTime: s.endTime,
      text: s.text,
      words: (s.words || []).map(w => ({
        text: w.text,
        startTime: w.startTime,
        endTime: w.endTime
      }))
    }));

    const { width:  outputWidth, height: outputHeight } = getVideoDimensions();
    const scaled = computeScaledStyle(preset, outputWidth, outputHeight);

    const stylePayload = {
      ...preset.backendOpts,
      fontSize: scaled.fontSizeAss,
      outline: scaled.outline,
      marginV: scaled.marginV,
      shadow: scaled.shadow,
      alignment: scaled.alignment,
      videoWidth: outputWidth,
      videoHeight: outputHeight
    };

    const response = await apiClient.post(`/render-captioned-video`, { 
      videoPath: transaction.value.video_url, 
      transcript: { segments:  segments },
      style: stylePayload, 
      output: { width: outputWidth, height: outputHeight } 
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
    setTimeout(() => {
      showMessage('Video shkarkuar me sukses! ');
    }, 2500);

    processingState.value = 'complete';
    processingStep.value = null;
    overlay.value?.stop();
  } catch (error) {
    console.error('Error downloading video:', error);
    showMessage(`Gabim: ${error.message}`, true);
    processingState.value = 'error';
    processingStep.value = null;
    overlay.value?.stop();
  } finally {
    isDownloadingVideo.value = false;
  }
}
</script>

<template>
  <!-- Processing Overlay -->
  <ProcessingOverlay
    ref="overlay"
    :state="processingState"
    :step="processingStep"
  />

  <!-- Toast Notification -->
  <div
    v-if="showSaveStatus"
    class="fixed top-0 flex justify-center h-fit w-full z-[2000] p-3 duration-300 transition-all"
    :class="showSaveStatus ? 'translate-y-[30px]' : '-translate-y-[100px]'"
  >
    <div 
      class="w-fit h-fit p-3 rounded-xl flex items-center border justify-center text-sm font-poppins shadow-lg"
      :class="isSaveError ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-secondary text-[#12998e]'"
    >
      {{ saveStatusMessage }} 
    </div>
  </div>

  <div class="sticky top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b border-primary/10 py-3 px-4">
    <div class="container mx-auto flex items-center">
      <RouterLink to="/dashboard"
        class="inline-flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 group"
      >
        <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Kthehu</span>
      </RouterLink>
    </div>
  </div>
  
  <div class="min-h-screen text-white font-poppins p-6">
    <div class="container mx-auto">
      <div v-if="loading" class="text-center py-24 text-xl text-[#92a3bb]">
        Duke mbledhur të dhënat e transkriptit
      </div>
      <div v-else-if="unauthorized" class="text-center py-24 text-red-400 text-xl">
        Ky veprim është i pa autorizuar.
      </div>
      <div v-else-if="transaction" class="max-w-6xl mx-auto font-poppins">

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- Transcript Panel -->
          <div class="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            <div class="bg-[#FBFCFB] border-b border-gray-200 px-4 py-3 flex justify-between items-center shrink-0">
              <h2 class="text-lg text-kollektif-bold text-primary">Segmentet e transkriptuara</h2>
              <div class="md:flex hidden space-x-2">
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
              <div class="md:hidden block self-end">
                <button @click="toggleMenu" class="p-2 rounded-md bg-secondary text-primary hover:bg-secondary/70 cursor-pointer duration-200 transition-all">
                  <svg class="w-6 h-6" fill="#000000" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
                <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <a @click="copyTranscript" class="cursor-pointer block px-4 py-2 text-sm text-primary hover:bg-gray-100">Kopjo</a>
                  <a @click="downloadSubtitles('srt')" class="cursor-pointer block px-4 py-2 text-sm text-primary hover:bg-gray-100">Shkarko SRT</a>
                  <a @click="downloadSubtitles('vtt')" class="cursor-pointer block px-4 py-2 text-sm text-primary hover:bg-gray-100">Shkarko VTT</a>
                  <a @click="downloadEmbeddedCaptionsModalCall" class="cursor-pointer block px-4 py-2 text-sm text-primary hover:bg-gray-100">Shkarko me Titra</a>
                </div>
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
                @loop="loopSegment"
                @begin-edit="beginEdit"
                @save="saveSegment"
                @cancel-edit="cancelEdit"
              />
            </div>
          </div>

          <!-- Video Panel -->
          <div class="lg:col-span-2 flex flex-col gap-4">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="bg-[#FBFCFB] border-b border-gray-200 px-4 py-3">
                <div v-if="!isEditingFilename" class="flex items-center justify-between">
                  <h2 class="text-lg text-kollektif-bold text-primary truncate pr-2">{{ originalFilenameLocal }}</h2>
                  <button @click="startEditingFilename" class="shrink-0 px-3 py-1 text-xs bg-primary text-white rounded hover:bg-[#033027] transition-colors">Edito</button>
                </div>
                <div v-else class="flex items-center gap-2">
                  <input ref="filenameInput" v-model="editedFilename" @keydown="handleFilenameKeydown" type="text" class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-800" placeholder="Enter filename" />
                  <button @click="saveFilename" :disabled="isSavingFilename" class="px-2 py-1 bg-secondary text-primary rounded hover:bg-[#7ED089] text-xs">Ruaj</button>
                  <button @click="cancelEditingFilename" class="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs">Anulo</button>
                </div>
              </div>

              <div class="p-4">
                <div class="relative aspect-video bg-black rounded overflow-hidden">
                  <video ref="videoPlayer" class="w-full h-full object-contain" controls @timeupdate="onVideoTimeUpdate" @play="isVideoPlaying = true" @pause="isVideoPlaying = false" @seeking="onVideoSeeking" :src="transaction.video_url"></video>
                </div>

                <div class="mt-4 flex items-center justify-between px-2 py-2 bg-[#FBFCFB] rounded border border-gray-100">
                  <div class="flex items-center space-x-2">
                    <button @click="togglePlayback" class="p-1.5 rounded-full bg-white shadow hover:bg-[#F4F9F7] text-primary"><svg v-if="isVideoPlaying" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7-.75a.75.75 0 00-.75.75v13.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-1.5z" clip-rule="evenodd" /></svg><svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" /></svg></button>
                    <button @click="skipBackward(5)" class="flex items-center text-xs font-medium text-primary px-2 py-1 hover:bg-[#F4F9F7] rounded">-5s</button>
                  </div>
                  <div class="text-xs font-medium text-gray-600">{{ formatVideoTime(currentVideoTime) }} / {{ formatVideoTime(videoDuration) }}</div>
                  <button @click="skipForward(5)" class="flex items-center text-xs font-medium text-primary px-2 py-1 hover:bg-[#F4F9F7] rounded">+5s</button>
                </div>
                
                <div class="mt-2 flex justify-between">
                  <button @click="playPreviousSegment" class="flex items-center text-sm font-medium text-primary px-3 py-1.5 bg-[#FBFCFB] border border-gray-100 hover:bg-[#F4F9F7] rounded transition-colors" :disabled="currentSegmentIndex <= 0" :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex <= 0 }">Para</button>
                  <button @click="playNextSegment" class="flex items-center text-sm font-medium text-primary px-3 py-1.5 bg-[#FBFCFB] border border-gray-100 hover:bg-[#F4F9F7] rounded transition-colors" :disabled="currentSegmentIndex >= transcriptSegments.length - 1" :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex >= transcriptSegments.length - 1 }">Pas</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div v-else class="text-center py-24 text-[#92a3bb]">Transaction not found.</div>
    </div>
  </div>

  <!-- Simplified Download Modal -->
  <teleport to="body">
    <transition name="fade">
      <div v-if="downloadModal" class="fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-poppins">
        <div class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <!-- Header -->
          <div class="bg-primary px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 class="text-xl font-bold text-white">Shkarko videon me titra</h2>
              <p class="text-white/60 text-xs mt-0.5">Zgjidhni një stil për titrat tuaja</p>
            </div>
            <button @click="closeDownloadModal" class="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-hidden flex flex-col lg:flex-row">
            
            <!-- Left: Style Selection -->
            <div class="w-full lg:w-5/12 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 space-y-3">
              <div 
                v-for="preset in captionPresets"
                :key="preset.id"
                @click="selectedPresetId = preset.id"
                class="group cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md bg-white"
                :class="selectedPresetId === preset.id ? 'border-secondary ring-1 ring-secondary/30' : 'border-transparent hover:border-gray-200'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-primary">{{ preset.name }}</span>
                  <div class="w-4 h-4 rounded-full border flex items-center justify-center" :class="selectedPresetId === preset.id ? 'border-secondary bg-secondary' : 'border-gray-300'">
                    <div v-if="selectedPresetId === preset.id" class="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                </div>
                <p class="text-xs text-gray-500">{{ preset.description }}</p>
              </div>
            </div>

            <!-- Right: Preview -->
            <div class="w-full lg:w-7/12 bg-[#1a1a1a] relative flex items-center justify-center p-8 overflow-hidden">
              <div class="relative w-full aspect-[9/16] max-h-[60vh] bg-black shadow-2xl rounded-lg overflow-hidden border border-white/10">
                
                <!-- Dynamic Preview Text: wrapper controls placement based on ASS alignment -->
                <div :style="currentPreviewWrapperStyle">
                  <div :style="currentPreviewCaptionStyle">
                    Këtu shfaqen titrat<br>për videon tuaj
                  </div>
                </div>
                
                <div class="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-bold">PREVIEW</div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-end gap-3 shrink-0">
             <button @click="closeDownloadModal" class="px-6 py-2.5 text-sm text-gray-600 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" :disabled="isDownloadingVideo">Anulo</button>
            <button @click="downloadWithSelectedStyle" class="px-6 py-2.5 text-sm bg-secondary text-primary font-bold rounded-lg hover:bg-[#8cd68b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow transition-all" :disabled="isDownloadingVideo">
                <svg v-if="isDownloadingVideo" class="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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