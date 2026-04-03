<template>
  <!-- Hero Section -->
  <div class="relative w-full min-h-screen bg-primary overflow-visible flex">
    <div class="w-full h-full flex-col items-center justify-start flex">  
      <!-- Background Lines - No animation needed (static BG) -->
      <div class="absolute inset-0 z-0 2xl:-bottom-1/4 overflow-hidden pointer-events-none">
        <div class="w-full h-full flex items-end justify-center">
          <logo_lines class="w-full h-2/3  md:translate-y-1/3 object-fill text-secondary/20" />
        </div>
      </div>

      <div class="w-full h-screen relative z-10 flex flex-col 2xl:gap-20 lg:gap-10 gap-5 items-center justify-center xl:mx-10 2xl:mx-15 lg:mx-5 md:mx-3 mx-2">
        <div class="w-fit mx-auto h-fit flex flex-col">
          <div class="w-fit h-fit items-center justify-center flex flex-row">
            <h1 class="2xl:text-[172px] lg:text-6xl md:text-5xl text-4xl text-kollektif-bold text-secondary">Titro&nbsp;</h1>
            <h1 class="2xl:text-[172px] lg:text-6xl md:text-5xl text-4xl text-kollektif-bold text-primary bg-secondary lg:rounded-2xl rounded-lg lg:py-3 2xl:px-24 lg:px-10 px-5 py-1">Dokumentarin</h1>
          </div>
          <h1 class="2xl:text-[172px] lg:text-6xl md:text-5xl text-4xl text-kollektif-bold text-secondary">pa shkruar asnjë fjalë</h1>
        </div>
        <h3 class="2xl:text-[60px] lg:text-xl md:text-xl text-md text-secondary font-poppins lg:font-light mx-3 text-center ">Kthe videon në tekst me saktësi maksimale, për rrjete sociale, montazh dhe biznese. Fuqizuar nga IA.</h3>
        <div class="w-fit h-fit flex 2xl:gap-10 gap-3 flex-col items-center justify-center">
          <RouterLink to="/signup" class="2xl:text-[48px] text-primary bg-secondary 2xl:px-10 px-3 py-2 rounded-md text-kollektif-bold text-xl hover:ring-2 hover:ring-secondary hover:bg-primary hover:text-secondary duration-200">
            Titro Falas Tani
          </RouterLink>
          <div class="w-fit h-fit flex flex-row items-center 2xl:gap-5 gap-2">
            <card class="2xl:w-[40px] 2xl:h-[30px] w-5 h-5 text-secondary" />
            <p class="2xl:text-[30px] text-secondary text-sm font-poppins">Pa Kartë Krediti</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Overlapping Box -->
    <div class="absolute left-1/2 -bottom-1/2 translate-y-1/3 -translate-x-1/2 z-20 max-w-[90vw] w-full p-3 rounded-xl shadow-[12px_16px_12px_8px_rgba(0,0,0,0.25)]">
      <wistia-player media-id="oco4fzfyr8" aspect="1.7777777777777777"></wistia-player>
    </div>
  </div>

    <!-- Stats Section -->
    <!-- <div class="w-full relative overflow-hidden bg-white">
      <Statistic />
    </div>

    <StackedCards class="mb-20"/>
    <BentoGrid class="my-20"/>
    <Upload class="my-20"/>
    <Payment class="my-20"/> -->

    <div class="relative mt-20">
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
import { onMounted } from 'vue'

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
</script>