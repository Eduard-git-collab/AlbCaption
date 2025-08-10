<template>
    <ModalDialog 
      v-if="modalVisible" 
      title="Identifikohu"
      :message="modalMessage"
      icon="info"
      confirm-text="Regjistrohu"
      cancel-text="Hyr"
      confirm-variant="primary"
      size="md"
      @confirm="handleSignUp"
      @cancel="handleLogin"
      @close="modalVisible = false"
    />
  
    <div class="relative inline-flex h-fit w-screen items-center justify-center overflow-hidden">
      <!-- Processing overlay (animation + status text) -->
      <ProcessingOverlay
        ref="overlay"
        :state="processingState"
        :step="processingStep"
      />
  
      <div class="min-h-screen relative w-full">
        <div class="container mx-auto px-4 py-6">
          <!-- File Upload Section -->
          <FileUploader
            v-if="!isComplete"
            :api-url="apiUrl"
            @auth-required="onAuthRequired"
            @upload-start="onUploadStart"
            @state-change="onStateChange"
            @processing-step="onProcessingStep"
            @upload-error="onUploadError"
            @upload-complete="onUploadComplete"
          />
  
          <!-- Complete State - Combined Editor View -->
          <TranscriptEditor
            v-if="isComplete"
            :api-url="apiUrl"
            :processing-id="processingId"
            :video-url="videoUrl"
            :original-transcription-json="originalTranscriptionJson"
            :original-filename="originalFilename"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ModalDialog from './items/ModalDialog.vue'
  import ProcessingOverlay from './subcomponents/ProcessingOverlay.vue'
  import FileUploader from './subcomponents/FileUploader.vue'
  import TranscriptEditor from './subcomponents/TranscriptEditor.vue'
  
  export default {
    name: 'VideoUpload',
    components: {
      ModalDialog,
      ProcessingOverlay,
      FileUploader,
      TranscriptEditor
    },
    data() {
      return {
        // Modal dialog properties
        modalVisible: false,
        modalMessage: "Regjistrimi është i nevojshëm për të vazhduar me ngarkimin e videos.",
  
        // API
        apiUrl: 'http://localhost:3000',
        // 'https://albcaptions-api-488229739417.europe-west4.run.app',
        // 'https://8064aa68daa5.ngrok-free.app',
  
        // Global processing state (drives overlay)
        processingState: null,  // null | 'uploading' | 'processing' | 'complete' | 'error'
        processingStep: null,   // null | 'audio-extraction' | 'transcribing' | ...
  
        // Data passed to TranscriptEditor upon completion
        isComplete: false,
        processingId: null,
        videoUrl: null,
        originalTranscriptionJson: null,
        originalFilename: null
      }
    },
    methods: {
      handleSignUp() {
        this.modalVisible = false
        this.$router.push('/signup')
      },
      handleLogin() {
        this.modalVisible = false
        this.$router.push('/signin')
      },
  
      onAuthRequired() {
        this.modalVisible = true
      },
  
      onUploadStart() {
        this.processingState = 'uploading'
        // kick off overlay animation
        this.$nextTick(() => {
          this.$refs.overlay?.start()
        })
      },
  
      onStateChange(state) {
        this.processingState = state
        if (state === 'error' || state === 'complete') {
          // stop overlay animation
          this.$refs.overlay?.stop()
        }
      },
  
      onProcessingStep(step) {
        this.processingState = 'processing'
        this.processingStep = step
      },
  
      onUploadError() {
        this.processingState = 'error'
        this.$refs.overlay?.stop()
      },
  
      onUploadComplete(payload) {
        // payload contains: processingId, videoUrl, originalTranscriptionJson, originalFilename
        this.processingState = 'complete'
        this.processingStep = null
        this.processingId = payload.processingId
        this.videoUrl = payload.videoUrl
        this.originalTranscriptionJson = payload.originalTranscriptionJson || null
        this.originalFilename = payload.originalFilename || null
        this.isComplete = true
        this.$refs.overlay?.stop()
      }
    }
  }
  </script>