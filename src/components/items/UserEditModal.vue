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
                                    Redakto përdoruesin
                                </h2>
                                <p class="text-sm text-primary/70 font-poppins">
                                    Përditëso të dhënat e përdoruesit
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
                            <!-- Full Name -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-primary font-poppins">
                                    Emri i plotë
                                </label>
                                <input
                                    v-model="displayUser.fullname"
                                    type="text"
                                    disabled
                                    class="w-full px-4 py-2 border border-primary/20 rounded-lg bg-primary/5 text-primary/60 cursor-not-allowed"
                                />
                            </div>

                            <!-- Username -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-primary font-poppins">
                                    Emri i përdoruesit
                                </label>
                                <input
                                    v-model="displayUser.username"
                                    type="text"
                                    disabled
                                    class="w-full px-4 py-2 border border-primary/20 rounded-lg bg-primary/5 text-primary/60 cursor-not-allowed"
                                />
                            </div>

                            <!-- Email -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-primary font-poppins">
                                    Email
                                </label>
                                <input
                                    v-model="displayUser.email"
                                    type="email"
                                    disabled
                                    class="w-full px-4 py-2 border border-primary/20 rounded-lg bg-primary/5 text-primary/60 cursor-not-allowed"
                                />
                            </div>

                            <!-- Grid for info fields -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Member Since -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-primary font-poppins">
                                        Anëtar që në
                                    </label>
                                    <input
                                        v-model="formattedCreatedAt"
                                        type="text"
                                        disabled
                                        class="w-full px-4 py-2 border border-primary/20 rounded-lg bg-primary/5 text-primary/60 cursor-not-allowed"
                                    />
                                </div>

                                <!-- Status -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-primary font-poppins">
                                        Statusi
                                    </label>
                                    <input
                                        v-model="statusDisplay"
                                        type="text"
                                        disabled
                                        class="w-full px-4 py-2 border border-primary/20 rounded-lg bg-primary/5 text-primary/60 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <!-- Deactivation Date (shown only if deactivated) -->
                            <div v-if="!displayUser.is_active && displayUser.deactivated_at" class="space-y-2">
                                <label class="block text-sm font-medium text-primary font-poppins">
                                    Data e çaktivizimit
                                </label>
                                <input
                                    v-model="formattedDeactivatedAt"
                                    type="text"
                                    disabled
                                    class="w-full px-4 py-2 border border-primary/20 rounded-lg bg-primary/5 text-primary/60 cursor-not-allowed"
                                />
                            </div>

                            <!-- Subscription -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-primary font-poppins">
                                    Aboniment
                                </label>
                                <input
                                    v-model="subscriptionDisplay"
                                    type="text"
                                    disabled
                                    class="w-full px-4 py-2 border border-primary/20 rounded-lg bg-primary/5 text-primary/60 cursor-not-allowed"
                                />
                            </div>

                            <!-- Current Role (Display) -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-primary font-poppins">
                                    Roli aktual
                                </label>
                                <input
                                    v-model="displayUser.role_name"
                                    type="text"
                                    disabled
                                    class="w-full px-4 py-2 border border-primary/20 rounded-lg bg-primary/5 text-primary/60 cursor-not-allowed"
                                />
                            </div>

                            <!-- Role (Editable) -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-primary font-poppins">
                                    Ndrysho rolin <span class="text-red-500">*</span>
                                </label>
                                <select
                                    v-model="form.role"
                                    class="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                                    required
                                >
                                    <option value="" disabled>Zgjidh një rol</option>
                                    <option
                                        v-for="role in availableRoles"
                                        :key="role.id"
                                        :value="role.id"
                                    >
                                        {{ role.name }}
                                    </option>
                                </select>
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
                                    Përditëso përdoruesin
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
const availableRoles = ref([])

const props = defineProps({
    open: { type: Boolean, default: false },
    user: { type: Object, default: null } 
})

const form = ref({
    role: ''
})

const emit = defineEmits(['update:open', 'saved'])

// Computed properties for displaying user data
const displayUser = computed(() => {
    return props.user || {}
})

const statusDisplay = computed(() => {
    return displayUser.value.is_active ? 'Aktiv' : 'I mbyllur'
})

const subscriptionDisplay = computed(() => {
    return displayUser.value.paypal_subscription_id ? 'Aktiv' : 'Nuk ka'
})

const formattedCreatedAt = computed(() => {
    if (!displayUser.value.created_at) return '—'
    try {
        return new Date(displayUser.value.created_at).toLocaleDateString('sq-AL', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    } catch {
        return '—'
    }
})

const formattedDeactivatedAt = computed(() => {
    if (!displayUser.value.deactivated_at) return '—'
    try {
        return new Date(displayUser.value.deactivated_at).toLocaleDateString('sq-AL', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    } catch {
        return '—'
    }
})

// Watch for user changes to set initial role
watch(() => props.user, (newUser) => {
    if (newUser && newUser.role_id) {
        form.value.role = newUser.role_id
    }
}, { immediate: true })

async function loadAvailableRoles() {
    try {
        const response = await apiClient.get('/auth/admin/roles')
        availableRoles.value = response.data || []
    } catch (error) {
        console.error('Error loading roles:', error)
        availableRoles.value = []
    }
}

async function handleSubmit(){
    errorMessage.value = null
    successMessage.value = null

    if (!form.value.role) {
        errorMessage.value = 'Roli është i detyrueshëm.'
        return
    }

    if (!props.user?.id) {
        errorMessage.value = 'ID e përdoruesit nuk është e disponueshme.'
        return
    }

    isLoading.value = true

    try{
        const response = await apiClient.put(`/auth/admin/update-user-role/${props.user.id}`, {
            roleId: form.value.role 
        }, {
            headers: {
                'Content-Type': 'application/json' 
            }
        })
        
        if(response.status === 200){
            successMessage.value = 'Roli i përdoruesit u përditësua me sukses.'
            isLoading.value = false
            emit('saved')
            setTimeout(() => {
                close()
            }, 1500)
        } else {
            throw new Error('Përditësimi dështoi.')
        }
    }
    catch (error) {
        errorMessage.value = error.response?.data?.message || 'Ndodhi një gabim gjatë përditësimit të përdoruesit.'
        isLoading.value = false
        return
    }
}

function close() {
  emit('update:open', false)
  resetForm()
}

watch(() => props.open, (isOpen) => {
    if (isOpen) {
        loadAvailableRoles()
    }
})

function resetForm() {
    form.value.role = props.user?.role_id || ''
    errorMessage.value = null
    successMessage.value = null
}

function onKeyDown(e) {
  if (e.key === 'Escape' && props.open) close()
}

onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    loadAvailableRoles()
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>