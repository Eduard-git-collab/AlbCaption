<template>
      <div class="w-full h-full flex flex-col p-6">
      <!-- optional divider -->
      <div v-if="showDivider" class="absolute top-0 right-0 h-full w-px bg-black/10" />
  
      <!-- TOP BLOCK: badge + price + description -->
      <div>
        <div class="text-left text-kollektif w-fit rounded-full px-3 py-0.5 text-xs" :style="badgeStyle">
          {{ badgeText }}
        </div>
  
        <h2 class="text-left text-kollektif-bold text-sm text-primary mt-2">
          {{ currency }}<span class="text-3xl mr-1">{{ price }}</span>.{{ decimal }}
          <span class="text-xs font-poppins font-normal text-primary/70">
            /{{ priceDescription }}
          </span>
        </h2>
  
        <!-- give description a min-height so headings align more -->
        <p class="text-center font-poppins text-xs text-primary/80 mt-2 min-h-[2.5rem]">
          {{ description }}
        </p>
      </div>
  
      <!-- BUTTON: fixed position in the vertical flow -->
      <button
        type="button"
        class="cursor-pointer w-full mx-auto my-4 px-3 py-2 bg-primary text-white text-sm rounded-full
               hover:bg-primary/80 transition-colors"
        @click="$emit('select')"
      >
        {{ buttonText }}
      </button>
  
      <!-- FEATURES: pushed to the bottom so all buttons align -->
      <div class="mt-2 flex flex-col gap-2 pt-2">
        <p
          v-for="(feature, idx) in features"
          :key="idx"
          class="text-xs font-poppins"
          :class="feature.locked ? 'text-primary/30' : 'text-secondary'"
        >
          <span aria-hidden="true">{{ feature.locked ? 'x' : '✓' }}</span>
          <span
            class="text-sm ml-2"
            :class="feature.locked ? 'text-primary/30 line-through' : 'text-primary'"
          >
            {{ feature.text }}
          </span>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    showDivider: { type: Boolean, default: false },
  
    badgeText: { type: String, required: true },
    badgeColor: { type: String, default: '#052B28' },
    currency: { type: String, default: '€' },
    price: { type: [String, Number], required: true },
    decimal: { type: [String, Number], default: '99' },
    priceDescription: { type: String, default: 'muaj' },
    description: { type: String, default: '' },
    buttonText: { type: String, default: 'Zgjidh' },
    features: { type: Array, default: () => [] }
  })
  
  defineEmits(['select'])
  
  const badgeStyle = computed(() => ({
    backgroundColor: props.badgeColor,
    color: '#052B28',
    opacity: 1
  }))
  </script>