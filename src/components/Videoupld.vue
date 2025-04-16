<template>
    <div class="flex flex-col items-center gap-4 mt-8">
      <input type="file" accept="video/*" @change="handleFileChange" />
      <button
        @click="uploadVideo"
        class="px-4 py-2 bg-violet-500 text-white rounded"
        :disabled="!videoFile"
      >
        Upload Video
      </button>
  
      <!-- ✅ Success Message -->
      <p v-if="uploadSuccess" class="text-green-500 font-semibold">
        Video uploaded successfully!
      </p>
  
      <!-- ✅ Error Message -->
      <p v-if="uploadError" class="text-red-500">{{ uploadError }}</p>
  
      <!-- ✅ Uploaded Video Preview -->
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
  
    const fileName = `${Date.now()}_${videoFile.value.name}`
  
    const { data, error } = await supabase.storage
      .from('jevguvid')
      .upload(`user-uploads/${fileName}`, videoFile.value, {
        cacheControl: '3600',
        upsert: false,
      })
  
    if (error) {
      uploadError.value = error.message
      uploadSuccess.value = false
      return
    }
  
    const { data: publicData } = supabase.storage
      .from('videos')
      .getPublicUrl(`user-uploads/${fileName}`)
  
    videoUrl.value = publicData.publicUrl
    uploadSuccess.value = true
  }
  </script>
  