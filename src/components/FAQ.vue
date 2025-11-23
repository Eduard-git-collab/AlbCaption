<script setup>
import FaqItem from './items/faqItem.vue'
import steps from './svg/steps.vue'
import { ref } from 'vue'

const faqs = [
  { question: 'A funksionon mirë në shqip?', answer: 'Po. Platforma jonë është ndërtuar posaçërisht për gjuhën shqipe me fokus në saktësi dhe fleksibilitet.' },
  { question: 'Mund t\'i redaktoj titrat para eksportit?', answer: 'Po. I gjithë transkripti është i redaktueshëm. Mund të ndryshosh fjalët, ritmin dhe gjatësinë e frazave.' },
  { question: 'A mund ta përdor edhe nga telefoni?', answer: 'Po. Përdorimi në celular është i thjeshtë, veçanërisht për përdoruesit në lëvizje.' },
  { question: 'Në çfarë formati i marr titrat?', answer: 'Eksporti bëhet në .srt, .vtt, i gatshëm për përdorim në Premiere, CapCut, VN dhe të tjera.' },
  { question: 'Sa kohë zgjat transkriptimi?', answer: 'Zakonisht vetëm pak minuta, por varet nga gjatësia e videos.' },
  { question: 'A ka kufizim sa video mund të ngarkoj?', answer: 'Në planin falas, mund të ngarkosh deri në 3. Shiko planet me pagesë të cilat ofrojnë më shumë minuta dhe mundësi.' },
  { question: 'Si ndihmon kjo në rritje në rrjete sociale?', answer: 'Titrat rrisin angazhimin, sidomos kur shumica e audiencës sheh videot pa zë. Titrat e qarta të mbajnë më gjatë në ekran.' },
]

const openIndex = ref(null)

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
    <!-- Outer container forces full viewport height -->
    <div class="w-full h-screen relative overflow-hidden bg-white">
      
      <!-- Background SVG: Forces full height/width behind content -->
      <div class="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <!-- object-cover ensures the SVG fills the area without distortion gaps -->
        <steps class="w-full h-full object-cover opacity-50 lg:opacity-100"/>
      </div>

      <!-- Main Content Layout -->
      <div class="w-full h-full flex flex-col lg:flex-row relative z-10">
        
        <!-- Left Side: Title -->
        <!-- Mobile: Takes top space. Desktop: Takes left 40% -->
        <div class="w-full lg:w-2/5 h-auto lg:h-full p-6 lg:p-0 flex items-center justify-center shrink-0">
          <h1 class="text-4xl sm:text-5xl lg:text-7xl text-primary text-center text-kollektif-bold leading-tight">
            Pyetje të shpeshta
          </h1>
        </div>

        <!-- Right Side: Scrollable List -->
        <!-- Mobile: Takes remaining height. Desktop: Takes right 60% -->
        <div class="w-full lg:w-3/5 h-full flex flex-col justify-center items-center p-4 lg:p-12 overflow-y-auto no-scrollbar">
          <div class="w-full max-w-2xl flex flex-col gap-3 pb-20 lg:pb-0">
            <faqItem
              v-for="(faq, index) in faqs"
              :key="index"
              :question="faq.question"
              :answer="faq.answer"
              :isOpen="openIndex === index"
              @toggle="toggle(index)"
            />
          </div>
        </div>

      </div>
    </div>
  </template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>