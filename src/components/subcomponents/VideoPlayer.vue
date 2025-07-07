<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="bg-gray-100 border-b border-gray-200 px-4 py-3">
        <!-- Display mode -->
        <div v-if="!isEditingFilename" class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">{{ filename }}</h2>
          <button 
            @click="startEditingFilename"
            class="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>
    
        <!-- Edit mode -->
        <div v-else class="space-y-2">
          <div class="flex items-center space-x-2">
            <input
              ref="filenameInput"
              v-model="editedFilename"
              @keydown="handleFilenameKeydown"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Enter filename"
            />
            <button
              @click="saveFilename"
              :disabled="isSavingFilename"
              class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors text-sm"
            >
              <svg v-if="isSavingFilename" class="w-4 h-4 inline mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ isSavingFilename ? 'Saving...' : 'Save' }}
            </button>
            <button
              @click="cancelEditingFilename"
              :disabled="isSavingFilename"
              class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors text-sm"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancel
            </button>
          </div>
          
          <!-- Error message -->
          <p v-if="filenameError" class="text-red-600 text-sm flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {{ filenameError }}
          </p>
        </div>
      </div>
      
      <div class="p-4">
        <!-- Video Player -->
        <div class="relative aspect-video bg-black rounded overflow-hidden">
          <video 
            ref="videoPlayer" 
            class="w-full h-full object-contain"
            controls
            @timeupdate="onVideoTimeUpdate"
            @play="$emit('play')"
            @pause="$emit('pause')"
            @seeking="$emit('seeking')"
            :src="videoUrl"
          ></video>
        </div>
    
        <!-- Custom Video Controls -->
        <div class="mt-4 flex items-center justify-between px-2 py-2 bg-gray-100 rounded">
          <div class="flex items-center space-x-3">
            <button 
              @click="togglePlayback" 
              class="p-1.5 rounded-full bg-white shadow hover:bg-gray-50"
            >
              <svg v-if="isPlaying" class="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7-.75a.75.75 0 00-.75.75v13.5c0 .414.336.75.75.75H15a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-1.5z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
              </svg>
            </button>
            <button 
              @click="$emit('skip-backward', 5)"
              class="flex items-center text-xs font-medium text-gray-700 px-2 py-1 hover:bg-gray-200 rounded"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
              5s
            </button>
          </div>
          
          <div class="text-xs font-medium text-gray-600">
            {{ formatVideoTime(currentTime) }} / {{ formatVideoTime(duration) }}
          </div>
          
          <button 
            @click="$emit('skip-forward', 5)"
            class="flex items-center text-xs font-medium text-gray-700 px-2 py-1 hover:bg-gray-200 rounded"
          >
            5s
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
        
        <!-- Segment Controls -->
        <div class="mt-4 flex justify-between">
          <button 
            @click="$emit('previous-segment')"
            class="flex items-center text-sm font-medium text-gray-700 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            :disabled="!canGoPrevious"
            :class="{ 'opacity-50 cursor-not-allowed': !canGoPrevious }"
          >
            <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <button 
            @click="$emit('next-segment')"
            class="flex items-center text-sm font-medium text-gray-700 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            :disabled="!canGoNext"
            :class="{ 'opacity-50 cursor-not-allowed': !canGoNext }"
          >
            Next
            <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
  
  const props = defineProps({
    videoUrl: String,
    filename: String,
    currentTime: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    isPlaying: {
      type: Boolean,
      default: false
    },
    canGoPrevious: {
      type: Boolean,
      default: false
    },
    canGoNext: {
      type: Boolean,
      default: false
    },
    processingId: String
  })
  
  const emit = defineEmits(['play', 'pause', 'seeking', 'time-update', 'skip-backward', 'skip-forward', 'previous-segment', 'next-segment', 'filename-updated'])
  
  const videoPlayer = ref(null)
  const filenameInput = ref(null)
  const isEditingFilename = ref(false)
  const editedFilename = ref('')
  const isSavingFilename = ref(false)
  const filenameError = ref(null)
  
  const startEditingFilename = () => {
    isEditingFilename.value = true
    editedFilename.value = props.filename || ''
    filenameError.value = null
    
    nextTick(() => {
      if (filenameInput.value) {
        filenameInput.value.focus()
      }
    })
  }
  
  const cancelEditingFilename = () => {
    isEditingFilename.value = false
    editedFilename.value = ''
    filenameError.value = null
  }
  
  const saveFilename = async () => {
    if (!editedFilename.value.trim()) {
      filenameError.value = 'Filename cannot be empty'
      return
    }
  
    if (!props.processingId) {
      filenameError.value = 'Processing ID not found'
      return
    }
  
    emit('filename-updated', {
      filename: editedFilename.value.trim(),
      onSuccess: () => {
        isEditingFilename.value = false
        editedFilename.value = ''
        filenameError.value = null
      },
      onError: (error) => {
        filenameError.value = error
      },
      onLoading: (loading) => {
        isSavingFilename.value = loading
      }
    })
  }
  
  const handleFilenameKeydown = (event) => {
    if (event.key === 'Enter') {
      saveFilename()
    } else if (event.key === 'Escape') {
      cancelEditingFilename()
    }
  }
  
  const onVideoTimeUpdate = () => {
    const video = videoPlayer.value
    if (video) {
      emit('time-update', video.currentTime)
    }
  }
  
  const togglePlayback = () => {
    const video = videoPlayer.value
    if (!video) return
    
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }
  
  const formatVideoTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
  
  defineExpose({
    videoPlayer
  })
  </script>