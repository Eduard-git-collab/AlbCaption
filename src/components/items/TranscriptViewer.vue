<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  originalFilename: String,
  transcriptionJson: Object,
  videoUrl: String,
  processingId: String,
  srtContent: String,
  canEdit: { type: Boolean, default: false }
});

const processingState = ref('complete');
const isEditingFilename = ref(false);
const editedFilename = ref(props.originalFilename);
const isSavingFilename = ref(false);
const filenameError = ref(null);
const saveStatus = ref(null);

const transcriptSegments = ref([]);
const currentSegmentIndex = ref(-1);
const currentVideoTime = ref(0);
const videoDuration = ref(0);
const isVideoPlaying = ref(false);
const maxWordsPerSegment = ref(15);
const segmentOverlapThreshold = ref(1.5);

const hasUnsavedChanges = computed(() =>
  transcriptSegments.value.some(seg => seg.originalText !== seg.text || seg.isEditing)
);

watch(() => props.transcriptionJson, (newJson) => {
  if (newJson) {
    createTranscriptSegments();
  }
}, { immediate: true, deep: true });

function createTranscriptSegments() {
  if (!props.transcriptionJson || !props.transcriptionJson.results) return;
  let allWords = [];
  props.transcriptionJson.results.forEach(result => {
    if (result.words && Array.isArray(result.words)) {
      const wordsFromResult = result.words.map(word => ({
        text: word.word,
        startTime: extractTimeInSeconds(word.startOffset),
        endTime: extractTimeInSeconds(word.endOffset)
      }));
      allWords = [...allWords, ...wordsFromResult];
    }
  });
  if (allWords.length === 0 && props.transcriptionJson.results[0]?.alternatives) {
    props.transcriptionJson.results.forEach(result => {
      if (result.alternatives[0]?.words) {
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

function extractTimeInSeconds(timeObject) {
  if (!timeObject) return 0;
  if (typeof timeObject === 'object') {
    const seconds = typeof timeObject.seconds === 'string' ? parseInt(timeObject.seconds) : timeObject.seconds || 0;
    const nanos = timeObject.nanos || 0;
    return seconds + (nanos / 1000000000);
  } else if (typeof timeObject === 'string') {
    if (timeObject.includes('s')) return parseFloat(timeObject.replace('s', ''));
    if (timeObject.includes(':')) {
      const parts = timeObject.split(':');
      let seconds = 0;
      if (parts.length === 3)
        seconds = (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseFloat(parts[2]);
      else if (parts.length === 2)
        seconds = (parseInt(parts[0]) * 60) + parseFloat(parts[1]);
      return seconds;
    }
    return parseFloat(timeObject);
  }
  return Number(timeObject) || 0;
}

function formatVideoTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function playSegment(segment) {
  const video = document.getElementById('tvideo');
  if (!video) return;
  video.currentTime = segment.startTime;
  video.play();
}

function playPreviousSegment() {
  if (currentSegmentIndex.value > 0) playSegment(transcriptSegments.value[currentSegmentIndex.value - 1]);
}
function playNextSegment() {
  if (currentSegmentIndex.value < transcriptSegments.value.length - 1)
    playSegment(transcriptSegments.value[currentSegmentIndex.value + 1]);
}

function updateCurrentSegment() {
  const currentTime = currentVideoTime.value;
  let newSegmentIndex = -1;
  for (let i = 0; i < transcriptSegments.value.length; i++) {
    const segment = transcriptSegments.value[i];
    if (currentTime >= segment.startTime && currentTime <= segment.endTime) {
      newSegmentIndex = i;
      break;
    }
  }
  if (newSegmentIndex === -1) {
    for (let i = 0; i < transcriptSegments.value.length; i++) {
      if (currentTime < transcriptSegments.value[i].startTime) break;
      newSegmentIndex = i;
    }
  }
  currentSegmentIndex.value = newSegmentIndex;
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

function isWordActive(word) {
  return currentVideoTime.value >= word.startTime && currentVideoTime.value < word.endTime;
}
function isWordPast(word) {
  return currentVideoTime.value >= word.endTime;
}

function onVideoTimeUpdate(e) {
  currentVideoTime.value = e.target.currentTime;
  updateCurrentSegment();
}
function onLoadedMetadata(e) {
  videoDuration.value = e.target.duration;
}
function togglePlayback() {
  const video = document.getElementById('tvideo');
  if (!video) return;
  if (video.paused) video.play();
  else video.pause();
}
function skipBackward(seconds) {
  const video = document.getElementById('tvideo');
  if (!video) return;
  video.currentTime = Math.max(0, video.currentTime - seconds);
}
function skipForward(seconds) {
  const video = document.getElementById('tvideo');
  if (!video) return;
  video.currentTime = Math.min(video.duration, video.currentTime + seconds);
}
</script>

<template>
  <div v-if="processingState === 'complete'" class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Transcript Panel -->
      <div class="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-gray-100 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-800">Transcript Segments</h2>
        </div>
        <div class="p-4">
          <div class="h-[calc(100vh-250px)] overflow-y-auto">
            <div 
              v-for="(segment, index) in transcriptSegments" 
              :key="index"
              class="mb-4 border border-gray-200 rounded-md transition-all"
              :class="{ 
                'bg-blue-50': currentSegmentIndex === index && !segment.isEditing,
                'shadow-md': segment.isEditing
              }"
            >
              <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                <div class="text-sm font-medium text-gray-700">
                  {{ formatVideoTime(segment.startTime) }} → {{ formatVideoTime(segment.endTime) }}
                </div>
                <div class="flex items-center">
                  <button @click="playSegment(segment)" class="p-1 text-blue-600 hover:text-blue-800 transition-colors" title="Play">
                    ▶
                  </button>
                </div>
              </div>
              <div class="px-3 py-2">
                <div class="py-1 relative min-h-[60px]">
                  <span 
                    v-for="(word, wordIndex) in segment.words" 
                    :key="`${index}-${wordIndex}`"
                    :class="[
                      'inline-block mr-1 px-0.5 rounded transition-colors duration-200',
                      isWordActive(word) ? 'bg-blue-500 text-white font-medium' : 
                      isWordPast(word) ? 'text-gray-500' : 'text-gray-800'
                    ]"
                  >{{ word.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Video Panel -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-gray-100 border-b border-gray-200 px-4 py-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-800">{{ props.originalFilename }}</h2>
          </div>
        </div>
        <div class="p-4">
          <div class="relative aspect-video bg-black rounded overflow-hidden">
            <video 
              id="tvideo"
              class="w-full h-full object-contain"
              controls
              @timeupdate="onVideoTimeUpdate"
              @loadedmetadata="onLoadedMetadata"
              :src="props.videoUrl"
            ></video>
          </div>
          <div class="mt-4 flex items-center justify-between px-2 py-2 bg-gray-100 rounded">
            <div class="flex items-center space-x-3">
              <button @click="togglePlayback" class="p-1.5 rounded-full bg-white shadow hover:bg-gray-50">
                <span v-if="isVideoPlaying">⏸</span>
                <span v-else>▶️</span>
              </button>
              <button @click="skipBackward(5)" class="flex items-center text-xs font-medium text-gray-700 px-2 py-1 hover:bg-gray-200 rounded">
                <span>⏪ 5s</span>
              </button>
            </div>
            <div class="text-xs font-medium text-gray-600">
              {{ formatVideoTime(currentVideoTime) }} / {{ formatVideoTime(videoDuration) }}
            </div>
            <button @click="skipForward(5)" class="flex items-center text-xs font-medium text-gray-700 px-2 py-1 hover:bg-gray-200 rounded">
              <span>5s ⏩</span>
            </button>
          </div>
          <div class="mt-4 flex justify-between">
            <button @click="playPreviousSegment" class="flex items-center text-sm font-medium text-gray-700 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              :disabled="currentSegmentIndex <= 0"
              :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex <= 0 }"
            >Previous</button>
            <button @click="playNextSegment" class="flex items-center text-sm font-medium text-gray-700 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              :disabled="currentSegmentIndex >= transcriptSegments.length - 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex >= transcriptSegments.length - 1 }"
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>