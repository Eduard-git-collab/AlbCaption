<template>
    <Teleport to="body">
        <transition name="fade">
            <div
            v-if="open"
            class="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
            @keydown.esc.prevent="close"
            @click.self="close"
            >
                <div class="w-full h-full flex items-start justify-center p-4 md:p-8 overflow-auto">
                    <div
                    ref="panelRef"
                    class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl ring-1 ring-primary/10"
                    role="dialog"
                    aria-modal="true"
                    >
                        <div class="top-0 bg-white/90 backdrop-blur px-5 md:px-6 py-4 border-b border-primary/10 rounded-t-2xl flex items-center justify-between">
                            <div class="w-full h-full">
                                <h2 class="text-lg md:text-xl font-semibold text-primary font-poppins">
                                    Raporto një problem
                                </h2>
                                <p class="text-sm text-primary/70 font-poppins">Raportoni problematikat që keni hasur me platformën</p>
                            </div>
                            <button
                                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-primary hover:bg-primary/5 transition"
                                @click="close"
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M6 6l12 12M18 6L6 18"/>
                                </svg>
                            </button>
                        </div>
                        <form @submit.prevent="handleSubmitReport">
                            <div class="px-5 md:px-6 py-4 font-poppins">
                                <!-- Error Alert -->
                                <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p class="text-sm text-red-700">{{ errorMessage }}</p>
                                </div>

                                <!-- Success Alert -->
                                <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p class="text-sm text-green-700">{{ successMessage }}</p>
                                </div>

                                <section class="py-4">
                                    <div>
                                        <label class="block text-primary/70 mb-3">Subjekti</label>
                                        <input
                                        v-model.trim="form.subject"
                                        type="text"
                                        class="w-full rounded-md bg-white border border-primary/15 focus:border-secondary focus:ring-2 focus:ring-secondary/40 px-3 py-2 text-sm text-primary outline-none"
                                        placeholder="Vendosni një titull për raportin tuaj"
                                        :disabled="busy"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-primary/70 mb-3 mt-4">Kategoria</label>
                                        <select 
                                          v-model="form.category" 
                                          class="w-full rounded-md bg-white border border-primary/15 focus:border-secondary focus:ring-2 focus:ring-secondary/40 px-3 py-2 text-sm outline-none"
                                          :class="form.category === '' ? 'text-primary/50' : 'text-primary'"
                                          :disabled="busy"
                                        >
                                          <option value="" disabled>Zgjidhni një kategori</option>
                                          <option value="bug" class="text-primary">Bug</option>
                                          <option value="feature_request" class="text-primary">Kërkesë për Feature</option>
                                          <option value="ui_ux" class="text-primary">UI/UX</option>
                                          <option value="performance" class="text-primary">Përformancë</option>
                                          <option value="other" class="text-primary">Tjetër</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-primary/70 mb-3 mt-4">Përshkrimi</label>
                                        <textarea
                                        v-model.trim="form.description"
                                        rows="4"
                                        class="w-full rounded-md bg-white border border-primary/15 focus:border-secondary focus:ring-2 focus:ring-secondary/40 px-3 py-2 text-sm text-primary outline-none resize-y"
                                        placeholder="Përshkruani problemin që keni hasur me sa më shumë detaje të jetë e mundur."
                                        :disabled="busy"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label class="block text-primary/70 mb-3 mt-4">Ngarko një skedar</label>
                                        
                                        <div 
                                          class="w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                                          :class="{ 
                                            'border-primary bg-[#F7FBF9]': isDragging, 
                                            'border-gray-300 hover:bg-[#FBFBFB]': !isDragging,
                                            'opacity-50 cursor-not-allowed': busy
                                          }"
                                          @dragover.prevent="isDragging = true"
                                          @dragleave.prevent="isDragging = false"
                                          @drop.prevent="onDrop"
                                          @click="busy ? null : triggerFileInput()"
                                        >
                                          <div class="flex flex-col items-center justify-center">
                                            <svg class="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p class="mb-2 text-lg font-poppins text-primary">
                                              {{ fileName ? 'Ngarko një skedar tjetër' : 'Ngarko skedarin' }}
                                            </p>
                                            <p class="mb-2 text-sm text-gray-500 font-poppins">
                                              Formatet e pranuara janë imazhe ose video
                                            </p>
                                            <span v-if="fileName" class="text-sm font-medium text-primary font-poppins">
                                              {{ fileName }}
                                            </span>
                                          </div>
                                          <input
                                            ref="fileInput"
                                            type="file"
                                            class="hidden"
                                            accept="image/*,video/*"
                                            @change="onFileChange"
                                            :disabled="busy"
                                          />
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div class="top-0 bg-white/90 px-5 md:px-6 py-4 border-t rounded-b-2xl border-primary/10 flex items-center justify-between">
                                <div class="text-[9px] text-primary/75 w-2/3 h-full">
                                    Të gjitha fushat (përveç skedarit) janë të detyrueshme për t'u plotësuar.<br>
                                </div>
                                <div class="w-fit h-fit">
                                    <button
                                    type="submit"
                                    class="px-3 py-1.5 text-sm bg-secondary text-primary rounded-md ring-1 ring-primary/10 hover:bg-[#7dd87b] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    :disabled="busy"
                                    >
                                        <span v-if="busy">Duke dërguar...</span>
                                        <span v-else>Dërgo</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import apiClient from '@/stores/apiClient'

