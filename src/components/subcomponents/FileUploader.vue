<template>
  <div class="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto font-poppins">
    <div class="mb-4">
      <div 
        class="w-full border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors"
        :class="{ 'border-primary bg-[#F7FBF9]': isDragging, 'border-gray-300 hover:bg-[#FBFBFB]': !isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
        @click="triggerFileInput"
      >
        <div class="flex flex-col items-center justify-center">
          <svg class="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="mb-2 text-lg font-poppins text-primary">
            {{ file ? 'Ngarko një video tjetër' : 'Ngarko videon' }}
          </p>
          <p class="mb-2 text-sm text-gray-500 font-poppins">
            Formatet e pranuara janë MP4, MOV, ose WebM<br>(max. {{ formattedMaxFileSize }})
          </p>
          <span v-if="file" class="text-sm font-medium text-primary font-poppins">
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

    <div v-if="file" class="w-full">
      <button
        @click="checkAuthAndUpload"
        :disabled="isUploading"
        class="w-full py-2 px-4 rounded-2xl font-poppins font-medium transition-colors"
        :class="[
          isUploading.value 
            ? 'bg-gray-400 cursor-not-allowed text-white' 
            : 'bg-secondary hover:bg-primary text-primary hover:text-white'
        ]"
      >
        {{ uploadButtonText }}
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="errorMessage" class="w-full mt-4 font-poppins">
      <!-- Quota Error Display -->
      <div v-if="quotaError" class="p-4 bg-red-50 border border-red-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm text-kollektif-bold text-red-800">
              Limiti i planit eshte arritur
            </h3>
            <div class="mt-2 text-sm text-red-700 font-poppins">
              <ul class="list-disc list-inside space-y-1">
                <li v-for="error in quotaError.errors" :key="error">{{ error }}</li>
              </ul>
            </div>
            <div v-if="quotaError.quotaInfo" class="mt-3 p-3 bg-red-100 rounded border">
              <h4 class="text-sm font-medium text-red-800 mb-2">Detajet e planit:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-red-700 font-poppins">
                <div v-if="quotaError.quotaInfo.videosTotal !== undefined">
                  <strong>Video:</strong> {{ quotaError.quotaInfo.videosUsed }}/{{ quotaError.quotaInfo.videosTotal }}
                </div>
                <div v-if="quotaError.quotaInfo.minutesTotal !== undefined">
                  <strong>Minuta:</strong> {{ quotaError.quotaInfo.minutesUsed }}/{{ quotaError.quotaInfo.minutesTotal }}
                </div>
                <div v-if="quotaError.quotaInfo.maxFileSizeMB !== undefined">
                  <strong>File size:</strong> {{ quotaError.quotaInfo.fileSizeMB?.toFixed(1) }}MB / {{ quotaError.quotaInfo.maxFileSizeMB }}MB max
                </div>
                <div v-if="quotaError.quotaInfo.maxDurationMinutes !== undefined">
                  <strong>Kohezgjatja:</strong> {{ Math.ceil(quotaError.quotaInfo.durationSeconds / 60) }} min / {{ quotaError.quotaInfo.maxDurationMinutes }} min max
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Generic Error Display -->
      <div v-else class="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md font-poppins">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  apiUrl: { type: String, required: true }
})

const emit = defineEmits([
  'auth-required',
  'upload-start',
  'state-change',
  'processing-step',
  'upload-error',
  'upload-complete'
])

