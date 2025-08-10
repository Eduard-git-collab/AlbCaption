<template>
    <div
      class="mb-4 border border-gray-200 rounded-md transition-all"
      :class="{ 'bg-blue-50': isCurrent && !segment.isEditing, 'shadow-md': segment.isEditing }"
    >
      <!-- Timestamp header -->
      <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
        <div class="text-sm font-medium text-gray-700">
          {{ formatVideoTime(segment.startTime) }} → {{ formatVideoTime(segment.endTime) }}
        </div>
        <div class="flex items-center">
          <button 
            @click="$emit('play', segment)"
            class="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Play this segment"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </button>
          <button 
            @click="$emit('begin-edit', index)"
            class="p-1 text-gray-600 hover:text-gray-800 transition-colors ml-2"
            title="Edit this segment"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      </div>
  
      <!-- Segment content -->
      <div class="px-3 py-2">
        <!-- Editable -->
        <textarea
          v-if="segment.isEditing"
          v-model="localEditText"
          class="w-full p-2 border border-blue-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          rows="3"
          @blur="onFinish(false)"
          @keydown.ctrl.enter.prevent="onFinish(true)"
          ref="segmentTextarea"
        ></textarea>
  
        <!-- Karaoke view -->
        <div v-else class="py-1 relative min-h-[60px]">
          <span 
            v-for="(word, wordIndex) in segment.words" 
            :key="`${index}-${wordIndex}`"
            :class="[
              'inline-block mr-1 px-0.5 rounded transition-colors duration-200',
              isWordActive(word) ? 'bg-blue-500 text-white font-medium' : 
              isWordPast(word) ? 'text-gray-500' : 'text-gray-800'
            ]"
          >
            {{ word.text }}
          </span>
        </div>
      </div>
  
      <!-- Edit buttons -->
      <div v-if="segment.isEditing" class="flex justify-end px-3 py-2 bg-gray-50 border-t border-gray-200">
        <button 
          @click="onCancel"
          class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors mr-2"
        >
          Anulo
        </button>
        <button 
          @click="onFinish(true)"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Ruaj
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  
  const props = defineProps({
    index: { type: Number, required: true },
    segment: { type: Object, required: true },
    currentVideoTime: { type: Number, required: true },
    isCurrent: { type: Boolean, default: false }
  })
  const emit = defineEmits(['play', 'begin-edit', 'save', 'cancel-edit'])
  
  const localEditText = ref(props.segment.editText || '')
  const segmentTextarea = ref(null)
  
  watch(() => props.segment.isEditing, (editing) => {
    if (editing) {
      localEditText.value = props.segment.text
      // focus textarea on edit start
      setTimeout(() => segmentTextarea.value?.focus(), 0)
    }
  })
  
  function isWordActive(word) {
    return props.currentVideoTime >= word.startTime && props.currentVideoTime < word.endTime
  }
  function isWordPast(word) {
    return props.currentVideoTime >= word.endTime
  }
  
  function onFinish(save) {
    if (save) {
      emit('save', { index: props.index, text: localEditText.value })
    } else {
      emit('cancel-edit', props.index)
    }
  }
  
  function onCancel() {
    emit('cancel-edit', props.index)
  }
  
  function formatVideoTime(seconds) {
    if (isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  </script>
  
  <style scoped>
  .mb-4.border.border-gray-200.rounded-md {
    transition: all 0.3s ease;
  }
  </style>