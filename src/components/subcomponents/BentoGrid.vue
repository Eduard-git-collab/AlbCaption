<template>
  <div class="w-screen lg:h-screen md:h-fit">

    <div class="grid grid-cols-2 grid-rows-25 gap-3 lg:hidden h-fit w-full p-5">
        <div class="col-span-2 row-span-9 bg-primary md:rounded-2xl rounded-lg">
          <div class="w-full h-full">
            <div class="h-full w-full flex flex-col justify-center">
              <h1 class="md:text-6xl text-3xl p-6 text-secondary text-center text-kollektif-bold my-6">Menaxho projektet<br> në lëvizje</h1>
              <div class="w-full h-full flex items-center justify-center">
                <img src="../../assets/images/Med_Shot_Dashboard_UI.png" alt="Dashboard UI" class="h-full object-contain mt-6">
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-2 row-span-3 row-start-10 bg-cream md:rounded-2xl rounded-lg overflow-hidden relative flex flex-col">
          <div class="w-full flex flex-row gap-2 items-center px-4 py-2 border-b border-primary/10 shrink-0">
            <p class="text-xs md:text-2xl font-poppins text-primary">00:12 - 00:18</p>
            <svg class="h-3.5 w-3.5 md:w-6 md:h-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            <svg class="h-3.5 w-3.5 md:w-6 md:h-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16ZM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1 min-h-0 w-full px-2 py-3">
          <div
            ref="containerRef"
            class="relative bg-white w-full h-full text-lg rounded-md border border-[#353535]/70 flex items-center gap-2 px-3 overflow-hidden"
          >
            <div v-if="!showEditor" class="flex items-center md:text-5xl">
              <h3
                :class="[
                  'text-kollektif-bold transition-all duration-200',
                  highlightedIndex === 0 ? 'text-secondary bg-primary px-2 py-0.5 rounded-md' : 'text-primary'
                ]"
              >Redaktim</h3>&nbsp;
              <h3
                :class="[
                  'text-kollektif-bold transition-all duration-200',
                  highlightedIndex === 1 ? 'text-secondary bg-primary px-2 py-0.5 rounded-md' : 'text-primary'
                ]"
              >manual</h3>&nbsp;
              <h3
                :class="[
                  'text-kollektif-bold transition-all duration-200',
                  highlightedIndex === 2 ? 'text-secondary bg-primary px-2 py-0.5 rounded-md' : 'text-primary'
                ]"
              >i</h3>&nbsp;
              <h3
                ref="misspelledRef"
                :class="[
                  'text-kollektif-bold transition-all duration-200 relative inline-block',
                  highlightedIndex === 3 && !showSquiggle
                    ? 'text-secondary bg-primary px-2 py-0.5 rounded-md'
                    : highlightedIndex === 3 && showSquiggle
                      ? 'text-secondary bg-primary px-2 py-0.5 rounded-md'
                      : 'text-primary',
                  wordSelected ? 'word-selected' : ''
                ]"
              >
                tijtrave
                <span v-if="showSquiggle" :class="['squiggle', squiggleAnimate ? 'squiggle-animate' : '']" />
              </h3>
            </div>

            <div v-else class="flex items-center w-full px-1 rounded bg-white">
              <span class="text-kollektif-bold text-primary text-lg md:text-5xl">Redaktim manual i</span>
              <span class="text-kollektif-bold text-primary text-lg md:text-5xl">&nbsp;</span>
              <span
                v-if="editorSelected"
                class="text-kollektif-bold text-lg md:text-5xl bg-blue-200 rounded px-0.5"
              >{{ editorSelected }}</span>
              <span class="text-kollektif-bold text-primary text-lg md:text-5xl">{{ editorSuffix }}</span>
              <span class="inline-block w-0.5 4xl:h-12 2xl:h-10 xl:h-10 lg:h-8 bg-black align-middle ml-0.5 animate-pulse" />
            </div>
          </div>
        </div>
        </div>

        <div class="row-span-9 row-start-13 bg-primary md:rounded-2xl rounded-lg flex flex-col gap-2 justify-center p-3 relative overflow-hidden">
            <div class="w-full h-full flex flex-col items-center justify-center -gap-2 text-secondary text-center">
              <h2 class="md:text-6xl text-3xl text-center text-kollektif-bold">Shkarko Skedarin</h2>
              <div class="w-fit h-fit flex flex-col items-center my-2">
                <h4 class="md:text-3xl text-kollektif-bold text-lg">SRT VTT TXT</h4>
                <span class="md:text-lg font-poppins text-sm">Zgjidh formatin që të përshtatet</span>
              </div>
            </div>
            <div class="absolute top-0 left-0 -translate-x-1/3 -rotate-30 w-[140%]">
              <div class="bg-cream py-2 overflow-hidden">
                <div class="marquee-track marquee-rtl">
                  <div class="marquee-content" v-for="n in 8" :key="`top-${n}`" :aria-hidden="n > 1 ? 'true' : undefined">
                    <img src="../../assets/images/DaVinci-Resolve-Logo.png" alt="DaVinci Resolve Logo" class="md:w-20 md:h-20 w-10 h-10 shrink-0 object-contain">
                    <img src="../../assets/images/filmora-logo-icon.svg" alt="Filmora Logo" class="md:w-20 md:h-20 w-10 h-10 shrink-0 object-contain">
                    <img src="../../assets/images/adobe-premiere-pro-icon.svg" alt="Adobe Premiere Pro Icon" class="md:w-20 md:h-20 w-10 h-10 shrink-0 object-contain">
                    <img src="../../assets/images/capcut-icon.svg" alt="CapCut Logo" class="md:w-20 md:h-20 w-10 h-10 shrink-0 object-contain">
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute bottom-0 right-0 translate-x-1/4 -rotate-30 w-[140%]">
              <div class="bg-cream py-2 overflow-hidden">
                <div class="marquee-track marquee-ltr">
                  <div class="marquee-content" v-for="n in 8" :key="`top-${n}`" :aria-hidden="n > 1 ? 'true' : undefined">
                    <img src="../../assets/images/DaVinci-Resolve-Logo.png" alt="DaVinci Resolve Logo" class="md:w-20 md:h-20 w-10 h-10 shrink-0 object-contain">
                    <img src="../../assets/images/filmora-logo-icon.svg" alt="Filmora Logo" class="md:w-20 md:h-20 w-10 h-10 shrink-0 object-contain">
                    <img src="../../assets/images/adobe-premiere-pro-icon.svg" alt="Adobe Premiere Pro Icon" class="md:w-20 md:h-20 w-10 h-10 shrink-0 object-contain">
                    <img src="../../assets/images/capcut-icon.svg" alt="CapCut Logo" class="md:w-20 md:h-20 w-10 h-10 shrink-0 object-contain">
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div class="row-span-9 row-start-13 bg-cream md:rounded-2xl rounded-lg p-3">
          <div class="w-full h-full flex flex-col items-center justify-center">
          <h3 class="text-kollektif-bold text-primary md:text-4xl text-center text-xl">Ngarko audio të zhurmshme,merr transkript të qartë</h3>
          <div class="w-[85%] mx-auto h-24 flex items-center justify-center px-4 overflow-hidden">
            <div class="wave-container">
              <span v-for="i in barCount" :key="i" class="wave-bar w-2" :style="barStyle(i)" />
            </div>
          </div>
        </div>
        </div>
    </div>
        
    <div class="grid-cols-5 grid-rows-9 4xl:gap-9 2xl:gap-7 xl:gap-5 lg:gap-2 w-full h-full p-10 hidden lg:grid">

      <div class="col-span-2 row-span-7 bg-primary 2xl:rounded-2xl xl:rounded-xl lg:rounded-lg overflow-hidden">
        <div class="w-full h-full flex flex-col items-center justify-center">
          <div class="h-1/2 w-full flex items-center justify-center">
            <h1 class="4xl:text-9xl 2xl:text-7xl xl:text-6xl lg:text-5xl h-fit text-secondary text-kollektif-bold text-center">
              Menaxho projektet<br class="xl:block hidden"> në lëvizje
            </h1>
          </div>
          <div class="h-fit w-full self-end">
            <img src="../../assets/images/Med_Shot_Dashboard_UI.png" alt="Dashboard UI" class="h-full 4xl:translate-x-1/3 4xl:scale-200 2xl:scale-130 lg:scale-120 object-contain">
          </div>
        </div>
      </div>

      <div class="col-span-3 row-span-2 col-start-1 row-start-8 bg-cream 2xl:rounded-2xl xl:rounded-xl lg:rounded-lg overflow-hidden relative flex flex-col">
        <div class="w-full flex flex-row gap-2 items-center px-4 py-2 border-b border-primary/10 shrink-0">
          <p class="4xl:text-3xl 2xl:text-2xl xl:text-lg lg:text-xs font-poppins text-primary">00:12 - 00:18</p>
          <svg class="4xl:w-8 4xl:h-8 2xl:w-6 2xl:h-6 xl:w-5 xl:h-5 lg:w-3.5 lg:h-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          <svg class="4xl:w-10 4xl:h-8 2xl:w-6 2xl:h-6 xl:w-5 xl:h-5 lg:w-3.5 lg:h-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16ZM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </div>

        <div class="flex-1 min-h-0 w-full px-4 py-3">
          <div
            ref="containerRef"
            class="relative bg-white w-full h-full rounded-md border border-[#353535]/70 flex items-center gap-2 px-3 overflow-hidden"
          >
            <div v-if="!showEditor" class="flex items-center gap-2">
              <h3
                :class="[
                  'text-kollektif-bold 4xl:text-7xl 2xl:text-6xl xl:text-5xl lg:text-3xl transition-all duration-200',
                  highlightedIndex === 0 ? 'text-secondary bg-primary px-3 py-2 rounded-md' : 'text-primary'
                ]"
              >Redaktim</h3>
              <h3
                :class="[
                  'text-kollektif-bold 4xl:text-7xl 2xl:text-6xl xl:text-5xl lg:text-3xl transition-all duration-200',
                  highlightedIndex === 1 ? 'text-secondary bg-primary px-3 py-2 rounded-md' : 'text-primary'
                ]"
              >manual</h3>
              <h3
                :class="[
                  'text-kollektif-bold 4xl:text-7xl 2xl:text-6xl xl:text-5xl lg:text-3xl transition-all duration-200',
                  highlightedIndex === 2 ? 'text-secondary bg-primary px-3 py-2 rounded-md' : 'text-primary'
                ]"
              >i</h3>
              <h3
                ref="misspelledRef"
                :class="[
                  'text-kollektif-bold 4xl:text-7xl 2xl:text-6xl xl:text-5xl lg:text-3xl transition-all duration-200 relative inline-block',
                  highlightedIndex === 3 && !showSquiggle
                    ? 'text-secondary bg-primary px-3 py-2 rounded-md'
                    : highlightedIndex === 3 && showSquiggle
                      ? 'text-secondary bg-primary px-3 rounded-md'
                      : 'text-primary',
                  wordSelected ? 'word-selected' : ''
                ]"
              >
                tijtrave
                <span v-if="showSquiggle" :class="['squiggle', squiggleAnimate ? 'squiggle-animate' : '']" />
              </h3>
            </div>

            <div v-else class="flex items-center w-full px-1 rounded bg-white">
              <span class="text-kollektif-bold text-primary 4xl:text-7xl 2xl:text-6xl xl:text-5xl lg:text-3xl">Redaktim manual i</span>
              <span class="text-kollektif-bold text-primary 4xl:text-7xl 2xl:text-6xl xl:text-5xl lg:text-3xl">&nbsp;</span>
              <span
                v-if="editorSelected"
                class="text-kollektif-bold 4xl:text-7xl 2xl:text-6xl xl:text-5xl lg:text-3xl bg-blue-200 rounded px-0.5"
              >{{ editorSelected }}</span>
              <span class="text-kollektif-bold text-primary 4xl:text-7xl 2xl:text-6xl xl:text-5xl lg:text-3xl">{{ editorSuffix }}</span>
              <span class="inline-block w-0.5 4xl:h-12 2xl:h-10 xl:h-10 lg:h-8 bg-black align-middle ml-0.5 animate-pulse" />
            </div>

            <div
              v-show="cursorVisible"
              id="anim-cursor"
              class="absolute pointer-events-none 4xl:w-18 4xl:h-18 2xl:w-15 2xl:h-15 xl:w-15 xl:h-15 lg:w-10 lg:h-10"
              :style="{
                bottom: cursorBottom,
                left: cursorLeft,
                transform: 'translateX(-50%)',
                transition: cursorTransition,
              }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" enable-background="new 0 0 32 32">
                <g>
                  <defs><rect id="SVGID_1_" width="32" height="32"/></defs>
                  <clipPath id="SVGID_2_"><use xlink:href="#SVGID_1_" overflow="visible"/></clipPath>
                  <path clip-path="url(#SVGID_2_)" fill="#FFFFFF" d="M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z"/>
                  <path clip-path="url(#SVGID_2_)" fill="none" stroke="#000000" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" d="M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z"/>
                  <line clip-path="url(#SVGID_2_)" fill="none" stroke="#000000" stroke-width="0.75" stroke-linecap="round" x1="19.6" y1="20.7" x2="19.6" y2="17.3"/>
                  <line clip-path="url(#SVGID_2_)" fill="none" stroke="#000000" stroke-width="0.75" stroke-linecap="round" x1="17.6" y1="20.7" x2="17.5" y2="17.3"/>
                  <line clip-path="url(#SVGID_2_)" fill="none" stroke="#000000" stroke-width="0.75" stroke-linecap="round" x1="15.6" y1="17.3" x2="15.6" y2="20.7"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-2 row-span-2 col-start-4 row-start-8 bg-secondary rounded-lg overflow-hidden relative">
        <div class="absolute h-full -translate-y-1/3 -left-3">
          <img
            src="https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/assets/BentoCurves.webp"
            alt="Background Curves"
            loading="lazy"
            decoding="async"
            class="h-full object-contain opacity-40"
          >
        </div>
        <div class="flex items-center justify-center h-full w-full relative z-10">
          <Albcaption_logo_nobg class="md:w-1/2 md:h-1/2 w-3/4 h-3/4 translate-y-1/3 lg:w-full lg:h-full lg:scale-75"/>
        </div>
      </div>

      <div class="col-span-3 row-span-3 col-start-3 relative row-start-1 overflow-hidden bg-primary 4xl:rounded-2xl xl:rounded-xl lg:rounded-lg p-3">
        <div class="w-full h-full flex flex-col items-center justify-center -gap-2 text-secondary">
          <h2 class="4xl:text-8xl xl:text-6xl lg:text-4xl text-center text-kollektif-bold">Shkarko Skedarin</h2>
          <div class="w-fit h-fit flex flex-col items-center my-2">
            <h4 class="text-kollektif-bold 4xl:text-7xl xl:text-5xl lg:text-3xl">SRT VTT TXT</h4>
            <span class="font-poppins 4xl:text-3xl xl:text-2xl lg:text-lg">Zgjidh formatin që të përshtatet</span>
          </div>
        </div>
        <div class="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 -rotate-30 w-[140%]">
          <div class="bg-cream py-2 overflow-hidden">
            <div class="marquee-track marquee-rtl">
              <div class="marquee-content" v-for="n in 8" :key="`top-${n}`" :aria-hidden="n > 1 ? 'true' : undefined">
                <img src="../../assets/images/DaVinci-Resolve-Logo.png" alt="DaVinci Resolve Logo" class="4xl:w-28 4xl:h-28 2xl:w-22 2xl:h-22 xl:w-18 xl:h-18 lg:w-15 lg:h-15 shrink-0 object-contain">
                <img src="../../assets/images/filmora-logo-icon.svg" alt="Filmora Logo" class="4xl:w-28 4xl:h-28 2xl:w-22 2xl:h-22 xl:w-18 xl:h-18 lg:w-15 lg:h-15 shrink-0 object-contain">
                <img src="../../assets/images/adobe-premiere-pro-icon.svg" alt="Adobe Premiere Pro Icon" class="4xl:w-28 4xl:h-28 2xl:w-22 2xl:h-22 xl:w-18 xl:h-18 lg:w-15 lg:h-15 shrink-0 object-contain">
                <img src="../../assets/images/capcut-icon.svg" alt="CapCut Logo" class="4xl:w-28 4xl:h-28 2xl:w-22 2xl:h-22 xl:w-18 xl:h-18 lg:w-15 lg:h-15 shrink-0 object-contain">
              </div>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 -rotate-30 w-[140%]">
          <div class="bg-cream py-2 overflow-hidden">
            <div class="marquee-track marquee-ltr">
              <div class="marquee-content" v-for="n in 8" :key="`top-${n}`" :aria-hidden="n > 1 ? 'true' : undefined">
                <img src="../../assets/images/DaVinci-Resolve-Logo.png" alt="DaVinci Resolve Logo" class="4xl:w-28 4xl:h-28 2xl:w-22 2xl:h-22 xl:w-18 xl:h-18 lg:w-15 lg:h-15 shrink-0 object-contain">
                <img src="../../assets/images/filmora-logo-icon.svg" alt="Filmora Logo" class="4xl:w-28 4xl:h-28 2xl:w-22 2xl:h-22 xl:w-18 xl:h-18 lg:w-15 lg:h-15 shrink-0 object-contain">
                <img src="../../assets/images/adobe-premiere-pro-icon.svg" alt="Adobe Premiere Pro Icon" class="4xl:w-28 4xl:h-28 2xl:w-22 2xl:h-22 xl:w-18 xl:h-18 lg:w-15 lg:h-15 shrink-0 object-contain">
                <img src="../../assets/images/capcut-icon.svg" alt="CapCut Logo" class="4xl:w-28 4xl:h-28 2xl:w-22 2xl:h-22 xl:w-18 xl:h-18 lg:w-15 lg:h-15 shrink-0 object-contain">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-3 row-span-4 col-start-3 row-start-4 bg-cream 4xl:rounded-2xl xl:rounded-xl lg:rounded-lg overflow-hidden">
        <div class="w-full h-full flex flex-col xl:gap-5 lg:gap-2 items-center justify-center">
          <h3 class="text-kollektif-bold text-primary xl:text-6xl lg:text-4xl text-center">Ngarko audio të zhurmshme,<br>merr transkript të qartë</h3>
          <div class="w-2/3 mx-auto h-24 flex items-center justify-center px-4 overflow-hidden">
            <div class="wave-container">
              <span v-for="i in barCount" :key="i" class="wave-bar" :style="barStyle(i)" />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import Albcaption_logo_nobg from '../logos/Albcaption_logo_inv_nobg.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const highlightedIndex = ref(-1)
