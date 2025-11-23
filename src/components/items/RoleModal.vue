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
                        <!-- Header -->
                        <div class="sticky top-0 bg-white/90 backdrop-blur px-5 md:px-6 py-4 border-b border-primary/10 rounded-t-2xl flex items-center justify-between">
                            <div>
                                <h2 class="text-lg md:text-xl font-semibold text-primary font-poppins">
                                    {{ isEdit ? 'Redakto rolin' : 'Krijo një rol të ri' }}
                                </h2>
                                <p class="text-sm text-primary/70 font-poppins">
                                    {{ isEdit ? 'Përditëso detajet e rolit' : 'Shto një rol të ri në sistem' }}
                                </p>
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

                        <!-- Error Alert -->
                        <div v-if="errorMessage" class="m-5 md:m-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p class="text-sm text-red-700">{{ errorMessage }}</p>
                        </div>

                        <!-- Success Alert -->
                        <div v-if="successMessage" class="m-5 md:m-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p class="text-sm text-green-700">{{ successMessage }}</p>
                        </div>

                        <!-- Form Content -->
                        <form @submit.prevent="handleSubmit" class="p-5 md:p-6 space-y-6">
                            <!-- Name -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-primary font-poppins">
                                    Emri i rolit <span class="text-red-500">*</span>
                                </label>
                                <input
                                    v-model="form.name"
                                    type="text"
                                    placeholder="p.sh. Premium, Professional"
                                    class="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                    :disabled="isEdit"
                                    required
                                />
                            </div>

                            <!-- Price -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-primary font-poppins">
                                    Çmimi (USD) <span class="text-red-500">*</span>
                                </label>
                                <input
                                    v-model.number="form.price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="9.99"
                                    class="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                    required
                                />
                            </div>

                            <!-- Grid for numeric fields -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Videos per month -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-primary font-poppins">
                                        Videot në muaj <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model.number="form.videos_per_month"
                                        type="number"
                                        min="0"
                                        placeholder="10"
                                        class="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                        required
                                    />
                                </div>

                                <!-- Total minutes per month -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-primary font-poppins">
                                        Përgjithsej minutat në muaj <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model.number="form.total_minutes_per_month"
                                        type="number"
                                        min="0"
                                        placeholder="300"
                                        class="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                        required
                                    />
                                </div>

                                <!-- Max video duration -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-primary font-poppins">
                                        Kohëzgjatja maksimale e videos (minuta) <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model.number="form.max_video_duration"
                                        type="number"
                                        min="0"
                                        placeholder="60"
                                        class="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                        required
                                    />
                                </div>

                                <!-- Max file size -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-primary font-poppins">
                                        Madhësia maksimale e skedarit (MB) <span class="text-red-500">*</span>
                                    </label>
                                    <input
                                        v-model.number="form.max_file_size_mb"
                                        type="number"
                                        min="0"
                                        placeholder="500"
                                        class="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                        required
                                    />
                                </div>

                                <!-- SRT exports per month -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-primary font-poppins">
                                        Eksportet SRT në muaj
                                    </label>
                                    <div class="flex items-center gap-2">
                                        <input
                                            v-model.number="form.srt_exports_per_month"
                                            type="number"
                                            min="0"
                                            placeholder="Pafundësi"
                                            class="flex-1 px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                        />
                                        <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                @change="form.srt_exports_per_month = $event.target.checked ? 10 : 0"
                                                :checked="form.srt_exports_per_month === 10"
                                                class="w-4 h-4"
                                            />
                                            <span class="text-sm text-primary/70 font-poppins">Pafundësi</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3 pt-4 border-t border-primary/10">
                                <button
                                    type="button"
                                    @click="close"
                                    class="flex-1 px-4 py-2 border border-primary/20 rounded-lg text-primary font-medium hover:bg-primary/5 transition"
                                >
                                    Anulo
                                </button>
                                <button
                                    type="submit"
                                    :disabled="isLoading"
                                    class="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                >
                                    <svg v-if="isLoading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    {{ isEdit ? 'Përditëso rolin' : 'Krijo rolin' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import apiClient from '@/stores/apiClient'

const errorMessage = ref(null)
const successMessage = ref(null)
const isLoading = ref(false)
const panelRef = ref(null)

const props = defineProps({
    open: { type: Boolean, default: false },
    role: { type: Object, default: null }  // ✅ Add role prop
})

const emit = defineEmits(['update:open', 'saved'])

// ✅ Detect if editing or creating
const isEdit = computed(() => props.role !== null)

const form = ref({
    name: '',
    price: 0,
    videos_per_month: 0,
    total_minutes_per_month: 0,
    max_video_duration: 0,
    max_file_size_mb: 0,
    srt_exports_per_month: 0
})

// ✅ Watch for role changes and populate form
watch(() => props.role, (newRole) => {
    if (newRole) {
        // Edit mode - populate form
        form.value = { ...newRole }
    } else {
        // Create mode - reset form
        form.value = {
            name: '',
            price: 0,
            videos_per_month: 0,
            total_minutes_per_month: 0,
            max_video_duration: 0,
            max_file_size_mb: 0,
            srt_exports_per_month: 0
        }
    }
}, { deep: true })

async function handleSubmit() {
    errorMessage.value = null
    successMessage.value = null

    // Form validation
    if (!form.value.name || form.value.price < 0 || form.value.videos_per_month < 0 || form.value.total_minutes_per_month < 0 || form.value.max_video_duration < 0 || form.value.max_file_size_mb < 0) {
        errorMessage.value = 'Ju lutemi plotësoni të gjitha fushat e kërkuara me vlera të vlefshme.'
        return
    }

    isLoading.value = true

    try {
        let response
        
        // ✅ Check if editing or creating
        if (isEdit.value) {
            // Update existing role
            response = await apiClient.put(`/auth/admin/update-role/${form.value.id}`, {
                price: form.value.price,
                videos_per_month: form.value.videos_per_month,
                total_minutes_per_month: form.value.total_minutes_per_month,
                max_video_duration: form.value.max_video_duration,
                max_file_size_mb: form.value.max_file_size_mb,
                srt_exports_per_month: form.value.srt_exports_per_month
            }, {
                headers: { 
                    'Content-Type': 'application/json'
                }
            })
        } else {
            // Create new role
            response = await apiClient.post('/auth/admin/create-role', {
                name: form.value.name.trim(),
                price: form.value.price,
                videos_per_month: form.value.videos_per_month,
                total_minutes_per_month: form.value.total_minutes_per_month,
                max_video_duration: form.value.max_video_duration,
                max_file_size_mb: form.value.max_file_size_mb,
                srt_exports_per_month: form.value.srt_exports_per_month
            }, {
                headers: { 
                    'Content-Type': 'application/json'
                }
            })
        }
        
        if (response.data.success) {
            successMessage.value = isEdit.value ? 'Roli u përditësua me sukses.' : 'Roli u ruajt me sukses.'
            setTimeout(() => {
                emit('saved')
                close()
            }, 1500)
        } else {
            errorMessage.value = response.data.message || 'Ndodhi një gabim gjatë ruajtjes së rolit. Ju lutemi provo përsëri.'
        }
    } catch (error) {
        console.error('Error submitting form:', error)
        errorMessage.value = 'Ndodhi një gabim gjatë ruajtjes së rolit. Ju lutemi provo përsëri.'
    } finally {
        isLoading.value = false
    }
}

function close() {
    emit('update:open', false)
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