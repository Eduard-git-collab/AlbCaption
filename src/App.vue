<template>
  <div class="app">
    <header 
      v-if="hideNavigation" 
      class="w-screen h-fit p-2 fixed z-100 transition-transform duration-300 ease-in-out"
      :class="{ 'transform -translate-y-full': isHeaderHidden }"
    >
      <div class="w-full h-full px-8 py-2 flex justify-center">
          <nav :class="{ 'transition-all duration-300 ease-in-out shadow-2xl': !isHeaderHidden }"
           class="min-w-3/4 h-fit bg-[#EDE6D4]/95 border border-[#c9c3b2] p-3 rounded-full flex flex-row justify-between items-center transition-all duration-300 ease-in-out">
            <RouterLink to="/">  
              <Albcaptions_logo_nobg class="w-10 h-10 cursor-pointer"/>
            </RouterLink>
              <div class="w-fit text-lg flex flex-row gap-4 justify-evenly font-poppins font-medium">
                <RouterLink to="/about" class="text-primary hover:text-secondary transition-colors">Rreth Nesh</RouterLink>
                <RouterLink to="/contact" class="text-primary hover:text-secondary transition-colors">Kontakt</RouterLink>
                <RouterLink to="/pricing" class="text-primary hover:text-secondary transition-colors">Çmimet</RouterLink>
                <RouterLink to="/faq" class="text-primary hover:text-secondary transition-colors">FAQ</RouterLink>
              </div>
              <div class="w-fit flex flex-row gap-2 justify-between font-poppins items-center font-medium">
                  <RouterLink v-if="!session" to="/signup" class="bg-primary min-w-32 text-center hover:bg-secondary p-2 rounded-full text-secondary hover:text-primary transition-colors">Regjistrohu</RouterLink>
                  <RouterLink v-if="!session" to="/signin" class="bg-primary min-w-32 text-center hover:bg-secondary p-2 rounded-full text-secondary hover:text-primary transition-colors">Hyr</RouterLink>
                <div v-else class="flex gap-4 items-center">
                  <router-link to="/dashboard" class="text-primary hover:text-secondary transition-colors">Dashboard</router-link>
                  <button @click="handleSignOut" class="bg-primary min-w-32 text-center hover:bg-secondary p-2 rounded-full text-secondary hover:text-primary cursor-pointer transition-colors">
                  Sign Out
                  </button>
                </div>  
              </div>
          </nav>
      </div>
  </header>
    <main class="bg-white">
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
const scrollThreshold = 10; 
const headerHeight = 70; 

const hideNavigation = computed(() => {
  return route.name === 'Home' || route.name === 'Pricing' ;
});

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  const scrollDifference = Math.abs(currentScrollY - lastScrollY.value);
  
  if (scrollDifference < scrollThreshold) {
    return;
  }

  if (currentScrollY > lastScrollY.value && currentScrollY > headerHeight) {
    isHeaderHidden.value = true;
  } 

  else if (currentScrollY < lastScrollY.value || currentScrollY <= headerHeight) {
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

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  session.value = data.session;
  
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