const showSquiggle     = ref(false)
const squiggleAnimate  = ref(false)
const wordSelected     = ref(false)
const cursorVisible    = ref(false)
const cursorBottom     = ref('-48px')
const cursorLeft       = ref('50%')
const cursorTransition = ref('none')
const showEditor       = ref(false)
const editorPrefix     = ref('Redaktim manual i ')
const editorSelected   = ref('')
const editorSuffix     = ref('')

const containerRef  = ref(null)
const misspelledRef = ref(null)

const MISSPELLED = 'tijtrave'
const CORRECT    = 'titrave'

let cancelLoop = false
let timeouts   = []

// Responsive bar count
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
let resizeHandler = null

const barCount = computed(() => {
  const w = windowWidth.value
  if (w >= 2560) return 75  // 2xl
  if (w >= 1440) return 60  // xl
  if (w >= 1024) return 40  // lg
  if (w >= 768)  return 30  // md
  return 10                 // sm
})

function delay(ms) {
  return new Promise(resolve => {
    const id = setTimeout(resolve, ms)
    timeouts.push(id)
  })
}

function clearAllTimeouts() {
  timeouts.forEach(clearTimeout)
  timeouts = []
}

function getWordCenterX() {
  if (!containerRef.value || !misspelledRef.value) return '50%'
  const cRect = containerRef.value.getBoundingClientRect()
  const wRect = misspelledRef.value.getBoundingClientRect()
  return (wRect.left + wRect.width / 2 - cRect.left) + 'px'
}

