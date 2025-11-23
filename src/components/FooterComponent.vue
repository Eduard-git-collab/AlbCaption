<template>
    <div class="w-full h-screen relative bg-primary overflow-hidden footer-section rounded-t-xl">
        <!-- Background banner container -->
        <!-- Changed h-fit to h-full and ensured it sits at bottom -->
        <div class="banner-container w-full h-full absolute inset-0 z-0 flex items-end pb-4 sm:pb-8 pointer-events-none select-none">
            <div class="banner-track flex animate-scroll opacity-20 text-kollektif-bold whitespace-nowrap">
              <!-- Content Loop -->
              <div class="flex items-center">
                  <div class="banner-item text-[clamp(80px,15vw,200px)] text-secondary uppercase px-4">Ngarko</div>
                  <div class="w-[clamp(40px,8vw,100px)] h-[clamp(40px,8vw,100px)] bg-secondary rounded-full flex items-center justify-center mx-4">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                  </div>
                  
                  <div class="banner-item text-[clamp(80px,15vw,200px)] text-secondary uppercase px-4">Gjenero</div>
                  <div class="w-[clamp(40px,8vw,100px)] h-[clamp(40px,8vw,100px)] bg-secondary rounded-full flex items-center justify-center mx-4">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                  </div>

                  <div class="banner-item text-[clamp(80px,15vw,200px)] text-secondary uppercase px-4">Redakto</div>
                  <div class="w-[clamp(40px,8vw,100px)] h-[clamp(40px,8vw,100px)] bg-secondary rounded-full flex items-center justify-center mx-4">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                  </div>

                  <div class="banner-item text-[clamp(80px,15vw,200px)] text-secondary uppercase px-4">Shkarko</div>
                  <div class="w-[clamp(40px,8vw,100px)] h-[clamp(40px,8vw,100px)] bg-secondary rounded-full flex items-center justify-center mx-4">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                  </div>
              </div>
              <!-- Duplicate for Loop -->
              <div class="flex items-center">
                  <div class="banner-item text-[clamp(80px,15vw,200px)] text-secondary uppercase px-4">Ngarko</div>
                  <div class="w-[clamp(40px,8vw,100px)] h-[clamp(40px,8vw,100px)] bg-secondary rounded-full flex items-center justify-center mx-4">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                  </div>
                  
                  <div class="banner-item text-[clamp(80px,15vw,200px)] text-secondary uppercase px-4">Gjenero</div>
                  <div class="w-[clamp(40px,8vw,100px)] h-[clamp(40px,8vw,100px)] bg-secondary rounded-full flex items-center justify-center mx-4">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                  </div>

                  <div class="banner-item text-[clamp(80px,15vw,200px)] text-secondary uppercase px-4">Redakto</div>
                  <div class="w-[clamp(40px,8vw,100px)] h-[clamp(40px,8vw,100px)] bg-secondary rounded-full flex items-center justify-center mx-4">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                  </div>

                  <div class="banner-item text-[clamp(80px,15vw,200px)] text-secondary uppercase px-4">Shkarko</div>
                  <div class="w-[clamp(40px,8vw,100px)] h-[clamp(40px,8vw,100px)] bg-secondary rounded-full flex items-center justify-center mx-4">
                      <albcaption_logo_inv_nobg class="w-3/4 h-3/4" />
                  </div>
              </div>
            </div>
        </div>
        
        <!-- Main Content (Links & Socials) -->
        <div class="relative z-10 w-full h-full flex flex-col justify-center items-center pb-32 lg:pb-48">
            <div class="flex flex-col gap-8 items-center justify-center max-w-4xl mx-auto px-6">
                <!-- Logo -->
                <div class="h-12 sm:h-16 w-auto mb-4">
                    <albcaption_logo_nobg class="h-full w-auto" />
                </div>
                
                <!-- Navigation Links -->
                <div class="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12 text-center">
                    <RouterLink to="/about" class="text-lg sm:text-xl text-secondary font-poppins hover:text-white transition-colors">Rreth Nesh</RouterLink>
                    <RouterLink to="/pricing" class="text-lg sm:text-xl text-secondary font-poppins hover:text-white transition-colors">Çmime</RouterLink>
                    <RouterLink to="/upload" class="text-lg sm:text-xl text-secondary font-poppins hover:text-white transition-colors">Ngarko</RouterLink>
                    <RouterLink to="/faq" class="text-lg sm:text-xl text-secondary font-poppins hover:text-white transition-colors">FAQ</RouterLink>
                    <RouterLink to="/contact" class="text-lg sm:text-xl text-secondary font-poppins hover:text-white transition-colors">Na Kontakto</RouterLink>
                    <RouterLink to="/tos" class="text-lg sm:text-xl text-secondary font-poppins hover:text-white transition-colors">Kushtet e Përdorimit</RouterLink>
                    <RouterLink to="/pp" class="text-lg sm:text-xl text-secondary font-poppins hover:text-white transition-colors">Politikat e Privatësisë</RouterLink>
                </div>
                
                <!-- Divider -->
                <div class="w-3/4 h-px bg-secondary/30 my-4"></div>
                
                <!-- Social Icons -->
                <div class="flex gap-6 items-center justify-center">
                    <gmail_logo class="h-6 w-6 sm:h-8 sm:w-8 fill-secondary hover:fill-white transition-colors cursor-pointer"/>
                    <facebook_logo class="h-6 w-6 sm:h-8 sm:w-8 fill-secondary hover:fill-white transition-colors cursor-pointer"/>
                    <instagram_logo class="h-6 w-6 sm:h-8 sm:w-8 fill-secondary hover:fill-white transition-colors cursor-pointer"/>
                    <linkedin_logo class="h-6 w-6 sm:h-8 sm:w-8 fill-secondary hover:fill-white transition-colors cursor-pointer"/>
                </div>
                
                <!-- Copyright -->
                <div class="flex flex-col sm:flex-row gap-2 text-secondary/60 text-sm font-poppins mt-4">
                    <span>AlbCaptions |</span>
                    <span>Të gjitha të drejtat e rezervuara</span>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import albcaption_logo_inv_nobg from './logos/Albcaption_logo_inv_nobg.vue';
import albcaption_logo_nobg from './logos/Albcaption_logo_nobg.vue';
import gmail_logo from './logos/gmail.vue';
import facebook_logo from './logos/facebook.vue';
import instagram_logo from './logos/instagram.vue';
import linkedin_logo from './logos/linkedin.vue';
</script>

<style scoped>
.animate-scroll {
    animation: scroll 30s linear infinite;
}
@keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
</style>