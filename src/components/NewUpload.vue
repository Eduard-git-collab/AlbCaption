<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-6">
      
      <!-- File Upload Section -->
      <div v-if="!processingState || processingState === 'error'" class="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <div class="mb-4">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Upload Video</h2>
          <div 
            class="w-full border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors"
            :class="{ 'border-blue-500 bg-blue-50': isDragging, 'border-gray-300 hover:bg-gray-50': !isDragging }"
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
        </div>

        <div v-if="file && (!processingState || processingState === 'error')" class="w-full">
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

      <!-- Processing State -->
      <div v-if="processingState && processingState !== 'error' && processingState !== 'complete'" class="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
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

      <!-- Complete State - Combined Editor View -->
      <div v-if="processingState === 'complete'" class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- Combined Transcript Panel - Now takes 3/5 of the width -->
          <div class="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-gray-100 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-800">Transcript Segments</h2>
              <div class="flex space-x-2">
                <button 
                  @click="copyTranscript" 
                  class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center"
                >
                  <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button 
                  @click="downloadSRT" 
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
                  @click="saveAllSegments" 
                  class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                  :disabled="isSavingTranscript"
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
                <!-- Each transcript segment is a row with timestamp and editable text -->
                <div 
                  v-for="(segment, index) in transcriptSegments" 
                  :key="index"
                  class="mb-4 border border-gray-200 rounded-md transition-all"
                  :class="{ 
                    'bg-blue-50': currentSegmentIndex === index && !segment.isEditing,
                    'shadow-md': segment.isEditing
                  }"
                >
                  <!-- Timestamp header -->
                  <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-700">
                      {{ formatVideoTime(segment.startTime) }} → {{ formatVideoTime(segment.endTime) }}
                    </div>
                    <div class="flex items-center">
                      <button 
                        @click="playSegment(segment)"
                        class="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Play this segment"
                      >
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        @click="editSegment(index)"
                        class="p-1 text-gray-600 hover:text-gray-800 transition-colors ml-2"
                        title="Edit this segment"
                      >
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Segment content - editable or karaoke view -->
                  <div class="px-3 py-2">
                    <!-- Editable textarea when in edit mode -->
                    <textarea
                      v-if="segment.isEditing"
                      v-model="segment.editText"
                      class="w-full p-2 border border-blue-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      rows="3"
                      @blur="finishEditing(index, false)"
                      @keydown.ctrl.enter="finishEditing(index, true)"
                      ref="segmentTextarea"
                    ></textarea>
                    
                    <!-- Karaoke view when not editing -->
                    <div v-else class="py-1 relative min-h-[60px]">
                      <!-- Words with karaoke highlighting -->
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
                  
                  <!-- Edit buttons when in edit mode -->
                  <div v-if="segment.isEditing" class="flex justify-end px-3 py-2 bg-gray-50 border-t border-gray-200">
                    <button 
                      @click="cancelEditing(index)"
                      class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors mr-2"
                    >
                      Cancel
                    </button>
                    <button 
                      @click="finishEditing(index, true)"
                      class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
                
                <p v-if="saveStatus" class="text-sm mt-2" :class="saveStatus.type">
                  {{ saveStatus.message }}
                </p>
              </div>
            </div>
          </div>

          <!-- Video Panel - Now takes 2/5 of the width -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-gray-100 border-b border-gray-200 px-4 py-3">
              <h2 class="text-lg font-semibold text-gray-800">Video Preview</h2>
            </div>
            
            <div class="p-4">
              <!-- Video Player -->
              <div class="relative aspect-video bg-black rounded overflow-hidden">
                <video 
                  ref="videoPlayer" 
                  class="w-full h-full object-contain"
                  controls
                  @timeupdate="onVideoTimeUpdate"
                  @play="isVideoPlaying = true"
                  @pause="isVideoPlaying = false"
                  @seeking="onVideoSeeking"
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
                    <svg v-if="isVideoPlaying" class="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7-.75a.75.75 0 00-.75.75v13.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-1.5z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    @click="skipBackward(5)"
                    class="flex items-center text-xs font-medium text-gray-700 px-2 py-1 hover:bg-gray-200 rounded"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"></path>
                    </svg>
                    5s
                  </button>
                </div>
                
                <div class="text-xs font-medium text-gray-600">
                  {{ formatVideoTime(currentVideoTime) }} / {{ formatVideoTime(videoDuration) }}
                </div>
                
                <button 
                  @click="skipForward(5)"
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
                  @click="playPreviousSegment"
                  class="flex items-center text-sm font-medium text-gray-700 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :disabled="currentSegmentIndex <= 0"
                  :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex <= 0 }"
                >
                  <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button 
                  @click="playNextSegment"
                  class="flex items-center text-sm font-medium text-gray-700 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  :disabled="currentSegmentIndex >= transcriptSegments.length - 1"
                  :class="{ 'opacity-50 cursor-not-allowed': currentSegmentIndex >= transcriptSegments.length - 1 }"
                >
                  Next
                  <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Segment settings -->
            <div class="mt-4 px-4 pb-4">
              <div class="border border-gray-200 rounded-md p-3">
                <h3 class="text-sm font-medium text-gray-700 mb-2">Segmentation Settings</h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">Max words per segment</label>
                    <div class="flex items-center">
                      <input 
                        type="range" 
                        v-model.number="maxWordsPerSegment"
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
                        v-model.number="segmentOverlapThreshold"
                        min="0.5" 
                        max="3" 
                        step="0.1"
                        class="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                      <span class="ml-2 text-sm font-medium w-8 text-gray-700">{{ segmentOverlapThreshold.toFixed(1) }}</span>
                    </div>
                  </div>
                  <button 
                    @click="reprocessSegments"
                    class="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mt-2"
                    :disabled="!hasOriginalTranscription"
                  >
                    Reprocess Segments
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoUpload',
  data() {
    return {
      // File upload and processing properties
      file: null,
      isDragging: false,
      isUploading: false,
      uploadProgress: 0,
      processingState: null, 
      processingStep: null, 
      errorMessage: null,
      apiUrl: 'https://albcaptions-api.onrender.com',
      
      // Transcription related properties
      transcript: null,
      originalTranscriptionJson: null,
      transcriptionUrl: null,
      videoUrl: null,
      audioUrl: null,
      processingId: null,
      
      // UI state properties
      isDownloadingSRT: false,
      isSavingTranscript: false,
      saveStatus: null,
      
      // Video playback properties
      currentVideoTime: 0,
      videoDuration: 0,
      isVideoPlaying: false,
      
      // New properties for the combined view
      transcriptSegments: [],
      currentSegmentIndex: -1,
      maxWordsPerSegment: 15, // Can be adjusted to fit requirements
      segmentOverlapThreshold: 1.5, // seconds of overlap to consider a word part of the current segment
      hasOriginalTranscription: false,
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
    },
    hasUnsavedChanges() {
      return this.transcriptSegments.some(segment => 
        segment.originalText !== segment.text || 
        segment.isEditing
      );
    }
  },
  watch: {
    originalTranscriptionJson: {
      handler(newJson) {
        if (newJson) {
          this.hasOriginalTranscription = true;
          this.createTranscriptSegments();
          
          // Debug the JSON structure to help identify any issues
          this.debugTranscriptionJson();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.videoPlayer) {
        this.setupVideoEvents();
      }
    });
  },
  methods: {
    // ===== FILE UPLOAD METHODS =====
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
    
    // ===== VIDEO UPLOAD AND PROCESSING =====
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
        
        // Store processing ID and video URL for later use
        this.processingId = response.processingId;
        this.videoUrl = response.videoUrl;
        
        // Poll for processing status
        await this.pollProcessingStatus(response.processingId);
        
        // Once processing is complete, fetch the full transcription JSON
        await this.fetchTranscriptionJson();
        
        // Wait for video element to be available
        this.$nextTick(() => {
          if (this.$refs.videoPlayer) {
            this.setupVideoEvents();
          }
        });
        
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
    
    async fetchTranscriptionJson() {
      try {
        if (!this.processingId) return;
        
        const response = await fetch(`${this.apiUrl}/transcriptions/${this.processingId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch transcription: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data.transcription_json) {
          this.originalTranscriptionJson = data.transcription_json;
          
          // Update the transcript if not already set
          if (!this.transcript) {
            this.transcript = data.transcription_json.text;
          }
        }
      } catch (error) {
        console.error('Error fetching transcription JSON:', error);
      }
    },
    
    // ===== VIDEO PLAYBACK CONTROLS =====
    setupVideoEvents() {
      const video = this.$refs.videoPlayer;
      if (!video) return;
      
      // Set initial video duration when metadata is loaded
      video.addEventListener('loadedmetadata', () => {
        this.videoDuration = video.duration;
      });
      
      // Update duration in case it changes (sometimes happens after loading)
      video.addEventListener('durationchange', () => {
        this.videoDuration = video.duration;
      });
    },
    
    onVideoTimeUpdate() {
      const video = this.$refs.videoPlayer;
      if (video) {
        this.currentVideoTime = video.currentTime;
        this.updateCurrentSegment();
      }
    },
    
    onVideoSeeking() {
      // Update current segment when user seeks in the video
      this.updateCurrentSegment();
    },
    
    togglePlayback() {
      const video = this.$refs.videoPlayer;
      if (!video) return;
      
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    },
    
    formatVideoTime(seconds) {
      if (isNaN(seconds)) return '00:00';
      
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    skipBackward(seconds) {
      const video = this.$refs.videoPlayer;
      if (!video) return;
      
      video.currentTime = Math.max(0, video.currentTime - seconds);
    },
    
    skipForward(seconds) {
      const video = this.$refs.videoPlayer;
      if (!video) return;
      
      video.currentTime = Math.min(video.duration, video.currentTime + seconds);
    },
    
    // ===== TRANSCRIPT SEGMENT METHODS =====
    createTranscriptSegments() {
      if (!this.originalTranscriptionJson || !this.originalTranscriptionJson.results) {
        return;
      }
      
      // Collect all words from all results
      let allWords = [];
      
      // Process all results, not just the first one
      this.originalTranscriptionJson.results.forEach(result => {
        if (result.words && Array.isArray(result.words)) {
          const wordsFromResult = result.words.map(word => {
            // Convert startOffset and endOffset to seconds
            const startTime = this.extractTimeInSeconds(word.startOffset);
            const endTime = this.extractTimeInSeconds(word.endOffset);
            
            return {
              text: word.word,
              startTime,
              endTime
            };
          });
          
          allWords = [...allWords, ...wordsFromResult];
        }
      });
      
      // If no words were found, try to handle alternative formats
      if (allWords.length === 0 && this.originalTranscriptionJson.results[0] && 
          this.originalTranscriptionJson.results[0].alternatives) {
        // Handle Google Speech API format with alternatives
        this.originalTranscriptionJson.results.forEach(result => {
          if (result.alternatives && result.alternatives[0] && result.alternatives[0].words) {
            const wordsFromAlternative = result.alternatives[0].words.map(word => {
              return {
                text: word.word,
                startTime: this.extractTimeInSeconds(word.startTime),
                endTime: this.extractTimeInSeconds(word.endTime)
              };
            });
            
            allWords = [...allWords, ...wordsFromAlternative];
          }
        });
      }
      
      // Sort all words by startTime to ensure correct chronological order
      allWords.sort((a, b) => a.startTime - b.startTime);
      
      // Rest of the code remains the same - split into segments
      const segments = [];
      let currentSegment = {
        words: [],
        startTime: 0,
        endTime: 0,
        text: '',
        originalText: '',
        editText: '',
        isEditing: false
      };
      
      for (const word of allWords) {
        // If this is the first word, initialize segment
        if (currentSegment.words.length === 0) {
          currentSegment.startTime = word.startTime;
          currentSegment.words.push(word);
        } 
        // Start a new segment if we've reached the word limit
        // or if there's a significant pause (> segmentOverlapThreshold)
        else if (currentSegment.words.length >= this.maxWordsPerSegment || 
                 word.startTime - currentSegment.words[currentSegment.words.length - 1].endTime > this.segmentOverlapThreshold) {
          
          // Finalize the current segment
          currentSegment.endTime = currentSegment.words[currentSegment.words.length - 1].endTime;
          currentSegment.text = currentSegment.words.map(w => w.text).join(' ');
          currentSegment.originalText = currentSegment.text;
          currentSegment.editText = currentSegment.text;
          
          segments.push(currentSegment);
          
          // Start a new segment
          currentSegment = {
            words: [word],
            startTime: word.startTime,
            endTime: 0,
            text: '',
            originalText: '',
            editText: '',
            isEditing: false
          };
        } else {
          // Add to the current segment
          currentSegment.words.push(word);
        }
      }
      
      // Add the last segment if it has any words
      if (currentSegment.words.length > 0) {
        currentSegment.endTime = currentSegment.words[currentSegment.words.length - 1].endTime;
        currentSegment.text = currentSegment.words.map(w => w.text).join(' ');
        currentSegment.originalText = currentSegment.text;
        currentSegment.editText = currentSegment.text;
        segments.push(currentSegment);
      }
      
      this.transcriptSegments = segments;
      
      // Debug log to verify all segments were created
      console.log(`Created ${segments.length} segments from ${allWords.length} words`);
    },
    
    // Debug helper function
    debugTranscriptionJson() {
      if (!this.originalTranscriptionJson) {
        console.log('No transcription JSON available');
        return;
      }
      
      console.log('Transcription JSON structure:', this.originalTranscriptionJson);
      
      let totalResults = 0;
      let totalWords = 0;
      
      if (this.originalTranscriptionJson.results) {
        totalResults = this.originalTranscriptionJson.results.length;
        
        this.originalTranscriptionJson.results.forEach((result, index) => {
          console.log(`Result ${index + 1}:`);
          
          // Check for words directly in result
          if (result.words && Array.isArray(result.words)) {
            console.log(`  - Contains ${result.words.length} words`);
            totalWords += result.words.length;
          } 
          // Check for alternatives format
          else if (result.alternatives && Array.isArray(result.alternatives)) {
            console.log(`  - Contains ${result.alternatives.length} alternatives`);
            result.alternatives.forEach((alt, altIndex) => {
              if (alt.words && Array.isArray(alt.words)) {
                console.log(`    - Alternative ${altIndex + 1} contains ${alt.words.length} words`);
                totalWords += alt.words.length;
              } else {
                console.log(`    - Alternative ${altIndex + 1} has no words array`);
              }
            });
          } else {
            console.log('  - No words or alternatives array found');
          }
        });
      }
      
      console.log(`Total results: ${totalResults}, Total words: ${totalWords}`);
    },
    
    reprocessSegments() {
      // Reprocess segments with current segmentation settings
      if (!this.hasOriginalTranscription) {
        return;
      }
      
      // Confirm with user if there are unsaved changes
      if (this.hasUnsavedChanges) {
        if (!confirm('You have unsaved changes. Reprocessing segments will discard these changes. Continue?')) {
          return;
        }
      }
      
      // Reprocess segments with current settings
      this.createTranscriptSegments();
      
      // Update status
      this.saveStatus = {
        type: 'text-blue-600',
        message: 'Segments reprocessed with new settings'
      };
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        this.saveStatus = null;
      }, 3000);
    },
    
    editSegment(index) {
      // First, finish editing any other segments
      this.transcriptSegments.forEach((segment, idx) => {
        if (idx !== index && segment.isEditing) {
          this.finishEditing(idx, true);
        }
      });
      
      // Enable editing for this segment
      this.transcriptSegments[index].isEditing = true;
      this.transcriptSegments[index].editText = this.transcriptSegments[index].text;
      
      // Focus the textarea after DOM update
      this.$nextTick(() => {
        if (this.$refs.segmentTextarea && this.$refs.segmentTextarea[0]) {
          this.$refs.segmentTextarea[0].focus();
        }
      });
    },
    
    finishEditing(index, save) {
      if (save) {
        // Update the text with edited content
        this.transcriptSegments[index].text = this.transcriptSegments[index].editText;
      } else {
        // Reset to original if not saving
        this.transcriptSegments[index].editText = this.transcriptSegments[index].text;
      }
      
      // Turn off editing mode
      this.transcriptSegments[index].isEditing = false;
    },
    
    cancelEditing(index) {
      this.finishEditing(index, false);
    },
    
    playSegment(segment) {
      const video = this.$refs.videoPlayer;
      if (!video) return;
      
      // Set video time to start of segment
      video.currentTime = segment.startTime;
      
      // Play the video
      video.play();
    },
    
    playPreviousSegment() {
      if (this.currentSegmentIndex > 0) {
        this.playSegment(this.transcriptSegments[this.currentSegmentIndex - 1]);
      }
    },
    
    playNextSegment() {
      if (this.currentSegmentIndex < this.transcriptSegments.length - 1) {
        this.playSegment(this.transcriptSegments[this.currentSegmentIndex + 1]);
      }
    },
    
    updateCurrentSegment() {
      // Find which segment corresponds to the current video time
      const currentTime = this.currentVideoTime;
      let newSegmentIndex = -1;
      
      for (let i = 0; i < this.transcriptSegments.length; i++) {
        const segment = this.transcriptSegments[i];
        if (currentTime >= segment.startTime && currentTime <= segment.endTime) {
          newSegmentIndex = i;
          break;
        }
      }
      
      // If no segment found, find the closest upcoming segment
      if (newSegmentIndex === -1) {
        for (let i = 0; i < this.transcriptSegments.length; i++) {
          if (currentTime < this.transcriptSegments[i].startTime) {
            // This is the next segment
            break;
          }
          // We're after this segment
          newSegmentIndex = i;
        }
      }
      
      // Update current segment index
      this.currentSegmentIndex = newSegmentIndex;
      
      // Scroll the current segment into view
      this.scrollToCurrentSegment();
    },
    
    scrollToCurrentSegment() {
      this.$nextTick(() => {
        if (this.currentSegmentIndex >= 0) {
          const segments = document.querySelectorAll('.mb-4.border.border-gray-200.rounded-md');
          if (segments && segments[this.currentSegmentIndex]) {
            segments[this.currentSegmentIndex].scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }
        }
      });
    },
    
    isWordActive(word) {
      return this.currentVideoTime >= word.startTime && 
             this.currentVideoTime < word.endTime;
    },
    
    isWordPast(word) {
      return this.currentVideoTime >= word.endTime;
    },
    
    extractTimeInSeconds(timeObject) {
      if (!timeObject) return 0;
      
      if (typeof timeObject === 'object') {
        // Handle { seconds: "X", nanos: Y } format
        const seconds = typeof timeObject.seconds === 'string' ? 
          parseInt(timeObject.seconds) : timeObject.seconds || 0;
        const nanos = timeObject.nanos || 0;
        
        return seconds + (nanos / 1000000000);
      } else if (typeof timeObject === 'string') {
        // Handle various string formats
        if (timeObject.includes('s')) {
          // "1.5s" format
          return parseFloat(timeObject.replace('s', ''));
        } else if (timeObject.includes(':')) {
          // "00:01:23.456" format (HH:MM:SS.mmm)
          const parts = timeObject.split(':');
          let seconds = 0;
          if (parts.length === 3) {
            seconds = (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseFloat(parts[2]);
          } else if (parts.length === 2) {
            seconds = (parseInt(parts[0]) * 60) + parseFloat(parts[1]);
          }
          return seconds;
        }
        // Try to parse as a raw number
        return parseFloat(timeObject);
      }
      
      return Number(timeObject) || 0;
    },
    
    // ===== TRANSCRIPT EXPORT AND SAVING =====
    async saveAllSegments() {
      if (!this.processingId) return;
      
      this.isSavingTranscript = true;
      this.saveStatus = null;
      
      try {
        // Finish any active editing
        this.transcriptSegments.forEach((segment, idx) => {
          if (segment.isEditing) {
            this.finishEditing(idx, true);
          }
        });
        
        // Combine all segment texts into a full transcript
        const fullText = this.transcriptSegments.map(segment => segment.text).join(' ');
        
        // Create an updated transcription JSON based on segments
        const updatedTranscriptionJson = this.createUpdatedTranscriptionJsonFromSegments();
        
        // Send the update to the server
        const response = await fetch(`${this.apiUrl}/update-transcript/${this.processingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: fullText,
            transcription_json: updatedTranscriptionJson
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save transcript');
        }
        
        // Update our local transcript
        this.transcript = fullText;
        this.originalTranscriptionJson = updatedTranscriptionJson;
        
        // Update original text in segments to reflect saved state
        this.transcriptSegments.forEach(segment => {
          segment.originalText = segment.text;
        });
        
        // Show success message
        this.saveStatus = {
          type: 'text-green-600',
          message: 'All segments saved successfully'
        };
        
        // Clear the message after 3 seconds
        setTimeout(() => {
          this.saveStatus = null;
        }, 3000);
      } catch (error) {
        console.error('Error saving transcript:', error);
        this.saveStatus = {
          type: 'text-red-600',
          message: `Failed to save transcript: ${error.message}`
        };
      } finally {
        this.isSavingTranscript = false;
      }
    },
    
    createUpdatedTranscriptionJsonFromSegments() {
      // Start with a copy of the original JSON
      if (!this.originalTranscriptionJson) {
        // If we don't have the original JSON, create a basic structure
        const fullText = this.transcriptSegments.map(segment => segment.text).join(' ');
        return {
          text: fullText,
          results: [{
            transcript: fullText,
            confidence: 1.0
          }]
        };
      }
      
      // Create a deep copy of the original JSON
      const updatedJson = JSON.parse(JSON.stringify(this.originalTranscriptionJson));
      const fullText = this.transcriptSegments.map(segment => segment.text).join(' ');
      
      // Update the text field with the combined text from all segments
      updatedJson.text = fullText;
      
      // If there are results, update the first result's transcript
      if (updatedJson.results && updatedJson.results.length > 0) {
        // Update all result transcripts to match our edited text
        // This is a simplification; in a real app you might want to distribute
        // the edits more intelligently across the original results
        updatedJson.results.forEach(result => {
          if (result.transcript) {
            result.transcript = fullText;
          }
          if (result.alternatives && result.alternatives.length > 0) {
            result.alternatives[0].transcript = fullText;
          }
        });
      }
      
      return updatedJson;
    },
    
    copyTranscript() {
      // Combine all segment texts for copying
      const fullText = this.transcriptSegments.map(segment => segment.text).join(' ');
      
      navigator.clipboard.writeText(fullText)
        .then(() => {
          // Show feedback
          this.saveStatus = {
            type: 'text-blue-600',
            message: 'Transcript copied to clipboard'
          };
          
          // Clear the message after 2 seconds
          setTimeout(() => {
            this.saveStatus = null;
          }, 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          this.saveStatus = {
            type: 'text-red-600',
            message: 'Failed to copy transcript'
          };
        });
    },
    
    async downloadSRT() {
      if (!this.processingId) {
        this.errorMessage = 'Processing ID not found. Cannot download SRT file.';
        return;
      }
      
      // If there are unsaved changes, warn the user
      if (this.hasUnsavedChanges) {
        alert('Please save your changes before downloading the SRT file.');
        return;
      }
      
      try {
        this.isDownloadingSRT = true;
        
        // Create a URL to the download endpoint
        const downloadUrl = `${this.apiUrl}/download-srt/${this.processingId}`;
        
        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${this.file ? this.file.name.replace(/\.[^/.]+$/, '') : 'transcript'}.srt`;
        
        // Append to the document, click it, then remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('SRT download error:', error);
        this.errorMessage = `Failed to download SRT file: ${error.message || 'Unknown error'}`;
      } finally {
        this.isDownloadingSRT = false;
      }
    },
    
    exportTranscript() {
      // Check for unsaved changes
      if (this.hasUnsavedChanges) {
        if (confirm('You have unsaved changes. Save changes before exporting?')) {
          this.saveAllSegments().then(() => {
            // Trigger download export options
            alert('Export options would appear here (SRT, TXT, etc.)');
          });
        } else {
          // Export without saving
          alert('Export options would appear here (SRT, TXT, etc.)');
        }
      } else {
        // No unsaved changes, proceed with export
        alert('Export options would appear here (SRT, TXT, etc.)');
      }
    }
  }
}
</script>

<style scoped>
/* Optional: Add custom styles for the karaoke effect */
.transition-colors {
  transition-property: background-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Custom range input styling */
input[type="range"] {
  -webkit-appearance: none;
  height: 8px;
  border-radius: 5px;  
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%; 
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* Segment transition effects */
.mb-4.border.border-gray-200.rounded-md {
  transition: all 0.3s ease;
}
</style>