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
    <div class="w-screen h-screen">
      <div class="w-full h-full p-3 relative">
        <div class="w-full h-full absolute z-0">
            <steps class="rounded-3xl"/>
        </div>
        <div class="w-full h-full flex flex-row gap-3 relative z-10">
          <div class="w-2/5 h-full p-3">
            <div class="w-full h-full flex items-center justify-center flex-col">
              <div class="w-full h-1/3 flex items-center justify-center">
                <h1 class="text-7xl text-[#052B28] text-center text-kollektif-bold">Pyetje të shpeshta</h1>
              </div>
            </div>
          </div>
          <div class="w-3/5 h-full flex justify-center flex-col gap-2 p-3 overflow-y-auto relative z-10">
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