<template>
    <div class="col-span-1 md:col-span-2 lg:col-span-3 w-full">
      <div class="relative bg-gradient-to-r from-primary to-[#1a4a47] border-2 border-secondary shadow-2xl rounded-2xl p-8 w-full flex flex-col lg:flex-row items-center gap-8 overflow-hidden">
        <!-- Decorative pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        <!-- Left side - Content -->
        <div class="flex-1 text-center lg:text-left relative z-10">
          <div class="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <span class="bg-secondary text-primary text-sm font-kollektif-bold px-4 py-1.5 rounded-full">
              Enterprise
            </span>
            <span class="text-secondary text-xs font-medium bg-secondary/20 px-3 py-1 rounded-full">
              Zgjidhje e Personalizuar
            </span>
          </div>
          
          <h3 class="text-3xl lg:text-4xl font-kollektif-bold text-secondary mb-3">
            Post-produksion modern. Inteligjent. Automatik.
          </h3>
          
          <p class="text-[#F7F5EB] text-lg mb-6 opacity-90">
            Për organizatat që kërkojnë zgjidhje të plota dhe të personalizuara për menaxhimin e videove në shkallë të madhe.
          </p>
          
          <!-- Key features grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-[#F7F5EB] text-sm">Përdorim i palimituar</span>
            </div>
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-[#F7F5EB] text-sm">Shërbim hostimi skedarësh me afat të përjetshëm</span>
            </div>
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-[#F7F5EB] text-sm">Integrime ekskluzive</span>
            </div>
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-[#F7F5EB] text-sm">Akses mbi API (së shpejti)</span>
            </div>
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-[#F7F5EB] text-sm">Shërbim Klienti Individual</span>
            </div>
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-[#F7F5EB] text-sm">Librari fjalësh të personalizuara</span>
            </div>
            <div class="flex items-center gap-3 md:col-span-2">
              <svg class="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-[#F7F5EB] text-sm">Transkriptim në masë për arkiva</span>
            </div>
          </div>
        </div>
        
        <!-- Right side - CTA -->
        <div class="flex-shrink-0 text-center relative z-10">
          <div class="mb-6">
            <div class="text-4xl lg:text-5xl font-kollektif-bold text-secondary mb-2">
              Çmim i
            </div>
            <div class="text-3xl lg:text-4xl font-kollektif-bold text-secondary mb-2">
              personalizuar
            </div>
            <div class="text-[#F7F5EB] text-sm opacity-75">
              Bazuar në nevojat tuaja
            </div>
          </div>
          
          <div class="space-y-3">
            <button 
              @click="emitContact()"
              class="w-full bg-secondary text-primary font-semibold px-6 py-3 rounded-full hover:bg-white transition-all shadow-lg transform hover:scale-105"
            >
              Na kontakto
            </button>
            
            <button 
              @click="emitDemo()"
              class="w-full border-2 border-secondary text-secondary font-semibold px-6 py-2.5 rounded-full hover:bg-secondary hover:text-primary transition-all"
            >
              Apliko për Demo
            </button>
          </div>
          
          <div class="text-[#F7F5EB] text-xs opacity-75 mt-4">
            Përgjigje brenda 24 orësh
          </div>
        </div>
        
        <!-- Corner decoration -->
        <div class="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-secondary/10"></div>
        <div class="absolute -left-20 -bottom-20 w-32 h-32 rounded-full bg-secondary/5"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  const emit = defineEmits(['contact-enterprise', 'apply-demo'])
  
  function emitContact() {
    // close/modal logic is handled by parent; emit event so the parent can react
    emit('contact-enterprise')
  }
  
  function emitDemo() {
    emit('apply-demo')
  }
  </script>
  
  <style scoped>
  .font-kollektif-bold { 
    font-family: 'Kollektif', sans-serif; 
    font-weight: bold; 
  }
  .bg-grid-pattern {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3e%3cpath d='M0 0h20v20H0z' fill='none'/%3e%3cpath d='M10 0v20M0 10h20' stroke='%239FE29E' stroke-width='0.5' stroke-opacity='0.3'/%3e%3c/svg%3e");
    background-size: 20px 20px;
  }
  </style>
  