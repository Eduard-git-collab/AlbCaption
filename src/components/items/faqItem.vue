<template>
    <div class="overflow-hidden transition-all">
      <button
        class="w-full flex justify-between rounded-2xl items-center px-5 py-4 text-left hover:bg-gray-100 transition cursor-pointer group"
        @click="toggle"
      >
        <span 
        class="text-lg group-hover:text-secondary transition-all duration-500 text-kollektif-bold"
        :class="isOpen ? 'text-secondary' : 'text-primary'"
        >
          {{ question }}
        </span>
        <svg
          class="w-5 h-5 transform transition-transform duration-300 ease-out group-hover:text-secondary"
          :class="isOpen ? 'rotate-180 text-secondary' : 'text-primary'"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <transition
        name="expand"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @leave="onLeave"
      >
        <div v-show="isOpen" class="overflow-hidden">
          <div class="px-5 pb-5 text-gray-700 font-poppins text-base">
            {{ answer }}
          </div>
        </div>
      </transition>
      <div class="mx-5 h-px bg-gray-100 last:hidden"></div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    question: String,
    answer: String,
    isOpen: Boolean,
  })
  
  const emit = defineEmits(['toggle'])
  
  const toggle = () => {
    emit('toggle')
  }
  
  const onEnter = (el) => {
    el.style.height = '0'
    el.style.opacity = '0'
    el.offsetHeight 
    el.style.transition = 'height 0.3s ease-out, opacity 0.3s ease-out'
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
  }
  
  const onAfterEnter = (el) => {
    el.style.height = 'auto'
  }
  
  const onLeave = (el) => {
    el.style.height = el.scrollHeight + 'px'
    el.offsetHeight
    el.style.transition = 'height 0.3s ease-out, opacity 0.3s ease-out'
    el.style.height = '0'
    el.style.opacity = '0'
  }
  </script>