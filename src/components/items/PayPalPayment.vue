<script setup>
import { defineProps, defineEmits, computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient'
import Logo_lines from '../logos/Logo_lines.vue'
import PaypalSubscribeButton from '../PaypalSubscribeButton.vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  planId: { type: String, default: null },
  plan: { type: Object, default: null },
  isYearly: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])
function close() { emit('close') }

const router = useRouter()

// Auth/session state
const isAuthed = ref(false)
const sessionUser = ref(null)
// Loading gate to avoid showing login while we don't know yet
const checkingSession = ref(true)

// User info state (for the "Detajet e Përdoruesit" card)
const userInfo = ref({
  username: '',
  email: '',
  name: '',
  loading: true
})

function clearUserInfo() {
  userInfo.value = { username: '', email: '', name: '', loading: false }
}

async function ensureSession() {
  // Try getSession
  const s1 = await supabase.auth.getSession()
  if (s1?.data?.session?.user) return s1.data.session

  // Try refresh (may no-op if already fresh)
  try { await supabase.auth.refreshSession() } catch {}
  const s2 = await supabase.auth.getSession()
  if (s2?.data?.session?.user) return s2.data.session

  // Fallback to getUser (sometimes returns user when getSession edge cases occur)
  const u = await supabase.auth.getUser()
  if (u?.data?.user) return { user: u.data.user }

  return null
}

async function loadUserInfo() {
  checkingSession.value = true
  userInfo.value.loading = true
  try {
    const sess = await ensureSession()
    if (!sess?.user) {
      sessionUser.value = null
      isAuthed.value = false
      clearUserInfo()
      return
    }
    sessionUser.value = sess.user
    isAuthed.value = true

    // Load profile by UUID id
    const { data, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', sess.user.id)
      .single()

    if (dbError || !data) {
      // Fallback to auth metadata if profile row not found
      userInfo.value = {
        username: sess.user.user_metadata?.username || '',
        email: sess.user.email || 'N/A',
        name: [sess.user.user_metadata?.name, sess.user.user_metadata?.surname].filter(Boolean).join(' ') || '',
        loading: false
      }
    } else {
      userInfo.value = {
        username: data.username || sess.user.user_metadata?.username || '',
        email: data.email || sess.user.email || 'N/A',
        name: [data.name, data.surname].filter(Boolean).join(' ') || '',
        loading: false
      }
    }
  } catch (e) {
    console.error('Failed to fetch user details:', e)
    sessionUser.value = null
    isAuthed.value = false
    clearUserInfo()
  } finally {
    checkingSession.value = false
  }
}

// Refresh when the modal opens
watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    await loadUserInfo()
  } else {
    clearUserInfo()
  }
})

// React to auth state changes (switch account, sign out, token refresh)
let authSubscription
onMounted(async () => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_OUT') {
      sessionUser.value = null
      isAuthed.value = false
      clearUserInfo()
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
      await loadUserInfo()
    }
  })
  authSubscription = subscription

  if (props.open) {
    await loadUserInfo()
  }
})

onUnmounted(() => {
  authSubscription?.unsubscribe?.()
})

// ====================
// Login form (template from Authentication.vue, simplified to login-only)
// ====================
const loginData = ref({
  emailOrUsername: '',
  password: ''
})
const loginLoading = ref(false)
const loginError = ref(null)
const loginSuccess = ref(null)

// Helper: check if string is an email
const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)

// Fetch email by username (from your Authentication page)
const getUserEmailByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('username', username)
      .single()
    if (error || !data) return null
    return data.email
  } catch (err) {
    console.error('Error getting user email by username:', err)
    return null
  }
}

async function handleSignIn(e) {
  e?.preventDefault?.()
  loginLoading.value = true
  loginError.value = null
  loginSuccess.value = null

  try {
    let emailToUse = loginData.value.emailOrUsername

    // If not an email, treat as username and resolve to email
    if (!isEmail(loginData.value.emailOrUsername)) {
      const email = await getUserEmailByUsername(loginData.value.emailOrUsername)
      if (!email) {
        throw new Error('Username nuk u gjet. Të lutem kontrolloni username-in ose përdorni email-in.')
      }
      emailToUse = email
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: loginData.value.password
    })
    if (signInError) throw signInError

    // Reload session/profile and switch UI to authed mode
    await loadUserInfo()

    loginSuccess.value = 'Hytje e suksesshme!'
    // Optional: clear fields
    loginData.value.password = ''
  } catch (err) {
    loginError.value = err.message || 'Emaili/username ose passwordi gabuar.\nProvo përsëri.'
  } finally {
    loginLoading.value = false
  }
}

function goToSignup() {
  router.push('/signup')
  // Optionally close the modal:
  // close()
}

