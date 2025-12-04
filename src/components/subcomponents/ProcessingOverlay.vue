<template>
  <span 
    ref="animationSpan"
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ease-out flex items-center justify-center" 
    :class="isClicked ? 'w-[170vmax] h-[200vmax] transition-all duration-[2s] z-100' : 'w-0 h-0 transition-all duration-[0.5s] z-0'"
  >
    <div
      id="processing_container"
      class="w-screen h-screen flex items-center justify-center"
    >
      <!-- Desktop Version (MD+) - Keeps original whitespace-nowrap and max-width animation -->
      <div class="items-center gap-2 md:flex hidden">
        <span
          class="text-4xl text-kollektif font-bold text-secondary whitespace-nowrap overflow-hidden wipe-transition"
          :class="showText ? 'wipe-open' : 'wipe-close'"
        >
          {{ processingStateMessage }}
        </span>
        <span
          v-if="isClicked"
          class="text-2xl text-kollektif font-bold text-secondary flex items-center"
        >
          <span class="dot dot-1">.</span>
          <span class="dot dot-2">.</span>
          <span class="dot dot-3">.</span>
        </span>
      </div>

      <!-- Mobile Version (SM) - Allows text breaking, uses clip-path for stability -->
      <div class="flex md:hidden flex-wrap items-center justify-center gap-1 max-w-[90vw] text-center">
        <span
          class="text-4xl text-kollektif font-bold text-secondary mobile-wipe-transition"
          :class="showText ? 'mobile-wipe-open' : 'mobile-wipe-close'"
        >
          {{ processingStateMessage }}
        </span>
        <span
          v-if="isClicked"
          class="text-2xl text-kollektif font-bold text-secondary flex items-center"
        >
          <span class="dot dot-1">.</span>
          <span class="dot dot-2">.</span>
          <span class="dot dot-3">.</span>
        </span>
      </div>

    </div>
  </span>
</template>

<script setup>
import { ref, computed, defineExpose, watch } from 'vue'

const props = defineProps({
  state: { type: String, default: null }, // uploading | processing | complete | error
  step: { type: String, default: null },  // audio-extraction | transcribing | ...
})

const isClicked = ref(false)
const showText = ref(false)
const animationSpan = ref(null)

const processingStateMessage = computed(() => {
  switch (props.state) {
    case 'uploading':
      return 'Video duke u ngarkuar'
    case 'processing':
      if (props.step === 'audio-extraction') return 'Konvertimi i videos ne audio'
      if (props.step === 'transcribing') return 'Transkriptimi i audios'
      return 'Duke u procesuar'
    case 'complete':
      return 'Procesimi perfundoi me sukses.'
    case 'error':
      return 'Një error është shfaqur gjatë procesimit.'
    case 'embedding':
      return 'Duke shkarkuar videon me titra'
    default:
      return 'Video duke u procesuar'
  }
})

function disableScroll() {
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
}

function enableScroll() {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
}

function start() {
  if (isClicked.value) return
  
  isClicked.value = true
  disableScroll()
  
  setTimeout(() => { showText.value = true }, 400)
}

function stop() {
  showText.value = false
  disableScroll() 
  setTimeout(() => {
    isClicked.value = false
    setTimeout(() => { enableScroll() }, 500)
  }, 1500)
}

watch(() => props.state, (newState) => {
  if (newState === 'complete' || newState === 'error') {
    setTimeout(() => { isClicked.value = false }, 2000)
    showText.value = false
    setTimeout(() => { enableScroll() }, 2500)
  }
})

defineExpose({ start, stop })
</script>

<style scoped>
.wipe-transition {
  transition: max-width 0.7s cubic-bezier(.4,0,.2,1), opacity 0.4s;
  display: inline-block;
  vertical-align: middle;
}
.wipe-open {
  max-width: 50vw;
  opacity: 1;
}
.wipe-close {
  max-width: 0;
  opacity: 0.5;
}

/* Mobile Wipe - Clip Path Animation (Prevents reflow on wrapped text) */
.mobile-wipe-transition {
  transition: clip-path 1s cubic-bezier(.4,0,.2,1), opacity 0.4s;
  display: inline-block;
}
.mobile-wipe-open {
  clip-path: inset(0 0 0 0);
  opacity: 1;
}
.mobile-wipe-close {
  clip-path: inset(0 100% 0 0);
  opacity: 0;
}

/* Dots Animation */
.dot {
  animation: bounce 1.4s infinite ease-in-out;
  font-size: 3rem;
  line-height: 1;
}
.dot-1 { animation-delay: -0.32s; }
.dot-2 { animation-delay: -0.16s; }
.dot-3 { animation-delay: 0s; }
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.8) translateY(0); opacity: 0.5; }
  40% { transform: scale(1.2) translateY(-10px); opacity: 1; }
}
</style>