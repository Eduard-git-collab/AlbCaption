<template>
  <div class="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Upload Video</h2>

    <!-- Upload Area -->
    <div 
      class="w-full border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors hover:bg-gray-50"
      :class="{ 'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging }"
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

    <!-- File Details & Upload Button -->
    <div v-if="file" class="w-full">
      <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full mb-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
        <p class="text-sm text-gray-600 mt-1 text-center">{{ uploadProgress }}% uploaded</p>
      </div>

      <div v-if="processingState" class="mb-4 text-center">
        <p class="text-sm font-medium" :class="processingStateColor">
          {{ processingStateMessage }}
        </p>
        <div v-if="transcript" class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md text-left">
          <h3 class="text-md font-medium text-gray-800 mb-2">Transcript:</h3>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ transcript }}</p>
          <div class="mt-4 flex justify-end">
            <button 
              @click="copyTranscript" 
              class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Copy to clipboard
            </button>
          </div>
        </div>
      </div>

      <button
        @click="uploadFile"
        :disabled="isUploading || processingState === 'complete'"
        class="w-full py-2 px-4 rounded-md font-medium text-white transition-colors"
        :class="[
          isUploading || processingState === 'complete' 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        ]"
      >
        {{ uploadButtonText }}
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="errorMessage" class="w-full mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoUpload',
  data() {
    return {
      file: null,
      isDragging: false,
      isUploading: false,
      uploadProgress: 0,
      processingState: null, // null, 'uploading', 'processing', 'complete', 'error'
      processingStep: null, // null, 'audio-extraction', 'transcribing'
      errorMessage: null,
      apiUrl: 'http://localhost:3000',
      transcript: null,
      transcriptionUrl: null,
      audioUrl: null
    }
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
    },
    uploadButtonText() {
      if (this.processingState === 'complete') return 'Processing Complete';
      return this.isUploading ? 'Uploading...' : 'Upload Video';
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        // Validate file type and size
        if (!this.validateFile(selectedFile)) return;
        this.file = selectedFile;
        this.errorMessage = null;
      }
    },
    onDrop(event) {
      this.isDragging = false;
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        // Validate file type and size
        if (!this.validateFile(droppedFile)) return;
        this.file = droppedFile;
        this.errorMessage = null;
      }
    },
    validateFile(file) {
      // Check file type
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Please select a valid video file (MP4, MOV, or WebM).';
        return false;
      }
      
      // Check file size (max 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        this.errorMessage = 'Video file is too large. Maximum size is 100MB.';
        return false;
      }
      
      return true;
    },
    formatFileSize(bytes) {
      if (bytes < 1024) {
        return bytes + ' B';
      } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + ' KB';
      } else {
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      }
    },
    async uploadFile() {
      if (!this.file || this.isUploading) return;
      
      this.isUploading = true;
      this.processingState = 'uploading';
      this.errorMessage = null;
      this.uploadProgress = 0;
      
      try {
        const formData = new FormData();
        formData.append('video', this.file);
        
        // Uploading with progress tracking
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            this.uploadProgress = Math.round((event.loaded / event.total) * 100);
          }
        });
        
        const response = await new Promise((resolve, reject) => {
          xhr.open('POST', `${this.apiUrl}/upload-video`, true);
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`HTTP error ${xhr.status}: ${xhr.statusText}`));
            }
          };
          
          xhr.onerror = () => reject(new Error('Network error occurred'));
          xhr.send(formData);
        });
        
        this.processingState = 'processing';
        
        // Poll for processing status
        await this.pollProcessingStatus(response.processingId);
        
        this.processingState = 'complete';
        this.$emit('upload-complete', response);
      } catch (error) {
        console.error('Upload error:', error);
        this.errorMessage = `Upload failed: ${error.message || 'Unknown error'}`;
        this.processingState = 'error';
      } finally {
        this.isUploading = false;
      }
    },
    async pollProcessingStatus(processingId) {
      return new Promise((resolve, reject) => {
        const checkStatus = async () => {
          try {
            const response = await fetch(`${this.apiUrl}/processing-status/${processingId}`);
            const data = await response.json();
            
            // Update processing step if available
            if (data.step) {
              this.processingStep = data.step;
            }
            
            if (data.status === 'complete') {
              // Store transcript and URLs if available
              if (data.transcript) {
                this.transcript = data.transcript;
              }
              if (data.transcriptionUrl) {
                this.transcriptionUrl = data.transcriptionUrl;
              }
              if (data.audioUrl) {
                this.audioUrl = data.audioUrl;
              }
              resolve(data);
            } else if (data.status === 'error') {
              this.errorMessage = data.message || 'Processing failed';
              reject(new Error(data.message || 'Processing failed'));
            } else {
              // Still processing, check again in 2 seconds
              setTimeout(checkStatus, 2000);
            }
          } catch (error) {
            reject(error);
          }
        };
        
        checkStatus();
      });
    },
    
    copyTranscript() {
      if (this.transcript) {
        navigator.clipboard.writeText(this.transcript)
          .then(() => {
            // You could add a temporary feedback message here
            console.log('Transcript copied to clipboard');
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      }
    }
  }
}
</script>