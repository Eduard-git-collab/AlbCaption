<template>
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="open"
          class="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
          @keydown.esc.prevent="close"
          @click.self="close"
        >
          <div class="w-full h-full flex items-start justify-center p-4 md:p-8 overflow-auto">
            <div
              ref="panelRef"
              class="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl ring-1 ring-primary/10 flex h-[80vh]"
              role="dialog"
              aria-modal="true"
            >
              <!-- Header -->
              <div class="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur px-5 md:px-6 py-4 border-b border-primary/10 rounded-t-2xl flex items-center justify-between z-10">
                <div>
                  <h2 class="text-lg md:text-xl font-semibold text-primary font-poppins">Konfigurime</h2>
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
  
              <!-- Sidebar -->
              <div class="w-48 border-r border-primary/10 pt-24 pb-24 overflow-y-auto bg-primary/2">
                <nav class="space-y-1 px-2">
                  <button
                    v-for="section in sections"
                    :key="section.id"
                    @click="activeSection = section.id"
                    :class="[
                      'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2',
                      activeSection === section.id
                        ? 'bg-secondary text-primary shadow-sm'
                        : 'text-primary/70 hover:bg-primary/5 hover:text-primary'
                    ]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="1" stroke-width="1.6" />
                    </svg>
                    {{ section.label }}
                  </button>
                </nav>
              </div>
  
              <!-- Content -->
              <div class="flex-1 pt-24 pb-24 overflow-y-auto px-5 md:px-8 py-6 font-poppins">
                <!-- Subscription Section -->
                <div v-if="activeSection === 'subscription'" class="space-y-6">
                  <h3 class="text-lg font-semibold text-primary">Plani i Abonimit</h3>
                  
                  <div v-if="loadingSubscription" class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                  </div>
  
                  <div v-else-if="subscriptionData" class="space-y-6">
                    <!-- Plan Card -->
                    <div class="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20">
                      <div class="flex items-start justify-between mb-4">
                        <div>
                          <p class="text-xs text-primary/60 mb-1">Plani aktual</p>
                          <h4 class="text-2xl font-semibold text-primary capitalize">{{ subscriptionData.role.name }}</h4>
                        </div>
                        <div class="text-right">
                          <p class="text-3xl font-bold text-primary">${{ subscriptionData.role.price }}</p>
                          <p class="text-xs text-primary/60">/muaj</p>
                        </div>
                      </div>
  
                      <!-- Quota Info -->
                      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-secondary/20">
                        <div>
                          <p class="text-xs text-primary/60 mb-1">Video/muaj</p>
                          <p class="text-lg font-semibold text-primary">{{ subscriptionData.role.videos_per_month }}</p>
                        </div>
                        <div>
                          <p class="text-xs text-primary/60 mb-1">Minuta/muaj</p>
                          <p class="text-lg font-semibold text-primary">{{ subscriptionData.role.total_minutes_per_month }}</p>
                        </div>
                        <div>
                          <p class="text-xs text-primary/60 mb-1">Max. kohëzgjatje</p>
                          <p class="text-lg font-semibold text-primary">{{ formatDuration(subscriptionData.role.max_video_duration) }}</p>
                        </div>
                        <div>
                          <p class="text-xs text-primary/60 mb-1">Max. madhësia</p>
                          <p class="text-lg font-semibold text-primary">{{ subscriptionData.role.max_file_size_mb }}MB</p>
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
                          <p class="text-xs text-primary/60">Video të mbetura</p>
                          <p class="text-lg font-semibold text-primary">{{ subscriptionData.usage.videos_rollover }}</p>
                        </div>
                        <div>
                          <p class="text-xs text-primary/60">Minuta të mbetura</p>
                          <p class="text-lg font-semibold text-primary">{{ subscriptionData.usage.minutes_rollover }}</p>
                        </div>
                        <div>
                          <p class="text-xs text-primary/60">SRT të mbetura</p>
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
                    <div class="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        class="flex-1 px-4 py-2.5 text-sm font-medium bg-secondary text-primary rounded-md hover:bg-[#7dd87b] transition"
                        @click="goToUpgradePlan"
                      >
                        Përditësoni planin
                      </button>
                      <button
                        type="button"
                        class="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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
                <div v-if="activeSection === 'notifications'" class="space-y-6">
                  <h3 class="text-lg font-semibold text-primary">Njoftimet</h3>
                  
                  <div class="space-y-4">
                    <label class="flex items-start gap-3 cursor-pointer hover:bg-primary/5 p-3 rounded transition">
                      <input 
                        v-model="settings.email_notifications_enabled" 
                        type="checkbox" 
                        class="w-4 h-4 mt-1 rounded border-primary/20 text-secondary cursor-pointer"
                      />
                      <div>
                        <p class="text-sm font-medium text-primary">Njoftimet me email</p>
                        <p class="text-xs text-primary/60">Merrni përditësime në lidhje me aktivitetin tuaj</p>
                      </div>
                    </label>
                    
                    <label class="flex items-start gap-3 cursor-pointer hover:bg-primary/5 p-3 rounded transition">
                      <input 
                        v-model="settings.receive_usage_alerts" 
                        type="checkbox"
                        class="w-4 h-4 mt-1 rounded border-primary/20 text-secondary cursor-pointer"
                      />
                      <div>
                        <p class="text-sm font-medium text-primary">Alertat e përdorimit</p>
                        <p class="text-xs text-primary/60">Njoftohu kur arrin në {{ settings.quota_alert_threshold }}% të kuotës</p>
                      </div>
                    </label>
  
                    <label class="flex items-start gap-3 cursor-pointer hover:bg-primary/5 p-3 rounded transition">
                      <input 
                        v-model="settings.receive_billing_alerts" 
                        type="checkbox"
                        class="w-4 h-4 mt-1 rounded border-primary/20 text-secondary cursor-pointer"
                      />
                      <div>
                        <p class="text-sm font-medium text-primary">Alertat e faturimit</p>
                        <p class="text-xs text-primary/60">Njoftimet për përditësimet e abonimit</p>
                      </div>
                    </label>
  
                    <label class="flex items-start gap-3 cursor-pointer hover:bg-primary/5 p-3 rounded transition">
                      <input 
                        v-model="settings.weekly_digest_enabled" 
                        type="checkbox"
                        class="w-4 h-4 mt-1 rounded border-primary/20 text-secondary cursor-pointer"
                      />
                      <div>
                        <p class="text-sm font-medium text-primary">Përmbledhja javore</p>
                        <p class="text-xs text-primary/60">Merrni një përmbledhje të qendrimit tuaj</p>
                      </div>
                    </label>
  
                    <div class="pt-4 border-t border-primary/10">
                      <label class="block text-sm font-medium text-primary mb-3">Pragu i alertit kuote</label>
                      <div class="flex items-center gap-4">
                        <input 
                          v-model.number="settings.quota_alert_threshold" 
                          type="range" 
                          min="10" 
                          max="90" 
                          step="10"
                          class="flex-1 h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer"
                        />
                        <span class="text-sm font-medium text-primary w-12 text-right">{{ settings.quota_alert_threshold }}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Account Deactivation Section -->
<div v-if="activeSection === 'deactivation'" class="space-y-6">
  <div>
    <h3 class="text-lg font-semibold text-primary mb-2">Çaktivizimi i Llogares</h3>
    <p class="text-sm text-primary/60 mb-6">Veprim përfundimtar dhe i pakthyeshëm</p>
  </div>

  <!-- Warning Card -->
  <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div>
        <h4 class="text-sm font-medium text-red-800">Paralajmërim: Veprim Përfundimtar</h4>
        <div class="mt-2 text-sm text-red-700">
          <p>Kjo do të fshijë përgjithmonë:</p>
          <ul class="list-disc list-inside mt-1">
            <li>Profilin dhe llogarinë tuaj</li>
            <li>Të gjithë transkriptimet dhe skedarët</li>
            <li>Të gjithë videot dhe të dhënat e ngarkuara</li>
            <li>Përvojat dhe preferencat tuaja</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-3 pt-4">
    <button
      type="button"
      class="w-full px-4 py-3 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
      @click="promptDeactivate"
    >
      <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      Çaktivizoni llogarinë
    </button>
    <p class="text-xs text-primary/50 text-center">Ky veprim nuk mund të kthehet</p>
  </div>
  </div>
  </div>


              <!-- Deactivate Account Modal -->
              <div v-if="showDeactivateModal" class="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl ring-1 ring-primary/10">
                  <div class="flex items-start gap-3 mb-4">
                    <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <h3 class="text-lg font-semibold text-primary">Çaktivizoni llogarinë</h3>
                      <p class="text-sm text-red-600 font-medium mt-1">Ky veprim nuk mund të kthehet</p>
                    </div>
                  </div>

                  <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 class="text-sm font-semibold text-red-800 mb-2">A jeni 100% i sigurt?</h4>
                    <p class="text-sm text-red-700 mb-3">Duke vazhduar, ju do të:</p>
                    <ul class="space-y-1">
                      <li class="text-sm text-red-700 flex items-start gap-2">
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span>Fshini përgjithmonë llogarinë</span>
                      </li>
                      <li class="text-sm text-red-700 flex items-start gap-2">
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span>Humbni të gjithë dhenat</span>
                      </li>
                      <li class="text-sm text-red-700 flex items-start gap-2">
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span>Të mos jetë në gjendje të kthehet</span>
                      </li>
                    </ul>
                  </div>

                  <p v-if="deactivateError" class="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded">{{ deactivateError }}</p>

                  <div class="flex gap-3">
                    <button
                      type="button"
                      class="flex-1 px-4 py-2.5 text-sm font-medium bg-white border border-primary/15 rounded-lg hover:bg-primary/5 transition"
                      @click="cancelDeactivate"
                      :disabled="deactivateLoading"
                    >
                      Anulo
                    </button>
                    <button
                      type="button"
                      class="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      @click="confirmDeactivate"
                      :disabled="deactivateLoading"
                    >
                      {{ deactivateLoading ? 'Duke mbyllur' : 'Mbyllni llogarinë' }}
                    </button>
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
    { id: 'deactivation', label: 'Çaktivizimi' }
  ]
  
  const settings = reactive({
    // Notifications
    email_notifications_enabled: true,
    weekly_digest_enabled: true,
    receive_usage_alerts: true,
    receive_billing_alerts: true,
    quota_alert_threshold: 80,
  
    // Appearance
    preferred_language: 'sq-AL',
    timezone: 'UTC',
    theme: 'light',
    items_per_page: 20,
    compact_view: false,
  
    // Security
    profile_visibility: 'private',
    two_factor_enabled: false,
    two_factor_method: null,
    allow_api_access: false,
  
    // Processing
    default_language_code: 'sq-AL',
    auto_generate_srt: true,
    default_transcription_accuracy: 'standard',
  
    // Data Management
    auto_delete_after_days: null,
    auto_delete_transcripts: false,
    backup_enabled: false,
    backup_frequency: 'weekly'
  })
  
  function formatDate(dateString) {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('sq-AL', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      })
    } catch {
      return '-'
    }
  }
  
  function formatDuration(seconds) {
    if (!seconds) return '-'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
  
  function getPercentage(used, quota) {
    if (!quota) return 0
    const percentage = (used / quota) * 100
    return Math.min(100, Math.max(0, percentage))
  }
  
  async function loadSubscriptionData() {
    if (!sessionUser.value) return
    loadingSubscription.value = true
  
    try {
      // Get user with role info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, id')
        .eq('id', sessionUser.value.id)
        .single()
  
      if (userError) throw userError
  
      // Get role details
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('*')
        .eq('id', userData.role)
        .single()
  
      if (roleError) throw roleError
  
      // Get user monthly usage
      const { data: usageData, error: usageError } = await supabase
        .from('user_monthly_usage')
        .select('*')
        .eq('user_id', sessionUser.value.id)
        .single()
  
      if (usageError && usageError.code !== 'PGRST116') throw usageError
  
      // Get PayPal subscription info for billing details
      const { data: subData, error: subError } = await supabase
        .from('paypal_subscriptions')
        .select('*')
        .eq('user_id', sessionUser.value.id)
        .single()
  
      if (subError && subError.code !== 'PGRST116') throw subError
  
      // Get rollover settings
      const { data: rolloverData, error: rolloverError } = await supabase
        .from('role_rollover_settings')
        .select('*')
        .eq('role_id', userData.role)
        .single()
  
      if (rolloverError && rolloverError.code !== 'PGRST116') {
        console.log('No rollover settings found')
      }
  
      subscriptionData.value = {
        role: roleData,
        usage: usageData || {
          videos_used: 0,
          videos_quota: roleData.videos_per_month,
          videos_rollover: 0,
          minutes_used: 0,
          minutes_quota: roleData.total_minutes_per_month,
          minutes_rollover: 0,
          srt_exports_used: 0,
          srt_exports_quota: roleData.srt_exports_per_month,
          srt_exports_rollover: 0,
          period_end: new Date().toISOString()
        },
        rolloverSettings: rolloverData,
        nextBillingTime: subData?.next_billing_time || new Date().toISOString(),
        isYearly: subData?.yearly || false,
        cycleCount: subData?.cycle_count || 0
      }
    } catch (err) {
      console.error('Error loading subscription:', err)
      subscriptionData.value = null
    } finally {
      loadingSubscription.value = false
    }
  }
  
  async function loadSettings() {
    const { data: { session } } = await supabase.auth.getSession()
    sessionUser.value = session?.user || null
    if (!sessionUser.value) return
  
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', sessionUser.value.id)
        .single()
  
      if (!error && data) {
        dbSettings.value = data
        Object.keys(settings).forEach(key => {
          if (key in data) {
            settings[key] = data[key]
          }
        })
      }
    } catch (err) {
      console.log('No existing settings')
    }
  }
  
  async function save() {
    if (!sessionUser.value) return
    busy.value = true
    status.value = 'Duke ruajtur...'
  
    try {
      const payload = { ...settings, user_id: sessionUser.value.id, updated_at: new Date().toISOString() }
  
      if (dbSettings.value?.id) {
        const { error } = await supabase
          .from('user_settings')
          .update(payload)
          .eq('id', dbSettings.value.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('user_settings')
          .insert([payload])
          .select()
          .single()
        if (error) throw error
        dbSettings.value = data
      }
  
      status.value = 'Ruajtur!'
      emit('saved')
      setTimeout(() => {
        status.value = ''
        close()
      }, 900)
    } catch (err) {
      status.value = err.message || 'Dështoi'
    } finally {
      busy.value = false
    }
  }
  
  function handleTwoFactorToggle() {
    if (settings.two_factor_enabled && !settings.two_factor_method) {
      settings.two_factor_method = 'email'
    }
  }

  function goToUpgradePlan() {
    close()
    router.push('/pricing')
  }
  
  function promptCancelSubscription() {
    showCancelModal.value = true
    cancelError.value = null
  }
  
  async function confirmCancelSubscription() {
    cancelingSubscription.value = true
    cancelError.value = null

    try {
      console.log('[FRONTEND] Cancelling subscription...')

      const response = await apiClient.post('/api/paypal/cancel')

      console.log('[FRONTEND] ✓ Cancellation initiated:', response.data)

      showCancelModal.value = false
      status.value = 'Abonimi u anulua me sukses!'
      
      setTimeout(async () => {
        await loadSubscriptionData()
      }, 2000)
      
      setTimeout(() => {
        status.value = ''
      }, 3000)

    } catch (err) {
      console.error('[FRONTEND] Error:', err)
      cancelError.value = err.response?.data?.message || err.message || 'Anulimi dështoi'
    } finally {
      cancelingSubscription.value = false
    }
  }

  // Deactivate account logic
  function promptDeactivate() {
    showDeactivateModal.value = true
    deactivateError.value = null
  }

  async function handleSignout() {
    await supabase.auth.signOut()
  }

  async function confirmDeactivate() {
    deactivateLoading.value = true
    deactivateError.value = null
    try {
      const response = await apiClient.post('/auth/deactivate-account')
      console.log('Account deactivated:', response.data)
      
      showDeactivateModal.value = false
      status.value = 'Llogara u çaktivizua. Po ridrejtoheni...'
      
      setTimeout(async () => {
        await handleSignout()
        router.push('/')
      }, 1500)
    } catch (err) {
      console.error('Error during account deactivation:', err)
      deactivateError.value = err.response?.data?.message || err.message || 'Çaktivizimi dështoi'
    } finally {
      deactivateLoading.value = false
    }
  }

  function cancelDeactivate() {
    showDeactivateModal.value = false
    deactivateError.value = null
  }
  
  function close() {
    emit('update:open', false)
  }
  
  watch(
    () => props.open,
    async (val) => {
      if (val) {
        activeSection.value = 'subscription'
        status.value = ''
        await loadSettings()
        await loadSubscriptionData()
      }
    },
    { immediate: false }
  )
  
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