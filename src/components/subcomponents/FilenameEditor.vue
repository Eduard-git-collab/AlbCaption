<template>
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-3">
      <!-- Display mode -->
      <div v-if="!isEditing" class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">{{ originalFilename }}</h2>
        <button 
          @click="$emit('edit')"
          class="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
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
            @keydown="handleKeydown"
            type="text"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Enter filename"
          />
          <button
            @click="$emit('save', editedFilename)"
            :disabled="isSaving"
            class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors text-sm"
          >
            <svg v-if="isSaving" class="w-4 h-4 inline mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
          <button
            @click="$emit('cancel')"
            :disabled="isSaving"
            class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors text-sm"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancel
          </button>
        </div>
        
        <!-- Error message -->
        <p v-if="error" class="text-red-600 text-sm flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          {{ error }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      originalFilename: String,
      isEditing: Boolean,
      editedFilename: String,
      isSaving: Boolean,
      error: String
    },
    methods: {
      handleKeydown(event) {
        if (event.key === 'Enter') {
          this.$emit('save', this.editedFilename);
        } else if (event.key === 'Escape') {
          this.$emit('cancel');
        }
      }
    }
  }
  </script>