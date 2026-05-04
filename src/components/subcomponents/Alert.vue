<template>
  <div
    class="fixed top-0 left-0 w-screen flex items-center z-10000 justify-center transition-all duration-500 pointer-events-none"
    :class="isActive ? 'translate-y-10 opacity-100' : 'translate-y-[-20%] opacity-0'"
  >
    <div
      class="w-[90%] md:w-[60%] lg:w-[40%] xl:w-[25%] 4xl:w-[20%] px-5 py-4 rounded-xl border-2 overflow-hidden relative pointer-events-auto shadow-lg"
      :style="{ backgroundColor: bgColor, borderColor: borderColor }"
    >
      <div
        class="w-full flex justify-between items-center mb-2"
        :style="{ color: textColor }"
      >
        <h1 class="font-bold 4xl:text-5xl 2xl:text-3xl xl:text-2xl lg:text-xl md:text-xl text-lg">
          {{ title }}
        </h1>
        <button
          class="4xl:w-12 4xl:h-12 w-8 h-8 opacity-80 font-bold cursor-pointer flex items-center justify-center 4xl:text-3xl xl:text-xl text-base"
          @click="close"
        >
          ✕
        </button>
      </div>

      <div class="flex items-center min-h-[60px] 4xl:min-h-[120px]">
        <div class="w-1/4 relative">
          <div class="absolute -bottom-10 left-0 translate-y-1/2 -translate-x-1/3">
            <Albcaption_logo_nocolor
              class="opacity-40 transition-all
                     4xl:w-48 4xl:h-48 
                     2xl:w-32 2xl:h-32 
                     xl:w-28 xl:h-28 
                     lg:w-24 lg:h-24 
                     md:w-20 md:h-20 
                     w-16 h-16"
              :class="logoColorClass"
            />
          </div>
        </div>

        <span class="w-3/4 text-black font-light font-poppins z-10
                    4xl:text-4xl 2xl:text-2xl xl:text-xl lg:text-lg md:text-lg text-base">
          {{ message }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Albcaption_logo_nocolor from '../logos/Albcaption_logo_nocolor.vue'

const props = defineProps({
  title: String,
  message: String,
  bgColor: String,
  borderColor: String,
  textColor: String,
  logoColorClass: String,
  duration: { type: Number, default: 4000 }
})

const emit = defineEmits(['close'])

const isActive = ref(false)

const close = () => {
  isActive.value = false
  emit('close')
}

onMounted(() => {
  setTimeout(() => (isActive.value = true), 100)
  setTimeout(() => close(), props.duration)
})
</script>