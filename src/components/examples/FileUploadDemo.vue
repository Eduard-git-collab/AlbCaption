<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">FileUploadArea Component Demo</h1>
      
      <!-- Demo 1: Default Video Upload -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Video Upload (Default Configuration)</h2>
        <FileUploadArea
          :current-file="videoFile"
          @file-selected="handleVideoSelected"
          @validation-error="handleValidationError"
          @file-cleared="handleVideoCleared"
        />
      </div>
      
      <!-- Demo 2: Custom Image Upload -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Image Upload (Custom Configuration)</h2>
        <FileUploadArea
          :max-file-size="5 * 1024 * 1024"
          :accepted-types="['image/jpeg', 'image/png', 'image/gif', 'image/webp']"
          :current-file="imageFile"
          title="Upload Image"
          drop-text="Drop your image here or click to browse"
          @file-selected="handleImageSelected"
          @validation-error="handleValidationError"
          @file-cleared="handleImageCleared"
        />
      </div>
      
      <!-- Demo 3: Minimal PDF Upload -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">PDF Upload (Minimal UI)</h2>
        <FileUploadArea
          :max-file-size="10 * 1024 * 1024"
          :accepted-types="['application/pdf']"
          :current-file="pdfFile"
          :show-title="false"
          :show-file-info="false"
          drop-text="Drop PDF document here"
          @file-selected="handlePdfSelected"
          @validation-error="handleValidationError"
          @file-cleared="handlePdfCleared"
        />
      </div>
      
      <!-- Status Panel -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Status & Events</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="p-4 bg-blue-50 rounded-md border border-blue-200">
            <h4 class="font-medium text-blue-800 mb-1">Video File</h4>
            <p class="text-sm text-blue-600">
              {{ videoFile ? `${videoFile.name} (${formatFileSize(videoFile.size)})` : 'No file selected' }}
            </p>
          </div>
          <div class="p-4 bg-green-50 rounded-md border border-green-200">
            <h4 class="font-medium text-green-800 mb-1">Image File</h4>
            <p class="text-sm text-green-600">
              {{ imageFile ? `${imageFile.name} (${formatFileSize(imageFile.size)})` : 'No file selected' }}
            </p>
          </div>
          <div class="p-4 bg-purple-50 rounded-md border border-purple-200">
            <h4 class="font-medium text-purple-800 mb-1">PDF File</h4>
            <p class="text-sm text-purple-600">
              {{ pdfFile ? `${pdfFile.name} (${formatFileSize(pdfFile.size)})` : 'No file selected' }}
            </p>
          </div>
        </div>
        
        <!-- Event Log -->
        <div v-if="eventLog.length > 0" class="mt-4">
          <h4 class="font-medium text-gray-800 mb-2">Event Log:</h4>
          <div class="bg-gray-50 border rounded-md p-3 max-h-40 overflow-y-auto">
            <div v-for="(event, index) in eventLog" :key="index" class="text-sm mb-1">
              <span class="text-gray-500">{{ event.time }}</span>
              <span class="font-medium ml-2" :class="event.type === 'error' ? 'text-red-600' : 'text-green-600'">
                {{ event.message }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Clear All Button -->
        <div class="mt-4">
          <button
            @click="clearAll"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Clear All Files
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FileUploadArea from '../subcomponents/FileUploadArea.vue'

const videoFile = ref(null)
const imageFile = ref(null)
const pdfFile = ref(null)
const eventLog = ref([])

const addToLog = (message, type = 'info') => {
  const time = new Date().toLocaleTimeString()
  eventLog.value.unshift({ time, message, type })
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(0, 10)
  }
}

const handleVideoSelected = (file) => {
  videoFile.value = file
  addToLog(`Video selected: ${file.name} (${formatFileSize(file.size)})`, 'success')
}

const handleImageSelected = (file) => {
  imageFile.value = file
  addToLog(`Image selected: ${file.name} (${formatFileSize(file.size)})`, 'success')
}

const handlePdfSelected = (file) => {
  pdfFile.value = file
  addToLog(`PDF selected: ${file.name} (${formatFileSize(file.size)})`, 'success')
}

const handleValidationError = (error) => {
  addToLog(`Validation error: ${error}`, 'error')
}

const handleVideoCleared = () => {
  videoFile.value = null
  addToLog('Video file cleared', 'info')
}

const handleImageCleared = () => {
  imageFile.value = null
  addToLog('Image file cleared', 'info')
}

const handlePdfCleared = () => {
  pdfFile.value = null
  addToLog('PDF file cleared', 'info')
}

const clearAll = () => {
  videoFile.value = null
  imageFile.value = null
  pdfFile.value = null
  eventLog.value = []
  addToLog('All files cleared', 'info')
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}
</script>