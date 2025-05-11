<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const router = useRouter();
const loading = ref(true);
const userData = ref(null);
const authError = ref(null);

// Function to load user data with debugging
const loadUserData = async () => {
  loading.value = true;
  authError.value = null;
  
  try {
    console.log("Checking authentication status...");
    
    // Get current session with more direct approach
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      authError.value = "Error retrieving session";
      return;
    }
    
    console.log("Session check result:", session ? "Session found" : "No session found");
    
    if (!session) {
      authError.value = "No active session found";
      return;
    }
    
    // Get user from session
    const user = session.user;
    console.log("User found:", user.id);
    
    // Verify user metadata exists
    if (!user.user_metadata) {
      console.warn("User metadata is missing");
      
      // Fallback approach: try to get user directly
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("User retrieval error:", userError);
        authError.value = "Error retrieving user data";
        return;
      }
      
      if (userData?.user) {
        user.user_metadata = userData.user.user_metadata || {};
      }
    }
    
    // Set up user data with fallbacks for missing metadata
    userData.value = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || 'User',
      surname: user.user_metadata?.surname || '',
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
      role: user.user_metadata?.role || 'free'
    };
    
    console.log("User data loaded successfully:", userData.value);
    
  } catch (error) {
    console.error("Error in loadUserData:", error);
    authError.value = error.message;
  } finally {
    loading.value = false;
  }
};

// Set up initialization and auth listeners
onMounted(async () => {
  // Initial load
  await loadUserData();
  
  // Set up auth state change listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event);
    
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      // Refresh user data when signed in or token refreshed
      loadUserData();
    } else if (event === 'SIGNED_OUT') {
      // Clear user data and redirect
      userData.value = null;
      router.push('/');
    }
  });
});
</script>

<template>
  <div class="min-h-screen bg-[#0f172a] text-white font-poppins p-6">
    <div class="container mx-auto">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a784ffd4]"></div>
      </div>
      
      <div v-else-if="userData" class="bg-gray-800 bg-opacity-40 rounded-xl p-8">
        <h1 class="text-4xl font-bold mb-6">Dashboard</h1>
        
        <div class="bg-gray-700 bg-opacity-40 rounded-lg p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-4">Welcome, {{ userData?.name }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-[#92a3bb] mb-1">Username:</p>
              <p class="font-medium">{{ userData?.username }}</p>
            </div>
            <div>
              <p class="text-[#92a3bb] mb-1">Email:</p>
              <p class="font-medium">{{ userData?.email }}</p>
            </div>
            <div>
              <p class="text-[#92a3bb] mb-1">Full Name:</p>
              <p class="font-medium">{{ userData?.name }} {{ userData?.surname }}</p>
            </div>
            <div>
              <p class="text-[#92a3bb] mb-1">Account Type:</p>
              <p class="font-medium capitalize">{{ userData?.role }}</p>
            </div>
          </div>
        </div>
        
        <!-- Dashboard content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-700 bg-opacity-40 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-3">Section One</h3>
            <p class="text-[#92a3bb]">Your dashboard content here.</p>
          </div>
          <div class="bg-gray-700 bg-opacity-40 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-3">Section Two</h3>
            <p class="text-[#92a3bb]">More dashboard content here.</p>
          </div>
          <div class="bg-gray-700 bg-opacity-40 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-3">Section Three</h3>
            <p class="text-[#92a3bb]">Additional dashboard content here.</p>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <h2 class="text-2xl">Authentication Issue</h2>
        <p v-if="authError" class="text-red-400 mt-4">{{ authError }}</p>
        <p class="mt-4 text-[#92a3bb]">
          We're having trouble verifying your login status. 
          Please try signing in again.
        </p>
        <div class="flex justify-center mt-6 gap-4">
          <button 
            @click="loadUserData" 
            class="px-6 py-2 bg-gray-700 rounded-full hover:bg-gray-600"
          >
            Retry
          </button>
          <router-link to="/signin" class="inline-block px-6 py-2 bg-[#a784ffd4] rounded-full">
            Sign In Again
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>