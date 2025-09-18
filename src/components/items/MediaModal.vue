<template>
    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[10000]">
        <!-- Backdrop (click outside to close) -->
        <div class="absolute inset-0 bg-black/70" @click.self="close" />
  
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow text-primary focus:outline-none"
          @click="close"
          aria-label="Mbyll"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
  
        <!-- Content -->
        <div class="relative w-full h-full flex items-center justify-center p-4">
          <!-- Prev -->
          <button
            v-if="canPrev"
            class="absolute left-3 md:left-6 p-2 rounded-full bg-white/80 hover:bg-white shadow text-primary"
            @click="prev"
            aria-label="Më parë"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
  
          <!-- Media -->
          <div class="max-w-[95vw] max-h-[85vh]">
            <img
              v-if="currentItem?.type === 'image'"
              :src="currentItem?.src"
              :alt="currentItem?.title || currentItem?.caption || 'Image'"
              class="max-w-full max-h-[80vh] object-contain rounded-lg shadow"
            />
            <video
              v-else-if="currentItem?.type === 'video'"
              :src="currentItem?.src"
              controls
              playsinline
              class="max-w-full max-h-[80vh] object-contain rounded-lg shadow bg-black"
            />
            <div v-else class="text-white">No media</div>
  
            <!-- Caption -->
            <div v-if="currentItem?.title || currentItem?.caption" class="mt-3 text-center text-white/90 font-poppins">
              <div v-if="currentItem?.title" class="text-sm font-semibold">{{ currentItem.title }}</div>
              <div v-if="currentItem?.caption" class="text-xs opacity-90">{{ currentItem.caption }}</div>
            </div>
          </div>
  
          <!-- Next -->
          <button
            v-if="canNext"
            class="absolute right-3 md:right-6 p-2 rounded-full bg-white/80 hover:bg-white shadow text-primary"
            @click="next"
            aria-label="Tjetra"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
  
  const props = defineProps({
    // v-model:open
    open: { type: Boolean, default: false },
    // Single item usage: { type: 'image'|'video', src: string, title?: string, caption?: string }
    item: { type: Object, default: null },
    // Optional carousel usage:
    items: { type: Array, default: () => [] },
    startIndex: { type: Number, default: 0 },
    closeOnEsc: { type: Boolean, default: true },
  })
  
  const emit = defineEmits(['update:open'])
  
  const isCarousel = computed(() => Array.isArray(props.items) && props.items.length > 0)
  const currentIndex = ref(Math.max(0, Math.min(props.startIndex, Math.max(0, props.items.length - 1))))
  
  const currentItem = computed(() => {
    if (isCarousel.value) return props.items[currentIndex.value]
    return props.item
  })
  
  const canPrev = computed(() => isCarousel.value && currentIndex.value > 0)
  const canNext = computed(() => isCarousel.value && currentIndex.value < props.items.length - 1)
  
  const close = () => emit('update:open', false)
  const prev = () => { if (canPrev.value) currentIndex.value-- }
  const next = () => { if (canNext.value) currentIndex.value++ }
  
  const onKeyDown = (e) => {
    if (!props.open) return
    if (props.closeOnEsc && e.key === 'Escape') { e.preventDefault(); close() }
    if (e.key === 'ArrowLeft' && canPrev.value) { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight' && canNext.value) { e.preventDefault(); next() }
  }
  
  watch(() => props.open, (o) => {
    if (o) {
      // Reset index when opening
      currentIndex.value = Math.max(0, Math.min(props.startIndex, Math.max(0, props.items.length - 1)))
    }
  })
  
  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
  </script>