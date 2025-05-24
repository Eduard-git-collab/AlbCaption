<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import TranscriptViewer from './items/TranscriptViewer.vue';

const route = useRoute();
const router = useRouter();
const transaction = ref(null);
const loading = ref(true);
const unauthorized = ref(false);

onMounted(async () => {
  loading.value = true;
  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    unauthorized.value = true;
    loading.value = false;
    return;
  }
  const userId = session.user.id;
  // Fetch the transaction by ID
  const { data, error } = await supabase
    .from('transactions')
    .select('*, videos(id, video_url)')
    .eq('id', route.params.id)
    .single();

  if (error || !data) {
    transaction.value = null;
    unauthorized.value = true;
  } else if (data.user_id !== userId) {
    unauthorized.value = true;
    transaction.value = null;
  } else {
    transaction.value = {
      ...data,
      video_url: data.videos?.video_url || null,
    };
  }
  loading.value = false;
});
</script>

<template>
  <div class="min-h-screen bg-[#0f172a] text-white font-poppins p-6">
    <div class="container mx-auto">
      <div v-if="loading" class="text-center py-24 text-xl text-[#92a3bb]">
        Loading transaction details...
      </div>
      <div v-else-if="unauthorized" class="text-center py-24 text-red-400 text-xl">
        Unauthorized. You do not have permission to view this transaction.
      </div>
      <div v-else-if="transaction">
        <TranscriptViewer
          :original-filename="transaction.original_filename"
          :transcription-json="transaction.transcription_json"
          :video-url="transaction.video_url"
          :processing-id="transaction.processing_id"
          :srt-content="transaction.srt_content"
          :can-edit="true"
        />
      </div>
      <div v-else class="text-center py-24 text-[#92a3bb]">
        Transaction not found.
      </div>
    </div>
  </div>
</template>