// ====================
// Pricing computed values
// ====================
const currentPrice = computed(() => !props.plan ? null : (props.isYearly ? props.plan.price.yearly : props.plan.price.monthly))
const currentDecimal = computed(() => !props.plan ? null : (props.isYearly ? props.plan.decimal.yearly : props.plan.decimal.monthly))
const originalPrice = computed(() => (!props.plan || !props.isYearly) ? null : props.plan.price.monthly)
const originalDecimal = computed(() => (!props.plan || !props.isYearly) ? null : props.plan.decimal.monthly)
const discount = computed(() => (!props.plan || !props.isYearly) ? null : props.plan.percentSaved)
const yearlyTotal = computed (() => (!props.plan || !props.isYearly) ? null : props.plan.yearlytotal.yearly)

const formatDateSq = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    const supported = Intl?.DateTimeFormat?.supportedLocalesOf?.(['sq-AL', 'sq']) ?? [];
    if (supported.length > 0) {
      return new Intl.DateTimeFormat('sq-AL', options).format(date);
    }
  } catch (_) {
  }
  const monthsSq = [
    'janar','shkurt','mars','prill','maj','qershor',
    'korrik','gusht','shtator','tetor','nëntor','dhjetor'
  ];
  return `${date.getDate()} ${monthsSq[date.getMonth()]} ${date.getFullYear()}`;
};

