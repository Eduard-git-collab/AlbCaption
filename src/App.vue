<script setup>

import VideoUpload from './components/VideoUpload.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import Upload from './components/Upload.vue'


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


  <div class="h-fit w-screen overflow-hidden scroll-smooth">
    
    <NavBar/>
    <HeroSection/>
    <Upload />

    <div class="w-screen h-fit">
      <div class="w-full h-full p-2 hidden">
        <div class="flex flex-col gap-3 justify-center items-center">
          <div>
            <h1 class="text-6xl">Upload your video</h1>
            <p class="text-xl text-center font-medium">
              A maximum limit of 50mb (free tier)
            </p>
          </div>
          <input type="file" accept="video/*" @change="handleFileChange" />
          <button
            @click="uploadVideo"
            class="px-4 py-2 bg-violet-500 text-white rounded"
            :disabled="!videoFile"
          >
            Upload Video
          </button>
        </div>
      </div>
    </div>


  </div>

</template>

