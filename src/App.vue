<template>
    <div class="app">
      <header v-if="!hideNavigation" class="bg-[#0f172a] text-white p-4">
        <nav class="container mx-auto flex justify-between items-center">
          <router-link to="/" class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-tl from-[#a784ffd4] to-white">
            App Name
          </router-link>
          
          <div class="flex gap-6 items-center">
            <router-link to="/" class="hover:text-[#a784ffd4] transition-colors">Home</router-link>
            
            <template v-if="!session">
              <router-link to="/signin" class="hover:text-[#a784ffd4] transition-colors">Sign In</router-link>
              <router-link to="/signup" class="bg-[#a784ffd4] text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors">
                Sign Up
              </router-link>
            </template>
            
            <template v-else>
              <router-link to="/dashboard" class="hover:text-[#a784ffd4] transition-colors">Dashboard</router-link>
              <button @click="handleSignOut" class="text-white px-4 py-2 rounded-full border border-[#a784ffd4] hover:bg-[#a784ffd4] transition-colors">
                Sign Out
              </button>
            </template>
          </div>
        </nav>
      </header>
  
      <main>
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { supabase } from './lib/supabaseClient';
  
  const session = ref(null);
  const route = useRoute();
  const router = useRouter();
  
  // Hide navigation on auth pages
  const hideNavigation = computed(() => {
    return route.name === 'SignIn' || route.name === 'SignUp';
  });
  
  // Check for existing session on mount
  onMounted(async () => {
    const { data } = await supabase.auth.getSession();
    session.value = data.session;
    
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
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  </script>