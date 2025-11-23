<template>
    <div class="w-full min-h-screen bg-white">
        <div class="w-full h-full px-4 py-8 lg:px-10 lg:py-10">
          
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 lg:grid-rows-7 gap-6 w-full lg:min-h-[800px]">
              
              <!-- BOX 1: Dashboard -->
              <div 
                data-aos="fade-up"
                class="bg-primary rounded-xl overflow-hidden relative min-h-[400px] md:min-h-[auto] lg:col-span-3 lg:row-span-5 order-1"
              >
                <div class="w-full h-full p-6 flex flex-col">
                    <div class="relative z-10">
                        <h1 class="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-kollektif text-secondary text-center my-2 leading-tight">
                            Menaxho Transkriptet kudo dhe kurdo 
                        </h1>
                        <h2 class="text-sm lg:text-base xl:text-lg text-tan font-poppins font-light text-center mb-6 mt-4">
                            Nëpërmjet panelit të përdoruesit, mund të menaxhoni, redaktoni apo shkarkoni transkriptet tuaja në çdo çast
                        </h2>
                    </div>
                    
                    <div class="relative mt-auto translate-y-4 lg:translate-x-4">
                        <!-- Reverted to /object/public/ but kept lazy loading and async decoding -->
                        <img 
                            src="https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/assets/Dashboard.webp" 
                            loading="lazy"
                            decoding="async"
                            class="w-full h-auto rounded-tl-lg"
                        >
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-primary pointer-events-none"></div>
                    </div>
                </div>
              </div>

              <!-- BOX 2: Auto Subtitles -->
              <div 
                data-aos="fade-up"
                data-aos-delay="200"
                class="bg-secondary rounded-xl overflow-hidden relative min-h-[200px] lg:col-span-7 lg:row-span-2 lg:col-start-4 lg:row-start-1 order-2"
              >
                <div class="w-full h-full p-6 flex items-center">
                    <div class="w-full flex flex-col lg:flex-row justify-between gap-4 lg:gap-8 items-center">
                       <h1 class="text-primary text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-kollektif text-center lg:text-left lg:max-w-md leading-tight">
                            Titra automatike të shpejta dhe të sakta
                       </h1>
                       <p class="text-primary text-sm lg:text-base xl:text-lg font-poppins text-center lg:text-justify leading-relaxed max-w-xl">
                            Nëpërmjet teknologjisë së AlbCaptions, transkriptoni automatikisht video në gjuhën shqipe. Mjafton vetëm një klikim për të gjeneruar titrat automatikisht.
                       </p>
                    </div>
                </div>
              </div>

              <!-- BOX 3: Logo Box -->
              <div 
                data-aos="zoom-in"
                data-aos-delay="300"
                class="bg-tan rounded-xl overflow-hidden relative min-h-[250px] lg:col-span-3 lg:row-span-3 lg:col-start-4 lg:row-start-3 order-3"
              >
                <div class="absolute h-full -top-2 -left-2 opacity-50">
                    <img 
                        src="https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/assets/BentoCurves.webp" 
                        alt="Background Curves"
                        loading="lazy"
                        decoding="async"
                        class="h-full object-contain opacity-40"
                    >
                </div>
                <div class="flex items-center justify-center h-full w-full relative z-10">
                    <Albcaption_logo_nobg class="w-1/2 h-1/2 lg:w-full lg:h-full lg:scale-75"/>
                </div>
              </div>

              <!-- BOX 4: Formats -->
              <div 
                data-aos="fade-up"
                data-aos-delay="400"
                class="bg-primary rounded-xl overflow-hidden relative min-h-[300px] lg:col-span-4 lg:row-span-3 lg:col-start-7 lg:row-start-3 order-4"
              >
                <div class="absolute z-10 bottom-4 -left-4 lg:bottom-0 lg:-left-2">
                    <img 
                        src="https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/assets/premiere-pro.webp" 
                        loading="lazy"
                        decoding="async"
                        class="h-16 w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 rotate-[20deg] rounded-3xl bg-primary shadow-lg shadow-black/20"
                    >
                </div>
                <div class="absolute z-10 top-4 -right-4 lg:-top-3 lg:-right-3">
                    <img 
                        src="https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/assets/capcut.webp" 
                        alt="CapCut Logo"
                        loading="lazy"
                        decoding="async"
                        class="h-16 w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 rotate-[-20deg] rounded-2xl bg-primary shadow-lg shadow-black/20"
                    >
                </div>
                <div class="absolute z-10 -bottom-2 -right-2 lg:-bottom-1 lg:-right-2">
                    <img 
                        src="https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/assets/DaVinci_Resolve_Studio.webp" 
                        loading="lazy"
                        decoding="async"
                        class="h-16 w-16 lg:h-22 lg:w-22 xl:h-26 xl:w-26 rotate-[-20deg] bg-primary shadow-lg shadow-black/20 rounded-2xl"
                    >
                </div>

                <div class="w-full h-full p-6 relative z-20 flex flex-col justify-center items-center">
                    <h1 class="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-kollektif text-tan text-center mb-4 leading-tight">
                        Shkarkim në formate standarde SRT dhe VTT 
                    </h1>
                    <div class="w-3/4 mx-auto">
                        <p class="text-tan font-poppins text-sm lg:text-base xl:text-lg font-light text-center opacity-90">
                            Të gjitha titrat mund të shkarkohen në formatet më të përdorura dhe të përputhshme.
                        </p>
                    </div>
                </div>
              </div>

              <!-- BOX 5: Manual Edit -->
              <div 
                data-aos="fade-up"
                data-aos-delay="500"
                class="bg-tan rounded-xl p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6 lg:gap-8 min-h-[200px] md:col-span-2 lg:col-span-10 lg:row-span-2 lg:row-start-6 order-5"
              >
                <div class="lg:w-1/5 flex justify-center">
                    <div class="text-6xl lg:text-8xl xl:text-9xl">✏️</div>
                </div>
                <div class="w-full lg:w-4/5 text-center lg:text-left">
                    <h2 class="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-kollektif text-primary mb-3 leading-tight">Redaktim Manual</h2>
                    <p class="text-primary text-sm lg:text-base xl:text-lg font-poppins font-light mb-3">
                        Nëse dëshiron më shumë kontroll mbi tekstin, AlbCaptions të ofron mundësinë të redaktosh titrat e gjeneruara automatikisht, njësoj si të redaktosh një email.
                    </p>
                    <p class="text-primary text-xs lg:text-sm xl:text-base font-poppins font-light opacity-75">
                        Bëj ndryshime në kohë reale, përshtat kohëzgjidhjeve, dhe shkarko në formatet që preferoj.
                    </p>
                </div>
              </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import Albcaption_logo_nobg from '../logos/Albcaption_logo_inv_nobg.vue';
</script>