function raf() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

async function runAnimation() {
  if (cancelLoop) return

  highlightedIndex.value = -1
  showSquiggle.value     = false
  squiggleAnimate.value  = false
  wordSelected.value     = false
  cursorVisible.value    = false
  cursorBottom.value     = '-48px'
  cursorTransition.value = 'none'
  showEditor.value       = false
  editorPrefix.value     = 'Redaktim manual i '
  editorSelected.value   = ''
  editorSuffix.value     = ''

  await delay(400)
  if (cancelLoop) return

  for (let i = 0; i <= 3; i++) {
    highlightedIndex.value = i
    await delay(700)
    if (cancelLoop) return
    if (i < 3) highlightedIndex.value = -1
  }

  await delay(500)
  if (cancelLoop) return

  showSquiggle.value    = true
  squiggleAnimate.value = true

  await delay(800)
  if (cancelLoop) return

  // Position cursor off-screen with no transition
  cursorLeft.value       = getWordCenterX()
  cursorBottom.value     = '-48px'
  cursorTransition.value = 'none'
  cursorVisible.value    = true

  // Wait two frames so the browser commits the position without transition
  await raf()
  if (cancelLoop) return

  // Now enable smooth transition and animate upward
  cursorTransition.value = 'bottom 0.55s cubic-bezier(0.22,1,0.36,1), left 0.3s ease'
  cursorBottom.value     = '4px'

  await delay(650)
  if (cancelLoop) return

  wordSelected.value = true
  const cursorEl = document.getElementById('anim-cursor')
  if (cursorEl) {
    cursorEl.classList.remove('dblclick')
    void cursorEl.offsetWidth
    cursorEl.classList.add('dblclick')
  }

  await delay(380)
  if (cancelLoop) return

  cursorVisible.value    = false
  showEditor.value       = true
  highlightedIndex.value = -1
  wordSelected.value     = false
  editorPrefix.value     = 'Redaktim manual i '
  editorSelected.value   = MISSPELLED
  editorSuffix.value     = ''

  await delay(600)
  if (cancelLoop) return

  for (let i = MISSPELLED.length; i >= 0; i--) {
    editorSelected.value = MISSPELLED.slice(0, i)
    await delay(80)
    if (cancelLoop) return
  }

  await delay(200)
  if (cancelLoop) return

  for (let i = 1; i <= CORRECT.length; i++) {
    editorSuffix.value = CORRECT.slice(0, i)
    await delay(110)
    if (cancelLoop) return
  }

  await delay(900)
  if (cancelLoop) return

  runAnimation()
}

