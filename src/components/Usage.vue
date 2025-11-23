<template>
    <div class="w-screen h-fit bg-gray-100">
      <div class="w-full h-full p-3">
        <!-- Header Section -->
        <div class="w-full h-fit bg-primary rounded-3xl px-10 py-6 mb-6 flex items-center relative">
          <div
          class="angled-grid pointer-events-none absolute inset-0"
          style="--angle: 40deg; --grid-size: 22px; --line-opacity: 0.14;"
        ></div>
          <div class="absolute top-6 left-6">
            <div @click="$router.go(-1)">
              <svg class="w-6 h-6 text-secondary hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
          <div class="w-full text-center">
            <h1 class="text-4xl font-bold text-secondary text-kollektif-bold">Manual Përdorimi</h1>
            <p class="text-white/70 font-poppins mt-2">Udhëzime hap pas hapi</p>
          </div>
        </div>
  
        <!-- Manual Container with Grid Background -->
        <div class="max-w-6xl mx-auto">
          <!-- Construction Paper Background -->
          <div class="bg-white rounded-lg shadow-xl overflow-hidden relative" 
            style="background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px); background-size: 20px 20px;">
            <!-- Two Column Layout -->
            <div class="grid grid-cols-12 min-h-screen">
              <!-- Left Sidebar - Table of Contents -->
              <div class="col-span-3 bg-gray-50/50 border-r-2 border-dashed border-gray-300 p-6">
                <div class="sticky top-6">
                  <h3 class="text-lg font-bold text-primary text-kollektif-bold mb-6 uppercase tracking-wide border-b-2 border-secondary pb-2">
                    Përmbajtja
                  </h3>
                  <nav class="space-y-3">
                    <div v-for="(section, sIdx) in sections" :key="section.id" class="group">
                      <!-- Section button -->
                      <button 
                        @click="activeSection = section.id"
                        :class="[
                          'w-full text-left p-3 rounded-lg font-poppins text-sm transition-all duration-200',
                          activeSection === section.id 
                            ? 'bg-secondary text-primary font-medium shadow-md transform scale-105' 
                            : 'text-gray-600 hover:bg-white hover:shadow-sm'
                        ]"
                      >
                        <div class="flex items-center justify-between">
                          <span>{{ sIdx + 1 }}. {{ section.title }}</span>
                          <span v-if="section.steps.length > 1" class="text-[10px] opacity-60">{{ section.steps.length }} hapa</span>
                          <span v-else class="text-[10px] opacity-60">{{ section.steps.length }} hap</span>
                        </div>
                      </button>
                  
                      <!-- Nested steps (only for active section) -->
                      <ol 
                        v-show="activeSection === section.id" 
                        class="mt-2 ml-3 space-y-1"
                      >
                        <li v-for="(step, stIdx) in section.steps" :key="stIdx">
                          <button
                            @click="goToStep(section.id, stIdx)"
                            class="w-full text-left px-3 py-1.5 rounded-md text-xs font-poppins transition-colors"
                            :class="currentStep === stIdx && activeSection === section.id
                              ? 'bg-primary/5 text-primary ring-1 ring-primary/10'
                              : 'text-gray-600 hover:bg-white hover:shadow-sm'"
                          >
                            {{ sIdx + 1 }}.{{ stIdx + 1 }} {{ step.title }}
                          </button>
                        </li>
                      </ol>
                    </div>
                  </nav>
                </div>
              </div>
  
              <!-- Main Content Area -->
              <div class="col-span-9 p-8">
                <!-- Current Section -->
                <div v-for="section in sections" :key="section.id" v-show="activeSection === section.id" class="space-y-8">
                  
                  <!-- Section Title Block -->
                  <div class="relative">
                    <div class="bg-primary text-white p-6 rounded-lg shadow-lg">
                      <div class="flex items-center justify-between">
                        <div>
                          <h2 class="text-3xl font-bold text-kollektif-bold mb-2">{{ section.title }}</h2>
                          <p class="text-secondary font-poppins">{{ section.description }}</p>
                        </div>
                        <div class="text-right">
                          <div class="bg-secondary text-primary px-4 py-2 rounded-full">
                            <span v-if="section.steps.length > 1" class="font-bold font-poppins">{{ section.steps.length }} Hapa</span>
                            <span v-else class="font-bold font-poppins">{{ section.steps.length }} Hap</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Steps Layout -->
                  <div class="space-y-10">
                    <div
                      v-for="(step, stepIndex) in section.steps"
                      :key="stepIndex"
                      class="relative scroll-mt-24"
                      :id="`step-${section.id}-${stepIndex}`"
                    >
                      
                      <!-- Step Card with Graph Paper Effect -->
                      <div class="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-visible relative ml-6">
                        
                        <!-- Step Number Tab -->
                        <div class="absolute -left-6 top-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-lg font-poppins shadow-lg z-10">
                          {{ stepIndex + 1 }}
                        </div>
  
                        <!-- Content Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-5 min-h-[400px]">
                          
                          <!-- Instructions Column -->
                          <div class="lg:col-span-3 p-8 relative">
                            <!-- Faint grid overlay for instruction area -->
                            <div class="absolute inset-0 opacity-10" 
                                 style="background-image: linear-gradient(#9FE29E 1px, transparent 1px), linear-gradient(90deg, #9FE29E 1px, transparent 1px); background-size: 15px 15px;">
                            </div>
                            
                            <div class="relative z-10">
                              <h3 class="text-2xl font-bold text-primary text-kollektif-bold mb-4 border-b border-gray-200 pb-2">
                                {{ step.title }}
                              </h3>
                              
                              <p class="text-gray-700 font-poppins leading-relaxed mb-6 whitespace-pre-line">
                                {{ step.description }}
                              </p>
  
                              <!-- Substeps with handwritten style -->
                              <div v-if="step.substeps" class="space-y-3 ml-4">
                                <h4 class="font-medium text-primary font-poppins mb-3">Detajet:</h4>
                                <div v-for="(substep, subIndex) in step.substeps" :key="subIndex" class="flex items-start group">
                                  <div class="flex-shrink-0 w-5 h-5 border-2 border-secondary rounded-sm flex items-center justify-center mr-3 group-hover:bg-secondary transition-colors">
                                    <svg class="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                  </div>
                                
                                  <span class="text-gray-600 font-poppins">
                                    {{ substep }}
                                    <RouterLink
                                      v-if="step.hasLink && subIndex === 0"
                                      :to="step.link"
                                      aria-label="Rregistrohu"
                                    >
                                      <span
                                        class="text-secondary font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-secondary after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                                      >
                                        Ose ketu
                                      </span>
                                    </RouterLink>
                                  </span>
                                </div>
                              </div>
  
                              <!-- Important Note -->
                              <div v-if="step.note" class="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                                <div class="flex items-start">
                                  <svg class="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                                  </svg>
                                  <div>
                                    <p class="font-medium text-yellow-800 font-poppins text-sm">Kujdes!</p>
                                    <p class="text-yellow-700 font-poppins text-sm mt-1">{{ step.note }}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
  
                          <!-- Media Column -->
                          <div class="lg:col-span-2 bg-gray-50 p-6 border-l border-gray-200 space-y-4">
                            
                            <!-- Image Placeholder -->
                            <div
                              v-if="step.hasImage"
                              class="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white text-center group hover:border-secondary transition-colors cursor-zoom-in"
                              @click="openImage(step.imageSrc, step.imageCaption, step.title)"
                              role="button"
                              tabindex="0"
                            >
                              <img 
                                v-if="step.imageSrc" 
                                :src="step.imageSrc" 
                                :alt="step.imageCaption || step.title" 
                                class="w-full h-32 object-cover rounded-lg mb-3"
                              />
                              <p class="text-gray-600 font-poppins text-sm font-medium mb-1">Figura {{ getCurrentSectionIndex() + 1 }}.{{ stepIndex + 1 }}</p>
                              <p class="text-gray-500 font-poppins text-xs">{{ step.imageCaption }}</p>
                            </div>
  
                            <!-- Video Placeholder -->
                            <div
                              v-if="step.hasVideo"
                              class="border-2 border-secondary rounded-lg p-6 bg-secondary/5 text-center group hover:bg-secondary/10 transition-colors cursor-pointer"
                              @click="openVideo(step.videoSrc, step.videoTitle)"
                              role="button"
                              tabindex="0"
                            >
                              <div class="relative">
                                <svg class="w-16 h-16 text-primary mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center">
                                  <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <svg class="w-3 h-3 text-primary ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <p class="text-primary font-poppins text-sm font-medium mb-1">{{ step.videoTitle }}</p>
                              <p class="text-gray-500 font-poppins text-xs">Kohëzgjatja: {{ step.videoDuration || '2:30' }}</p>
                            </div>
  
                            <!-- Code Example -->
                            <div v-if="step.codeExample" class="bg-gray-900 rounded-lg overflow-hidden">
                              <div class="flex items-center justify-between bg-gray-800 px-4 py-2">
                                <span class="text-gray-300 font-poppins text-xs">Kodi</span>
                                <button class="text-secondary hover:text-white text-xs font-poppins transition-colors">
                                  Kopjo
                                </button>
                              </div>
                              <pre class="text-green-400 font-mono text-xs p-4 overflow-x-auto leading-relaxed">{{ step.codeExample }}</pre>
                            </div>
  
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Navigation Buttons -->
                <div class="flex justify-between items-center py-8 ">
                  <button 
                    @click="previousSection()"
                    class="flex items-center px-6 py-3 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-poppins"
                    :disabled="getCurrentSectionIndex() === 0"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Mbrapa
                  </button>
                  
                  <span class="text-gray-500 font-poppins text-sm">
                    Seksioni {{ getCurrentSectionIndex() + 1 }} nga {{ sections.length }}
                  </span>
                  
                  <button 
                    @click="nextSection()"
                    class="flex items-center px-6 py-3 bg-secondary text-primary rounded-lg hover:bg-primary hover:text-secondary transition-colors font-poppins font-medium"
                    :disabled="getCurrentSectionIndex() === sections.length - 1"
                  >
                    Para
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Footer -->
            <div class="bg-primary text-white p-8 mt-12">
              <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div>
                  <h3 class="text-lg font-bold text-kollektif-bold mb-2">Keni pyetje?</h3>
                  <p class="text-secondary font-poppins text-sm">Shikoi FAQ ose na kontaktonin</p>
                </div>
                <div class="flex space-x-4">
                  <RouterLink to="/contact" class="bg-secondary text-primary px-6 py-3 rounded-lg font-poppins font-medium hover:bg-white transition-colors">
                    Kontaktoni
                  </RouterLink>
                  <RouterLink to="/faq" class="border border-secondary text-secondary px-6 py-3 rounded-lg font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors">
                    FAQ
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Media Modal -->
    <MediaLightbox
      v-model:open="showLightbox"
      :item="lightboxItem"
    />
  </template>
  
  <script setup>
  import { ref, computed, nextTick } from 'vue'
  // script setup