const nextBillingDate = computed(() => {
  const today = new Date();
  const nextDate = new Date(today);
  if (props.isYearly) {
    nextDate.setFullYear(today.getFullYear() + 1);
  } else {
    const currentDay = today.getDate();
    nextDate.setMonth(today.getMonth() + 1);
    if (currentDay === 31) {
      const lastDayOfNextMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
      if (lastDayOfNextMonth < 31) {
        nextDate.setDate(1);
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
    }
  }
  return formatDateSq(nextDate);
});


const billingCycle = computed(() => (props.isYearly ? 'Vjetore' : 'Mujore'))
</script>

<template>
  <!-- Top-level stacking context -->
  <div v-if="open" class="fixed inset-0 z-[1000] flex items-center justify-center">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/30 backdrop-blur-sm"
      @click="close"
    />
    <!-- Content wrapper -->
    <div class="w-full h-full md:w-[1200px] md:h-[700px] px-4 md:px-8 py-6 relative z-10">
      <div class="w-full h-full bg-white relative rounded-xl shadow-xl overflow-hidden">
        <!-- Close button -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer z-20"
          @click="close"
          aria-label="Mbyll"
        >
          ✕
        </button>

        <div class="w-full h-full flex flex-col lg:flex-row">
          <!-- Left -->
          <div class="w-full lg:w-1/3 h-full bg-primary rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none relative">
            <div class="h-full z-10 relative w-full">
              <div class="h-full w-full py-8 px-6 flex justify-between flex-col">
                <div class="flex w-full h-full flex-col gap-4">
                  <h1 class="text-3xl md:text-4xl text-kollektif-bold font-bold text-secondary relative inline-block w-fit">
                    Abonohuni
                    <span class="relative">
                      tani
                      <svg class="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 12" preserveAspectRatio="none">
                        <path d="M 0 8 Q 25 2 50 6 T 100 4" stroke="#9FE29E" stroke-width="4" fill="none" stroke-linecap="round"/>
                      </svg>
                    </span>
                  </h1>

                  <span class="text-white text-sm font-poppins font-thin">
                    Bashkohu me AlbCaptions, mënyra më e shpejtë për të bërë video me cilësi profesionale që tërheqin dhe mbajnë vëmendjen e audiencës tënde
                  </span>

                  <span class="text-secondary text-lg font-poppins h-fit w-fit rounded-xl">
                    Plani i zgjedhur: {{ plan?.badgeText || plan?.key || '—' }}
                  </span>

                  <ul class="mt-2 space-y-1">
                    <li
                      v-for="(f, idx) in (plan?.planfeatures || [])"
                      :key="idx"
                      class="text-secondary font-poppins text-sm"
                    >
                      {{ f.label }}: {{ f.value }} <span v-if="f.locked" aria-hidden="true">🔒</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Logo_lines class="absolute bottom-0 left-0 w-full z-0 pointer-events-none"/>
          </div>

          <!-- Right -->
          <div class="w-full lg:w-2/3 h-full rounded-b-xl lg:rounded-r-xl flex flex-col p-6 relative m-2">
            <!-- Session loading gate -->
            <div v-if="checkingSession" class="flex-1 flex items-center justify-center text-primary">
                <span class="dot dot-1">.</span>
                <span class="dot dot-2">.</span>
                <span class="dot dot-3">.</span>
            </div>

            <!-- If NOT authenticated, show Login Form -->
            <div v-else-if="!isAuthed" class="flex-1 flex items-center justify-center">
              <form @submit="handleSignIn" class="w-full max-w-md space-y-4">
                <h2 class="text-2xl text-primary text-kollektif-bold">Hyr për të vazhduar</h2>

                <div v-if="loginError" class="bg-red-300 border border-red-400 text-xs text-red-700 px-3 py-2 rounded-lg">
                  {{ loginError }}
                </div>
                <div v-if="loginSuccess" class="bg-green-300 border border-green-400 text-green-700 px-3 py-2 rounded-lg">
                  {{ loginSuccess }}
                </div>

                <input
                  type="text"
                  v-model="loginData.emailOrUsername"
                  class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="email ose username"
                  required
                />
                <input
                  type="password"
                  v-model="loginData.password"
                  class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Fjalëkalimi"
                  required
                />
                <button
                  type="submit"
                  class="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-primary cursor-pointer duration-300 transition-colors disabled:opacity-60"
                  :disabled="loginLoading"
                >
                  <span v-if="loginLoading">Hyr...</span>
                  <span v-else>Hyr</span>
                </button>

                <div class="text-center">
                  <button type="button" @click="goToSignup" class="text-primary underline hover:text-secondary">
                    Nuk ke llogari? Regjistrohu
                  </button>
                </div>
              </form>
            </div>

            <!-- If authenticated, show user and pricing details + PayPal -->
            <div v-else class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- User Details Section -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-3 font-kollektif-bold">
                  Detajet e Përdoruesit
                </h3>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-600 text-sm">Emri:</span>
                    <span class="text-gray-800 font-medium">
                      {{ userInfo.loading ? 'Duke u ngarkuar...' : (userInfo.name || 'N/A') }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-600 text-sm">Email:</span>
                    <span class="text-gray-800 font-medium">
                      {{ userInfo.loading ? 'Duke u ngarkuar...' : (userInfo.email || 'N/A') }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-600 text-sm">Përdoruesi:</span>
                    <span class="text-gray-800 font-medium">
                      {{ userInfo.loading ? 'Duke u ngarkuar...' : (userInfo.username || 'N/A') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Pricing Details Section -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-3 font-kollektif-bold">
                  Detajet e Çmimit
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Plani:</span>
                    <span class="font-medium text-gray-800">{{ plan?.badgeText }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Cikli i Faturimit:</span>
                    <span class="font-medium text-gray-800">{{ billingCycle }}</span>
                  </div>

                  <div v-if="isYearly && originalPrice" class="flex justify-between items-center">
                    <span class="text-gray-600">Çmimi Mujor:</span>
                    <span class="text-gray-500 line-through text-sm">
                      {{ plan?.currency }}{{ originalPrice }}.{{ originalDecimal }}
                    </span>
                  </div>

                  <div class="flex justify-between items-center text-lg text-kollektiff">
                    <span class="text-gray-800 font-semibold">Çmimi:</span>
                    <div class="flex items-baseline gap-1">
                      <span class="text-2xl font-bold text-primary">
                        {{ plan?.currency }}{{ currentPrice }}
                      </span>
                      <span class="text-lg text-gray-600">.{{ currentDecimal }}</span>
                      <span class="text-sm text-gray-500">/{{ isYearly ? 'muaj' : 'muaj' }}</span>
                    </div>
                  </div>
                  <div class="flex items-baseline justify-end w-full gap-1">
                    <span 
                        v-if="isYearly" 
                        class="text-[10px] text-gray-500"
                        >
                        *€{{ yearlyTotal }} faturuar në vit*
                    </span>
                  </div>

                  <div v-if="isYearly && discount" class="flex justify-center">
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Kurseni {{ discount }}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- Billing Information Section -->
              <div class="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <h3 class="text-lg font-semibold text-gray-800 mb-3 font-kollektif-bold">
                  Informacioni i Faturimit
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Faturimi i Ardhshëm:</span>
                    <span class="font-medium text-gray-800 capitalize">{{ nextBillingDate }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Metoda e Pagesës:</span>
                    <span class="font-medium text-gray-800">PayPal</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- PayPal Button Section -->
            <div class="flex flex-col items-center gap-3">
              <div class="w-fit">
                <!-- Only show PayPal button when authenticated -->
                <PaypalSubscribeButton v-if="isAuthed && planId" :key="planId" :planId="planId" />
              </div>
              
              <div class="text-center text-xs text-gray-500 max-w-md px-4">
                <p v-if="!isAuthed">
                  
                </p>
                <p v-else>
                  Duke vazhduar, ju pranoni 
                  <a href="/terms" class="text-primary hover:underline" target="_blank">Kushtet e Përdorimit</a> 
                  dhe 
                  <a href="/privacy" class="text-primary hover:underline" target="_blank">Politikën e Privatësisë</a> 
                  të AlbCaptions. Abonimi do të rinovohet automatikisht.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-kollektif-bold { 
  font-family: 'Kollektif', sans-serif; 
  font-weight: bold; 
}
.dot {
    animation: bounce 1.4s infinite ease-in-out;
    font-size: 3rem;
    line-height: 1;
  }
  .dot-1 { animation-delay: -0.32s; }
  .dot-2 { animation-delay: -0.16s; }
  .dot-3 { animation-delay: 0s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.8) translateY(0); opacity: 0.5; }
    40% { transform: scale(1.2) translateY(-10px); opacity: 1; }
  }
</style>