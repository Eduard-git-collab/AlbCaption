<template>
  <div class="flex flex-col items-center gap-4 mt-8 h-screen justify-center">
    <input
      ref="fileInput"
      type="file"
      accept="video/*"
      @change="handleFileChange"
    />

    <button
      @click="uploadVideo"
      class="px-4 py-2 bg-violet-500 text-white rounded disabled:opacity-50"
      :disabled="!videoFile || isUploading"
    >
      <span v-if="isUploading">Uploading...</span>
      <span v-else>Upload Video</span>
    </button>

    <div class="w-full max-w-md h-3 bg-gray-300 rounded overflow-hidden" v-if="isUploading">
      <div
        class="h-full bg-violet-500 transition-all duration-200 ease-linear"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <!-- Success Message -->
    <transition name="fade">
      <div
        v-if="uploadSuccess"
        class="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow"
      >
        <span>✅ Video uploaded successfully!</span>
        <button @click="uploadSuccess = false" class="text-green-600 hover:text-green-800 font-bold text-xl">&times;</button>
      </div>
    </transition>

    <!-- Error Message -->
    <p v-if="uploadError" class="text-red-500">{{ uploadError }}</p>

    <!-- Video Preview -->
    <div v-if="videoUrl" class="mt-6">
      <h3 class="text-xl font-semibold mb-2">Uploaded Video:</h3>
      <video controls width="480">
        <source :src="videoUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase/supabaseClient'

const videoFile = ref(null)
const videoUrl = ref('')
const uploadError = ref('')
const uploadSuccess = ref(false)
const isUploading = ref(false)
const fileInput = ref(null)
const progress = ref(0)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  uploadError.value = ''
  uploadSuccess.value = false

  if (file && file.size <= 50 * 1024 * 1024) {
    videoFile.value = file
  } else {
    uploadError.value = 'File is too large (max 50MB)'
    videoFile.value = null
  }
}

const uploadVideo = async () => {
  if (!videoFile.value) return

  isUploading.value = true
  progress.value = 0
  uploadSuccess.value = false
  uploadError.value = ''

  // Simulate progress for demo purposes
  const fakeProgress = setInterval(() => {
    if (progress.value < 95) {
      progress.value += Math.random() * 5
    }
  }, 200)

  const fileName = `${Date.now()}_${videoFile.value.name}`

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(`user-uploads/${fileName}`, videoFile.value, {
      cacheControl: '3600',
      upsert: false,
    })

  
  clearInterval(fakeProgress)
  progress.value = 100
  isUploading.value = false

  if (error) {
    uploadError.value = error.message
    return
  }

  // Get the public URL of the uploaded file
  const { data: publicData } = supabase.storage
    .from('videos')
    .getPublicUrl(`user-uploads/${fileName}`)

  videoUrl.value = publicData.publicUrl
  uploadSuccess.value = true

  // Clear file input so user must select a new file
  videoFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }

  setTimeout(() => {
    uploadSuccess.value = false
    progress.value = 0
  }, 5000)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
