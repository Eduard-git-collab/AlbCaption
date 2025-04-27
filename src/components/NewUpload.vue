<template>
    <div class="max-w-3xl mx-auto p-5 font-sans">
      <h1 class="text-2xl font-bold mb-6">Video Transcription Tool</h1>
      
      <div class="flex items-center gap-4 mb-8">
        <input 
          type="file" 
          @change="handleFileUpload" 
          accept="video/*" 
          ref="fileInput"
          :disabled="isUploading"
          class="border rounded p-2"
        />
        
        <button 
          @click="uploadVideo" 
          :disabled="!selectedFile || isUploading"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {{ isUploading ? 'Uploading...' : 'Upload Video' }}
        </button>
      </div>
      
      <div v-if="status" class="mb-6 p-4 bg-gray-50 rounded">
        <h3 class="font-semibold mb-2">Status: {{ statusMessage }}</h3>
        <div v-if="status === 'processing'" class="w-full">
          <div class="text-gray-600 italic">Processing your video. This may take a few minutes...</div>
        </div>
        <div v-if="status === 'error'" class="text-red-600 font-semibold">
          {{ errorMessage }}
        </div>
      </div>
      
      <div class="mb-6" v-if="videoUrl">
        <h3 class="text-lg font-semibold mb-3">Video Preview</h3>
        <video ref="videoPlayer" controls :src="videoUrl" class="w-full max-h-96 bg-black"></video>
      </div>
      
      <div v-if="transcription" class="mt-8">
        <h3 class="text-lg font-semibold mb-3">Transcription</h3>
        
        <div class="p-4 bg-gray-50 rounded mb-5 leading-relaxed">
          <p>{{ transcription.fullText }}</p>
        </div>
        
        <h4 class="text-md font-semibold mb-3">Interactive Transcript</h4>
        <div class="mb-6">
          <div v-for="(result, idx) in transcription.results" :key="idx" class="mb-5">
            <p class="font-semibold mb-1">{{ result.transcript }}</p>
            
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="(wordInfo, wIdx) in result.words" 
                :key="`word-${idx}-${wIdx}`"
                class="px-2 py-1 bg-blue-100 rounded cursor-pointer hover:bg-blue-500 hover:text-white transition-colors"
                @click="seekToTime(parseFloat(wordInfo.startTime))"
              >
                {{ wordInfo.word }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <a 
        v-if="jobId"
        :href="`http://localhost:3000/transcription/${jobId}/srt`" 
        download 
        class="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Download Subtitle (SRT)
      </a>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedFile: null,
        isUploading: false,
        jobId: null,
        status: null,
        errorMessage: '',
        videoUrl: null,
        audioUrl: null,
        transcription: null,
        pollingInterval: null
      }
    },
    
    computed: {
      statusMessage() {
        const statusMap = {
          'processing': 'Processing',
          'completed': 'Transcription Complete',
          'error': 'Error'
        };
        return statusMap[this.status] || 'Unknown';
      }
    },
    
    methods: {
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
        // Reset any previous state
        this.clearState();
      },
      
      clearState() {
        this.jobId = null;
        this.status = null;
        this.errorMessage = '';
        this.videoUrl = null;
        this.audioUrl = null;
        this.transcription = null;
        
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }
      },
      
      async uploadVideo() {
        if (!this.selectedFile) return;
        
        try {
          this.isUploading = true;
          
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          
          console.log('Uploading video...');
          const response = await fetch('http://localhost:3000/convert', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Upload response:', data);
          
          if (data.success) {
            this.jobId = data.jobId;
            this.videoUrl = data.videoUrl;
            this.audioUrl = data.audioUrl;
            this.status = 'processing';
            
            // Start polling for status updates
            this.startPolling();
          } else {
            throw new Error(data.message || 'Unknown error occurred');
          }
        } catch (error) {
          console.error('Upload error:', error);
          this.status = 'error';
          this.errorMessage = error.message || 'Failed to upload video';
        } finally {
          this.isUploading = false;
        }
      },
      
      startPolling() {
        this.pollingInterval = setInterval(async () => {
          await this.checkTranscriptionStatus();
        }, 5000); // Check every 5 seconds
      },
      
      async checkTranscriptionStatus() {
        if (!this.jobId) return;
        
        try {
          const response = await fetch(`http://localhost:3000/transcription/${this.jobId}`);
          
          if (!response.ok) {
            throw new Error(`Status check failed: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Status check response:', data);
          
          this.status = data.status;
          
          if (data.status === 'completed') {
            // Transcription is ready
            this.transcription = data.transcription_data;
            
            // Stop polling
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
          } else if (data.status === 'error') {
            this.errorMessage = data.error_message || 'Transcription failed';
            
            // Stop polling
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
          }
        } catch (error) {
          console.error('Status check error:', error);
          // Don't stop polling on temporary errors
        }
      },
      
      seekToTime(seconds) {
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.currentTime = seconds;
          this.$refs.videoPlayer.play();
        }
      }
    },
    
    beforeUnmount() {
      // Clean up polling on component unmount
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .upload-section {
    margin-bottom: 30px;
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  .upload-button {
    padding: 8px 16px;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .upload-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .status-section {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
  }
  
  .progress-status {
    font-style: italic;
    color: #555;
  }
  
  .error-message {
    color: #d32f2f;
    font-weight: bold;
  }
  
  .video-section {
    margin: 20px 0;
  }
  
  .video-preview {
    width: 100%;
    max-height: 400px;
    background-color: #000;
  }
  
  .transcription-section {
    margin-top: 30px;
  }
  
  .transcript-summary {
    margin-bottom: 20px;
    line-height: 1.5;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
  }
  
  .transcript-segment {
    margin-bottom: 20px;
  }
  
  .segment-text {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .word-timestamps {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .transcript-word {
    padding: 3px 6px;
    background-color: #e6f2ff;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .transcript-word:hover {
    background-color: #4285f4;
    color: white;
  }
  </style>