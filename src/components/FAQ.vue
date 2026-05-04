<script setup>
import FooterComponent from './FooterComponent.vue'
import FaqItem from './items/faqItem.vue'
import steps from './svg/steps.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const faqs = [
  { question: 'A funksionon mirë në shqip?', answer: 'Po. Platforma jonë është ndërtuar posaçërisht për gjuhën shqipe me fokus në saktësi dhe fleksibilitet.' },
  { question: 'Mund ti redaktoj titrat para eksportit?', answer: 'Po. I gjithë transkripti është i redaktueshëm. Mund të ndryshosh fjalët, ritmin dhe gjatësinë e frazave.' },
  { question: 'A mund ta përdor edhe nga telefoni?', answer: 'Po. Përdorimi në celular është i thjeshtë, veçanërisht për përdoruesit në lëvizje.' },
  { question: 'Në çfarë formati i marr titrat?', answer: 'Eksporti bëhet në .srt, .vtt, i gatshëm për përdorim në Premiere, CapCut, VN dhe të tjera.' },
  { question: 'Sa kohë zgjat transkriptimi?', answer: 'Zakonisht vetëm pak minuta, por varet nga gjatësia e videos.' },
  { question: 'A ka kufizim sa video mund të ngarkoj?', answer: 'Në planin falas, mund të ngarkosh deri në 3. Shiko planet me pagesë të cilat ofrojnë më shumë minuta dhe mundësi.' },
  { question: 'Si ndihmon kjo në rritje në rrjete sociale?', answer: 'Titrat rrisin angazhimin, sidomos kur shumica e audiencës sheh videot pa zë. Titrat e qarta të mbajnë më gjatë në ekran.' },

  //FAQ page questions
    { question: 'A funksionon mirë në dialekte?', answer: 'Po, sistemi mbështet shumicën e thekseve në shqip.' },
  { question: 'A e kupton zërin me sfond muzikor?', answer: 'Po, për sa kohë zëri është i qartë dhe në përparësi, transkriptimi mbetet i saktë.' },
  { question: 'A mund të përdor video me më shumë se një folës?', answer: 'Po, por transkriptimi nuk do i ndajë me emër – thjesht tekst në rradhë.' },
  { question: 'A ka limite në madhësinë e videos?', answer: 'Po, çdo plan ka kufizime të qarta të skedarit (shih faqen e çmimeve).' },
  { question: 'A funksionon edhe me audio, jo vetëm video?', answer: 'Po, mund të ngarkosh edhe audio të thjeshtë (.mp3, .wav).' },
  { question: 'Sa kohë zgjat procesi?', answer: '1–5 minuta zakonisht, në varësi të gjatësisë dhe trafikut.' },
  { question: 'A më njofton kur transkripti është gati?', answer: 'Po, në ekran do shfaqet automatikisht pas përpunimit.' },
  { question: 'Mund të ndalem dhe të rikthehem te një video më vonë?', answer: 'Po, në planet me pagesë ruhet historia e projekteve.' },
  { question: 'A është i saktë në krahasim me njerëzit?', answer: 'Nuk zëvendëson plotësisht një redaktor njerëzor, por për shumicën e videove është 95–98% i saktë.' },
  { question: 'A kam nevojë për program tjetër për ta përdorur?', answer: 'Jo. Çdo gjë ndodh brenda platformës, edhe nga telefoni.' },
  { question: 'A funksionon më mirë në desktop apo telefon?', answer: 'Të dyja punojnë mirë, por desktop është më i rehatshëm për redaktime të gjata.' },
  { question: 'Mund të importoj .srt në CapCut ose VN?', answer: 'Po, formati është i përputhshëm.' },
  { question: 'A ka mbështetje për përdoruesit?', answer: 'Po, mbështetja ofrohet me email dhe për planet me pagesë edhe me përparësi.' },
  { question: 'A ruhen skedarët e mi në platformë?', answer: 'Vetëm përkohësisht. Pas disa ditësh, fshihen për privatësi.' },
  { question: 'Mund ta përdor në më shumë se një pajisje?', answer: 'Po, llogaria jote është aktive kudo ku hyn.' },
  { question: 'A ka watermark?', answer: 'Jo, pasi nuk bëjmë eksport video, vetëm titrat në .srt.' },
  { question: 'A mund të përdor më shumë minuta se limiti?', answer: 'Po, duke kaluar në një plan më të lartë.' },
  { question: 'A ka plan për ekipe?', answer: 'Jo ende, por është në zhvillim.' },
  { question: 'A funksionon me video vertikale dhe horizontale?', answer: 'Po, nuk ka rëndësi formati i ekranit.' },
  { question: 'A ka ofertë për studentë apo organizata?', answer: 'Po, na kontakto për oferta të personalizuara.' },
]

const openIndex = ref(null)

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}

const isFaqPage = computed(() => route.path === '/faq')

const visibleFaqs = computed(() => {
  return isFaqPage.value ? faqs : faqs.slice(0, 7)
  return !isFaqPage.value ? faqs : faqs.slice(7, 21)
})
</script>

<template>
  <div :class="[
    'w-full relative pt-20',
    isFaqPage ? 'h-auto' : 'h-auto lg:h-screen',
    'overflow-visible lg:overflow-hidden'
  ]">
    <div class="absolute inset-0 z-0 w-full h-full pointer-events-none">
      <steps :class="['w-full h-full object-cover opacity-50 lg:opacity-100', isFaqPage ? 'scale-200 translate-x-1/6' : 'scale-100 translate-x-0']"/>
    </div>

    <div class="w-full h-full flex flex-col lg:flex-row relative z-10">
      <div class="w-full lg:w-2/5 h-full p-6 lg:p-0 flex items-center justify-center shrink-0">
        <h1 class="text-4xl 4xl:text-8xl xl:text-7xl h-full sm:text-5xl lg:text-6xl text-primary text-center text-kollektif-bold leading-tight">
          Pyetje të shpeshta
        </h1>
      </div>

      <div :class="['w-full lg:w-3/5 flex flex-col justify-center items-center p-4 lg:p-12', isFaqPage ? '' : 'h-full overflow-y-auto no-scrollbar']">
        <div class="w-full 4xl:max-w-6xl 2xl:max-w-4xl xl:max-w-2xl flex flex-col 4xl:gap-8 2xl:gap-4 gap-3 pb-20 lg:pb-0">
          <faqItem
            v-for="(faq, index) in visibleFaqs"
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
  <div v-if="isFaqPage">
    <FooterComponent/>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>