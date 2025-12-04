<template>
    <section 
      ref="sectionRef"
      class="relative w-full bg-white py-24 lg:py-40 overflow-hidden"
    >
      <!-- Background -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-br from-white via-white to-secondary/3"></div>
        <div class="absolute top-1/4 -right-96 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 -left-96 w-96 h-96 bg-tan/5 rounded-full blur-3xl"></div>
      </div>
  
      <!-- Container: Increased max-width for wider cards on large screens -->
      <div class="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
  
        <!-- Cards Stack Container -->
        <div class="relative h-[600px] xl:h-[650px] 2xl:h-[700px] w-full">
          
          <!-- Card 1: Introduction -->
          <div
            ref="card1"
            class="absolute top-0 left-0 w-full rounded-3xl shadow-2xl overflow-hidden border border-cream bg-white"
            style="will-change: transform; z-index: 10;"
          >
            <div class="flex flex-col lg:flex-row h-[600px]">
              <!-- Left Content -->
              <div class="w-full lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden order-2 lg:order-1">
                <div class="absolute inset-0 opacity-[0.03]">
                  <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=%2220%27 height=%2720%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M0 0h20v20H0z%27 fill=%27none%27/%3E%3Cpath d=%27M10 0v20M0 10h20%27 stroke=%27%23000%27 stroke-width=%271%27/%3E%3C/svg%3E')"></div>
                </div>
  
                <div class="relative z-10 space-y-6 lg:space-y-10">
                  <div>
                    <!-- Larger text sizes for desktop -->
                    <h3 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-kollektif font-bold text-primary mb-6 lg:mb-8 leading-tight">
                      Bizneset Moderne Kerkojne Zgjidhje Praktike
                    </h3>
                    <p class="text-base sm:text-lg lg:text-xl 2xl:text-2xl text-primary/80 font-poppins leading-relaxed">
                      Nëse po përpiqesh të ndërtosh një audiencë në TikTok, Instagram apo YouTube për të shitur produkte ose për të rritur ndikimin tënd, titrimi manual i videove mund të të kushtojë orë të tëra. Orë që mund t’i shpenzosh për të krijuar videon e radhës.
                    </p>
                  </div>
                </div>
              </div>
  
              <!-- Right Illustration -->
              <div class="w-full lg:w-2/5 relative overflow-hidden bg-primary/5 flex items-center justify-center order-1 lg:order-2 h-64 lg:h-auto">
                <div class="absolute inset-0 text-primary pointer-events-none">
                  <svg class="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none">
                    <path d="M-10 0 C 30 50 -10 150 30 200" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.1" fill="none" />
                    <path d="M10 0 C 50 50 10 150 50 200" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.15" fill="none" />
                    <path d="M30 0 C 70 50 30 150 70 200" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.2" fill="none" />
                  </svg>
                </div>
  
                <RouterLink to="/signup" class="relative z-10 block">
                  <button class="text-kollektif text-xl xl:text-2xl hover:text-secondary hover:bg-primary text-primary py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer bg-secondary border-2 border-secondary">
                    Provo Falas AlbCaptions
                  </button>
                </RouterLink>
  
                <div class="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 lg:w-96 lg:h-96 grayscale opacity-50 lg:opacity-100">
                  <Albcaption_logo_nobg class="w-full h-full"/>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Card 2: Audience Strategy -->
          <div
            ref="card2"
            class="absolute top-0 left-0 w-full rounded-3xl shadow-2xl overflow-hidden border border-cream bg-white"
            style="will-change: transform; z-index: 20;"
          >
            <div class="flex flex-col lg:flex-row h-[600px]">
              <!-- Left Illustration (Reversed Layout on Desktop) -->
              <div class="w-full lg:w-2/5 relative overflow-hidden bg-primary/5 border-b lg:border-b-0 lg:border-r border-gray-100 h-64 lg:h-auto order-1">
                <div class="absolute inset-0 text-primary pointer-events-none">
                  <svg class="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none">
                     <path d="M110 0 C 70 50 110 150 70 200" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.1" fill="none" />
                     <path d="M90 0 C 50 50 90 150 50 200" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.15" fill="none" />
                  </svg>
                </div>
  
                <div class="absolute left-1/2 lg:-left-16 top-1/2 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 w-48 h-48 lg:w-80 lg:h-80 opacity-20 flex items-center justify-center text-primary">
                   <svg class="w-32 h-32 lg:w-48 lg:h-48" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                   </svg>
                </div>
              </div>
  
              <!-- Right Content -->
              <div class="w-full lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden order-2">
                <div class="absolute inset-0 opacity-[0.03]">
                  <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=%2220%27 height=%2720%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M0 0h20v20H0z%27 fill=%27none%27/%3E%3Cpath d=%27M10 0v20M0 10h20%27 stroke=%27%23000%27 stroke-width=%271%27/%3E%3C/svg%3E')"></div>
                </div>
  
                <div class="relative z-10 space-y-6 lg:space-y-10">
                  <div>
                    <h3 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-kollektif font-bold text-primary mb-6 lg:mb-8 leading-tight">
                      Nuk ka rëndesi thelbi i videos nëse askush nuk po e shikon
                    </h3>
                    <p class="text-base sm:text-lg lg:text-xl 2xl:text-2xl text-primary/80 font-poppins leading-relaxed">
                      Audiencat nuk ndërtohen për një ditë. Suksesi në rrjetet sociale kërkon strategji dhe mjete specifike për të tërhequr vëmendjen dhe për të mbajtur audiencën të angazhuar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Card 3: Accuracy & AI -->
          <div
            ref="card3"
            class="absolute top-0 left-0 w-full rounded-3xl shadow-2xl overflow-hidden border border-cream bg-white"
            style="will-change: transform; z-index: 30;"
          >
            <div class="flex flex-col lg:flex-row h-[600px]">
              <!-- Left Content -->
              <div class="w-full lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden order-2 lg:order-1">
                <div class="absolute inset-0 opacity-[0.03]">
                  <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=%2220%27 height=%2720%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M0 0h20v20H0z%27 fill=%27none%27/%3E%3Cpath d=%27M10 0v20M0 10h20%27 stroke=%27%23000%27 stroke-width=%271%27/%3E%3C/svg%3E')"></div>
                </div>
  
                <div class="relative z-10 space-y-6 lg:space-y-10">
                  <div>
                    <h3 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-kollektif font-bold text-primary mb-6 lg:mb-8 leading-tight">
                      98% saktësi në çdo dialekt nga AlbCaptions
                    </h3>
                    <div class="text-base sm:text-lg lg:text-xl 2xl:text-2xl text-primary/80 font-poppins leading-relaxed">
                      <p>
                        AlbCaptions përdor një proces të automatizuar që konverton zërin në titra dhe i sinkronizon ato me videon përkatëse (98% saktësi).
                      </p>
                      <p>
                        Për 2% që mbetet, AlbCaptions ofron mjete të integruara për redaktim manual, ku përdoruesit mund të korrigjojnë tekstin me lehtësi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Right Illustration -->
              <div class="w-full lg:w-2/5 relative overflow-hidden bg-primary/5 border-b lg:border-b-0 lg:border-l border-gray-100 h-64 lg:h-auto flex items-center justify-center order-1 lg:order-2">
                <div class="absolute inset-0 text-primary pointer-events-none">
                  <svg class="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none">
                    <path d="M-10 0 C 30 50 -10 150 30 200" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.1" fill="none" />
                    <path d="M10 0 C 50 50 10 150 50 200" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.15" fill="none" />
                  </svg>
                </div>
  
                <div class="absolute right-1/2 lg:-right-16 translate-x-1/2 lg:translate-x-0 top-1/2 -translate-y-1/2 w-48 h-48 lg:w-80 lg:h-80 opacity-40 flex items-center justify-center text-secondary">
                   <svg class="w-32 h-32 lg:w-48 lg:h-48" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
                   </svg>
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
  
  const sectionRef = ref(null)
  const card1 = ref(null)
  const card2 = ref(null)
  const card3 = ref(null)
  
  let ctx 
  
  onMounted(() => {
    ctx = gsap.context(() => {
      const cards = [card1.value, card2.value, card3.value]
      
      gsap.set(cards, { 
        yPercent: 100, 
        opacity: 0,
        transformOrigin: "top center" 
      })
      gsap.set(card1.value, { yPercent: 0, opacity: 1 })
  
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: "center center", 
          end: "+=3000",
          scrub: 1, 
          pin: true, 
          anticipatePin: 1,
        }
      })
  
      tl.to(card2.value, {
        yPercent: 0,
        y: 40, 
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      })
      .to(card1.value, {
        scale: 0.95,
        filter: "blur(2px)",
        duration: 1
      }, "<")
  
      .to(card3.value, {
        yPercent: 0,
        y: 80,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      })
      .to(card2.value, {
        scale: 0.95,
        filter: "blur(2px)",
        duration: 1
      }, "<")
      
      .to(card1.value, {
        scale: 0.90,
        duration: 1
      }, "<")
  
    }, sectionRef.value)
  })
  
  onUnmounted(() => {
    if (ctx) ctx.revert()
  })
  </script>
  
  <style scoped>
  :deep(*) {
    user-select: none;
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  </style>