<template>
  <div class="relative max-w-6xl mx-auto">
    <div
      class="relative rounded-2xl bg-white p-6 h-[60vh] border-3 border-[#353535]/70 font-poppins z-10"
    >
      <div class="mb-4 h-full">
        <div
          class="w-full border-2 border-dashed rounded-lg p-8 mb-6 h-full text-center cursor-pointer transition-colors bg-[#A0A0A0]/10"
          :class="{
            'border-primary bg-[#F7FBF9]': isDragging,
            'border-gray-500 hover:bg-[#A0A0A0]/30': !isDragging
          }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
          @click="triggerFileInput"
        >
          <div class="flex flex-col h-full items-center justify-center">
            <svg
              class="w-50 h-50 text-gray-400/80 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <p class="mb-2 font-poppins font-semibold text-primary text-3xl">
              {{ file ? "Ngarko një video tjetër" : "Ngarko videon" }}
            </p>

            <p class="mb-2 text-sm text-gray-500 font-poppins">
              Formatet e pranuara janë MP4, MOV, ose WebM<br />(max.
              {{ formattedMaxFileSize }})
            </p>
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
    </div>

    <div
      class="absolute left-0 right-0 top-0 rounded-2xl bg-white p-6 h-[60vh] border-3 border-[#353535]/70 mx-auto font-poppins z-0
             4xl:shadow-[12px_16px_12px_8px_rgba(0,0,0,0.25)] shadow-[5px_5px_0px_rgba(0,0,0,0.25)]
             flex items-end transition-all duration-500 ease-in-out"
      :class="
        file
          ? 'translate-y-20 pointer-events-auto'
          : 'translate-y-0 pointer-events-none'
      "
    >
      <span class="text-sm font-medium text-primary font-poppins self-end">
        {{ file?.name }} ({{ file ? formatFileSize(file.size) : "" }})
      </span>
    </div>
  </div>

  <div v-if="file" class="w-fit mx-auto mt-4">
    <button
      @click="checkAuthAndUpload"
      :disabled="isUploading"
      class="w-full py-3 px-20 mt-20 cursor-pointer rounded-xl font-poppins text-3xl font-medium transition-colors"
      :class="[
        isUploading.value
          ? 'bg-gray-400 cursor-not-allowed text-white'
          : 'bg-secondary hover:bg-primary text-primary hover:text-white'
      ]"
    >
      {{ uploadButtonText }}
    </button>
  </div>

  <div v-if="errorMessage" class="w-screen h-screen fixed inset-0 bg-black/20 backdrop-blur-xs z-40 flex items-center justify-center">
    <div v-if="quotaError" class="p-4 bg-red-50 border relative border-red-200 rounded-md">
      <div @click="hideEror" class="absolute top-2 right-4 font-semibold cursor-pointer text-red-300 hover:text-red-400 transition-all">X</div>
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
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

              <RouterLink to="/pricing">
                <button
                  class="mt-4 inline-flex items-center px-4 py-2 border border-red-800 text-sm font-medium rounded-md hover:text-white hover:bg-red-800 text-red-800 transition-colors cursor-pointer"
                >
                  Ndrysho planin
                </button>
              </RouterLink>
            </div>
          </div>
    </div>

    <div
          v-else
          class="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md font-poppins"
        >
          {{ errorMessage }}
    </div>
  </div>  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/stores/apiClient'
import { useAlert } from '@/stores/useAlert'

const { showAlert } = useAlert()

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
  return isUploading.value ? 'Duke u ngarkuar...' : 'Ngarko'
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
    const { supabase } = await import('@/lib/supabaseClient')
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
    const { supabase } = await import('@/lib/supabaseClient')
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

function hideEror() {
  errorMessage.value = null
  quotaError.value = null
}

// Fetch the user's role on load so max file size is correct before file selection
onMounted(() => {
  getCurrentUser()
})

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

    const response = await apiClient.post('/upload-video', formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          uploadProgress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        }
      }
    })

    emit('state-change', 'processing')

    const processingId = response.data.processingId
    const videoUrl = response.data.videoUrl
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
    if (error.response?.status === 403 && error.response?.data) {
      quotaError.value = {
        errors: error.response.data.message ? error.response.data.message.split('; ') : ['Limiti i planit është arritur'],
        quotaInfo: error.response.data.quotaInfo || null
      }
      errorMessage.value = 'Limiti i planit është arritur. Plani juaj aktual:'
    } else {
      quotaError.value = null
    }
    emit('upload-error', { message: errorMessage.value, quotaError: quotaError.value })
    emit('state-change', 'error')
    showAlert('error', error.response?.data?.error || 'Ndodhi një gabim në server')
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
  try {
    const response = await apiClient.get(`/transcriptions/${processingId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching transcription:', error)
    throw new Error(`Failed to fetch transcription: ${error.message}`)
  }
}
</script>