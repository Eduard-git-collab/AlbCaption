<template>
    <div class="min-h-screen bg-[#0f172a] text-white font-poppins">
      <div class="container mx-auto px-4 py-20">
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-tl from-[#a784ffd4] to-white">
            Welcome to Your App
          </h1>
          <p class="text-xl text-[#92a3bb] max-w-3xl mx-auto">
            Your amazing application description goes here. Showcase the value proposition of your app and encourage users to sign up.
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
        
        <!-- Add your home page content here -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div class="bg-gray-800 bg-opacity-50 p-8 rounded-xl">
            <h3 class="text-2xl font-bold mb-4">Feature One</h3>
            <p class="text-[#92a3bb]">Describe an amazing feature of your application here.</p>
          </div>
          <div class="bg-gray-800 bg-opacity-50 p-8 rounded-xl">
            <h3 class="text-2xl font-bold mb-4">Feature Two</h3>
            <p class="text-[#92a3bb]">Describe another amazing feature of your application here.</p>
          </div>
          <div class="bg-gray-800 bg-opacity-50 p-8 rounded-xl">
            <h3 class="text-2xl font-bold mb-4">Feature Three</h3>
            <p class="text-[#92a3bb]">Describe one more amazing feature of your application here.</p>
          </div>
        </div>
      </div>
    </div>
  </template>