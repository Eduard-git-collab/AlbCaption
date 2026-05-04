<template>
<div class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm 
            flex items-end lg:items-center justify-center 
            p-0 lg:p-4 font-poppins">

  <!-- Modal container -->
  <div class="w-full lg:max-w-5xl 
              h-[90%] lg:h-[70%] 2xl:h-[60%] 4xl:h-[50%]
              bg-white flex flex-col rounded-t-xl lg:rounded-xl shadow-lg relative overflow-hidden">

    <!-- Header -->
    <div class="w-full bg-primary px-3 py-2 lg:px-5 lg:py-3 rounded-t-xl relative">
      
      <div class="absolute top-2 right-3 lg:top-3 lg:right-5 
                  hover:bg-gray-300/30 rounded-full 
                  w-8 h-8 lg:w-10 lg:h-10 
                  flex items-center justify-center cursor-pointer transition-all"
           @click="$emit('close')">
        <svg class="w-4 h-4 lg:w-5 lg:h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h2 class="text-white text-base lg:text-lg 2xl:text-xl 4xl:text-2xl text-kollektif-bold">
        Shkarko Titrat
      </h2>
      <span class="text-white font-light text-xs lg:text-sm 2xl:text-base opacity-80">
        Konfiguroni cilësimet e shkarkimit
      </span>
    </div>

    <!-- Content -->
    <div class="w-full h-full flex flex-col lg:flex-row gap-3 lg:gap-4">

      <!-- LEFT SIDE -->
      <div class="w-full lg:w-[55%] h-full flex flex-col p-4 lg:p-5 overflow-y-auto">

        <form @submit.prevent="handleDownload" class="flex flex-col w-full h-full">

          <div class="text-kollektif-bold 
                      text-lg lg:text-xl 2xl:text-2xl 4xl:text-3xl mb-3">
            Stili i titrave
          </div>

          <!-- Inputs -->
          <div class="flex flex-col gap-4 w-full text-xs lg:text-sm 2xl:text-base">

            <!-- Range block -->
            <div class="flex flex-col gap-2">
              <span>
                Gjatësia maksimale e shkronjave
                <span class="font-bold text-[10px] lg:text-xs opacity-40">(7–72)</span>
              </span>

              <div class="flex items-center gap-2 lg:gap-3">
                <input type="range" min="7" max="72" step="1"
                       v-model="maxChars"
                       class="flex-1 custom-slider">

                <input type="text"
                       v-model="maxChars"
                       class="w-12 lg:w-16 text-center border rounded-lg px-2 py-1">
              </div>
            </div>

            <!-- Min duration -->
            <div class="flex flex-col gap-2">
              <span>
                Kohëzgjatja minimale
                <span class="font-bold text-[10px] lg:text-xs opacity-40">(1.2–6)</span>
              </span>

              <div class="flex items-center gap-2 lg:gap-3">
                <input type="range" min="1.2" max="6" step="0.1"
                       v-model="minSeconds"
                       class="flex-1 custom-slider">

                <input type="text"
                       v-model="minSeconds"
                       class="w-12 lg:w-16 text-center border rounded-lg px-2 py-1">
              </div>
            </div>

            <!-- Gap + style -->
            <div class="flex flex-col gap-2">
              <span>
                Hapësira midis titrave
                <span class="font-bold text-[10px] lg:text-xs opacity-40">(0–10)</span>
              </span>

              <div class="flex items-center gap-2 lg:gap-3">
                <input type="range" min="0" max="10" step="1"
                       v-model="gapBetweenFrames"
                       class="flex-1 custom-slider">

                <input type="text"
                       v-model="gapBetweenFrames"
                       class="w-12 lg:w-16 text-center border rounded-lg px-2 py-1">
              </div>

              <!-- Radios -->
              <div class="flex gap-4 text-xs lg:text-sm">
                <label class="flex items-center gap-1 cursor-pointer">
                  <input type="radio" value="single" v-model="subtitleStyle" class="accent-primary"/>
                  Një Linjë
                </label>

                <label class="flex items-center gap-1 cursor-pointer">
                  <input type="radio" value="double" v-model="subtitleStyle" class="accent-primary"/>
                  Dy Linja
                </label>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 justify-center mt-auto pt-4">

            <button
                @click="handleDownload('srt')"
                class="inline-flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                SRT
              </button>

            <button
                @click="handleDownload('vtt')"
                class="inline-flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                VTT
              </button>

          </div>

        </form>
      </div>

      <!-- RIGHT SIDE (Preview) -->
      <div class="w-full lg:w-[45%] h-[35%] lg:h-full 
                  bg-black flex items-center justify-center 
                  text-white p-4 lg:p-5 relative overflow-hidden">

        <!-- Play icon -->
        <div class="absolute z-20">
          <div class="w-12 h-12 lg:w-16 lg:h-16 2xl:w-20 2xl:h-20
                      bg-gray-300/40 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 lg:w-8 lg:h-8 text-white/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        <!-- Subtitles -->
        <div class="absolute bottom-6 lg:bottom-10 text-center w-full px-4">
          <div class="font-semibold leading-snug mx-auto
                      text-sm lg:text-lg 2xl:text-xl 4xl:text-2xl max-w-[85%]"
               style="text-shadow: 0px 2px 6px rgba(0,0,0,0.8);">

            <div v-for="line in timedSubtitles[currentIndex]?.text.split('\n')" :key="line">
              {{ line }}
            </div>

          </div>
        </div>

      </div>

    </div>
  </div>
