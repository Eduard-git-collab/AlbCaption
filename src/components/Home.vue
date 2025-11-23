<template>
  <!-- Hero Section -->
    <div class="relative w-full min-h-screen bg-primary overflow-visible flex flex-col items-center justify-start">
      
      <!-- Background Lines - No animation needed (static BG) -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="w-full h-full flex items-end justify-center">
          <logo_lines class="w-full h-2/3  md:translate-y-1/3 object-cover text-secondary/20" />
        </div>
      </div>

      <div class="relative z-10 w-full flex flex-col items-center pt-28 sm:pt-32 lg:pt-36 px-4">
        
        <div class="w-full flex flex-col items-center text-center max-w-[90rem]">
          
          <!-- Headline: Fade Up -->
          <h1 
            data-aos="fade-up"
            class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-secondary leading-tight mb-6 max-w-5xl"
          >
            Shkurto post-produksionin deri në 88%, Transkripto Automatikisht Gjuhën Shqipe
          </h1>

          <!-- Subhead: Fade Up + 100ms Delay -->
          <h2 
            data-aos="fade-up"
            data-aos-delay="100"
            class="text-base sm:text-lg lg:text-xl text-secondary/90 font-poppins mb-8 max-w-3xl leading-relaxed"
          >
            Tërhiq vëmëndjen, rrit shikimet. Fuqizuar nga AI për skuadra dhe influencera.
          </h2>

          <!-- Button: Fade Up + 200ms Delay -->
          <div 
            data-aos="fade-up"
            data-aos-delay="200"
            class="flex justify-center mb-12 lg:mb-16"
          >
            <RouterLink 
              to="/signup" 
              class="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-primary bg-secondary rounded-lg border-2 border-secondary overflow-hidden transition-all duration-300 hover:bg-transparent hover:text-secondary"
            >
              <span class="relative z-10">Provo falas</span>
            </RouterLink>
          </div>
        </div>

        <!-- Hero Image: Fade Up + 300ms Delay -->
        <div 
          data-aos="fade-up"
          data-aos-delay="300"
          class="w-[90%] sm:w-[85%] max-w-6xl z-20 transform translate-y-[15%] lg:translate-y-[20%]"
        >
          <img 
            src="https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/assets/Herobg.webp" 
            loading="lazy"
            alt="Dashboard Preview"
            class="w-full h-auto rounded-xl shadow-2xl border-4 border-white/10 bg-white object-cover"
          />
        </div>

      </div>
    </div>

    <!-- Stats Section -->
    <div class="w-full relative py-24 lg:py-48 overflow-hidden bg-white">
      <div class="w-full max-w-[95rem] mx-auto px-6 lg:px-12 flex flex-col gap-8 lg:gap-10">
        
        <!-- Row 1 -->
        <div class="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6">
            <!-- Added delay="200" so it doesn't trigger instantly -->
            <h1 
                data-aos="fade-up"
                data-aos-delay="200"
                class="text-4xl sm:text-6xl lg:text-8xl text-kollektif-bold text-primary whitespace-nowrap text-center lg:text-left"
            >
                <strong class="text-secondary"> 69% </strong> e postimeve
            </h1>
            
            <span 
                data-aos="fade-up"
                data-aos-delay="300"
                class="text-sm sm:text-base font-poppins font-light text-primary/80 w-full lg:w-[30%] max-w-lg leading-relaxed text-center lg:text-left"
            >
                Gjasat janë që, nëse po publikon një video të pa titruar, audienca jote nuk ka për ta parë. 69% e shikuesëve ne ambjente publike ose zyra përdorin rrjete sociale me zërin e fikur.
            </span>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-col lg:flex-row items-center lg:items-center gap-6 lg:gap-12">
            <img 
              data-aos="zoom-in"
              data-aos-delay="200"
              src="https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/assets/pexels-amina-filkins-5427978.webp" 
              alt="Person using social media on phone"
              loading="lazy"
              class="h-24 sm:h-32 w-full lg:w-96 object-cover object-bottom rounded-full shadow-md"
            >
            <h1 
                data-aos="fade-up"
                data-aos-delay="300"
                class="text-4xl sm:text-6xl lg:text-8xl text-kollektif-bold text-primary whitespace-nowrap text-center lg:text-left"
            >
                në rrjete sociale
            </h1>
        </div>

        <!-- Row 3 -->
        <div class="flex flex-row items-center justify-center lg:justify-start mt-2 lg:mt-4">
            <!-- Added fade-up and delay to the final text block -->
            <h1 
                data-aos="fade-up"
                data-aos-delay="400"
                class="text-4xl sm:text-6xl lg:text-8xl w-full text-kollektif-bold text-primary relative leading-tight text-center lg:text-left"
            >
                shikohen 
                <span class="relative inline-block">
                    me zërin e fikur
                    <Curved_line 
                      data-aos="fade-in" 
                      data-aos-delay="600" 
                      class="overflow-visible absolute left-0 w-full top-full mt-1"
                    />
                </span>
            </h1>
        </div>

      </div>
    </div>

    <StackedCards class="my-20"/>
    <BentoGrid class="my-20"/>
    <Upload class="my-20"/>
    <Payment class="my-20"/>

    <!-- 
      FAQ + Footer Stacking Logic 
      - We wrap FAQ in a generic container.
      - We place Footer AFTER it.
      - GSAP will pin FAQ, allowing Footer to slide over.
    -->
    <div class="relative mt-20">
      <!-- Z-Index 0: Stays behind when pinned -->
      <div ref="faqContainer" class="relative z-0">
        <FAQ/>
      </div>

      <!-- Z-Index 50: Slides OVER the pinned FAQ -->
      <div class="relative z-50 shadow-2xl">
        <FooterComponent />
      </div>
    </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo_lines from './logos/Logo_lines.vue';
import Upload from './Upload.vue';
import FooterComponent from './FooterComponent.vue';
import Payment from './Payment.vue';
import FAQ from './FAQ.vue';
import BentoGrid from './subcomponents/BentoGrid.vue';
import StackedCards from './subcomponents/StackedCards.vue';

gsap.registerPlugin(ScrollTrigger);

const faqContainer = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    // Logic: Pin the FAQ section so the Footer slides over it
    ScrollTrigger.create({
      trigger: faqContainer.value,
      start: "top top",     // When top of FAQ hits top of viewport
      end: "bottom top",    // Pin until the bottom of FAQ hits top (effectively 100vh duration if h-screen)
      pin: true,            // Pin the FAQ
      pinSpacing: false,    // Important: allows the Footer to overlap instead of being pushed down
      scrub: true
    });
  });
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>