onMounted(() => {
  cancelLoop = false
  resizeHandler = () => { windowWidth.value = window.innerWidth }
  window.addEventListener('resize', resizeHandler)
  runAnimation()
})

onUnmounted(() => {
  cancelLoop = true
  clearAllTimeouts()
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})

function barStyle(i) {
  const t   = Math.sin(i * 12.9898) * 43758.5453
  const r   = t - Math.floor(t)
  const amp = Math.round(8 + r * 52)
  return {
  '--amp': `${amp}px`,
  '--min-height': `${Math.max(4, amp * 0.15)}px`,
  '--dur': `${(0.4 + r * 0.7).toFixed(2)}s`,
  '--del': `${(r * 0.9).toFixed(2)}s`,
  }
}
</script>

<style scoped>
.marquee-track { display: flex; width: max-content; }
.marquee-content { display: flex; align-items: center; gap: 1.5rem; padding: 0 0.75rem; flex-shrink: 0; }
.marquee-rtl { animation: marquee-rtl 8s linear infinite; }
.marquee-ltr { animation: marquee-ltr 8s linear infinite; }
@keyframes marquee-rtl { from { transform: translateX(0); } to { transform: translateX(-25%); } }
@keyframes marquee-ltr { from { transform: translateX(-25%); } to { transform: translateX(0); } }