</div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue"

const emit = defineEmits(['close', 'download'])

const props = defineProps({
  segments: {
    type: Array,
    default: () => []
  }
})

const maxChars = ref(20)
const minSeconds = ref(2)
const gapBetweenFrames = ref(3)
const subtitleStyle = ref("single")

const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

watch(maxChars, (val) => {
  maxChars.value = clamp(Number(val), 7, 72)
})

watch(minSeconds, (val) => {
  minSeconds.value = clamp(Number(val), 1.2, 6)
})

watch(gapBetweenFrames, (val) => {
  gapBetweenFrames.value = clamp(Number(val), 0, 10)
})

function handleDownload(format) {
  emit('download', {
    format,
    maxChars: maxChars.value,
    minSeconds: minSeconds.value,
    gapBetweenFrames: gapBetweenFrames.value,
    subtitleStyle: subtitleStyle.value,
  })
}

const subtitles = computed(() => {
  // Flatten all words from all segments into a single word list.
  // Prefer word-level data when available, fall back to splitting segment text.
  const allWords = props.segments.flatMap(seg =>
    seg.words?.length
      ? seg.words.map(w => w.text)
      : seg.text.split(' ').filter(Boolean)
  )

  if (!allWords.length) return []

  const result = []
  let current = ''

  allWords.forEach(word => {
    const candidate = current ? current + ' ' + word : word
    if (candidate.length <= maxChars.value) {
      current = candidate
    } else {
      if (current) result.push(current.trim())
      current = word
    }
  })
  if (current) result.push(current.trim())

  if (subtitleStyle.value === 'double') {
    const doubleLines = []
    for (let i = 0; i < result.length; i += 2) {
      doubleLines.push(result[i] + (result[i + 1] ? '\n' + result[i + 1] : ''))
    }
    return doubleLines
  }

  return result
})

const timedSubtitles = computed(() => {
  let time = 0

  return subtitles.value.map(text => {
    const duration = Math.max(minSeconds.value, text.length * 0.05)

    const item = {
      text,
      start: time,
      end: time + duration
    }

    time += duration + gapBetweenFrames.value
    return item
  })
})

const currentIndex = ref(0)

onMounted(() => {
  let i = 0

  const loop = () => {
    if (!timedSubtitles.value.length) return

    const current = timedSubtitles.value[i]
    currentIndex.value = i

    setTimeout(() => {
      i = (i + 1) % timedSubtitles.value.length
      loop()
    }, (current.end - current.start) * 1000)
  }

  loop()
})
</script>

<style scoped>
.custom-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: #e5e7eb;
  border-radius: 9999px;
  outline: none;
}

.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
}
</style>