<template>
    <div v-if="isVisible" class="fixed top-4 right-4 z-50 max-w-md">
      <div 
        :class="[
          'p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 ease-in-out',
          messageTypeClasses,
          'animate-slide-in'
        ]"
      >
        <div class="flex items-start">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg 
              :class="iconClasses" 
              class="w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path v-if="type === 'error'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              <path v-else-if="type === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              <path v-else-if="type === 'warning'" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <!-- Message Content -->
          <div class="ml-3 flex-1">
            <h3 v-if="title" :class="titleClasses" class="text-sm font-medium">
              {{ title }}
            </h3>
            <p :class="messageClasses" class="text-sm">
              {{ message }}
            </p>
          </div>
          
          <!-- Close Button -->
          <div class="ml-4 flex-shrink-0">
            <button
              @click="close"
              :class="closeButtonClasses"
              class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <span class="sr-only">Close</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  
  const props = defineProps({
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    },
    autoHide: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 5000
    }
  })
  
  const emit = defineEmits(['close', 'update:show'])
  
  const isVisible = ref(props.show)
  let autoHideTimer = null
  
  // Computed classes based on message type
  const messageTypeClasses = computed(() => {
    switch (props.type) {
      case 'success':
        return 'bg-green-50 border-green-400 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-400 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800'
      default:
        return 'bg-blue-50 border-blue-400 text-blue-800'
    }
  })
  
  const iconClasses = computed(() => {
    switch (props.type) {
      case 'success':
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
      case 'warning':
        return 'text-yellow-400'
      default:
        return 'text-blue-400'
    }
  })
  
  const titleClasses = computed(() => {
    switch (props.type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      default:
        return 'text-blue-800'
    }
  })
  
  const messageClasses = computed(() => {
    switch (props.type) {
      case 'success':
        return 'text-green-700'
      case 'error':
        return 'text-red-700'
      case 'warning':
        return 'text-yellow-700'
      default:
        return 'text-blue-700'
    }
  })
  
  const closeButtonClasses = computed(() => {
    switch (props.type) {
      case 'success':
        return 'text-green-400 hover:text-green-600 focus:ring-green-500'
      case 'error':
        return 'text-red-400 hover:text-red-600 focus:ring-red-500'
      case 'warning':
        return 'text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500'
      default:
        return 'text-blue-400 hover:text-blue-600 focus:ring-blue-500'
    }
  })
  
  // Watch for show prop changes
  watch(() => props.show, (newValue) => {
    isVisible.value = newValue
    if (newValue && props.autoHide) {
      startAutoHideTimer()
    } else {
      clearAutoHideTimer()
    }
  })
  
  // Auto-hide functionality
  const startAutoHideTimer = () => {
    clearAutoHideTimer()
    autoHideTimer = setTimeout(() => {
      close()
    }, props.duration)
  }
  
  const clearAutoHideTimer = () => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      autoHideTimer = null
    }
  }
  
  const close = () => {
    isVisible.value = false
    clearAutoHideTimer()
    emit('close')
    emit('update:show', false)
  }
  
  onMounted(() => {
    if (props.show && props.autoHide) {
      startAutoHideTimer()
    }
  })
  </script>
  
  <style scoped>
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
  </style>