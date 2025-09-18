<!-- DebugParallaxWrapper.vue -->
<template>
    <div class="relative min-h-screen">
      <!-- Debug Info (remove this once working) -->
      <div class="fixed top-4 right-4 z-50 bg-black text-white p-2 rounded text-sm">
        <div>Scroll: {{ Math.round(scrollY) }}px</div>
        <div>FAQ Bottom: {{ Math.round(faqBottom) }}px</div>
        <div>Window Height: {{ windowHeight }}px</div>
        <div>Footer Transform: {{ Math.round(footerTransform) }}%</div>
        <div>Should Show: {{ shouldShowFooter }}</div>
      </div>
  
      <!-- FAQ Section with extra space to allow scrolling -->
      <div ref="faqContainer" class="relative z-10 min-h-screen">
        <!-- Your FAQ Component -->
        <div class="w-screen h-screen">
          <div class="w-full h-full p-3 relative">
            <div class="w-full h-full absolute z-0">
              <div class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl flex items-center justify-center">
                <div class="text-gray-400 text-2xl">FAQ Background (Steps SVG goes here)</div>
              </div>
            </div>
            <div class="w-full h-full flex flex-row gap-3 relative z-10">
              <div class="w-2/5 h-full p-3">
                <div class="w-full h-full flex items-center justify-center flex-col">
                  <div class="w-full h-1/3 flex items-center justify-center">
                    <h1 class="text-7xl text-primary text-center font-bold">Pyetje të shpeshta</h1>
                  </div>
                </div>
              </div>
              <div class="w-3/5 h-full flex justify-center flex-col gap-2 p-3 overflow-y-auto relative z-10">
                <div
                  v-for="(faq, index) in faqs"
                  :key="index"
                  class="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    @click="toggle(index)"
                    class="w-full text-left flex justify-between items-center"
                  >
                    <h3 class="text-lg font-semibold text-primary">{{ faq.question }}</h3>
                    <span class="text-2xl text-primary transform transition-transform duration-300"
                          :class="{ 'rotate-45': openIndex === index }">+</span>
                  </button>
                  <div
                    class="overflow-hidden transition-all duration-300 ease-in-out"
                    :class="openIndex === index ? 'max-h-40 mt-3' : 'max-h-0'"
                  >
                    <p class="text-gray-700">{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Extra content to allow more scrolling -->
        <div class="h-screen bg-gray-100 flex items-center justify-center">
          <div class="text-center">
            <h2 class="text-4xl font-bold text-gray-600 mb-4">Scroll more to see footer</h2>
            <p class="text-gray-500">Keep scrolling down to trigger the footer parallax effect</p>
          </div>
        </div>
      </div>
  
      <!-- Footer Section with Parallax Effect -->
      <div 
        class="fixed bottom-0 left-0 w-full z-20"
        :style="{ 
          transform: `translateY(${footerTransform}%)`,
          transition: 'transform 0.1s ease-out'
        }"
      >
        <!-- Simple Footer Content for Testing -->
        <div class="w-full bg-primary text-secondary p-8">
          <div class="text-center">
            <h3 class="text-3xl font-bold mb-4">Footer Content</h3>
            <p class="mb-4">This is the footer that should slide up</p>
            <div class="flex justify-center gap-4">
              <a href="#" class="hover:underline">About</a>
              <a href="#" class="hover:underline">Contact</a>
              <a href="#" class="hover:underline">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  // FAQ data
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
  const faqContainer = ref(null)
  
  // Debug variables
  const scrollY = ref(0)
  const faqBottom = ref(0)
  const windowHeight = ref(0)
  const footerTransform = ref(100)
  const shouldShowFooter = ref(false)
  
  const toggle = (index) => {
    openIndex.value = openIndex.value === index ? null : index
  }
  
  const updateScrollInfo = () => {
    scrollY.value = window.scrollY
    windowHeight.value = window.innerHeight
    
    if (faqContainer.value) {
      const rect = faqContainer.value.getBoundingClientRect()
      faqBottom.value = rect.bottom
      
      // Start showing footer when FAQ bottom reaches the viewport bottom
      const triggerPoint = windowHeight.value // Start at bottom of screen
      const fullShowPoint = windowHeight.value * 0.5 // Fully show when FAQ is 50% up
      
      if (rect.bottom <= triggerPoint) {
        // Calculate progress: 0 when bottom hits viewport bottom, 1 when it's at 50% up
        const distance = triggerPoint - fullShowPoint
        const progress = Math.max(0, Math.min(1, (triggerPoint - rect.bottom) / distance))
        footerTransform.value = 100 - (progress * 100)
        shouldShowFooter.value = true
      } else {
        footerTransform.value = 100
        shouldShowFooter.value = false
      }
    }
  }
  
  onMounted(() => {
    window.addEventListener('scroll', updateScrollInfo, { passive: true })
    window.addEventListener('resize', updateScrollInfo, { passive: true })
    updateScrollInfo()
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', updateScrollInfo)
    window.removeEventListener('resize', updateScrollInfo)
  })
  </script>