import MediaLightbox from './items/MediaModal.vue' // adjust the path to your project
const showLightbox = ref(false)
const lightboxItem = ref(null)
// Optional carousel:
const lightboxItems = ref([])
const lightboxStartIndex = ref(0)

const openImage = (src, caption, title) => {
  lightboxItem.value = { type: 'image', src, caption, title }
  showLightbox.value = true
}
const openVideo = (src, title, caption = '') => {
  lightboxItem.value = { type: 'video', src, title, caption }
  showLightbox.value = true
}

// Optional: open a gallery for all media inside the current section
const openGalleryForSection = (section, indexToOpen = 0) => {
  const items = []
  section.steps.forEach((st) => {
    if (st.imageSrc) items.push({ type: 'image', src: st.imageSrc, title: st.title, caption: st.imageCaption })
    if (st.videoSrc) items.push({ type: 'video', src: st.videoSrc, title: st.videoTitle })
  })
  if (items.length === 0) return
  lightboxItems.value = items
  lightboxStartIndex.value = Math.max(0, Math.min(indexToOpen, items.length - 1))
  showLightbox.value = true
}

const goToStep = async (sectionId, stepIdx) => {
  if (activeSection.value !== sectionId) {
    activeSection.value = sectionId
    await nextTick()
  }
  currentStep.value = stepIdx
  const el = document.getElementById(`step-${sectionId}-${stepIdx}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
  
  // Reactive state
  const activeSection = ref('getting-started')
  const currentStep = ref(0)
  
  // Current date for version info
  const currentDate = computed(() => {
    return new Date().toLocaleDateString('sq-AL')
  })
  
  // Calculate total pages
  const totalPages = computed(() => {
    return sections.value.reduce((total, section) => total + section.steps.length, 0) + 2
  })
  
  // Sample manual sections
  const sections = ref([
    {
      id: 'getting-started',
      title: 'Krijimi i Llogarisë',
      description: 'Hapat e parë për të përdorur shërbimin tonë',
      steps: [
        {
          title: 'Krijimi i Llogarisë',
          description: 'Regjistrohuni për të krijuar llogarinë tuaj të re dhe të filloni të përdorni shërbimin. Ky është hapi më i rëndësishëm që ju lejon të hyni në sistemin tonë.',
          hasImage: true,
          imageSrc: 'https://htoujjoglfzjvyovryuc.supabase.co/storage/v1/object/public/email-assets/confirmation_mail_header.png',
          imageCaption: 'Paneli i krijimit të llogarisë',
          hasVideo: true,
          videoTitle: 'Si të regjistroheni në 3 minuta',
          videoDuration: '3:45',
          substeps: [
            'Hapni faqen e regjistrimit nga linku kryesor',
            'Plotësoni të dhënat e kërkuara: emri, email dhe username',
            'Krijoni një fjalëkalim të sigurt me të paktën 8 karaktere',
            'Verifikoni email-in tuaj duke klikuar linkun e dërguar'
          ],
          hasLink: true,
          link: '/signup',
          note: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere dhe të përmbajë numra, shkronja të vogla dhe të mëdha'
        },
        {
          title: 'Konfigurimi i profilit tuaj',
          description: 'Pasi jeni rregjistruar ju mund të konfiguroni profilin tuaj nëpërmjet dashboardit. Klikoni profilin në këndin e sipërm të djathtë për të hyrë.',
          hasImage: true,
          imageCaption: 'Panel i cilësimeve me opsionet kryesore',
          substeps: [
            'Shkoni te cilësimet e llogarisë nga menu kryesore',
            'Vendosni fotografinë e profilit (opsionale)',
            'Menaxhoni të dhënat tuaja si emri, email dhe fjalëkalimi',
            'Konfiguroni preferencat e njoftimeve'
          ]
        }
      ]
    },
    {
      id: 'features',
      title: 'Përdorimi i transkriptuesit',
      description: 'Mësoni të përdorni funksionalitetet më të rëndësishme të platformës',
      steps: [
        {
          title: 'Krijimi i një transkripti të ri',
          description: 'Për të krijuar një transkript të ri janë 3 mënyra: \n 1. Nëpërmjet faqes kryesore \n2. Nëpërmjet dashboard-it \n3. Nëpërmjet faqes së transkriptuesit',
          hasImage: true,
          imageCaption: 'Komponenti i krijimit të transkriptit me opsionet e ngarkimit',
          hasVideo: true,
          videoTitle: 'Krijimi i një transkripti',
          videoDuration: '5:20',
          substeps: [
            'Përpara se të krijoni një transkript, sigurohuni që jeni rregjistruar ose krijuar nje llogari. *Shikoni krijimi i lloagrisë për më shumë*',
            'Në komponentin e krijimit të transkriptit, ngarkoni videon ose audion të cilën doni të transkriptoni',
            'Shtypni butonin "Ngarko", për të nisur procesin e transkriptimit',
            'Prisni derisa të përfundojë transkriptimi me sukses',
          ]
        },
        {
          title: 'Redaktimi i transkriptit',
          description: 'Ju mund të redaktoni transkriptet tuaja pas krijimit ose në çdo moment tjetër nëpërmjet panelit të dashboard-it tuaj.',
          hasImage: true,
          imageCaption: 'Komponenti i redaktimit',
          hasVideo: true,
          videoTitle: 'Krijimi i projektit të parë',
          videoDuration: '5:20',
          substeps: [
            'Në dashboard, zgjidhni transkriptin që dëshironi të redaktoni',
            'Në anën e majtë mund të gjeni transkriptin bashkangjitur me videon ose audion e ngarkuar',
            'Për të redaktuar, klikoni ikonën e lapsit pranë transkriptit',
            'Përdorni redaktorin për të ndryshuar tekstin, shtuar ose hequr pjesë',
            'Ndryshimet mund te ruhen duke klikuar ruaj ose duke klikuar ruaj të gjitha për te ruajtuar ndryshimet në të gjithë segmentet e transkriptit',
          ]
        },
        {
          title: 'Fshirja e transkriptit',
          description: 'Ju mund të fshini një transkript në çdo moment nëpërmjet dashboard-it tuaj. Kjo do të fshijë përfundimisht transkriptin dhe të dhënat e tij.',
          hasImage: true,
          imageCaption: 'Paneli i dashboard-it',
          hasVideo: true,
          videoTitle: 'Fshirja e një transkripti',
          videoDuration: '5:20',
          substeps: [
            'Në dashboard, në listën e transkripteve, gjeni transkriptin që dëshironi të fshini',
            'Në anën e djathtë të tabelës mund të gjeni butonin për fshirjen e transkriptit',
            'Një dialog do të shfaqet për të konfirmuar fshirjen'
          ],
          note: 'Fshirja është përfundimtare dhe nuk mund të rikuperohet. Sigurohuni që dëshironi të fshini transkriptin para se të vazhdoni. Transkriptet e fshira nuk ndryshojnë kuotat e mbetura të përdorimit.'
        },
        {
          title: 'Shkarkimi i transkriptit',
          description: 'Pas krijimit dhe redaktimit të transkriptit, ju mund ta shkarkoni atë në formatin e dëshiruar për përdorim të mëtejshëm.',
          hasImage: true,
          imageCaption: 'Paneli i shkarkimit të transkriptit me opsionet e formatit',
          hasVideo: true,
          videoTitle: 'Si të shkarkoni transkriptin tuaj',
          videoDuration: '4:10',
          substeps: [
            'Në dashboard, zgjidhni transkriptin që dëshironi të shkarkoni',
            'Klikoni butonin "Shkarko" në krye të transkriptit',
            'Zgjidhni formatin e dëshiruar (TXT, SRT, VTT)',
            'Klikoni "Shkarko" për të filluar shkarkimin',
            'Transkripti do të ruhet në kompjuterin tuaj në formatin e zgjedhur'
          ]
        }
      ]
    },
    {
      id: 'bug-reporting',
      title: 'Raportimi i problemeve',
      description: 'Mësoni si të raportoni probleme dhe të kontribuoni në përmirësimin e shërbimit',
      steps:[
        {
          title: 'Raportimi i një problemi',
          description: 'Nëse hasni ndonjë problem gjatë përdorimit të shërbimit, ju lutemi raportoni atë në mënyrë që ne të mund të e përmirësojmë shërbimin tonë.',
          hasImage: true,
          imageCaption: 'Forma e raportimit të problemeve',
          hasVideo: true,
          videoTitle: 'Si të raportoni një problem',
          videoDuration: '3:30',
          substeps: [
            'Shkoni te seksioni "Raporto një problemeve" në panelin e dashboard-it ose në faqen kryesore',
            'Plotësoni formularin me detajet e problemit tuaj',
            'Përfshini një përshkrim të qartë dhe, nëse është e mundur, një foto ose video të problemit',
            'Klikoni butonin "Dërgo" për të dërguar raportin tuaj'
          ],
          note: 'Ne vlerësojmë çdo raport dhe do të punojmë për të zgjidhur problemet sa më shpejt të jetë e mundur.'
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Menaxhimi i planit tuaj',
      description: 'Menaxhimi i planit tuaj në platformën AlbCaptions',
      steps: [
        {
          title: 'Përzgjedhja e një plani',
          description: 'Për të përfituar sa më shumë nga shërbimet e AlbCaptions, ju mund të përzgjidhni një nga planet e AlbCaptions',
          hasVideo: true,
          videoTitle: 'Përzgjedhja e planit',
          videoDuration: '8:15',
          substeps: [
            'Pasi jeni rregjistruar ose keni hyrë në llogarinë tuaj ekzistuese. Shkoni te seksioni "Çmimet" në menunë kryesore',
            'Përzgjidhni planin që i përshtatet më së miri nevojave tuaja',
            'Klikoni butonin "Përzgjidh" për të vazhduar me blerjen',
            'Plotësoni të dhënat e pagesës dhe klikoni "Bli Tani"',
          ],
          note: 'Pas përzgjedhjes së planit, mund të ketë vonesa në shfaqjen e planit në llogarinë tuaj. Nëse hasni probleme, ju lutemi kontaktoni suportin teknik.',
        },
        {
          title: 'Menaxhimi i planit tuaj',
          description:'Ju mund të vendosni të anulloni planin tuaj në çdo kohë. Nëse anulloni, plani do të vazhdojë deri në fund të periudhës së faturimit aktuale.',
          hasVideo: true,
          videoTitle: 'Menaxhimi i planit',
          videoDuration: '6:30',
          substeps:[
            'Për të menaxhuar planin tuaj, shkoni te seksioni "Plani" në menunë kryesore',
            'Këtu mund të shihni informacionin e planit tuaj aktual, përfshirë datën e rinovimit dhe kuotat e mbetura',
            'Nëse dëshironi të anulloni planin, klikoni butonin "Anullo Planin"',
            'Pas anullimit, do të merrni një konfirmim dhe plani do të vazhdojë deri në fund të periudhës së faturimit aktuale',
            'Në perfundim të planit lloagria juaj do të kthehet në planin falas'
          ],
          note: 'Anullimi i planit nuk do të fshijë transkriptet tuaja ekzistuese. Ju mund të vazhdoni të përdorni shërbimin deri në fund të periudhës së faturimit aktuale.',
        }
      ]
    }
  ])
  
  // Methods
  const getCurrentSectionIndex = () => {
    return sections.value.findIndex(section => section.id === activeSection.value)
  }
  
  const nextSection = () => {
    const currentIndex = getCurrentSectionIndex()
    if (currentIndex < sections.value.length - 1) {
      activeSection.value = sections.value[currentIndex + 1].id
      currentStep.value = 0
    }
  }
  
  const previousSection = () => {
    const currentIndex = getCurrentSectionIndex()
    if (currentIndex > 0) {
      activeSection.value = sections.value[currentIndex - 1].id
      currentStep.value = 0
    }
  }
  </script>
  
  <style scoped>
  .angled-grid {
    --angle: 35deg;
    --grid-size: 20px;
    --line-opacity: 0.12;
    --line-color: 159, 226, 158;
    background-image:
      repeating-linear-gradient(var(--angle), rgba(var(--line-color), var(--line-opacity)) 0 1px, transparent 1px var(--grid-size)),
      repeating-linear-gradient(calc(var(--angle) + 90deg), rgba(var(--line-color), var(--line-opacity)) 0 1px, transparent 1px var(--grid-size));
    mask-image: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.1) 80%, rgba(0,0,0,0));
    -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.1) 80%, rgba(0,0,0,0));
  }
  
  /* Smooth transitions */
  * {
    transition: all 0.2s ease;
  }
  
  /* Custom scrollbar for better aesthetics */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #9FE29E;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #052B28;
  }
  </style>