// File upload and processing properties
const file = ref(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref(null)
const quotaError = ref(null)

// User data and role
const userId = ref(null)
const userName = ref('No User')
const userRole = ref(null)

const fileInput = ref(null)

const uploadButtonText = computed(() => {
  return isUploading.value ? 'Duke u ngarkuar...' : 'Ngarko videon'
})

const maxFileSizeMB = computed(() => userRole.value?.max_file_size_mb || 100)
const formattedMaxFileSize = computed(() => {
  if (maxFileSizeMB.value >= 1024) {
    const sizeInGB = maxFileSizeMB.value / 1024
    return `${sizeInGB % 1 === 0 ? sizeInGB.toFixed(0) : sizeInGB.toFixed(1)}GB`
  }
  return `${maxFileSizeMB.value}MB`
})

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(event) {
  const selectedFile = event.target.files?.[0]
  if (selectedFile) {
    if (!validateFile(selectedFile)) return
    file.value = selectedFile
    errorMessage.value = null
  }
}

function onDrop(event) {
  isDragging.value = false
  const droppedFile = event.dataTransfer.files?.[0]
  if (droppedFile) {
    if (!validateFile(droppedFile)) return
    file.value = droppedFile
    errorMessage.value = null
  }
}

function validateFile(f) {
  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm']
  if (!allowedTypes.includes(f.type)) {
    errorMessage.value = 'Please select a valid video file (MP4, MOV, or WebM).'
    return false
  }
  // Enforce maximum 100MB if role not loaded; otherwise use role
  const maxSize = (userRole.value?.max_file_size_mb || 100) * 1024 * 1024
  if (f.size > maxSize) {
    errorMessage.value = `Video file is too large. Maximum size is ${formattedMaxFileSize.value}.`
    return false
  }
  return true
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

// Auth and role
async function getCurrentUser() {
  try {
    const { supabase } = await import('../../lib/supabaseClient')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) return null

    const user = session.user
    userId.value = user.id
    userName.value = user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous'
    await fetchUserRole()
    return user.id
  } catch (e) {
    console.error('Error getting current user:', e)
    return null
  }
}

async function fetchUserRole() {
  try {
    if (!userId.value) return
    const { supabase } = await import('../../lib/supabaseClient')
    const { data, error } = await supabase
      .from('users')
      .select(`
        role,
        roles (
          id,
          name,
          max_file_size_mb,
          max_video_duration,
          videos_per_month,
          total_minutes_per_month,
          srt_exports_per_month
        )
      `)
      .eq('id', userId.value)
      .single()
    if (error) {
      console.error('Error fetching user role:', error)
      return
    }
    if (data && data.roles) {
      userRole.value = data.roles
    }
  } catch (e) {
    console.error('Error fetching user role:', e)
  }
}

// Upload flow
async function checkAuthAndUpload() {
  if (!file.value) return
  const uid = await getCurrentUser()
  if (!uid) {
    emit('auth-required')
    return
  }
  emit('upload-start')
  await uploadFile()
}

async function uploadFile() {
  if (!file.value || isUploading.value) return

  isUploading.value = true
  errorMessage.value = null
  quotaError.value = null
  uploadProgress.value = 0
  emit('state-change', 'uploading')

  try {
    const formData = new FormData()
    formData.append('video', file.value)
    formData.append('userId', userId.value || 'no-user-id')
    formData.append('userName', userName.value || 'Anonymous')

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded / event.total) * 100)
      }
    })

    const response = await new Promise((resolve, reject) => {
      xhr.open('POST', `${props.apiUrl}/upload-video`, true)
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          let errorData = null
          try {
            errorData = JSON.parse(xhr.responseText)
          } catch {
            errorData = { message: xhr.statusText }
          }
          const err = new Error(errorData.message || `HTTP error ${xhr.status}`)
          err.status = xhr.status
          err.data = errorData
          reject(err)
        }
      }
      xhr.onerror = () => reject(new Error('Network error occurred'))
      xhr.send(formData)
    })

    emit('state-change', 'processing')

    const processingId = response.processingId
    const videoUrl = response.videoUrl

    // Poll for processing status and steps
    await pollProcessingStatus(processingId)

    // Fetch full transcription JSON
    const transcriptionData = await fetchTranscriptionJson(processingId)

    emit('upload-complete', {
      processingId,
      videoUrl,
      originalTranscriptionJson: transcriptionData?.transcription_json || null,
      originalFilename: transcriptionData?.original_filename || null
    })
  } catch (error) {
    console.error('Upload error:', error)
    if (error.status === 403 && error.data) {
      quotaError.value = {
        errors: error.data.message ? error.data.message.split('; ') : ['Quota limit exceeded'],
        quotaInfo: error.data.quotaInfo || null
      }
      errorMessage.value = 'Upload quota exceeded. Please check the details below.'
    } else {
      quotaError.value = null
      errorMessage.value = `Upload failed: ${error.message || 'Unknown error'}`
    }
    emit('upload-error', { message: errorMessage.value, quotaError: quotaError.value })
    emit('state-change', 'error')
  } finally {
    isUploading.value = false
  }
}

function pollProcessingStatus(processingId) {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${props.apiUrl}/processing-status/${processingId}`)
        const data = await res.json()
        if (data.step) {
          emit('processing-step', data.step)
        }
        if (data.status === 'complete') {
          resolve(data)
        } else if (data.status === 'error') {
          reject(new Error(data.message || 'Processing failed'))
        } else {
          setTimeout(checkStatus, 2000)
        }
      } catch (e) {
        reject(e)
      }
    }
    checkStatus()
  })
}

async function fetchTranscriptionJson(processingId) {
  const res = await fetch(`${props.apiUrl}/transcriptions/${processingId}`)
  if (!res.ok) throw new Error(`Failed to fetch transcription: ${res.statusText}`)
  return res.json()
}
</script>