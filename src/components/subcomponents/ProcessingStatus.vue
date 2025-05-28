<template>
    <div class="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div class="text-center">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Processing Video</h2>
        
        <!-- Upload Progress -->
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full mb-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ uploadProgress }}% uploaded</p>
        </div>
        
        <div class="mb-4">
          <p class="font-medium" :class="processingStateColor">
            {{ processingStateMessage }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      processingState: String,
      processingStep: String,
      uploadProgress: Number
    },
    computed: {
      processingStateMessage() {
        switch(this.processingState) {
          case 'uploading':
            return 'Uploading video to storage...';
          case 'processing':
            if (this.processingStep === 'audio-extraction') {
              return 'Converting video to audio...';
            } else if (this.processingStep === 'transcribing') {
              return 'Transcribing audio to text using Google Speech-to-Text...';
            }
            return 'Processing...';
          case 'complete':
            return 'Processing complete! Audio transcribed successfully.';
          case 'error':
            return 'An error occurred during processing.';
          default:
            return '';
        }
      },
      processingStateColor() {
        switch(this.processingState) {
          case 'uploading':
          case 'processing':
            return 'text-blue-600';
          case 'complete':
            return 'text-green-600';
          case 'error':
            return 'text-red-600';
          default:
            return '';
        }
      }
    }
  }
  </script>