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
            <div class="flex flex-col 4xl:gap-12  2xl:gap-10 lg:gap-8 items-center justify-center 4xl:max-w-8xl 2xl:max-w-[50%] xl:max-w-5xl  lg:max-w-4xl md:max-w-2xl max-w-4xl mx-auto px-6">
                <!-- Logo -->
                <div class="4xl:h-32 2xl:h-28 xl:h-20 lg:h-20 h-16 w-auto mb-4">
                    <albcaption_logo_nobg class="h-full w-auto" />
                </div>
                
                <!-- Navigation Links -->
                <div class="flex flex-wrap justify-center 4xl:gap-12  2xl:gap-10 md:gap-8 gap-3 text-center 4xl:text-6xl 2xl:text-5xl xl:text-3xl text-lg">
                    <RouterLink to="/about" class="cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] text-secondary font-poppins hover:text-white transition-colors after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">Rreth Nesh</RouterLink>
                    <RouterLink to="/pricing" class="cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] text-secondary font-poppins hover:text-white transition-colors after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">Çmime</RouterLink>
                    <RouterLink to="/upload" class="cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] text-secondary font-poppins hover:text-white transition-colors after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">Ngarko</RouterLink>
                    <RouterLink to="/faq" class="cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] text-secondary font-poppins hover:text-white transition-colors after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">FAQ</RouterLink>
                    <RouterLink to="/contact" class="cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] text-secondary font-poppins hover:text-white transition-colors after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">Na Kontakto</RouterLink>
                    <a href="" @click.prevent="promptToSModal" class="cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] text-secondary font-poppins hover:text-white transition-colors after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">Kushtet e Përdorimit</a>
                    <a href="" @click.prevent="promptPrivacyPolicy" class="cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] text-secondary font-poppins hover:text-white transition-colors after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">Politikat e Privatësisë</a>
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
                <div class="flex flex-row gap-1 text-secondary/60 text-sm font-poppins mt-4">
                    <span>AlbCaptions |</span>
                    <span>Të gjitha të drejtat e rezervuara</span>
                </div>
            </div>
        </div>
    </div>
    <ToSModal
        v-model:open="ShowToSModal"
    />
    <PrivacyPolicyModal
        v-model:open="ShowPrivacyPolicy"
    />
</template>
  
<script setup>
import albcaption_logo_inv_nobg from './logos/Albcaption_logo_inv_nobg.vue';
import albcaption_logo_nobg from './logos/Albcaption_logo_nobg.vue';
import gmail_logo from './logos/gmail.vue';
import facebook_logo from './logos/facebook.vue';
import instagram_logo from './logos/instagram.vue';
import linkedin_logo from './logos/linkedin.vue';
import PrivacyPolicyModal from './items/PrivacyPolicyModal.vue';
import ToSModal from './items/ToSModal.vue';
import { ref } from 'vue';

const ShowPrivacyPolicy = ref(false);
const ShowToSModal = ref(false);
const promptPrivacyPolicy = () => {
  ShowPrivacyPolicy.value = true;
};
const promptToSModal = () => {
  ShowToSModal.value = true;
};
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