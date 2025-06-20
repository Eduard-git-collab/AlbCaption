<template>
    <div class="min-h-screen bg-[#0f172a] text-white font-poppins">
      <div class="container mx-auto px-4 py-20">
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-tl from-[#a784ffd4] to-white">
            Welcome
          </h1>
          <p class="text-xl text-[#92a3bb] max-w-3xl mx-auto">
            Subtitle
          </p>
          <div class="mt-10 flex justify-center gap-4">
            <router-link 
              to="/signup" 
              class="px-8 py-3 bg-[#a784ffd4] hover:bg-opacity-80 text-white text-lg rounded-full transition-all"
            >
              Get Started
            </router-link>
            <router-link 
              to="/signin" 
              class="px-8 py-3 border border-[#a784ffd4] text-white text-lg rounded-full hover:bg-gray-800 transition-all"
            >
              Sign In
            </router-link>
          </div>
        </div>
        
      </div>
    </div>
    <NewUpload />
    <Payment />
  </template>

  <script setup>
  import NewUpload from './NewUpload.vue';
  import Payment from './Payment.vue';
  </script>