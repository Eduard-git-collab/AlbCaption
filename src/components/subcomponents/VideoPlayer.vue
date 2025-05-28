<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <FilenameEditor
        :original-filename="originalFilename"
        :is-editing="isEditingFilename"
        :edited-filename="editedFilename"
        :is-saving="isSavingFilename"
        :error="filenameError"
        @edit="isEditingFilename = true"
        @save="$emit('save-filename', $event)"
        @cancel="isEditingFilename = false"
      />
      
      <div class="p-4">
        <!-- Video Player -->
        <div class="relative aspect-video bg-black rounded overflow-hidden">
          <video 
            ref="videoPlayer" 
            class="w-full h-full object-contain"
            controls
            @timeupdate="$emit('timeupdate', $event.target.currentTime)"
            @play="$emit('play')"
            @pause="$emit('pause')"
            @seeking="$emit('seeking')"
            :src="videoUrl"
          ></video>
        </div>
    
        <!-- Custom Video Controls -->
        <div class="mt-4 flex items-center justify-between px-2 py-2 bg-gray-100 rounded">
          <div class="flex items-center space-x-3">
            <button 
              @click="$emit('toggle-playback')" 
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
              @click="$emit('skip-backward', 5)"
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
            @click="$emit('skip-forward', 5)"
            class="flex items-center text-xs font-medium text-gray-700 px-2 py-1 hover:bg-gray-200 rounded"
          >
            5s
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import FilenameEditor from './FilenameEditor.vue';
  
  export default {
    components: { FilenameEditor },
    props: {
      videoUrl: String,
      originalFilename: String,
      currentVideoTime: Number,
      videoDuration: Number,
      isVideoPlaying: Boolean
    },
    data() {
      return {
        isEditingFilename: false,
        editedFilename: '',
        isSavingFilename: false,
        filenameError: null
      }
    },
    methods: {
      formatVideoTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
  }
  </script>