<template>
  <!-- Loading Screen: Only shows if isHome is true -->
  <Loading v-if="isHome" :isLoading="isLoading" />

  <div class="app font-poppins">
    <!-- Header -->
    <header 
      v-if="hideNavigation" 
      class="w-full fixed z-50 top-0 transition-transform duration-300 ease-in-out"
      :class="{ '-translate-y-full': isHeaderHidden }"
    >
      <div class="w-full px-4 sm:px-8 py-4 flex justify-center">
        <nav 
          class="bg-[#EDE6D4] shadow-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
          :class="[
            isMobileMenuOpen ? 'rounded-2xl' : 'rounded-2xl',
            'w-full max-w-7xl px-6'
          ]"
        >
          <!-- Navbar Top Row -->
          <div class="flex flex-row justify-between items-center h-16">
            
            <!-- Logo -->
            <RouterLink to="/" class="flex-shrink-0" @click="isMobileMenuOpen = false">  
              <Albcaptions_logo_nobg class="w-10 h-10 cursor-pointer"/>
            </RouterLink>

            <!-- Hamburger Button (lg:hidden) -->
            <button 
              @click="toggleMobileMenu"
              class="lg:hidden p-2 text-primary focus:outline-none"
            >
              <div class="relative w-8 h-8 flex items-center justify-center">
                <transition name="rotate-fade" mode="out-in">
                  <svg v-if="!isMobileMenuOpen" key="menu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 absolute">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  <svg v-else key="close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 absolute">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </transition>
              </div>
            </button>

            <!-- Desktop Links -->
            <div class="hidden lg:flex flex-row gap-8 items-center font-medium text-lg">
              <RouterLink to="/about" class="text-primary hover:text-secondary transition-colors">Rreth Nesh</RouterLink>
              <RouterLink to="/contact" class="text-primary hover:text-secondary transition-colors">Kontakt</RouterLink>
              <RouterLink to="/upload" class="text-primary hover:text-secondary transition-colors">Ngarko</RouterLink>
              <RouterLink to="/pricing" class="text-primary hover:text-secondary transition-colors">Çmimet</RouterLink>
              <RouterLink to="/faq" class="text-primary hover:text-secondary transition-colors">FAQ</RouterLink>
            </div>

            <!-- Desktop Auth Buttons -->
            <div class="hidden lg:flex flex-row gap-2 items-center font-medium">
              <template v-if="!session">
                <RouterLink to="/signup" class="bg-primary min-w-32 text-center hover:bg-secondary p-2 rounded-lg text-secondary hover:text-primary transition-all duration-200 border-primary border-2">
                  Regjistrohu
                </RouterLink>
                <RouterLink to="/signin" class="bg-primary min-w-32 text-center hover:bg-secondary p-2 rounded-lg text-secondary hover:text-primary transition-all duration-200 border-primary border-2">
                  Hyr
                </RouterLink>
              </template>
              <div v-else class="flex gap-4 items-center">
                <RouterLink to="/dashboard" class="text-primary hover:text-secondary transition-colors">
                  Dashboard
                </RouterLink>
                <button @click="handleSignOut" class="bg-primary min-w-32 text-center hover:bg-secondary p-2 rounded-lg text-secondary hover:text-primary cursor-pointer transition-all duration-200 border-primary border-2">
                  Sign Out
                </button>
              </div>  
            </div>
          </div>

          <!-- Mobile Menu -->
          <div 
            class="lg:hidden transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden"
            :class="isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="flex flex-col gap-4 pb-6 pt-2 text-center border-t border-primary/10">
              <RouterLink @click="isMobileMenuOpen = false" to="/about" class="text-primary text-lg font-medium hover:text-secondary py-2 border-b border-primary/5">Rreth Nesh</RouterLink>
              <RouterLink @click="isMobileMenuOpen = false" to="/contact" class="text-primary text-lg font-medium hover:text-secondary py-2 border-b border-primary/5">Kontakt</RouterLink>
              <RouterLink @click="isMobileMenuOpen = false" to="/upload" class="text-primary text-lg font-medium hover:text-secondary py-2 border-b border-primary/5">Ngarko</RouterLink>
              <RouterLink @click="isMobileMenuOpen = false" to="/pricing" class="text-primary text-lg font-medium hover:text-secondary py-2 border-b border-primary/5">Çmimet</RouterLink>
              <RouterLink @click="isMobileMenuOpen = false" to="/faq" class="text-primary text-lg font-medium hover:text-secondary py-2 mb-2">FAQ</RouterLink>

              <div class="flex flex-col gap-3 px-2">
                <template v-if="!session">
                  <RouterLink @click="isMobileMenuOpen = false" to="/signup" class="w-full bg-primary p-3 rounded-lg text-secondary border-2 border-primary font-medium hover:bg-secondary hover:text-primary transition-colors">
                    Regjistrohu
                  </RouterLink>
                  <RouterLink @click="isMobileMenuOpen = false" to="/signin" class="w-full bg-transparent p-3 rounded-lg text-primary border-2 border-primary font-medium hover:bg-primary hover:text-secondary transition-colors">
                    Hyr
                  </RouterLink>
                </template>
                <div v-else class="flex flex-col gap-3">
                  <RouterLink @click="isMobileMenuOpen = false" to="/dashboard" class="w-full bg-transparent p-3 rounded-lg text-primary border-2 border-primary font-medium hover:bg-primary hover:text-secondary transition-colors">
                    Dashboard
                  </RouterLink>
                  <button @click="handleSignOut" class="w-full bg-primary p-3 rounded-lg text-secondary border-2 border-primary font-medium hover:bg-secondary hover:text-primary transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <main class="bg-white min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Albcaptions_logo_nobg from './components/logos/Albcaption_logo_inv_nobg.vue';
