<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import ConfirmModal from './items/ModalDialog.vue';

const router = useRouter();
const loading = ref(true);
const transcriptsLoading = ref(true); // Separate loading state for transcripts
const userData = ref(null);
const authError = ref(null);
const userTrans = ref([]);
const showSuccessAlert = ref(false);
const successAlertMessage = ref('');

// Modal state
const showDeleteModal = ref(false);
const transactionToDelete = ref(null);
const deleteLoading = ref(false);
const deleteError = ref(null);

const goToDetails = (id) => {
  router.push(`/transaction/${id}`);
};

// Function to load user data with debugging
const loadUserData = async () => {
  loading.value = true;
  authError.value = null;
  
  try {
    // Get current session with more direct approach
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      authError.value = "Error retrieving session";
      return;
    }
    
    if (!session) {
      authError.value = "No active session found";
      return;
    }
    
    // Get user from session
    const user = session.user;
    
    if (!user.user_metadata) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        authError.value = "Error retrieving user data";
        return;
      }
      if (userData?.user) {
        user.user_metadata = userData.user.user_metadata || {};
      }
    }
    
    userData.value = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || 'User',
      surname: user.user_metadata?.surname || '',
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
      role: user.user_metadata?.role || 'free'
    };
    
  } catch (error) {
    authError.value = error.message;
  } finally {
    loading.value = false;
  }
};

// Function to get user transcripts
async function getTranscripts() {
  transcriptsLoading.value = true;
  try {
    if (!userData.value?.id) {
      return;
    }

    // Fetch transactions with video_url from the related videos table
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        videos (id, video_url)
      `)
      .eq('user_id', userData.value.id);

    if (error) {
      return;
    }
    
    userTrans.value = data.map(transaction => ({
      ...transaction,
      video_url: transaction.videos?.video_url || null,
    }));
  } catch (error) {
  } finally {
    transcriptsLoading.value = false;
  }
}

// Delete transaction logic
const promptDelete = (transaction) => {
  transactionToDelete.value = transaction;
  showDeleteModal.value = true;
  deleteError.value = null;
};

const confirmDelete = async () => {
  if (!transactionToDelete.value) return;
  deleteLoading.value = true;
  deleteError.value = null;
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionToDelete.value.id);
    if (error) {
      deleteError.value = error.message || 'Failed to delete transaction.';
    } else {
      // Remove from local list
      userTrans.value = userTrans.value.filter(t => t.id !== transactionToDelete.value.id);
      showDeleteModal.value = false;
      transactionToDelete.value = null;
      showSuccessAlert.value = true;
      successAlertMessage.value = 'Transcript deleted successfully.';
      setTimeout(() => {
        showSuccessAlert.value = false;
        successAlertMessage.value = '';
      }, 2500);
    }
  } catch (err) {
    deleteError.value = err.message || 'Failed to delete transaction.';
  } finally {
    deleteLoading.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  transactionToDelete.value = null;
  deleteError.value = null;
};

onMounted(async () => {
  await loadUserData();
  if (userData.value) {
    getTranscripts();
  }
  
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      loadUserData().then(() => {
        if (userData.value) {
          getTranscripts();
        }
      });
    } else if (event === 'SIGNED_OUT') {
      userData.value = null;
      userTrans.value = [];
      router.push('/');
    }
  });
});

</script>

<template>
  
  <div class="min-h-screen bg-[#0f172a] text-white font-poppins p-6">
    <div class="container mx-auto">
      <div v-if="showSuccessAlert" class="mb-4 bg-green-500 text-white px-4 py-3 rounded shadow fixed flex justify-center">
        {{ successAlertMessage }}
      </div>
      <!-- Only show full loading for initial auth check -->
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
        <h2 class="text-2xl font-semibold mb-4">Your Transcripts</h2>
        
        <!-- Show skeleton loaders while transcripts are loading -->
        <div v-if="transcriptsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="n in 3" :key="n" class="bg-gray-700 bg-opacity-40 p-4 rounded-lg animate-pulse">
            <div class="h-6 bg-gray-600 rounded mb-3 w-3/4"></div>
            <div class="relative w-full h-48 bg-gray-600 rounded-lg mb-4 flex items-center justify-center">
              <div class="text-gray-400">
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4l2-2v6l-2-2v4H7V5z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-600 rounded w-full"></div>
              <div class="h-4 bg-gray-600 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        
        <!-- Display actual videos once loaded -->
        <div v-else-if="userTrans.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="(transaction, index) in userTrans" :key="index" class="bg-gray-700 bg-opacity-40 p-4 rounded-lg">
            <h3 class="text-xl font-semibold mb-3">
              <a 
                class="cursor-pointer text-[#a784ffd4] hover:underline"
                @click="goToDetails(transaction.id)"
              >
                {{ transaction.original_filename }}
              </a>
            </h3>
            <div v-if="transaction.video_url" class="mb-4">
              <div class="relative w-full h-48 bg-black rounded-lg overflow-hidden">
                <video 
                  :src="transaction.video_url" 
                  class="absolute inset-0 w-full h-full object-contain" 
                  controls
                  preload="metadata"
                ></video>
              </div>
            </div>
            <p v-else class="text-yellow-400 mb-4">No video available for this transcript</p>
            <div class="text-sm text-[#92a3bb]">
              <p>Created: {{ new Date(transaction.created_at).toLocaleString() }}</p>
              <p v-if="transaction.description">Description: {{ transaction.description }}</p>
            </div>
            <div class="mt-4 flex gap-2">
              <button
                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                @click="promptDelete(transaction)"
              >Delete</button>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-gray-700 bg-opacity-40 p-6 rounded-lg mb-8">
          <p class="text-[#92a3bb]">No transcripts found. Your transcriptions will appear here once created.</p>
        </div>
        
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
    <!-- Delete confirmation modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      :title="'Delete Transcript'"
      :message="`Are you sure you want to delete '${transactionToDelete?.original_filename}'? This action cannot be undone.`"
      icon="warning"
      confirm-text="Delete"
      confirm-variant="danger"
      cancel-text="Cancel"
      :show-footer="true"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
      @close="cancelDelete"
    >
      <template #body>
        <p v-if="deleteError" class="text-red-600 mb-2">{{ deleteError }}</p>
        <p v-if="deleteLoading" class="text-gray-500">Deleting...</p>
      </template>
    </ConfirmModal>
  </div>
</template>