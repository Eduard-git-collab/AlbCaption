<template>
  <div class="w-screen h-screen">    
    <div class="grid grid-cols-5 grid-rows-9 gap-2 w-full h-full p-10">
      <div class="col-span-2 row-span-7 bg-primary rounded-lg">
        <div class="relative w-full h-full flex flex-col items-center overflow-hidden">
          <h1 class="text-4xl text-secondary my-2 w-2/3 mx-auto text-center text-kollektif-bold">
            Menaxho Transkriptet kudo dhe kurdo 
          </h1>
          <p class=" w-2/3 mx-auto text-center text-secondary text-md font-poppins font-light my-2">
            Nëpërmjet panelit të përdoruesit, mund të menaxhoni, redaktoni apo shkarkoni transkriptet tuaja në çdo çast
          </p>
          <div class="absolute -bottom-0 z-0">
            <img src="../assets/images/Med_Shot_Dashboard_UI.png" class="w-auto">
          </div>
        </div>
      </div>
      <div class="col-span-3 row-span-2 col-start-1 row-start-8 bg-cream rounded-lg overflow-hidden relative">

        <!-- Segment header row -->
        <div class="w-full flex flex-row gap-2 items-center px-4 py-2 border-b border-primary/10">
          <p class="text-xs font-poppins text-primary">00:12 - 00:18</p>
          <svg class="w-3.5 h-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          <svg class="w-3.5 h-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </div>
    
        <!-- Content area — overflow-hidden hides the cursor below the fold -->
        <div class="relative w-full px-4 py-3 overflow-hidden" style="height: calc(100% - 2.25rem)">
    
          <!-- PHASE: playback — large bold text for sentence 1 -->
          <Transition name="fade">
            <p
              v-if="phase === 'playback'"
              class="absolute inset-0 px-4 py-3 font-poppins font-bold leading-tight text-primary flex flex-wrap content-center gap-x-3"
              style="font-size: clamp(1.4rem, 3.5vw, 2rem);"
            >
              <span
                v-for="(word, i) in sentence1Words"
                :key="i"
                :class="[
                  'transition-all duration-150',
                  i < activeWord
                    ? 'text-gray-400 font-medium'
                    : i === activeWord
                      ? 'text-secondary font-extrabold bg-primary rounded px-1.5 py-0.5'
                      : 'text-primary font-bold'
                ]"
              >{{ word }}</span>
            </p>
          </Transition>
    
          <!-- PHASE: editing — smaller text so sentence 2 fits -->
          <Transition name="fade">
            <div
              v-if="phase === 'editing'"
              class="absolute inset-0 px-3 py-2 flex items-center"
            >
              <div class="w-full h-full border border-primary/30 rounded bg-white text-base font-poppins text-primary leading-relaxed px-3 py-2 flex items-start pt-3">
                <span class="whitespace-pre-wrap break-words">{{ displayedText }}<span class="inline-block w-px h-5 bg-primary align-middle ml-px" /></span>
              </div>
            </div>
          </Transition>
    
          <!-- Pointer cursor — starts below the visible area -->
          <div
            v-show="cursorVisible"
            class="absolute pointer-events-none z-10"
            :style="{
              bottom: cursorBottom,
              left:   cursorLeft,
              transform: `scale(${cursorScale})`,
              transition: cursorTransition
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
              class="w-8 h-8 drop-shadow-md"
            >
              <g>
                <path fill="#FFFFFF" d="M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z"/>
                <path fill="none" stroke="#000000" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" d="M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z"/>
                <line fill="none" stroke="#000000" stroke-width="0.75" stroke-linecap="round" x1="19.6" y1="20.7" x2="19.6" y2="17.3"/>
                <line fill="none" stroke="#000000" stroke-width="0.75" stroke-linecap="round" x1="17.6" y1="20.7" x2="17.5" y2="17.3"/>
                <line fill="none" stroke="#000000" stroke-width="0.75" stroke-linecap="round" x1="15.6" y1="17.3" x2="15.6" y2="20.7"/>
              </g>
            </svg>
          </div>
    
        </div>
      </div>
      <div class="col-span-2 row-span-2 col-start-4 row-start-8 bg-cream rounded-lg overflow-hidden relative">
        <div class="absolute h-full -translate-y-1/3 -left-3 opacity-50">
          <img 
              src="https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/assets/BentoCurves.webp" 
              alt="Background Curves"
              loading="lazy"
              decoding="async"
              class="h-full object-contain opacity-40"
          >
        </div>
          <div class="flex items-center justify-center h-full w-full relative z-10">
              <Albcaption_logo_nobg class="md:w-1/2 md:h-1/2 w-3/4 h-3/4 translate-y-1/3 lg:w-full lg:h-full lg:scale-75"/>
          </div>
      </div>
      <div class="col-span-3 row-span-3 col-start-3 row-start-1 bg-cream rounded-lg p-3">
        <div class="w-full h-full flex items-center justify-center relative overflow-hidden">
          <div class="w-fit h-fit flex gap-3 items-center justify-center">
            <img
              src="../assets/images/DaVinci-Resolve-Logo.png"
              class="h-12 w-12 lg:h-16 lg:w-16"
              />
          </div> 
        </div>
      </div>
      <div class="col-span-3 row-span-4 col-start-3 row-start-4 bg-primary rounded-lg">
        <div class="w-full h-full flex items-center justify-between gap-4 p-2">
          <h2 class="text-3xl max-w-[35%] text-secondary text-center shrink-0">
            Titra automatike të shpejta dhe të sakta
          </h2>
        
          <!-- Soundwave bridge -->
          <div class="flex-1 flex items-center justify-between h-20">
            <span class="sound-bar" style="--delay: 0ms;   --peak: 25%"></span>
            <span class="sound-bar" style="--delay: 70ms;  --peak: 50%"></span>
            <span class="sound-bar" style="--delay: 140ms; --peak: 75%"></span>
            <span class="sound-bar" style="--delay: 210ms; --peak: 95%"></span>
            <span class="sound-bar" style="--delay: 280ms; --peak: 100%"></span>
            <span class="sound-bar" style="--delay: 350ms; --peak: 65%"></span>
            <span class="sound-bar" style="--delay: 420ms; --peak: 100%"></span>
            <span class="sound-bar" style="--delay: 490ms; --peak: 70%"></span>
            <span class="sound-bar" style="--delay: 560ms; --peak: 45%"></span>
            <span class="sound-bar" style="--delay: 630ms; --peak: 20%"></span>
          </div>
        
          <span class="text-sm text-center text-secondary shrink-0 max-w-[45%]">
            Nëpërmjet teknologjisë së AlbCaptions, transkriptoni automatikisht video në gjuhën shqipe. Mjafton vetëm një klikim për të gjeneruar titrat automatikisht.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Albcaption_logo_nobg from './logos/Albcaption_logo_inv_nobg.vue';
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

