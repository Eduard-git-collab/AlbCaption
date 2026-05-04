<template>
  <section class="relative w-full bg-primary overflow-hidden">
    <!-- Hero Section -->
    <div class="relative w-full min-h-screen overflow-hidden flex">
      <div class="w-full min-h-screen flex-col items-center justify-start flex">
        <!-- Background Lines (static) -->
        <div class="absolute inset-0 z-0 xl:-bottom-1/3 4xl:-bottom-1/4 overflow-hidden pointer-events-none">
          <div class="w-full h-full flex items-end justify-center">
            <logo_lines class="w-full h-2/3 translate-y-1/3 object-fill text-secondary/20" />
          </div>
        </div>
  
        <!-- Hero Content -->
        <div
          class="w-full min-h-screen relative z-10 flex flex-col 2xl:gap-15 4xl:gap-20 lg:gap-10 gap-5
                 items-center justify-center xl:mx-10 4xl:mx-15 lg:mx-5 md:mx-3 mx-2"
        >
          <div           
            data-aos="fade-up"
            data-aos-delay="700"
            data-aos-duration="600"
            class="w-fit mx-auto h-fit flex flex-col">
            <div class="w-fit h-fit items-center justify-center flex flex-row">
              <h1 class="2xl:text-[130px] 4xl:text-[172px] xl:text-8xl lg:text-6xl md:text-5xl text-4xl text-kollektif-bold text-secondary">
                Titro&nbsp;
              </h1>
  
              <div class="relative overflow-hidden h-[1.2em] flex items-center justify-center 2xl:text-[130px] 4xl:text-[172px] xl:text-8xl lg:text-6xl md:text-5xl text-4xl text-kollektif-bold w-[12ch] text-center text-primary bg-secondary lg:rounded-2xl rounded-lg lg:py-3 2xl:px-18 4xl:px-24 lg:px-10 px-5 py-1">
    
                <TransitionGroup name="slot">
                  <h1 
                    v-for="word in currentWord" 
                    :key="word" 
                    class="absolute w-full left-0 right-0"
                  >
                    {{ word }}
                  </h1>
                </TransitionGroup>

              </div>
            </div>
            <h1 class="2xl:text-[130px] 4xl:text-[172px] xl:text-8xl lg:text-6xl md:text-5xl text-4xl text-kollektif-bold text-secondary">
              pa shkruar asnjë fjalë
            </h1>
          </div>
  
          <h3 
            data-aos="fade-up" 
            data-aos-easing="linear"
            data-aos-duration="600"
            data-aos-delay="1200"  
            class="4xl:text-[60px] 2xl:text-4xl xl:text-3xl lg:text-xl md:text-xl text-md text-secondary font-poppins lg:font-light mx-3 text-center">
            Kthe videon në tekst me saktësi maksimale, për rrjete sociale, montazh dhe biznese. Fuqizuar nga IA.
          </h3>
  
          <div
            data-aos="fade-up" 
            data-aos-duration="600"
            data-aos-easing="linear"
            data-aos-delay="1400"  
           class="w-fit h-fit flex 2xl:gap-7 4xl:gap-10 gap-3 flex-col items-center justify-center">
            <RouterLink
              to="/signup"
              class="4xl:text-[48px] 2xl:text-4xl xl:text-2xl text-primary bg-secondary 2xl:px-6 2xl:py-3 4xl:px-8 4xl:py-4 4xl:rounded-xl px-3 py-2 rounded-md
                     text-kollektif-bold text-xl hover:ring-2 hover:ring-secondary hover:bg-primary hover:text-secondary duration-200"
            >
              Titro Falas Tani
            </RouterLink>
  
            <div class="w-fit h-fit flex flex-row items-center 4xl:gap-5 gap-2">
              <card class="4xl:w-7.5 4xl:h-7.5 2xl:w-6 2xl:h-6 w-5 h-5 text-secondary" />
              <p class="4xl:text-[30px] 2xl:text-xl text-secondary text-sm font-poppins">Pa Kartë Krediti</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- NEXT SECTION -->
  <section class="w-full bg-white text-slate-900">
    <!--
      Video box is in-flow (so it can't cover hero text),
      but pulled UP to overlap hero using translate (no pixel values).
      To push the video DOWN further (less overlap), reduce the negative translate:
        -translate-y-1/3  (more overlap)
        -translate-y-1/4  (medium overlap)
        -translate-y-1/6  (less overlap / pushed down)
    -->
    <div
      data-aos="fade-up"
      data-aos-delay="300"
      class="max-w-[90vw] aspect-video w-full mx-auto relative z-20
             -translate-y-1/6 md:-translate-y-1/5 lg:-translate-y-1/4
             rounded-2xl 4xl:shadow-[12px_16px_12px_8px_rgba(0,0,0,0.25)] shadow-[5px_5px_0px_rgba(0,0,0,0.25)]"
    >
      <wistia-player media-id="oco4fzfyr8"></wistia-player>
    </div>
    <Statistic />
  </section>
  <div class="h-[20vh]"></div>
  <HorizontalScroll />
  <div class="my-20 overflow-x-clip">
    <Dialektet />
  </div>
  <div class="my-20">
    <Redaktim />
  </div>
  <div class="h-[20vh]"></div>
  <div class="my-20 overflow-x-clip">
  <BannerContent />
  </div>
  <BentoGrid class="my-20"/>
  <Payment class="my-20"/>
    <div class="w-full md:h-[15vh] h-[30vh]"></div>
    <div class="relative">
      <!-- Sticky FAQ container -->
      <div class="sticky top-0 z-0">
        <FAQ/>
      </div>
      <div class="relative z-50 shadow-2xl bg-white">
        <FooterComponent />
      </div>
    </div>

</template>

<script setup>
import Logo_lines from './logos/Logo_lines.vue';
import Upload from './Upload.vue';
import FooterComponent from './FooterComponent.vue';
import Payment from './Payment.vue';
import FAQ from './FAQ.vue';
import BentoGrid from './subcomponents/BentoGrid.vue';
import StackedCards from './subcomponents/StackedCards.vue';
import Statistic from './subcomponents/Statistic.vue';
import card from './logos/card.vue';
import HorizontalScroll from './HorizontalScroll.vue';
import Dialektet from './Dialektet.vue';
import Redaktim from './Redaktim.vue';
import { ref, computed, onMounted, onUnmounted, inject, watch, nextTick } from 'vue'
import BannerContent from './subcomponents/BannerContent.vue';
import AOS from 'aos'
import 'aos/dist/aos.css'

const isLoading = inject('isLoading')

watch(isLoading, (loading) => {
  if (!loading) {
    nextTick(() => {
      AOS.init({
        once: true, 
      })
      AOS.refresh()
    })
  }
}, { immediate: true })

onMounted(() => {
  // Load the embed script for this specific video
  const embedScript = document.createElement('script')
  embedScript.src = 'https://fast.wistia.com/embed/oco4fzfyr8.js'
  embedScript.async = true
  embedScript.type = 'module'
  document.head.appendChild(embedScript)

  // Load the Wistia player script (if not already in index.html)
  const playerScript = document.createElement('script')
  playerScript.src = 'https://fast.wistia.com/player.js'
  playerScript.async = true
  document.head.appendChild(playerScript)
})

const allWords = ['TikTok-un', 'Podcastin', 'Intervistën', 'Dokumentarin', 'Filmin', 'Webinar-in', 'Vlogun', 'Leksionin', 'Livestreamin', 'Reklamën', 'Videoklipin'];
const currentWord = ref([allWords[0]]);
let index = 0;
let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    index = (index + 1) % allWords.length;
    currentWord.value = [allWords[index]];
  }, 1500); 
});

onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.slot-enter-from {
  transform: translateY(-100%);
}

.slot-leave-to {
  transform: translateY(100%);
}

.slot-enter-active,
.slot-leave-active {
  transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
}

/* Maintain layout during the swap */
.slot-leave-active {
  position: absolute;
}
</style>