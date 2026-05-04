<template>
  <div
    v-if="state.show"
    class="fixed w-screen h-screen bg-black/20 backdrop-blur-xs z-100 flex items-center justify-center"
  >
    <div class="relative bg-white border border-[#353535]/70 rounded-lg shadow-lg w-2/5 h-fit">
      
      <!-- HEADER -->
      <div class="flex flex-row gap-5 items-center border-b border-[#353535]/70 p-5">
        
        <!-- ICON -->
        <div class="w-12 h-12 relative flex items-center justify-center">
          
          <!-- Dynamic icon -->
          <template v-if="state.type === 'warning'">
            <svg viewBox="0 0 92 83" class="w-full h-full" :class="state.iconColor">
              <path
                d="M37.2948 4.99999C41.1438 -1.66668 50.7663 -1.66667 54.6153 5L90.5554 67.25C94.4044 73.9167 89.5931 82.25 81.8951 82.25H10.015C2.317 82.25 -2.49423 73.9167 1.35477 67.25L37.2948 4.99999Z"
                fill="currentColor"
              />
            </svg>

            <div class="absolute inset-0 flex items-center justify-center">
              <Albcaption_logo_nocolor class="w-5 h-5 translate-y-[10%]" :class="state.logoColor" />
            </div>
          </template>

          <template v-else>
            <div :class="state.iconWrapper">
              <Albcaption_logo_nocolor class="w-6 h-6" :class="state.logoColor" />
            </div>
          </template>

        </div>

        <h1 class="text-4xl font-semibold font-poppins" :class="state.textColor">
          {{ state.title }}
        </h1>
      </div>

      <!-- BODY -->
      <div class="flex flex-col h-full">
        <p class="text-lg font-light text-[#353535] p-3">
          {{ state.message }}
        </p>

        <!-- ACTIONS -->
        <div class="w-full flex justify-end pb-2 px-5 gap-2">
          <button
            class="px-4 py-1 rounded-md border border-[#353535]/70 text-[#353535] hover:bg-[#353535]/10"
            @click="cancel"
          >
            {{state.reject}}
          </button>
          <button
            class="px-4 py-1 rounded-md text-white"
            :class="state.buttonColor"
            @click="confirm"
          >
            {{ state.approve }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Albcaption_logo_nocolor from '../logos/Albcaption_logo_nocolor.vue'
import { useConfirm } from '@/stores/useConfirm'

const { state, confirm, cancel } = useConfirm()
</script>