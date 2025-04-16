<script setup>

import VideoUpload from './components/VideoUpload.vue'
import supabaseTest from './components/supabaseTest.vue';


</script>

<template>
  <div class="hidden">
    <header style="background-color: #f1f1f1; padding: 15px; text-align: center; font-weight: bold;">
      Header Area Placeholder
    </header>
    
    <main>
      <VideoUpload />
    
      <div style="height: 300px; background-color: #e9ecef; display: flex; align-items: center; justify-content: center; color: #6c757d;">Pricing Section Placeholder</div>
      <div style="height: 300px; background-color: #dee2e6; display: flex; align-items: center; justify-content: center; color: #6c757d;">FAQ Section Placeholder</div>
    
    </main>
    
    <footer style="background-color: #343a40; padding: 30px; text-align: center; color: white;">
      Footer Area Placeholder
    </footer>
  </div>
  
  <supabaseTest />

</template>
