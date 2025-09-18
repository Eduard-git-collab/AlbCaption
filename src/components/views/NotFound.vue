<template>
  <div class="w-screen h-screen bg-primary overflow-hidden">
    <div class="w-full h-full relative">
      <!-- Background SVG lines -->
      <div class="absolute bottom-0 left-0 z-0 w-full h-full pointer-events-none">
        <div class="w-full h-full flex items-end lg:block">
          <logo_lines class="h-1/2 w-full pointer-events-none" />
        </div>
      </div>

      <!-- Main content -->
      <div class="relative z-10 w-full flex justify-center h-full items-center sm:items-center md:items-center lg:items-start xl:items-start">
        <div class="p-4 sm:p-6 md:p-8 lg:p-10 my-8 sm:my-0 md:my-0 lg:my-16 xl:my-20 text-secondary flex items-center w-full sm:w-11/12 md:w-5/6 lg:w-3/4 xl:w-3/4 h-fit justify-center text-center lg:text-left">
          <div class="max-w-3xl">
            <div class="text-kollektif-bold text-7xl sm:text-8xl md:text-9xl leading-none">404</div>
            <h1 class="text-kollektif-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl leading-tight mt-2">
              Faqja nuk u gjet
            </h1>
            <p class="font-poppins text-lg sm:text-xl md:text-2xl lg:text-2xl font-normal mt-3 sm:mt-4 md:mt-5 opacity-90">
              Na vjen keq, faqja që kërkoni nuk ekziston ose është lëvizur.
            </p>

            <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <span @click="$router.back(-1)"
                to="/"
                class="cursor-pointer inline-flex items-center justify-center rounded-full bg-secondary text-primary px-5 sm:px-6 py-3 sm:py-3.5 font-poppins font-medium hover:bg-white transition-colors"
              >
                Kthehu
              </span>
              <a
                href="mailto:hello@albcaptions.com"
                class="inline-flex items-center justify-center rounded-full border border-secondary text-secondary px-5 sm:px-6 py-3 sm:py-3.5 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
              >
                Na kontakto
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import logo_lines from '../logos/Logo_lines.vue';
</script>