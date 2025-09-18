<template>
  <span 
    ref="animationSpan"
    class="absolute rounded-full bg-primary ease-out flex items-center justify-center z-100" 
    :class="isClicked ? 'w-[170vmax] h-[200vmax] transition-all duration-[2s]' : 'w-0 h-0 transition-all duration-[0.5s]'"
  >
    <div
      id="processing_container"
      class="w-screen h-screen flex items-center justify-center"
    >
      <div class="flex items-center gap-2">
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

function scrollToCenter() {
  if (animationSpan.value) {
    const spanRect = animationSpan.value.getBoundingClientRect()
    const spanCenterY = spanRect.top + window.scrollY + (spanRect.height / 2)
    const viewportCenterY = window.innerHeight / 2
    const scrollToY = spanCenterY - viewportCenterY
    window.scrollTo({
      top: Math.max(0, scrollToY),
      behavior: 'smooth'
    })
  }
}

function start() {
  if (isClicked.value) return
  scrollToCenter()
  setTimeout(() => {
    isClicked.value = true
    disableScroll()
    setTimeout(() => { showText.value = true }, 400)
    // auto re-enable scroll after main expansion
    setTimeout(() => { enableScroll() }, 2000)
  }, 500)
}

function stop() {
  showText.value = false
  disableScroll()
  setTimeout(() => {
    isClicked.value = false
    setTimeout(() => { enableScroll() }, 500)
  }, 1500)
}

// Auto-stop when state transitions to final states (safety net)
watch(() => props.state, (newState) => {
  if (newState === 'complete' || newState === 'error') {
    setTimeout(() => { isClicked.value = false }, 2000)
    showText.value = false
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