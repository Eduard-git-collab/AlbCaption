<template>
  <div class="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
    <div class="mb-4">
      <h2 v-if="showTitle" class="text-xl font-bold mb-4 text-gray-800">{{ title }}</h2>
      <div 
        class="w-full border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors"
        :class="{ 'border-blue-500 bg-blue-50': isDragging, 'border-gray-300 hover:bg-gray-50': !isDragging }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <div class="flex flex-col items-center justify-center">
          <svg class="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="mb-2 text-lg font-medium text-gray-700">
            {{ currentFile ? 'Change file' : dropText }}
          </p>
          <p class="mb-2 text-sm text-gray-500">
            {{ acceptedTypesText }} (max. {{ formatFileSize(maxFileSize) }})
          </p>
          <span v-if="currentFile" class="text-sm font-medium text-blue-600">
            {{ currentFile.name }} ({{ formatFileSize(currentFile.size) }})
          </span>
        </div>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          :accept="acceptAttribute"
          @change="handleFileChange"
        />
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="errorMessage" class="w-full mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
      {{ errorMessage }}
    </div>

    <!-- File Info Display -->
    <div v-if="currentFile && showFileInfo" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-blue-800">{{ currentFile.name }}</p>
            <p class="text-xs text-blue-600">{{ formatFileSize(currentFile.size) }}</p>
          </div>
        </div>
        <button
          @click="clearFile"
          class="text-red-600 hover:text-red-800 transition-colors"
          title="Remove file"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 100 * 1024 * 1024 // 100MB default
  },
  acceptedTypes: {
    type: Array,
    default: () => ['video/mp4', 'video/quicktime', 'video/webm']
  },
  currentFile: {
    type: File,
    default: null
  },
  title: {
    type: String,
    default: 'Upload File'
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  dropText: {
    type: String,
    default: 'Drop file here or click to upload'
  },
  showFileInfo: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['file-selected', 'validation-error', 'file-cleared'])

const isDragging = ref(false)
const errorMessage = ref(null)
const fileInput = ref(null)

// Computed properties
const acceptedTypesText = computed(() => {
  const typeMap = {
    'video/mp4': 'MP4',
    'video/quicktime': 'MOV',
    'video/webm': 'WebM',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'application/pdf': 'PDF',
    'text/plain': 'TXT'
  }
  
  const types = props.acceptedTypes.map(type => typeMap[type] || type.split('/')[1].toUpperCase())
  return types.join(', ') + ' files only'
})

const acceptAttribute = computed(() => {
  return props.acceptedTypes.join(',')
})

// Watch for external file changes
watch(() => props.currentFile, (newFile) => {
  if (newFile) {
    errorMessage.value = null
  }
})

// Methods
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    processFile(selectedFile)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragging.value = false
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  const droppedFile = event.dataTransfer.files[0]
  if (droppedFile) {
    processFile(droppedFile)
  }
}

const processFile = (file) => {
  const validation = validateFile(file)
  
  if (validation.isValid) {
    errorMessage.value = null
    emit('file-selected', file)
  } else {
    errorMessage.value = validation.error
    emit('validation-error', validation.error)
  }
}

const validateFile = (file) => {
  // Check file type
  if (!props.acceptedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Please select a valid file type. Accepted types: ${acceptedTypesText.value}`
    }
  }
  
  // Check file size
  if (file.size > props.maxFileSize) {
    return {
      isValid: false,
      error: `File is too large. Maximum size is ${formatFileSize(props.maxFileSize)}.`
    }
  }
  
  return { isValid: true }
}

const clearFile = () => {
  errorMessage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('file-cleared')
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' B'
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB'
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }
}

// Expose methods for parent component if needed
defineExpose({
  triggerFileInput,
  clearFile,
  validateFile,
  formatFileSize
})
</script>

<style scoped>
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
</style>