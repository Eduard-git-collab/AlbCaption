<template>
    <div class="w-screen h-fit relative mt-15">
        <div class="w-full h-full pt-2">
            <!-- Background banner container -->
            <div class="banner-container overflow-hidden bg-[#052B28] h-fit flex items-end text-kollektif-bold rounded-t-3xl absolute inset-0 z-0">
                <div class="banner-track flex animate-scroll opacity-20">
                  <!-- First set of words -->
                  <div class="banner-item flex-shrink-0 text-[clamp(200px,30vw,450px)] text-[#9FE29E] uppercase pr-10">
                    Ngarko
                  </div>
                  <div class="banner-item flex-shrink-0 flex items-center justify-center pr-10">
                    <div class="w-[clamp(100px,15vw,225px)] h-[clamp(100px,15vw,225px)] bg-[#9FE29E] rounded-full flex items-center justify-center ">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                    </div>
                  </div>
                  <div class="banner-item flex-shrink-0 text-[clamp(200px,30vw,450px)] text-[#9FE29E] uppercase pr-10">
                    Gjenero
                  </div>
                  <div class="banner-item flex-shrink-0 flex items-center justify-center pr-10">
                    <div class="w-[clamp(100px,15vw,225px)] h-[clamp(100px,15vw,225px)] bg-[#9FE29E] rounded-full flex items-center justify-center ">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                    </div>
                  </div>
                  <div class="banner-item flex-shrink-0 text-[clamp(200px,30vw,450px)] text-[#9FE29E] uppercase pr-10">
                    Redakto
                  </div>
                  <div class="banner-item flex-shrink-0 flex items-center justify-center pr-10">
                    <div class="w-[clamp(100px,15vw,225px)] h-[clamp(100px,15vw,225px)] bg-[#9FE29E] rounded-full flex items-center justify-center ">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                    </div>
                  </div>
                  <div class="banner-item flex-shrink-0 text-[clamp(200px,30vw,450px)] text-[#9FE29E] uppercase pr-10">
                    Shkarko
                  </div>
                  <div class="banner-item flex-shrink-0 flex items-center justify-center pr-10">
                    <div class="w-[clamp(100px,15vw,225px)] h-[clamp(100px,15vw,225px)] bg-[#9FE29E] rounded-full flex items-center justify-center ">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                    </div>
                  </div>
                  
                  <!-- Duplicate set for seamless loop -->
                  <div class="banner-item flex-shrink-0 text-[clamp(200px,30vw,450px)] text-[#9FE29E] uppercase pr-10">
                    Ngarko
                  </div>
                  <div class="banner-item flex-shrink-0 flex items-center justify-center pr-10">
                    <div class="w-[clamp(100px,15vw,225px)] h-[clamp(100px,15vw,225px)] bg-[#9FE29E] rounded-full flex items-center justify-center ">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                    </div>
                  </div>
                  <div class="banner-item flex-shrink-0 text-[clamp(200px,30vw,450px)] text-[#9FE29E] uppercase pr-10">
                    Gjenero
                  </div>
                  <div class="banner-item flex-shrink-0 flex items-center justify-center pr-10">
                    <div class="w-[clamp(100px,15vw,225px)] h-[clamp(100px,15vw,225px)] bg-[#9FE29E] rounded-full flex items-center justify-center ">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                    </div>
                  </div>
                  <div class="banner-item flex-shrink-0 text-[clamp(200px,30vw,450px)] text-[#9FE29E] uppercase pr-10">
                    Redakto
                  </div>
                  <div class="banner-item flex-shrink-0 flex items-center justify-center pr-10">
                    <div class="w-[clamp(100px,15vw,225px)] h-[clamp(100px,15vw,225px)] bg-[#9FE29E] rounded-full flex items-center justify-center ">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                    </div>
                  </div>
                  <div class="banner-item flex-shrink-0 text-[clamp(200px,30vw,450px)] text-[#9FE29E] uppercase pr-10">
                    Shkarko
                  </div>
                  <div class="banner-item flex-shrink-0 flex items-center justify-center pr-10">
                    <div class="w-[clamp(100px,15vw,225px)] h-[clamp(100px,15vw,225px)] bg-[#9FE29E] rounded-full flex items-center justify-center ">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                    </div>
                  </div>
                </div>
            </div>
            
            <!-- Overlay content container -->
            <div class="relative z-10 h-full flex w-full">
                <div class="w-full h-full p-6">
                    <div class="flex flex-col gap-8 justify-center">
                        <div class="h-12 w-fit flex flex-row gap-2 items-end">
                            <albcaption_logo_nobg class="h-full w-auto" />
                        </div>
                        <div class="w-full h-fit p-3 flex flex-row gap-4 items-center justify-center">
                            <RouterLink to="" class="text-xl text-[#9FE29E] font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#9FE29E] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
                                Rreth Nesh
                            </RouterLink>
                            
                            <RouterLink to="" class="text-xl text-[#9FE29E] font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#9FE29E] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
                                Çmime
                            </RouterLink>
                            <RouterLink to="" class="text-xl text-[#9FE29E] font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#9FE29E] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
                                FAQ
                            </RouterLink>
                            <RouterLink to="" class="text-xl text-[#9FE29E] font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#9FE29E] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
                                Na Kontakto
                            </RouterLink>
                            <RouterLink to="" class="text-xl text-[#9FE29E] font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#9FE29E] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
                                Kushtet e Përdorimit
                            </RouterLink>
                            <RouterLink to="" class="text-xl text-[#9FE29E] font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#9FE29E] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
                                Politikiat e Privatësisë
                            </RouterLink>
                        </div>
                        <div class="w-3/4 h-fit border-b border-[#9FE29E] opacity-30 flex items-center justify-center mx-auto">
                        </div>
                        <div class="flex flex-row gap-3 items-center justify-center">
                            <gmail_logo class="w-auto h-6 fill-[#9FE29E] opacity-50 cursor-pointer hover:opacity-100 transiton-all duration-200 curosr-pointer"/>
                            <facebook_logo class="w-auto h-6 fill-[#9FE29E] opacity-50 cursor-pointer hover:opacity-100 transiton-all duration-200 curosr-pointer"/>
                            <instagram_logo class="w-auto h-6 fill-[#9FE29E] opacity-50 cursor-pointer hover:opacity-100 transiton-all duration-200 curosr-pointer"/>
                            <linkedin_logo class="w-auto h-6 fill-[#9FE29E] opacity-50 cursor-pointer hover:opacity-100 transiton-all duration-200 curosr-pointer"/>
                        </div>
                        <div class="w-full h-fit flex flex-row gap-2 items-center justify-center font-thin">
                            <span class="text-[#9FE29E] text-xs font-poppins">
                                AlbCaptions |
                            </span>
                            <span class="text-[#9FE29E] text-xs font-poppins">
                                Të gjitha të drejtat e rezervuara
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
  </template>
  
  <style scoped>
  .banner-container {
    white-space: nowrap;
  }
  
  .banner-track {
    width: fit-content;
  }
  
  .animate-scroll {
    animation: scroll 40s linear infinite;
  }
  
  @keyframes scroll {
    0% {
      transform: translateX(0) translateY(45%);
    }
    100% {
      transform: translateX(-50%) translateY(45%);
    }
  }
  
  </style>
<script setup>
import albcaption_logo_inv_nobg from './logos/albcaption_logo_inv_nobg.vue';
import albcaption_logo_nobg from './logos/albcaption_logo_nobg.vue';
import gmail_logo from './logos/gmail.vue';
import facebook_logo from './logos/facebook.vue';
import instagram_logo from './logos/instagram.vue';
import linkedin_logo from './logos/linkedin.vue';
</script>