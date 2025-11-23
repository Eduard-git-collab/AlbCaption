<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
        @keydown.esc.prevent="close"
        @click.self="close"
      >
        <div class="w-full h-full flex items-start justify-center p-0 md:p-8 overflow-hidden">
          <div
            ref="panelRef"
            class="relative w-full h-full md:h-[90vh] max-w-5xl bg-white md:rounded-2xl shadow-2xl ring-1 ring-primary/10 flex flex-col md:flex-row overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <!-- Mobile Header -->
            <div class="md:hidden bg-white border-b border-primary/10 px-4 py-3 flex items-center justify-between shrink-0 z-20">
               <h2 class="text-lg font-semibold text-primary">Konfigurime</h2>
               <button @click="close" class="p-2 text-primary/70">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M6 6l12 12M18 6L6 18"/></svg>
               </button>
            </div>

            <!-- Desktop Header (Hidden on Mobile) -->
            <div class="hidden md:flex absolute top-0 left-0 right-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-primary/10 rounded-t-2xl items-center justify-between z-10">
              <div>
                <h2 class="text-xl font-semibold text-primary font-poppins">Konfigurime</h2>
                <p class="text-sm text-primary/70 font-poppins">Menaxhoni preferencat tuaja</p>
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

            <!-- Sidebar (Nav) -->
            <!-- Mobile: Horizontal Scroll. Desktop: Vertical Sidebar -->
            <div class="w-full md:w-56 border-b md:border-b-0 md:border-r border-primary/10 bg-primary/2 shrink-0 md:pt-24 md:pb-24 overflow-x-auto md:overflow-y-auto">
              <nav class="flex md:flex-col px-4 md:px-2 py-3 md:py-0 gap-2 md:gap-1 min-w-max md:min-w-0">
                <button
                  v-for="section in sections"
                  :key="section.id"
                  @click="activeSection = section.id"
                  :class="[
                    'text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 whitespace-nowrap',
                    activeSection === section.id
                      ? 'bg-secondary text-primary shadow-sm ring-1 ring-primary/5'
                      : 'text-primary/70 hover:bg-primary/5 hover:text-primary'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                  {{ section.label }}
                </button>
              </nav>
            </div>

            <!-- Content Area -->
            <div class="flex-1 md:pt-24 md:pb-24 overflow-y-auto px-5 md:px-8 py-6 font-poppins bg-white">
              <!-- Subscription Section -->
              <div v-if="activeSection === 'subscription'" class="space-y-6 pb-20 md:pb-0">
                <h3 class="text-lg font-semibold text-primary">Plani i Abonimit</h3>
                
                <div v-if="loadingSubscription" class="flex items-center justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                </div>

                <div v-else-if="subscriptionData" class="space-y-6">
                  <!-- Plan Card -->
                  <div class="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20">
                    <div class="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
                      <div>
                        <p class="text-xs text-primary/60 mb-1">Plani aktual</p>
                        <h4 class="text-2xl font-semibold text-primary capitalize">{{ subscriptionData.role.name }}</h4>
                      </div>
                      <div class="text-left sm:text-right">
                        <p class="text-3xl font-bold text-primary">${{ subscriptionData.role.price }}</p>
                        <p class="text-xs text-primary/60">/muaj</p>
                      </div>
                    </div>

                    <!-- Quota Info -->
                    <div class="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-secondary/20">
                      <div>
                        <p class="text-xs text-primary/60 mb-1">Video/muaj</p>
                        <p class="text-lg font-semibold text-primary">{{ subscriptionData.role.videos_per_month }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-primary/60 mb-1">Minuta/muaj</p>
                        <p class="text-lg font-semibold text-primary">{{ subscriptionData.role.total_minutes_per_month }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-primary/60 mb-1">Max. kohë</p>
                        <p class="text-lg font-semibold text-primary">{{ formatDuration(subscriptionData.role.max_video_duration) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-primary/60 mb-1">SRT Exports</p>
                        <p class="text-lg font-semibold text-primary">{{ subscriptionData.role.srt_exports_per_month === Infinity ? '∞' : subscriptionData.role.srt_exports_per_month }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Rollover Info -->
                  <div v-if="subscriptionData.rolloverSettings" class="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h5 class="text-sm font-semibold text-primary mb-3">Kuota e mbetur</h5>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p class="text-xs text-primary/60">Video</p>
                        <p class="text-lg font-semibold text-primary">{{ subscriptionData.usage.videos_rollover }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-primary/60">Minuta</p>
                        <p class="text-lg font-semibold text-primary">{{ subscriptionData.usage.minutes_rollover }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-primary/60">SRT</p>
                        <p class="text-lg font-semibold text-primary">{{ subscriptionData.usage.srt_exports_rollover }}</p>
                      </div>
                    </div>
                    <p class="text-xs text-primary/60 mt-2">Skadojnë: {{ formatDate(subscriptionData.usage.period_end) }}</p>
                  </div>

                  <!-- Billing Info -->
                  <div class="p-4 bg-primary/5 rounded-lg border border-primary/10 space-y-3">
                    <h5 class="text-sm font-semibold text-primary">Informacioni i faturimit</h5>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-primary/60">Faturimi i ardhshëm</p>
                        <p class="text-sm font-medium text-primary">{{ formatDate(subscriptionData.nextBillingTime) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-primary/60">Shuma</p>
                        <p class="text-sm font-medium text-primary">€{{ subscriptionData.role.price }}<span class="text-[10px] text-primary/40">.00</span></p>
                      </div>
                    </div>

                    <div>
                      <p class="text-xs text-primary/60">Cikli i faturimit</p>
                      <p class="text-sm font-medium text-primary">{{ subscriptionData.isYearly ? 'Vjetor' : 'Mujor' }}</p>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      class="flex-1 px-4 py-3 text-sm font-medium bg-secondary text-primary rounded-lg hover:bg-[#7dd87b] transition shadow-sm"
                      @click="goToUpgradePlan"
                    >
                      Përditësoni planin
                    </button>
                    <button
                      type="button"
                      class="flex-1 px-4 py-3 text-sm font-medium bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition shadow-sm"
                      @click="promptCancelSubscription"
                    >
                      Anuloni abonimin
                    </button>
                  </div>
                </div>

                <div v-else class="text-center py-8">
                  <p class="text-primary/60">Nuk keni abonime aktive</p>
                  <button
                    type="button"
                    class="mt-4 px-4 py-2 text-sm bg-secondary text-primary rounded-md hover:bg-[#7dd87b] transition"
                    @click="goToUpgradePlan"
                  >
                    Përditësoni planin
                  </button>
                </div>
              </div>

              <!-- Notifications Section -->
              <div v-if="activeSection === 'notifications'" class="space-y-6 pb-20 md:pb-0">
                <h3 class="text-lg font-semibold text-primary">Njoftimet</h3>
                
                <div class="space-y-2">
                  <!-- Reused checkbox styles -->
                  <label class="flex items-start gap-3 cursor-pointer hover:bg-primary/5 p-3 rounded-lg transition border border-transparent hover:border-primary/5">
                    <input 
                      v-model="settings.email_notifications_enabled" 
                      type="checkbox" 
                      class="w-5 h-5 mt-0.5 rounded border-primary/20 text-secondary focus:ring-secondary cursor-pointer"
                    />
                    <div>
                      <p class="text-sm font-medium text-primary">Njoftimet me email</p>
                      <p class="text-xs text-primary/60">Merrni përditësime në lidhje me aktivitetin tuaj</p>
                    </div>
                  </label>
                  
                  <label class="flex items-start gap-3 cursor-pointer hover:bg-primary/5 p-3 rounded-lg transition border border-transparent hover:border-primary/5">
                    <input 
                      v-model="settings.receive_usage_alerts" 
                      type="checkbox"
                      class="w-5 h-5 mt-0.5 rounded border-primary/20 text-secondary focus:ring-secondary cursor-pointer"
                    />
                    <div>
                      <p class="text-sm font-medium text-primary">Alertat e përdorimit</p>
                      <p class="text-xs text-primary/60">Njoftohu kur arrin në {{ settings.quota_alert_threshold }}% të kuotës</p>
                    </div>
                  </label>

                  <!-- ... (rest of notifications same pattern) ... -->
                </div>
              </div>

              <!-- Account Deactivation Section -->
              <div v-if="activeSection === 'deactivation'" class="space-y-6 pb-20 md:pb-0">
                <div>
                  <h3 class="text-lg font-semibold text-primary mb-1">Çaktivizimi i Llogarisë</h3>
                  <p class="text-sm text-primary/60">Veprim përfundimtar dhe i pakthyeshëm</p>
                </div>

                <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 mt-0.5">
                      <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-red-800">Paralajmërim: Veprim Përfundimtar</h4>
                      <div class="mt-2 text-sm text-red-700 space-y-1">
                        <p>Kjo do të fshijë përgjithmonë:</p>
                        <ul class="list-disc list-inside pl-1 opacity-90">
                          <li>Profilin dhe llogarinë tuaj</li>
                          <li>Të gjithë transkriptimet dhe skedarët</li>
                          <li>Videot dhe të dhënat e ngarkuara</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="pt-2">
                  <button
                    type="button"
                    class="w-full px-4 py-3.5 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 shadow-sm flex items-center justify-center gap-2"
                    @click="promptDeactivate"
                  >
                    Çaktivizoni llogarinë
                  </button>
                </div>
              </div>
            </div>


            <!-- Deactivate Account Modal (Nested) -->
            <div v-if="showDeactivateModal" class="absolute inset-0 z-[90] bg-white/80 backdrop-blur-md flex items-center justify-center p-4">
              <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl ring-1 ring-primary/10 border border-primary/5">
                 <!-- ... (same modal content as before, just simpler responsive sizing) ... -->
                 <div class="text-center space-y-4">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                       <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-primary">A jeni i sigurt?</h3>
                      <p class="text-sm text-primary/60 mt-1">Ky veprim nuk mund të zhbëhet.</p>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                       <button @click="cancelDeactivate" class="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50">Anulo</button>
                       <button @click="confirmDeactivate" :disabled="deactivateLoading" class="px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">
                          {{ deactivateLoading ? '...' : 'Fshi' }}
                       </button>
                    </div>
                 </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'
import apiClient from '@/stores/apiClient'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['update:open', 'saved'])

const router = useRouter()
const panelRef = ref(null)
const busy = ref(false)
const status = ref('')
const activeSection = ref('subscription')

const sessionUser = ref(null)
const dbSettings = ref(null)

// Modal Data
const showDeactivateModal = ref(false)
const deactivateLoading = ref(false)
const deactivateError = ref(null)

// Subscription data
const loadingSubscription = ref(false)
const subscriptionData = ref(null)
const showCancelModal = ref(false)
const cancelError = ref(null)
const cancelingSubscription = ref(false)

const sections = [
  { id: 'subscription', label: 'Abonimi' },
  { id: 'notifications', label: 'Njoftimet' },
  { id: 'deactivation', label: 'Çaktivizimi' }
]

const settings = reactive({
  email_notifications_enabled: true,
  weekly_digest_enabled: true,
  receive_usage_alerts: true,
  receive_billing_alerts: true,
  quota_alert_threshold: 80,
})

function formatDate(dateString) {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('sq-AL', { day: '2-digit', month: 'long', year: 'numeric' })
  } catch { return '-' }
}

function formatDuration(seconds) {
  if (!seconds) return '-'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

async function loadSubscriptionData() {
  if (!sessionUser.value) return
  loadingSubscription.value = true
  try {
    const { data: userData } = await supabase.from('users').select('role, id').eq('id', sessionUser.value.id).single()
    if(!userData) throw new Error("User not found")
    
    const { data: roleData } = await supabase.from('roles').select('*').eq('id', userData.role).single()
    const { data: usageData } = await supabase.from('user_monthly_usage').select('*').eq('user_id', sessionUser.value.id).single()
    const { data: subData } = await supabase.from('paypal_subscriptions').select('*').eq('user_id', sessionUser.value.id).single()
    const { data: rolloverData } = await supabase.from('role_rollover_settings').select('*').eq('role_id', userData.role).single()

    subscriptionData.value = {
      role: roleData,
      usage: usageData || { videos_rollover: 0, minutes_rollover: 0, srt_exports_rollover: 0, period_end: new Date().toISOString() },
      rolloverSettings: rolloverData,
      nextBillingTime: subData?.next_billing_time || new Date().toISOString(),
      isYearly: subData?.yearly || false,
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingSubscription.value = false
  }
}

async function loadSettings() {
  const { data: { session } } = await supabase.auth.getSession()
  sessionUser.value = session?.user || null
  if (!sessionUser.value) return

  try {
    const { data } = await supabase.from('user_settings').select('*').eq('user_id', sessionUser.value.id).single()
    if (data) {
      dbSettings.value = data
      Object.assign(settings, data)
    }
  } catch (err) {}
}

function goToUpgradePlan() {
  close()
  router.push('/pricing')
}

function promptCancelSubscription() {
  if(confirm("A jeni i sigurt që doni të anuloni abonimin?")) confirmCancelSubscription()
}

async function confirmCancelSubscription() {
  try {
    await apiClient.post('/api/paypal/cancel')
    alert("Abonimi u anulua.")
    await loadSubscriptionData()
  } catch (err) {
    alert("Gabim gjatë anulimit")
  }
}

function promptDeactivate() {
  showDeactivateModal.value = true
}

async function confirmDeactivate() {
  deactivateLoading.value = true
  try {
    await apiClient.post('/auth/deactivate-account')
    await supabase.auth.signOut()
    router.push('/')
  } catch (err) {
    alert("Gabim gjatë çaktivizimit")
  } finally {
    deactivateLoading.value = false
  }
}

function cancelDeactivate() {
  showDeactivateModal.value = false
}

function close() {
  emit('update:open', false)
}

watch(() => props.open, async (val) => {
  if (val) {
    activeSection.value = 'subscription'
    await loadSettings()
    await loadSubscriptionData()
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>