<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import logo_lines from './logos/Logo_lines.vue';

const router = useRouter();

const loading = ref(false);
const errorMsg = ref('');

async function signInWithGoogle() {
  loading.value = true;
  errorMsg.value = '';
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) {
    errorMsg.value = 'Failed to start Google sign-in: ' + error.message;
    loading.value = false;
  }
}

onMounted(() => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = session.user;
      
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // --- DATA MAPPING FIX ---
        // 1. Generate a robust username
        const emailName = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''); // Sanitize email part
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const generatedUsername = `${emailName.substring(0, 20)}_${randomSuffix}`;

        // 2. Safely get Name and Surname from Google's metadata
        const firstName = user.user_metadata?.given_name || (user.user_metadata?.full_name?.split(' ')[0]) || 'New';
        const lastName = user.user_metadata?.family_name || (user.user_metadata?.full_name?.split(' ').slice(1).join(' ')) || 'User';

        // 3. Find your default role ID. Replace this placeholder.
        const defaultRoleID = 'e2195325-783a-441d-b3c4-6485b0d8b248'; // IMPORTANT: Replace with your actual default role UUID

        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          username: generatedUsername,
          name: firstName,
          surname: lastName,
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url,
          role: defaultRoleID,
          oauth_provider: 'google',
          oauth_provider_id: user.id, // This should be user.id from the auth provider
          oauth_data: user.user_metadata, // Store all the metadata for future use
        });

        if (insertError) {
          console.error('Error creating new user profile:', insertError);
          errorMsg.value = `Failed to create profile: ${insertError.message}`;
          loading.value = false;
          return; // Stop execution if profile creation fails
        }
      }
      
      // Redirect to the main application page
      router.push('/');
    }
  });
});
</script>

<template>
  <div class="w-full h-screen bg-primary overflow-y-auto overflow-x-hidden">
    <div class="w-full min-h-full relative flex flex-col items-center justify-center p-4">
      <!-- Background SVG lines -->
      <div class="fixed bottom-0 left-0 z-0 w-full h-full pointer-events-none">
        <div class="w-full h-full flex items-end lg:block">
          <logo_lines class="h-1/2 w-full pointer-events-none text-secondary/10" />
        </div>
      </div>

      <!-- Main Content -->
      <div class="h-fit w-full max-w-[400px] bg-white rounded-xl shadow-lg shadow-black z-20 p-6">
        <div class="w-full h-full flex flex-col gap-4 text-center">
            <h1 class="text-kollektif-bold text-2xl md:text-3xl leading-tight">
              Sign In
            </h1>
            <p class="text-gray-600">
              Sign in to your account to continue.
            </p>

            <button 
              @click="signInWithGoogle" 
              :disabled="loading"
              class="flex items-center justify-center gap-3 w-full p-3 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
              <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8.003 8.003 0 0 1 24 36c-5.222 0-9.618-3.66-11.083-8.584l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C43.099 34.552 46 29.697 46 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              Sign In with Google
            </button>

            <div v-if="loading" class="mt-4 text-center">
              <p>Redirecting to Google...</p>
            </div>
            
            <div v-if="errorMsg" class="mt-4 text-center text-red-500">
              <p>Error: {{ errorMsg }}</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>