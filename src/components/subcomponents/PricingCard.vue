<template>
  <div class="relative flex justify-center">
    <!-- Clean Recommended Badge with border -->
    <div
      v-if="isRecommended"
      class="absolute left-1/2 -top-8 -translate-x-1/2 z-30 flex flex-col items-center"
    >
      <span class="bg-[#052B28] text-white font-bold px-6 py-1 rounded-full border-[#C8BC9B] border-4 text-md shadow-lg">
        Rekomanduar
      </span>
    </div>
    
    <div 
      class="relative bg-cream border-[#C8BC9B] shadow-xl rounded-2xl p-8 pb-10 w-full h-full flex flex-col overflow-hidden transition-all duration-300"
      :class="[
        isRecommended ? 'border-8 scale-[1.03] z-10 shadow-2xl' : 'border-2',
        !isRecommended ? 'opacity-85' : ''
      ]"
    >
      <!-- Corner SVG Decoration -->
      <div class="absolute right-5 top-5 z-0 w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 pointer-events-none select-none">
        <svg
          viewBox="0 0 662 658"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-full h-full translate-x-1/3 -translate-y-1/3"
          style="clip-path: inset(0 0 0 0 round 0 40px 0 0);"
        >
          <path d="M662 658H522V522.754C518.316 527.814 514.474 532.851 510.472 537.863C455.094 607.224 380.382 645.377 291.896 655.634C233.785 662.37 177.593 655.112 125.039 628.881C39.388 586.13 -8.86746 495.369 1.35454 402.504C12.3887 302.262 80.1582 226.324 174.537 203.194C210.519 194.376 246.389 194.849 282.427 202.922C291.698 204.999 294.305 208.58 291.358 218.122C280.287 253.973 269.522 289.934 259.62 326.121C256.349 338.076 248.913 334.754 241.648 333.623C191.621 325.837 143.195 362.237 137.081 412.36C130.553 465.882 164.451 509.095 220.627 518.865C330.099 537.905 432.57 466.452 448.351 356.514C464.957 240.825 382.968 153.318 288.47 138.233C248.136 131.795 209.625 137.198 172.829 154.944C168.219 157.168 163.482 160.972 159.448 153.583C139.331 116.733 119.046 79.9723 98.8838 43.295C202.674 -27.2779 408.036 -21.1039 522 133.565V5.02818e-05H662V658Z" :fill="svgColor"/>
        </svg>
      </div>
      
      <!-- Badge -->
      <div class="absolute left-8 top-8">
        <span class="text-cream text-sm text-kollektif-bold px-4 py-1 rounded-full"
              :style="{ backgroundColor: badgeColor }">
          {{ badgeText }}
        </span>
      </div>
      
      <!-- Subtle savings indicator -->
      <div v-if="isRecommended && showOldMonthlyPrice" class="absolute right-8 top-8">
        <span class="text-xs text-[#052B28] font-medium bg-[#9FE29E]/20 px-3 py-1 rounded-full">
            Kurse {{ Math.floor(((oldMonthlyPrice - price) / oldMonthlyPrice) * 100) }}%
        </span>
      </div>
      
      <!-- Price Section -->
      <div class="mt-14 flex flex-row items-center gap-3 relative z-10">
        <div class="flex flex-row items-end text-kollektif-bold leading-tight">
          <span class="text-[#052B28] text-7xl text-kollektif-bold ml-1 tracking-tight flex items-baseline gap-1">
            <!-- Subtle old price -->
            <span
              v-if="showOldMonthlyPrice && oldMonthlyPrice"
              class="ml-0 text-sm text-gray-500 line-through font-normal tracking-normal"
              style="vertical-align: super;"
            >
              {{ currency }}{{ oldMonthlyPrice }}
            </span>
            <!-- Main Price -->
            <span class="text-2xl align-super" style="vertical-align: super; font-size: 0.4em;">
              {{ currency }}
            </span>
            {{ price }}
            <span class="text-xl tracking-normal" style="font-size: 0.25em;">
              .{{decimal}}
            </span>
          </span>
          <span class="text-[#052B28] font-semibold ml-3 mb-2 text-sm font-poppins italic">/<sub>{{ priceDescription }}</sub></span>
        </div>
      </div>
      
      <!-- Plan Description -->
      <div class="mt-2 text-[#052B28] flex items-center justify-center text-sm font-poppins relative z-10">
        <p class="text-center w-3/4" :class="isRecommended ? 'font-medium' : ''">{{description}}</p>
      </div>
      
      <!-- Action Button -->
      <div class="mt-8 w-full flex justify-items-center relative z-10">
        <router-link
          v-if="to"
          :to="to"
          :class="isRecommended 
            ? 'w-full text-center bg-[#052B28] text-[#F7F5EB] font-semibold py-3 px-4 rounded-full hover:bg-[#9FE29E] hover:text-[#052B28] transition-all shadow-lg'
            : 'w-full text-center border-2 border-[#052B28] bg-transparent text-[#052B28] font-semibold py-2 px-4 rounded-full hover:bg-[#052B28] hover:text-[#F7F5EB] transition-colors'"
        >
          Zgjidh
        </router-link>
        <button
          v-else
          @click="$emit('select', planType)"
          :class="isRecommended
            ? 'w-full text-center bg-[#052B28] text-cream font-semibold py-3 px-4 rounded-full hover:bg-[#9FE29E] hover:text-[#052B28] transition-all shadow-lg'
            : 'w-full text-center border-2 border-[#052B28] bg-transparent text-[#052B28] font-semibold py-2 px-4 rounded-full hover:bg-[#052B28] hover:text-cream transition-colors'"
        >
          Zgjidh
        </button>
      </div>
      
      <!-- Feature List -->
      <ul class="mt-8 space-y-4 font-poppins">
        <li v-for="(feature, i) in features" :key="i"
          class="flex items-center gap-3 text-base transition-opacity duration-200"
          :class="[
            feature.locked ? 'text-gray-400 opacity-60' : 'text-[#052B28]',
            isRecommended && !feature.locked ? 'font-medium' : ''
          ]"
        >
          <svg v-if="!feature.locked" class="w-5 h-5 text-[#9FE29E] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="font-poppins flex-1"
            :class="feature.locked ? 'line-through' : 'text-[#052B28]'"
          >
            {{ feature.text || feature }}
          </span>
          <span v-if="feature.locked" class="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">Vetëm PRO +</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  badgeText: { type: String, default: 'Falas' },
  badgeColor: { type: String, default: '#052B28' },
  price: { type: [String, Number], default: '0' },
  decimal: { type: String, default: '00' }, 
  currency: { type: String, default: '€' },
  description: { type: String, default: 'Përshkrimi i planit' },
  priceDescription: { type: String, default: '*Falas për përdorim personal' },
  features: { type: Array, default: () => ([
    { text: "Akses te veçoritë bazë" },
    { text: "Personalizim i konzolës" },
    { text: "Inteligjencë Artificiale dhe ML" },
    { text: "Ndaje deri në 5 të ftuar" }
  ]) },
  svgColor: { type: String, default: '#9FE29E' },
  to: { type: String, default: null },
  planType: { type: String, default: null },
  isRecommended: { type: Boolean, default: false },
  oldMonthlyPrice: { type: [String, Number], default: null },
  showOldMonthlyPrice: { type: Boolean, default: false },
  percentSaved: { type: [String, Number], default: null }
});
</script>

<style scoped>
.bg-cream { background: #FFFDEE; }
.font-kollektif-bold { font-family: 'Kollektif', sans-serif; font-weight: bold; }
</style>