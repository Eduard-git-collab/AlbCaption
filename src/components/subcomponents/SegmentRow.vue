<template>
  <div class="segment-row" :class="isCurrent ? 'scroll-mt-4' : ''">
    <!-- Non-current segment -->
    <div v-if="!isCurrent" @dblclick="jumpAndEdit" class="w-full flex flex-col p-1 opacity-40 text-sm cursor-pointer">
      <div class="flex items-center gap-2 px-2 py-1 bg-gray-100">
        <p class="text-xs font-poppins text-primary">
          {{ formatVideoTime(segment.startTime) }} - {{ formatVideoTime(segment.endTime) }}
        </p>
        <svg
          @click.stop="$emit('loop', segment)"
          class="w-4 h-4 cursor-pointer text-primary hover:text-secondary transition-all duration-200"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
        </svg>
        <svg
          @click.stop="$emit('play', segment)"
          class="w-4 h-4 cursor-pointer hover:text-secondary text-primary transition-all duration-200"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="px-2 py-1 bg-gray-100 wrap-break-word">
        <p class="line-clamp-2 font-poppins text-primary font-light">
          <span
            v-for="(word, wordIndex) in segment.words"
            :key="`${index}-${wordIndex}`"
            class="inline mr-1"
          >{{ word.text }}</span>
        </p>
      </div>
    </div>

    <!-- Current segment -->
    <div v-else class="w-full h-fit flex flex-col p-2 bg-secondary/20">
      <div class="w-full h-fit flex flex-row gap-2 items-center p-2 text-primary">
        <p>{{ formatVideoTime(segment.startTime) }} - {{ formatVideoTime(segment.endTime) }}</p>
        <svg
          @click="$emit('loop', segment)"
          class="w-5 h-5 cursor-pointer text-primary hover:text-secondary transition-all duration-200"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
        </svg>
        <svg
          @click="$emit('play', segment)"
          class="w-5 h-5 cursor-pointer text-primary hover:text-secondary transition-all duration-200"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
      </div>
      <div @dblclick="$emit('begin-edit', index)" class="w-full h-fit pr-4 wrap-break-word">
        <textarea
          v-if="segment.isEditing"
          v-model="localEditText"
          class="w-full border rounded p-1 text-primary resize-none overflow-hidden leading-relaxed"
          rows="1"
          @input="autoResize"
          @blur="handleSave"
          @keydown.enter.prevent="handleSave"
          ref="segmentTextarea"
        />
        <p v-else>
          <span
            v-for="(word, wordIndex) in segment.words"
            :key="`${index}-${wordIndex}`"
            :class="[
              'inline mr-1 text-primary font-medium',
              isWordActive(word) ? 'text-secondary bg-primary font-bold px-1 py-0.5 rounded-md' :
              isWordPast(word) ? 'text-gray-400' : ''
            ]"
          >{{ word.text }}&shy;</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  index: { type: Number, required: true },
  segment: { type: Object, required: true },
  currentVideoTime: { type: Number, required: true },
  isCurrent: { type: Boolean, default: false }
})
const emit = defineEmits(['play', 'loop', 'begin-edit', 'save', 'cancel-edit'])

const localEditText = ref(props.segment.editText ?? '')
const segmentTextarea = ref(null)
const pendingEdit = ref(false)

watch(() => props.segment.isEditing, (editing) => {
  if (editing) {
    localEditText.value = props.segment.text
    nextTick(() => {
      autoResize()
      segmentTextarea.value?.focus()
    })
  }
})

watch(() => props.isCurrent, (current) => {
  if (current && pendingEdit.value) {
    pendingEdit.value = false
    emit('begin-edit', props.index)
  }
})

function autoResize() {
  const el = segmentTextarea.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function isWordActive(word) {
  return props.currentVideoTime >= word.startTime && props.currentVideoTime < word.endTime
}
function isWordPast(word) {
  return props.currentVideoTime >= word.endTime
}

function formatVideoTime(seconds) {
  if (isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function handleSave() {
  emit('save', { index: props.index, text: localEditText.value })
}

function jumpAndEdit() {
  pendingEdit.value = true
  emit('play', props.segment)
}
</script>