const props = defineProps({
  open: { type: Boolean, default: false }
})

const form = reactive({
    subject: '',
    description: '',
    category: '',
})

const emit = defineEmits(['update:open', 'saved'])

const fileInput = ref(null)
const isDragging = ref(false)
const fileName = ref(null)
const selectedFile = ref(null)
const panelRef = ref(null)
const busy = ref(false)
const errorMessage = ref(null)
const successMessage = ref(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(event) {
  const file = event.target.files?.[0]
  if (file) {
    fileName.value = file.name
    selectedFile.value = file
  }
}

function onDrop(event) {
  isDragging.value = false
  const droppedFile = event.dataTransfer.files?.[0]
  if (droppedFile) {
    fileName.value = droppedFile.name
    selectedFile.value = droppedFile
  }
}

async function handleSubmitReport() {
  errorMessage.value = null
  successMessage.value = null

  // Validate form
  if (!form.subject.trim()) {
    errorMessage.value = 'Subjekti është i detyrueshëm'
    return
  }

  if (!form.description.trim()) {
    errorMessage.value = 'Përshkrimi është i detyrueshëm'
    return
  }

  if (!form.category) {
    errorMessage.value = 'Kategoria është e detyrueshme'
    return
  }

  busy.value = true

  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('title', form.subject.trim())
    formData.append('description', form.description.trim())
    formData.append('category', form.category)
    
    if (selectedFile.value) {
      formData.append('attachment', selectedFile.value)
    }

    const response = await apiClient.post('/auth/report-bug', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      successMessage.value = 'Raporti u dërgua me sukses! Faleminderit për përshtypjet tuaja.'
      
      setTimeout(() => {
        emit('saved')
        close()
      }, 1500)
    } else {
      errorMessage.value = response.data.error || 'Gabim gjatë dërgimit të raportit'
    }
  } catch (error) {
    console.error('[BUG-REPORT] Error:', error)
    
    if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error
    } else if (error.response?.status === 401) {
      errorMessage.value = 'Ju duhet të jeni i regjistruar për të dërguar një raport'
    } else {
      errorMessage.value = error.message || 'Gabim gjatë dërgimit të raportit. Provo përsëri.'
    }
  } finally {
    busy.value = false
  }
}

function resetForm() {
  form.subject = ''
  form.description = ''
  form.category = ''
  fileName.value = null
  selectedFile.value = null
  errorMessage.value = null
  successMessage.value = null
}
    
function close() {
  emit('update:open', false)
  resetForm()
}

function onKeyDown(e) {
  if (e.key === 'Escape' && props.open) close()
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>