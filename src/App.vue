<script setup>

import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import Upload from './components/Upload.vue'
import Authentication from './components/Authentication.vue'
import NewUpload from './components/NewUpload.vue'

</script>

<template>

  <div class="h-fit w-screen overflow-hidden hidden scroll-smooth">
    
    <NavBar/>
    <HeroSection/>
    <Upload />

  <Authentication />
  </div>

    <NewUpload />

</template>

