<template>
  <div class="app">
    <header 
      v-if="!hideNavigation" 
      class="w-screen h-fit p-2 fixed z-100 transition-transform duration-300 ease-in-out"
      :class="{ 'transform -translate-y-full': isHeaderHidden }"
    >
      <div class="w-full h-full px-8 py-2 flex justify-center">
          <nav class="min-w-3/4 h-fit bg-tan p-3 rounded-full flex flex-row justify-between items-center">
            <RouterLink to="/">  
              <Albcaptions_logo_nobg class="w-10 h-10 cursor-pointer"/>
            </RouterLink>
              <div class="w-fit text-lg flex flex-row gap-4 justify-evenly font-poppins font-medium">
                <RouterLink to="/about" class="text-[#052B28] hover:text-[#9FE29E] transition-colors">Rreth Nesh</RouterLink>
                <RouterLink to="/contact" class="text-[#052B28] hover:text-[#9FE29E] transition-colors">Kontakt</RouterLink>
                <RouterLink to="/pricing" class="text-[#052B28] hover:text-[#9FE29E] transition-colors">Paketat</RouterLink>
                <RouterLink to="/faq" class="text-[#052B28] hover:text-[#9FE29E] transition-colors">FAQ</RouterLink>
              </div>
              <div class="w-fit flex flex-row gap-2 justify-between font-poppins items-center font-medium">
                  <RouterLink v-if="!session" to="/signup" class="bg-[#052B28] min-w-32 text-center hover:bg-[#9FE29E] p-2 rounded-full text-[#9FE29E] hover:text-[#052B28] transition-colors">Regjistrohu</RouterLink>
                  <RouterLink v-if="!session" to="/signin" class="bg-[#052B28] min-w-32 text-center hover:bg-[#9FE29E] p-2 rounded-full text-[#9FE29E] hover:text-[#052B28] transition-colors">Hyr</RouterLink>
                <div v-else class="flex gap-4 items-center">
                  <router-link to="/new-dashboard" class="text-[#052B28] hover:text-[#9FE29E] transition-colors">Dashboard</router-link>
                  <button @click="handleSignOut" class="bg-[#052B28] min-w-32 text-center hover:bg-[#9FE29E] p-2 rounded-full text-[#9FE29E] hover:text-[#052B28] cursor-pointer transition-colors">
                  Sign Out
                  </button>
                </div>  
              </div>
          </nav>
      </div>
  </header>
    <main class="bg-gray-100">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Albcaptions_logo_nobg from './components/logos/Albcaption_logo_inv_nobg.vue';
import { supabase } from './lib/supabaseClient';

const session = ref(null);
const route = useRoute();
const router = useRouter();

// Header visibility state
const isHeaderHidden = ref(false);
const lastScrollY = ref(0);
const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show
const headerHeight = 80; // Approximate header height for better UX

// Hide navigation on auth pages
const hideNavigation = computed(() => {
  return route.name === 'SignIn' || route.name === 'SignUp' || route.name === 'NewDashboard' || route.name === 'ConfirmEmail';
});

// Scroll handler with threshold and direction detection
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  const scrollDifference = Math.abs(currentScrollY - lastScrollY.value);
  
  // Only trigger if scroll difference exceeds threshold
  if (scrollDifference < scrollThreshold) {
    return;
  }
  
  // Hide header when scrolling down (and past the header height)
  if (currentScrollY > lastScrollY.value && currentScrollY > headerHeight) {
    isHeaderHidden.value = true;
  } 
  // Show header when scrolling up or near the top
  else if (currentScrollY < lastScrollY.value || currentScrollY <= headerHeight) {
    isHeaderHidden.value = false;
  }
  
  lastScrollY.value = currentScrollY;
};

// Throttled scroll handler to improve performance
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

// Check for existing session on mount
onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  session.value = data.session;
  
  // Add scroll event listener
  window.addEventListener('scroll', throttledHandleScroll, { passive: true });
  lastScrollY.value = window.scrollY;
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
    session.value = currentSession;
    
    if (event === 'SIGNED_IN') {
      if (route.name === 'SignIn' || route.name === 'SignUp') {
        router.push('/dashboard');
      }
    } else if (event === 'SIGNED_OUT') {
      router.push('/');
    } else if (event === 'USER_UPDATED') {
      session.value = currentSession;
    }
  });
});

// Cleanup scroll listener
onUnmounted(() => {
  window.removeEventListener('scroll', throttledHandleScroll);
});

const handleSignOut = async () => {
  await supabase.auth.signOut();
};
</script>