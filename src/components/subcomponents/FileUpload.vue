<template>
    <div class="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div class="mb-4">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Upload Video</h2>
        <div 
          class="w-full border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors"
          :class="{ 'border-blue-500 bg-blue-50': isDragging, 'border-gray-300 hover:bg-gray-50': !isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
          @click="triggerFileInput"
        >
          <div class="flex flex-col items-center justify-center">
            <svg class="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mb-2 text-lg font-medium text-gray-700">
              {{ file ? 'Change video' : 'Drop video here or click to upload' }}
            </p>
            <p class="mb-2 text-sm text-gray-500">
              MP4, MOV, or WebM files only (max. 100MB)
            </p>
            <span v-if="file" class="text-sm font-medium text-blue-600">
              {{ file.name }} ({{ formatFileSize(file.size) }})
            </span>
          </div>
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="video/*"
            @change="onFileChange"
          />
        </div>
      </div>
  
      <div v-if="file" class="w-full">
        <button
          @click="$emit('upload', file)"
          :disabled="isUploading"
          class="w-full py-2 px-4 rounded-md font-medium text-white transition-colors"
          :class="[
            isUploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          ]"
        >
          {{ isUploading ? 'Uploading...' : 'Upload Video' }}
        </button>
      </div>
  
      <!-- Error Display -->
      <div v-if="errorMessage" class="w-full mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    isUploading: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['upload'])
  
  const file = ref(null)
  const isDragging = ref(false)
  const errorMessage = ref(null)
  const fileInput = ref(null)
  
  const triggerFileInput = () => {
    fileInput.value.click()
  }
  
  const onFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      if (!validateFile(selectedFile)) return
      file.value = selectedFile
      errorMessage.value = null
    }
  }
  
  const onDrop = (event) => {
    isDragging.value = false
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      if (!validateFile(droppedFile)) return
      file.value = droppedFile
      errorMessage.value = null
    }
  }
  
  const validateFile = (file) => {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      errorMessage.value = 'Please select a valid video file (MP4, MOV, or WebM).'
      return false
    }
    
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      errorMessage.value = 'Video file is too large. Maximum size is 100MB.'
      return false
    }
    
    return true
  }
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' B'
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB'
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }
  }
  </script>