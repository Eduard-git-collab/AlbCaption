<template>
  <!-- 
    Height 300vh: Defines total scroll distance/speed.
  -->
  <section ref="container" class="relative w-full h-[300vh] bg-white">
    
    <!-- 
      Sticky Container: Pins the viewport.
      Removed all background gradients/blobs for a clean white look.
    -->
    <div class="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-white">
      
      <!-- Cards Wrapper -->
      <div class="relative w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div class="relative w-full aspect-[16/10] lg:aspect-[2.4/1] min-h-[600px] flex items-center justify-center">
          
          <!-- Card 1 -->
          <div 
            ref="card1"
            class="absolute inset-0 w-full h-full bg-white rounded-3xl border border-cream shadow-2xl overflow-hidden z-10"
            style="will-change: transform, filter;"
          >
            <div class="flex flex-col lg:flex-row h-full">
               <!-- Text -->
               <div class="w-full lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center">
                  <h3 class="text-3xl sm:text-4xl lg:text-6xl font-kollektif font-bold text-primary mb-6 lg:mb-8 leading-tight">
                    Bizneset Moderne Kërkojnë Zgjidhje Praktike
                  </h3>
                  <p class="text-base sm:text-lg lg:text-2xl text-primary/80 font-poppins leading-relaxed">
                    Nëse po përpiqesh të ndërtosh një audiencë në TikTok, Instagram apo YouTube për të shitur produkte ose për të rritur ndikimin tënd, titrimi manual i videove mund të të kushtojë orë të tëra.
                  </p>
               </div>
               <!-- Image -->
               <div class="w-full h-full lg:w-2/5 bg-primary/5 relative overflow-hidden flex items-center justify-center">
                  <div class="absolute inset-0 text-primary opacity-[0.05]">
                    <svg class="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none"><path d="M-10 0 C 30 50 -10 150 30 200" stroke="currentColor" fill="none"/></svg>
                  </div>
                  <RouterLink to="/signup" class="relative z-10">
                    <button class="text-kollektif text-xl hover:text-secondary hover:bg-primary text-primary py-3 px-6 rounded-xl transition-all duration-200 border-2 border-secondary bg-secondary">
                      Provo Falas AlbCaptions
                    </button>
                  </RouterLink>
                  <div class="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 opacity-50">
                    <Albcaption_logo_nobg class="w-full h-full"/>
                  </div>
               </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div 
            ref="card2"
            class="absolute inset-0 w-full h-full bg-white rounded-3xl border border-cream shadow-2xl overflow-hidden z-20 translate-y-[110%]"
            style="will-change: transform, filter;"
          >
            <div class="flex flex-col lg:flex-row h-full">
               <!-- Image (Left) -->
               <div class="w-full lg:w-2/5 bg-primary/5 relative overflow-hidden flex items-center justify-center order-1 border-r border-gray-100">
                  <div class="absolute inset-0 text-primary opacity-[0.05]">
                     <svg class="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none"><path d="M110 0 C 70 50 110 150 70 200" stroke="currentColor" fill="none"/></svg>
                  </div>
                  <div class="w-48 h-48 opacity-20 text-primary">
                      <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                  </div>
               </div>
               <!-- Text -->
               <div class="w-full lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center order-2">
                  <h3 class="text-3xl sm:text-4xl lg:text-6xl font-kollektif font-bold text-primary mb-6 lg:mb-8 leading-tight">
                    Nuk ka rëndësi thelbi i videos nëse askush nuk po e shikon
                  </h3>
                  <p class="text-base sm:text-lg lg:text-2xl text-primary/80 font-poppins leading-relaxed">
                    Audiencat nuk ndërtohen për një ditë. Suksesi në rrjetet sociale kërkon strategji dhe mjete specifike për të tërhequr vëmendjen dhe për të mbajtur audiencën të angazhuar.
                  </p>
               </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div 
            ref="card3"
            class="absolute inset-0 w-full h-full bg-white rounded-3xl border border-cream shadow-2xl overflow-hidden z-30 translate-y-[110%]"
            style="will-change: transform, filter;"
          >
            <div class="flex flex-col lg:flex-row h-full">
               <!-- Text -->
               <div class="w-full lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center">
                  <h3 class="text-3xl sm:text-4xl lg:text-6xl font-kollektif font-bold text-primary mb-6 lg:mb-8 leading-tight">
                    98% saktësi në çdo dialekt nga AlbCaptions
                  </h3>
                  <div class="text-base sm:text-lg lg:text-2xl text-primary/80 font-poppins leading-relaxed space-y-4">
                    <p>AlbCaptions përdor një proces të automatizuar që konverton zërin në titra dhe i sinkronizon ato me videon përkatëse (98% saktësi).</p>
                    <p>Për 2% që mbetet, AlbCaptions ofron mjete të integruara për redaktim manual, ku përdoruesit mund të korrigjojnë tekstin me lehtësi.</p>
                  </div>
               </div>
               <!-- Image -->
               <div class="w-full h-full lg:w-2/5 bg-primary/5 relative overflow-hidden flex items-center justify-center border-l border-gray-100">
                  <div class="absolute inset-0 text-primary opacity-[0.05]">
                    <svg class="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none"><path d="M-10 0 C 30 50 -10 150 30 200" stroke="currentColor" fill="none"/></svg>
                  </div>
                  <div class="w-48 h-48 opacity-40 text-secondary">
                      <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Albcaption_logo_nobg from '../logos/Albcaption_logo_nobg.vue'

gsap.registerPlugin(ScrollTrigger)

const container = ref(null)
const card1 = ref(null)
const card2 = ref(null)
const card3 = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.value,
        start: "top top", 
        end: "bottom bottom",
        scrub: 1, 
      }
    })

    // PHASE 1: Reading Time (Delay)
    tl.to({}, { duration: 0.5 }) 

    // PHASE 2: Card 2 Enters
    tl.to(card2.value, {
      yPercent: -110,
      ease: "power1.inOut",
      duration: 2
    })
    // RESTORED: Blur + Scale Effect (No black brightness/dimming)
    .to(card1.value, {
      scale: 0.90,
      filter: "blur(5px)", // Smooth blur
      duration: 2
    }, "<")

    // PHASE 3: Reading Time
    .to({}, { duration: 0.5 })

    // PHASE 4: Card 3 Enters
    .to(card3.value, {
      yPercent: -110,
      ease: "power1.inOut",
      duration: 2
    })
    // Card 2 blurs out
    .to(card2.value, {
      scale: 0.90,
      filter: "blur(5px)",
      duration: 2
    }, "<")

    // PHASE 5: Hold
    .to({}, { duration: 0.5 })

  }, container.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
:deep(*) {
  user-select: none;
}
</style>