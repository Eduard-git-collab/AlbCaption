<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="bg-gray-100 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">Transcript Segments</h2>
        <div class="flex space-x-2">
          <button 
            @click="$emit('copy-transcript')" 
            class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center"
          >
            <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
          <button 
            @click="$emit('download-srt')" 
            class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center"
            :disabled="isDownloadingSRT || hasUnsavedChanges"
            :class="{ 'opacity-50 cursor-not-allowed': isDownloadingSRT || hasUnsavedChanges }"
          >
            <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {{ isDownloadingSRT ? 'Downloading...' : 'Download SRT' }}
          </button>
          <button 
            v-if="hasUnsavedChanges"
            @click="$emit('save-all')" 
            class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            :disabled="isSaving"
          >
            <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save All
          </button>
        </div>
      </div>
  
      <!-- Transcript Segments -->
      <div class="p-4">
        <div class="h-[calc(100vh-250px)] overflow-y-auto">
          <TranscriptSegment
            v-for="(segment, index) in segments" 
            :key="index"
            :segment="segment"
            :index="index"
            :is-current="currentSegmentIndex === index"
            :current-video-time="currentVideoTime"
            @edit="editSegment"
            @play="$emit('play-segment', segment)"
            @save="saveSegment"
            @cancel="cancelSegmentEdit"
          />
          
          <p v-if="saveStatus" class="text-sm mt-2" :class="saveStatus.type">
            {{ saveStatus.message }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import TranscriptSegment from './TranscriptSegment.vue'
  
  const props = defineProps({
    segments: {
      type: Array,
      required: true
    },
    currentSegmentIndex: {
      type: Number,
      default: -1
    },
    currentVideoTime: {
      type: Number,
      default: 0
    },
    isDownloadingSRT: {
      type: Boolean,
      default: false
    },
    isSaving: {
      type: Boolean,
      default: false
    },
    saveStatus: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['copy-transcript', 'download-srt', 'save-all', 'play-segment', 'edit-segment', 'save-segment', 'cancel-segment-edit'])
  
  const hasUnsavedChanges = computed(() => {
    return props.segments.some(segment => 
      segment.originalText !== segment.text || 
      segment.isEditing
    )
  })
  
  const editSegment = (index) => {
    emit('edit-segment', index)
  }
  
  const saveSegment = (index, text) => {
    emit('save-segment', index, text)
  }
  
  const cancelSegmentEdit = (index) => {
    emit('cancel-segment-edit', index)
  }
  </script>