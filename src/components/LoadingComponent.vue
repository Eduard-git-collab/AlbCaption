<template>
    <div class="flex justify-center items-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a784ffd4]"></div>
      <span class="ml-2 text-[#92a3bb]" v-if="message">{{ message }}</span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    message: {
      type: String,
      default: ''
    }
  });
  </script>