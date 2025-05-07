<template>
  <div class="flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Upload Video</h2>

    <!-- Upload Area (Initially Shown) -->
    <div 
      v-if="!processingState || processingState === 'error'"
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

    <!-- Processing Status & Progress -->
    <div v-if="processingState && processingState !== 'error'" class="w-full">
      <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full mb-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
        </div>
        <p class="text-sm text-gray-600 mt-1 text-center">{{ uploadProgress }}% uploaded</p>
      </div>

      <div class="mb-4 text-center">
        <p class="text-sm font-medium" :class="processingStateColor">
          {{ processingStateMessage }}
        </p>
      </div>

      <!-- Video Player and Transcript Section (when complete) -->
      <div v-if="processingState === 'complete' && videoUrl" class="mt-6">
        <div class="bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
          <!-- Video Player -->
          <div class="w-full relative aspect-video">
            <video 
              ref="videoPlayer" 
              class="w-full h-full object-contain bg-black"
              controls
              @timeupdate="onVideoTimeUpdate"
              @play="isVideoPlaying = true"
              @pause="isVideoPlaying = false"
              @seeking="onVideoSeeking"
              :src="videoUrl"
            ></video>
          </div>

          <!-- Playback Controls & Time -->
          <div class="flex items-center justify-between px-4 py-2 bg-gray-100 border-t border-gray-200">
            <div class="flex items-center space-x-2">
              <button 
                @click="togglePlayback" 
                class="p-1 rounded focus:outline-none hover:bg-gray-200"
              >
                <svg v-if="isVideoPlaying" class="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7-.75a.75.75 0 00-.75.75v13.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-1.5z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <div class="text-xs text-gray-600">
              {{ formatVideoTime(currentVideoTime) }} / {{ formatVideoTime(videoDuration) }}
            </div>
          </div>

          <!-- Transcript Tabs -->
          <div class="border-t border-gray-200">
            <div class="flex border-b border-gray-200">
              <button 
                @click="activeTab = 'karaoke'" 
                class="flex-1 py-2 px-4 text-sm font-medium transition-colors"
                :class="activeTab === 'karaoke' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'"
              >
                Karaoke View
              </button>
              <button 
                @click="activeTab = 'edit'" 
                class="flex-1 py-2 px-4 text-sm font-medium transition-colors"
                :class="activeTab === 'edit' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'"
              >
                Edit Transcript
              </button>
            </div>
            
            <!-- Karaoke View Tab -->
            <div v-if="activeTab === 'karaoke'" class="p-4">
              <div class="max-h-80 overflow-y-auto px-2">
                <p class="text-base leading-relaxed">
                  <span 
                    v-for="(word, index) in parsedWords" 
                    :key="index"
                    :class="[
                      'inline-block mr-1 px-0.5 rounded transition-colors duration-200',
                      isWordActive(word) ? 'bg-blue-500 text-white font-medium' : 
                      isWordPast(word) ? 'text-gray-500' : 'text-gray-800'
                    ]"
                    :ref="el => { if (el) wordElements[index] = el }"
                  >
                    {{ word.word }}
                  </span>
                </p>
              </div>
            </div>
            
            <!-- Edit Transcript Tab -->
            <div v-if="activeTab === 'edit'" class="p-4">
              <div class="relative">
                <textarea
                  v-model="editedTranscript"
                  class="w-full min-h-[150px] p-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  :class="{ 'border-yellow-500': hasTranscriptChanged }"
                  placeholder="Transcript appears here..."
                ></textarea>
                
                <div v-if="hasTranscriptChanged" class="text-xs text-yellow-600 mt-1">
                  You have unsaved changes to the transcript
                </div>
              </div>
              
              <div class="mt-4 flex justify-between">
                <div class="flex space-x-2">
                  <button 
                    @click="resetTranscript" 
                    class="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    :disabled="!hasTranscriptChanged"
                    :class="{ 'opacity-50 cursor-not-allowed': !hasTranscriptChanged }"
                  >
                    Reset
                  </button>
                  <button 
                    @click="saveTranscript" 
                    class="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    :disabled="!hasTranscriptChanged || isSavingTranscript"
                    :class="{ 'opacity-50 cursor-not-allowed': !hasTranscriptChanged || isSavingTranscript }"
                  >
                    {{ isSavingTranscript ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
                
                <div class="flex space-x-2">
                  <button 
                    @click="copyTranscript" 
                    class="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Copy
                  </button>
                  <button 
                    @click="downloadSRT" 
                    class="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    :disabled="isDownloadingSRT || hasTranscriptChanged"
                    :class="{ 'opacity-50 cursor-not-allowed': isDownloadingSRT || hasTranscriptChanged }"
                    :title="hasTranscriptChanged ? 'Please save your changes first' : ''"
                  >
                    {{ isDownloadingSRT ? 'Downloading...' : 'Download SRT' }}
                  </button>
                </div>
              </div>
              
              <p v-if="saveStatus" class="text-sm mt-2" :class="saveStatus.type">
                {{ saveStatus.message }}
              </p>
            </div>
          </div>
        </div>
      </div>
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
      processingState: null, 
      processingStep: null, 
      errorMessage: null,
      apiUrl: 'http://localhost:3000',
      transcript: null,
      editedTranscript: null,
      originalTranscriptionJson: null,
      transcriptionUrl: null,
      videoUrl: null,
      audioUrl: null,
      processingId: null,
      isDownloadingSRT: false,
      isSavingTranscript: false,
      saveStatus: null,
      activeTab: 'karaoke',
      currentVideoTime: 0,
      videoDuration: 0,
      isVideoPlaying: false,
      wordElements: [],
      activeWordIndex: -1,
      // For scrolling to the active word in karaoke view
      scrollTimeout: null
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
    hasTranscriptChanged() {
      return this.transcript !== this.editedTranscript;
    },
    parsedWords() {
      if (!this.originalTranscriptionJson || !this.originalTranscriptionJson.results || 
          !this.originalTranscriptionJson.results[0] || 
          !this.originalTranscriptionJson.results[0].words) {
        return [];
      }
      
      return this.originalTranscriptionJson.results[0].words.map(word => {
        // Convert startOffset and endOffset to seconds
        const startTime = this.extractTimeInSeconds(word.startOffset);
        const endTime = this.extractTimeInSeconds(word.endOffset);
        
        return {
          word: word.word,
          startTime,
          endTime
        };
      });
    }
  },
  watch: {
    activeTab(newTab) {
      // When switching to karaoke tab, update active word
      if (newTab === 'karaoke') {
        this.updateActiveWord();
      }
    },
    parsedWords(newWords) {
      // Re-initialize word elements array when parsed words change
      this.$nextTick(() => {
        this.wordElements = Array(newWords.length).fill(null);
        this.updateActiveWord();
      });
    }
  },
  mounted() {
    // When the component is mounted, initialize the video events if there's already a video
    this.$nextTick(() => {
      if (this.$refs.videoPlayer) {
        this.setupVideoEvents();
      }
    });
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
                this.editedTranscript = data.transcript; // Initialize edited version
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
        this.updateActiveWord();
      }
    },
    
    onVideoSeeking() {
      // Update active word when user seeks in the video
      this.updateActiveWord();
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
    
    extractTimeInSeconds(timeObject) {
      if (!timeObject) return 0;
      
      if (typeof timeObject === 'object') {
        // Handle { seconds: "X", nanos: Y } format
        const seconds = typeof timeObject.seconds === 'string' ? 
          parseInt(timeObject.seconds) : timeObject.seconds || 0;
        const nanos = timeObject.nanos || 0;
        
        return seconds + (nanos / 1000000000);
      } else if (typeof timeObject === 'string') {
        // Handle "Xs" format
        return parseFloat(timeObject.replace('s', ''));
      }
      
      return Number(timeObject) || 0;
    },
    
    isWordActive(word) {
      return this.currentVideoTime >= word.startTime && 
             this.currentVideoTime < word.endTime;
    },
    
    isWordPast(word) {
      return this.currentVideoTime >= word.endTime;
    },
    
    updateActiveWord() {
      if (!this.parsedWords.length) return;
      
      // Find the active word based on current time
      let foundActiveWord = false;
      let newActiveWordIndex = -1;
      
      for (let i = 0; i < this.parsedWords.length; i++) {
        const word = this.parsedWords[i];
        if (this.currentVideoTime >= word.startTime && 
            this.currentVideoTime < word.endTime) {
          newActiveWordIndex = i;
          foundActiveWord = true;
          break;
        }
      }
      
      // If no active word was found, find the next word to highlight
      if (!foundActiveWord && this.activeTab === 'karaoke') {
        for (let i = 0; i < this.parsedWords.length; i++) {
          const word = this.parsedWords[i];
          if (this.currentVideoTime < word.startTime) {
            // This is the next word to be highlighted
            newActiveWordIndex = -1; // No current active word
            break;
          }
        }
      }
      
      // If active word has changed, scroll to it
      if (newActiveWordIndex !== this.activeWordIndex && newActiveWordIndex !== -1) {
        this.activeWordIndex = newActiveWordIndex;
        this.scrollToActiveWord();
      } else {
        this.activeWordIndex = newActiveWordIndex;
      }
    },
    
    scrollToActiveWord() {
      // Clear any existing scroll timeout
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      // Wait a moment to ensure the DOM has updated
      this.scrollTimeout = setTimeout(() => {
        const activeElement = this.wordElements[this.activeWordIndex];
        if (activeElement && this.activeTab === 'karaoke') {
          // Get the parent scroll container
          const scrollContainer = activeElement.closest('.max-h-80');
          if (scrollContainer) {
            // Scroll the active word into view with smooth animation
            const containerRect = scrollContainer.getBoundingClientRect();
            const elementRect = activeElement.getBoundingClientRect();
            
            // Calculate if element is outside visible area
            const isAbove = elementRect.top < containerRect.top;
            const isBelow = elementRect.bottom > containerRect.bottom;
            
            if (isAbove || isBelow) {
              // Calculate the new scroll position
              const newScrollTop = isAbove 
                ? scrollContainer.scrollTop + (elementRect.top - containerRect.top) - 40 // Add some padding
                : scrollContainer.scrollTop + (elementRect.bottom - containerRect.bottom) + 40;
              
              // Scroll smoothly to the new position
              scrollContainer.scrollTo({
                top: newScrollTop,
                behavior: 'smooth'
              });
            }
          }
        }
      }, 100);
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
            this.editedTranscript = data.transcription_json.text;
          }
          
          // Initialize word elements array
          if (this.parsedWords.length > 0) {
            this.wordElements = Array(this.parsedWords.length).fill(null);
          }
        }
      } catch (error) {
        console.error('Error fetching transcription JSON:', error);
      }
    },
    
    async saveTranscript() {
      if (!this.processingId || !this.hasTranscriptChanged) return;
      
      this.isSavingTranscript = true;
      this.saveStatus = null;
      
      try {
        // Create an updated transcription JSON based on the edited text
        const updatedTranscriptionJson = this.createUpdatedTranscriptionJson();
        
        // Send the update to the server
        const response = await fetch(`${this.apiUrl}/update-transcript/${this.processingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: this.editedTranscript,
            transcription_json: updatedTranscriptionJson
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save transcript');
        }
        
        // Update our local transcript to match the edited version
        this.transcript = this.editedTranscript;
        this.originalTranscriptionJson = updatedTranscriptionJson;
        
        // Show success message
        this.saveStatus = {
          type: 'text-green-600',
          message: 'Transcript saved successfully'
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
    
    createUpdatedTranscriptionJson() {
      // Start with a copy of the original JSON
      if (!this.originalTranscriptionJson) {
        // If we don't have the original JSON, create a basic structure
        return {
          text: this.editedTranscript,
          results: [{
            transcript: this.editedTranscript,
            confidence: 1.0
          }]
        };
      }
      
      // Create a deep copy of the original JSON
      const updatedJson = JSON.parse(JSON.stringify(this.originalTranscriptionJson));
      
      // Update the text field with the edited text
      updatedJson.text = this.editedTranscript;
      
      // If there are results, update the first result's transcript
      if (updatedJson.results && updatedJson.results.length > 0) {
        updatedJson.results[0].transcript = this.editedTranscript;
      }
      
      return updatedJson;
    },
    
    resetTranscript() {
      // Reset the edited transcript to the original
      this.editedTranscript = this.transcript;
      this.saveStatus = null;
    },
    
    copyTranscript() {
      if (this.editedTranscript) {
        navigator.clipboard.writeText(this.editedTranscript)
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
      }
    },
    
    async downloadSRT() {
      if (!this.processingId) {
        this.errorMessage = 'Processing ID not found. Cannot download SRT file.';
        return;
      }
      
      // If there are unsaved changes, warn the user
      if (this.hasTranscriptChanged) {
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
    }
  }
}
</script>

<style scoped>
.text-green-600 {
  color: #059669;
}
.text-red-600 {
  color: #dc2626;
}
.text-blue-600 {
  color: #2563eb;
}
.text-yellow-600 {
  color: #d97706;
}
</style>