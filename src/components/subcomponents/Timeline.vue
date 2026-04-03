<template>
  <div class="w-full h-fit p-2 flex-shrink-0">
    <div
      ref="timelineRef"
      @mousedown="handleTimelineMouseDown"
      @touchstart.prevent="handleTimelineTouchStart"
      @touchmove.prevent="handleTimelineTouchMove"
      @touchend="handleTimelineTouchEnd"
      class="w-full h-10 bg-black/80 rounded-lg relative overflow-hidden cursor-pointer select-none timeline-touch"
    >
      <!-- Video Frames Background -->
      <div class="absolute inset-0 flex">
        <template v-if="videoFrames.length > 0">
          <div
            v-for="(frame, i) in videoFrames"
            :key="i"
            class="flex-1 border-r border-white/10 bg-contain bg-center bg-no-repeat bg-black/40"
            :style="{ backgroundImage: `url(${frame})` }"
          />
        </template>
        <template v-else-if="framesLoading">
          <div
            v-for="i in 20"
            :key="i"
            class="flex-1 border-r border-white/10 relative overflow-hidden"
          >
            <div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </template>
        <template v-else>
          <div v-for="i in 20" :key="i" class="flex-1 border-r border-white/10" />
        </template>
      </div>

      <!-- Played Region -->
      <div
        class="absolute top-0 bottom-0 left-0 bg-secondary/20 z-[5] pointer-events-none"
        :style="{ width: `${playheadPosition}%` }"
      />

      <!-- Playhead -->
      <div
        :style="{ left: `${playheadPosition}%` }"
        class="absolute top-0 bottom-0 z-10 pointer-events-none"
      >
        <div class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-secondary rounded-full shadow-playhead"></div>
        <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-white shadow-md"></div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-white shadow-md"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  currentTime: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  videoFrames: { type: Array, default: () => [] },
  framesLoading: { type: Boolean, default: false },
});

const emit = defineEmits(['seek']);

const timelineRef = ref(null);
const isDragging = ref(false);
const dragPosition = ref(0);

const playheadPosition = computed(() => {
  if (isDragging.value) return dragPosition.value;
  if (!props.duration || props.duration === 0) return 0;
  return (props.currentTime / props.duration) * 100;
});

function getPercentageFromEvent(e) {
  if (!timelineRef.value) return 0;
  const rect = timelineRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  return Math.max(0, Math.min(100, (x / rect.width) * 100));
}

function getPercentageFromTouch(e) {
  if (!timelineRef.value || !e.touches.length) return dragPosition.value;
  const rect = timelineRef.value.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  return Math.max(0, Math.min(100, (x / rect.width) * 100));
}

function emitSeek(percentage) {
  if (!props.duration) return;
  emit('seek', (percentage / 100) * props.duration);
}

// Mouse
function handleTimelineMouseDown(e) {
  isDragging.value = true;
  const pct = getPercentageFromEvent(e);
  dragPosition.value = pct;
  emitSeek(pct);
}

function handleMouseMove(e) {
  if (!isDragging.value) return;
  const pct = getPercentageFromEvent(e);
  dragPosition.value = pct;
  emitSeek(pct);
}

function handleMouseUp() {
  isDragging.value = false;
}

// Touch
function handleTimelineTouchStart(e) {
  isDragging.value = true;
  const pct = getPercentageFromTouch(e);
  dragPosition.value = pct;
  emitSeek(pct);
}

function handleTimelineTouchMove(e) {
  if (!isDragging.value) return;
  const pct = getPercentageFromTouch(e);
  dragPosition.value = pct;
  emitSeek(pct);
}

function handleTimelineTouchEnd() {
  isDragging.value = false;
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped>
.timeline-touch {
  touch-action: none;
}

.shadow-playhead {
  box-shadow:
    0 0 6px rgba(156, 230, 155, 0.7),
    0 0 12px rgba(156, 230, 155, 0.3);
}
</style>