import { supabase } from '@/lib/supabaseClient';
import Loading from './components/subcomponents/Loading.vue';

const route = useRoute();
const router = useRouter();
const session = ref(null);

// --- LOADING LOGIC ---
const isLoading = ref(false);
const isHome = ref(false);

// 3500ms matches the CSS 'animation: lift 3.5s' in LoadingScreen.vue
const MIN_ANIMATION_DURATION = 3500; 

const startLoading = () => {
  isLoading.value = true;
  const startTime = Date.now();
  
  const finish = () => {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - elapsedTime);
    
    setTimeout(() => {
      isLoading.value = false;
    }, remainingTime);
  };

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish);
  }
  
  // Fallback safety: force finish after 7 seconds if window.load never fires
  setTimeout(finish, 7000);
};

// Watch isLoading to lock/unlock scroll
watch(isLoading, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Watch route to enable/disable loading screen logic
// UPDATED: Now calls startLoading() every time we hit '/'
watch(
  () => route.path,
  (path) => {
    if (path === '/') {
      isHome.value = true;
      startLoading();
    } else {
      isHome.value = false;
      isLoading.value = false; // Hide immediately if navigating away
    }
  },
  { immediate: true }
);

// --- HEADER LOGIC ---
const isHeaderHidden = ref(false);
const lastScrollY = ref(0);
const scrollThreshold = 10; 
const headerHeight = 70; 

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const hideNavigation = computed(() => {
  return route.name === 'Home' || route.name === 'Pricing';
});

const handleScroll = () => {
  if (isMobileMenuOpen.value) return;

  const currentScrollY = window.scrollY;
  const scrollDifference = Math.abs(currentScrollY - lastScrollY.value);
  
  if (scrollDifference < scrollThreshold) return;

  if (currentScrollY > lastScrollY.value && currentScrollY > headerHeight) {
    isHeaderHidden.value = true;
  } else if (currentScrollY < lastScrollY.value || currentScrollY <= headerHeight) {
    isHeaderHidden.value = false;
  }
  
  lastScrollY.value = currentScrollY;
};

let ticking = false;
const throttledHandleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
};

// --- LIFECYCLE ---
onMounted(async () => {
  // 1. Auth Session
  const { data } = await supabase.auth.getSession();
  session.value = data.session;
  
  // 2. Scroll Listeners
  window.addEventListener('scroll', throttledHandleScroll, { passive: true });
  lastScrollY.value = window.scrollY;
  
  // 3. Auth State
  supabase.auth.onAuthStateChange((event, currentSession) => {
    session.value = currentSession;
    
    if (event === 'SIGNED_IN') {
      if (route.name === 'SignIn' || route.name === 'SignUp') {
        router.push('/dashboard');
      }
    } else if (event === 'SIGNED_OUT') {
      router.push('/');
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', throttledHandleScroll);
  // Ensure scroll is unlocked if component unmounts unexpectedly while loading
  document.body.style.overflow = '';
});

const handleSignOut = async () => {
  await supabase.auth.signOut();
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
.rotate-fade-enter-active,
.rotate-fade-leave-active {
  transition: all 0.2s ease;
}
.rotate-fade-enter-from,
.rotate-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}
</style>