// ─── EDIT ONLY THESE TWO LINES ───────────────────────────────────────────────
const SENTENCE_1 = 'Redaktim manual i titrave'
const SENTENCE_2 = 'Nëse dëshiron më shumë kontroll mbi tekstin, AlbCaptions të ofron mundësinë të redaktosh titrat e gjeneruara automatikisht'
// ─────────────────────────────────────────────────────────────────────────────

const WORD_HIGHLIGHT_MS  = 650   // how long each word is highlighted
const CURSOR_TRAVEL_MS   = 600   // cursor glide duration
const BACKSPACE_MS       = 80    // ms per character deleted
const TYPE_MS            = 30   // ms per character typed
const HOLD_MS            = 2000  // how long to hold the finished sentence
const PAUSE_MS           = 800   // pause before restarting

const sentence1Words = computed(() => SENTENCE_1.split(' '))

const phase          = ref('playback')
const activeWord     = ref(-1)
const displayedText  = ref('')

// cursor reactive style
const cursorBottom     = ref('-3rem')
const cursorLeft       = ref('50%')
const cursorScale      = ref(1)
const cursorTransition = ref('none')
const cursorVisible    = ref(false)

let timers = []

const delay = (ms) => new Promise(resolve => {
  const id = setTimeout(resolve, ms)
  timers.push(id)
})

async function cursorMoveTo(bottom, left, durationMs) {
  cursorTransition.value = `bottom ${durationMs}ms ease, left ${durationMs}ms ease`
  cursorBottom.value = bottom
  cursorLeft.value   = left
  await delay(durationMs)
  cursorTransition.value = 'none'
}

async function cursorClick() {
  for (let i = 0; i < 2; i++) {
    cursorTransition.value = 'transform 80ms ease'
    cursorScale.value = 1.35
    await delay(80)
    cursorScale.value = 1
    await delay(120)
  }
  cursorTransition.value = 'none'
}

async function runLoop() {
  while (true) {
    // ── 1. Playback sweep ──────────────────────────────────────────
    phase.value        = 'playback'
    activeWord.value   = -1
    cursorVisible.value = false

    for (let i = 0; i < sentence1Words.value.length; i++) {
      activeWord.value = i
      await delay(WORD_HIGHLIGHT_MS)
    }
    activeWord.value = sentence1Words.value.length
    await delay(400)

    // ── 2. Cursor: rise from below → slide left → double-click ────
    // phase stays 'playback' — sentence 1 remains fully visible

    cursorBottom.value     = '-3rem'
    cursorLeft.value       = '50%'
    cursorScale.value      = 1
    cursorTransition.value = 'none'
    cursorVisible.value    = true

    await nextTick()
    await delay(50)

    await cursorMoveTo('40%', '50%', 500)
    await cursorMoveTo('40%', '30%', 400)
    await delay(200)
    await cursorClick()
    await delay(150)

    // ── 3. Editing — only NOW fade sentence 1 out ─────────────────
    cursorVisible.value     = false
    phase.value             = 'editing'
    displayedText.value     = SENTENCE_1
    await delay(300)

    while (displayedText.value.length > 0) {
      displayedText.value = displayedText.value.slice(0, -1)
      await delay(BACKSPACE_MS)
    }
    await delay(200)

    for (let i = 1; i <= SENTENCE_2.length; i++) {
      displayedText.value = SENTENCE_2.slice(0, i)
      await delay(TYPE_MS)
    }

    // ── 4. Hold then reset ─────────────────────────────────────────
    await delay(HOLD_MS)
    phase.value = 'playback'
    await delay(PAUSE_MS)
  }
}

onMounted(runLoop)
onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
.sound-bar {
  display: block;
  width: 3px;
  height: var(--peak);
  background-color: var(--color-secondary, #1a1a2e);
  border-radius: 999px;
  animation: pulse 1s ease-in-out infinite alternate;
  animation-delay: var(--delay);
  transform-origin: center;
}

@keyframes pulse {
  0%   { transform: scaleY(0.15); opacity: 0.3; }
  100% { transform: scaleY(1);    opacity: 1;   }
}
</style>