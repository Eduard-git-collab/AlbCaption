<template>
  <div class="relative flex items-center w-fit">
    <!-- Small toggle -->
    <button
      class="relative w-12 h-6 bg-[#1a4a47] rounded-full focus:outline-none transition-all duration-300 shadow-sm"
      @click="toggle"
      aria-pressed="isOn"
      aria-label="Ndrysho mënyrën e faturimit"
    >
      <!-- Track highlight for yearly -->
      <span
        class="absolute left-0 top-0 h-full w-full rounded-full pointer-events-none transition-colors duration-300"
        :class="isOn ? 'bg-[#9FE29E]/60' : 'bg-[#1a4a47]'"
      ></span>
      <!-- Toggle knob -->
      <span
        class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
        :class="isOn ? 'translate-x-6 ring-2 ring-[#9FE29E]' : ''"
        style="transition-property: transform;"
      ></span>
    </button>
    <!-- Animated savings badge (wipe in/out) -->
    <div
      class="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-28 h-7 rounded-full overflow-hidden transition-all duration-300 ease-in-out select-none pointer-events-none"
      :class="isOn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'"
    >
      <div
        class="absolute inset-0 bg-[#9FE29E] rounded-full transition-transform duration-500"
        :class="isOn ? 'translate-x-0 animate-bounce' : 'translate-x-full'"
      ></div>
      <span
        class="relative z-10 flex items-center justify-center h-full text-[#052B28] text-xs font-semibold transition-all duration-500"
        :class="isOn ? 'opacity-100' : 'opacity-0'"
      >
        Kurse deri në {{ percent }}%
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const isOn = ref(true)
const emit = defineEmits(['toggle'])
const props = defineProps({
  percent: { type: [String, Number], default: 30 }
})
function toggle() {
  isOn.value = !isOn.value
  emit('toggle', isOn.value)
}
</script>

<style scoped>
button { min-width: unset; min-height: unset; padding: 0; }
button:active { transform: scale(0.97); }
.animate-bounce {
  animation: bounce 0.8s;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(-5px);}
}
</style>