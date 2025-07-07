<template>
    <div class="mt-4 px-4 pb-4">
      <div class="border border-gray-200 rounded-md p-3">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Segmentation Settings</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Max words per segment</label>
            <div class="flex items-center">
              <input 
                type="range" 
                :value="maxWordsPerSegment"
                @input="$emit('update:max-words', $event.target.value)"
                min="5" 
                max="30" 
                step="1"
                class="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <span class="ml-2 text-sm font-medium w-8 text-gray-700">{{ maxWordsPerSegment }}</span>
            </div>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Pause threshold (seconds)</label>
            <div class="flex items-center">
              <input 
                type="range" 
                :value="pauseThreshold"
                @input="$emit('update:pause-threshold', $event.target.value)"
                min="0.5" 
                max="3" 
                step="0.1"
                class="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <span class="ml-2 text-sm font-medium w-8 text-gray-700">{{ pauseThreshold.toFixed(1) }}</span>
            </div>
          </div>
          <button 
            @click="$emit('reprocess')"
            class="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mt-2"
            :disabled="!hasOriginalTranscription"
          >
            Reprocess Segments
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    maxWordsPerSegment: {
      type: Number,
      required: true
    },
    pauseThreshold: {
      type: Number,
      required: true
    },
    hasOriginalTranscription: {
      type: Boolean,
      default: false
    }
  })
  
  defineEmits(['update:max-words', 'update:pause-threshold', 'reprocess'])
  </script>