.wave-container { display: flex; align-items: center; gap: 3px; width: 100%; height: 100%; }
.wave-bar {
  flex: 1;
  height: var(--min-height);
  background: rgb(5 43 40);
  border-radius: 999px;
  animation: wavePulse var(--dur) ease-in-out infinite alternate;
  animation-delay: var(--del);
  opacity: 0.75;
   will-change: height;
}
@keyframes wavePulse {
  from {
    height: var(--min-height);
    opacity: 0.35;
  }
  to {
    height: var(--amp);
    opacity: 0.9;
  }
}

.squiggle {
  position: absolute; bottom: 2px; left: 0; width: 100%; height: 4px;
  background: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%224%22><path d=%22M0 3 Q3 0 6 3 Q9 6 12 3%22 fill=%22none%22 stroke=%22red%22 stroke-width=%221.5%22/></svg>') repeat-x bottom;
  pointer-events: none;
}
.squiggle-animate { animation: squiggle-in 0.4s ease forwards; transform-origin: left center; }
@keyframes squiggle-in { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }

#anim-cursor.dblclick { animation: dblclick-flash 0.35s ease; }
@keyframes dblclick-flash {
  0%, 100% { transform: translateX(-50%) scale(1); }
  30% { transform: translateX(-50%) scale(0.82); }
  50% { transform: translateX(-50%) scale(1); }
  70% { transform: translateX(-50%) scale(0.82); }
}

.word-selected { background-color: #b3d4ff !important; border-radius: 2px; color: inherit !important; padding: 0 2px; }
</style>