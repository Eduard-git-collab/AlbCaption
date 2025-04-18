<script setup>
import transcript_item from './items/transcript-item.vue'
import { ref, computed } from 'vue'

const videoUrl = ref('') // Replace with your video URL
const videoElement = ref(null)
const isVertical = ref(false)

// Check video orientation when metadata is loaded
const checkVideoOrientation = () => {
  const video = videoElement.value
  if (video) {
    isVertical.value = video.videoHeight > video.videoWidth
  }
}

// Dynamically compute the class based on orientation
const videoOrientationClass = computed(() =>
  isVertical.value ? 'vertical-video' : 'horizontal-video'
)

</script>

<template>
        <div class="w-screen h-screen bg-[#f8f9fa]">
            <div class="w-full h-full p-4">
                <div class="w-full h-full ">
                    <div class="w-full h-full flex flex-row gap-2">
                        <div class="w-full h-full rounded-3xl bg-white box">
                            <div class="w-full h-full p-6">
                                <div class="w-full h-full flex flex-col gap-2">
                                    <div class="h-1/4 w-full ">
                                        <div class="w-full h-full flex flex-col gap-5">
                                            <div class="w-full h-full ">
                                                <h1 class="text-lg my-2 font-bold">
                                                    Transcript
                                                </h1>
                                                <hr class="text-stone-300 mb-2">
                                                <button class="w-full h-fit py-2 self-center bg-violet-500 rounded-xl text-md font-medium text-white mt-2">
                                                    Start Transcribing
                                                </button>
                                            </div>
                                            <div class="w-full h-full ">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="h-3/4 w-full flex flex-col text-left">
                                        <div class="flex flex-col">
                                            <transcript_item />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-4/5 max-h-full p-6 rounded-3xl bg-white box">
                            <h1 class="text-lg my-2 font-bold">
                                Video Preview
                            </h1>
                            <hr class="text-stone-300">
                            <video
                            ref="videoElement"
                            :class="videoOrientationClass"
                            controls
                            @loadedmetadata="checkVideoOrientation"
                          >
                            <source :src="videoUrl" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>

                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<style scoped>

.box{
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

video {
    margin-top: 20px;
    max-width: 100%;
    border: 2px solid #ccc;
    border-radius: 8px;
  }
  
  /* Horizontal video styles */
  .horizontal-video {
    width: 100%;
    height: auto;
  }
  
  /* Vertical video styles */
  .vertical-video {
    width: auto;
    height: 90%;
  }

</style>