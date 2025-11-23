<script setup>
import { defineProps, defineEmits, computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
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
const checkingSession = ref(true)

// User info state
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
  const s1 = await supabase.auth.getSession()
  if (s1?.data?.session?.user) return s1.data.session
  try { await supabase.auth.refreshSession() } catch {}
  const s2 = await supabase.auth.getSession()
  if (s2?.data?.session?.user) return s2.data.session
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

    const { data, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', sess.user.id)
      .single()

    if (dbError || !data) {
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

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    await loadUserInfo()
  } else {
    clearUserInfo()
  }
})

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

// Login form logic
const loginData = ref({ emailOrUsername: '', password: '' })
const loginLoading = ref(false)
const loginError = ref(null)
const loginSuccess = ref(null)

const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)

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
    if (!isEmail(loginData.value.emailOrUsername)) {
      const email = await getUserEmailByUsername(loginData.value.emailOrUsername)
      if (!email) throw new Error('Username nuk u gjet. Të lutem kontrolloni username-in ose përdorni email-in.')
      emailToUse = email
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: loginData.value.password
    })
    if (signInError) throw signInError
    await loadUserInfo()
    loginSuccess.value = 'Hytje e suksesshme!'
    loginData.value.password = ''
  } catch (err) {
    loginError.value = err.message || 'Emaili/username ose passwordi gabuar.\nProvo përsëri.'
  } finally {
    loginLoading.value = false
  }
}

function goToSignup() {
  router.push('/signup')
}

// Pricing computed values
const currentPrice = computed(() => !props.plan ? null : (props.isYearly ? props.plan.price.yearly : props.plan.price.monthly))
const currentDecimal = computed(() => !props.plan ? null : (props.isYearly ? props.plan.decimal.yearly : props.plan.decimal.monthly))
const originalPrice = computed(() => (!props.plan || !props.isYearly) ? null : props.plan.price.monthly)
const originalDecimal = computed(() => (!props.plan || !props.isYearly) ? null : props.plan.decimal.monthly)
const discount = computed(() => (!props.plan || !props.isYearly) ? null : props.plan.percentSaved)
const yearlyTotal = computed (() => (!props.plan || !props.isYearly) ? null : props.plan.yearlytotal.yearly)

const formatDateSq = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    return new Intl.DateTimeFormat('sq-AL', options).format(date);
  } catch (_) {}
  const monthsSq = ['janar','shkurt','mars','prill','maj','qershor','korrik','gusht','shtator','tetor','nëntor','dhjetor'];
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
  <div v-if="open" class="fixed inset-0 z-[1000] overflow-y-auto bg-black/60 backdrop-blur-sm">
    <!-- Flex container for centering, min-h-full allows scrolling if content is tall -->
    <div class="flex min-h-full items-center justify-center p-4 sm:p-6">
      
      <!-- Backdrop click area -->
      <div class="fixed inset-0" @click="close"></div>

      <!-- Modal Content -->
      <div class="relative z-10 w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 z-30 p-2 bg-white/80 rounded-full hover:bg-white text-gray-500 hover:text-gray-800 transition-colors"
          @click="close"
          aria-label="Mbyll"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- LEFT: Marketing Info -->
        <div class="w-full lg:w-1/3 bg-primary p-8 lg:min-h-[600px] relative overflow-hidden flex flex-col justify-between shrink-0">
            <div class="relative z-10 space-y-6">
                <div>
                    <h1 class="text-3xl md:text-4xl text-kollektif-bold font-bold text-secondary relative inline-block leading-tight">
                    Abonohuni
                    <span class="relative">
                        tani
                        <svg class="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 12" preserveAspectRatio="none">
                        <path d="M 0 8 Q 25 2 50 6 T 100 4" stroke="#9FE29E" stroke-width="4" fill="none" stroke-linecap="round"/>
                        </svg>
                    </span>
                    </h1>
                    <p class="text-white text-sm font-poppins font-thin mt-4 leading-relaxed opacity-90">
                    Bashkohu me AlbCaptions, mënyra më e shpejtë për të bërë video me cilësi profesionale që tërheqin dhe mbajnë vëmendjen e audiencës tënde.
                    </p>
                </div>

                <div class="space-y-4">
                    <div class="inline-block bg-secondary/10 border border-secondary/30 rounded-xl px-4 py-2">
                        <span class="text-secondary text-lg font-poppins font-medium">
                            Plani: {{ plan?.badgeText || plan?.key || '—' }}
                        </span>
                    </div>

                    <ul class="space-y-2">
                    <li
                        v-for="(f, idx) in (plan?.planfeatures || [])"
                        :key="idx"
                        class="flex items-start gap-2 text-secondary font-poppins text-sm"
                    >
                        <span class="mt-1 text-xs opacity-70">●</span>
                        <span>{{ f.label }}: {{ f.value }} <span v-if="f.locked" aria-hidden="true" class="opacity-70">🔒</span></span>
                    </li>
                    </ul>
                </div>
            </div>

            <!-- Decorative BG -->
            <Logo_lines class="absolute bottom-0 left-0 w-full h-1/2 object-cover z-0 pointer-events-none text-secondary/5"/>
        </div>

        <!-- RIGHT: Interactive (Login or Details) -->
        <div class="w-full lg:w-2/3 p-6 lg:p-10 bg-white flex flex-col">
            
            <!-- LOADING -->
            <div v-if="checkingSession" class="flex-1 flex flex-col items-center justify-center py-20 text-primary">
                <div class="flex gap-1 mb-2">
                    <span class="dot dot-1">.</span>
                    <span class="dot dot-2">.</span>
                    <span class="dot dot-3">.</span>
                </div>
                <p class="text-sm opacity-60">Duke verifikuar llogarinë...</p>
            </div>

            <!-- LOGIN FORM -->
            <div v-else-if="!isAuthed" class="flex-1 flex flex-col justify-center items-center py-8">
                <form @submit="handleSignIn" class="w-full max-w-md space-y-5">
                    <div class="text-center">
                        <h2 class="text-2xl md:text-3xl text-primary text-kollektif-bold">Hyr për të vazhduar</h2>
                        <p class="text-gray-500 text-sm mt-1">Identifikohuni për të përfunduar pagesën</p>
                    </div>

                    <div v-if="loginError" class="bg-red-50 border border-red-200 text-sm text-red-600 px-4 py-3 rounded-lg">
                        {{ loginError }}
                    </div>
                    <div v-if="loginSuccess" class="bg-green-50 border border-green-200 text-sm text-green-600 px-4 py-3 rounded-lg">
                        {{ loginSuccess }}
                    </div>

                    <div class="space-y-3">
                        <input
                            type="text"
                            v-model="loginData.emailOrUsername"
                            class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            placeholder="Email ose username"
                            required
                        />
                        <input
                            type="password"
                            v-model="loginData.password"
                            class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            placeholder="Fjalëkalimi"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        class="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl hover:bg-[#8cd68b] cursor-pointer transform active:scale-[0.98] transition-all disabled:opacity-60 disabled:pointer-events-none shadow-lg shadow-secondary/20"
                        :disabled="loginLoading"
                    >
                        <span v-if="loginLoading" class="flex items-center justify-center gap-2">
                            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Duke hyrë...
                        </span>
                        <span v-else>Hyr</span>
                    </button>

                    <div class="text-center pt-2">
                        <button type="button" @click="goToSignup" class="text-primary text-sm font-medium hover:text-secondary underline decoration-transparent hover:decoration-current transition-all">
                        Nuk ke llogari? Regjistrohu
                        </button>
                    </div>
                </form>
            </div>

            <!-- CHECKOUT DETAILS -->
            <div v-else class="flex-1 flex flex-col">
                <h3 class="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                   <span class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-sm">✓</span>
                   Konfirmimi i Porosisë
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <!-- User Details -->
                    <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Llogaria</h4>
                        <div class="space-y-3 text-sm">
                            <div class="flex flex-col">
                                <span class="text-gray-500 text-xs">Emri</span>
                                <span class="font-medium text-gray-900 truncate">{{ userInfo.name || 'N/A' }}</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-gray-500 text-xs">Email</span>
                                <span class="font-medium text-gray-900 truncate">{{ userInfo.email || 'N/A' }}</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-gray-500 text-xs">Username</span>
                                <span class="font-medium text-gray-900 truncate">@{{ userInfo.username || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div class="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col justify-between">
                        <div>
                             <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Përmbledhja</h4>
                             <div class="flex justify-between items-center mb-2">
                                <span class="text-gray-600 text-sm">Plani {{ plan?.badgeText }} ({{ billingCycle }})</span>
                             </div>
                             <div v-if="isYearly && originalPrice" class="flex justify-between items-center mb-1">
                                <span class="text-xs text-gray-400">Çmimi standart</span>
                                <span class="text-xs text-gray-400 line-through">{{ plan?.currency }}{{ originalPrice }}.{{ originalDecimal }}</span>
                             </div>
                        </div>

                        <div class="pt-4 border-t border-gray-200 mt-2">
                            <div class="flex justify-between items-end">
                                <span class="font-bold text-primary">Total</span>
                                <div class="text-right">
                                    <div class="flex items-baseline gap-0.5 text-primary">
                                        <span class="text-2xl font-bold">{{ plan?.currency }}{{ currentPrice }}</span>
                                        <span class="text-lg font-medium">.{{ currentDecimal }}</span>
                                        <span class="text-sm text-gray-500 font-normal">/muaj</span>
                                    </div>
                                    <p v-if="isYearly" class="text-[10px] text-green-600 font-medium mt-1 bg-green-50 px-2 py-0.5 rounded-full inline-block">
                                        Faturuar €{{ yearlyTotal }} në vit
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Billing Info Row -->
                <div class="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-8 flex flex-wrap items-center justify-between gap-4 text-sm">
                    <div class="flex items-center gap-2 text-blue-800">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>Rinovimi i rradhës: <strong>{{ nextBillingDate }}</strong></span>
                    </div>
                    <div class="flex items-center gap-2 text-blue-800">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Mund të anuloni në çdo kohë</span>
                    </div>
                </div>

                <!-- PayPal Action -->
                <div class="mt-auto flex flex-col items-center gap-3 pt-6">
                    <div class="w-fit">
                        <PaypalSubscribeButton v-if="isAuthed && planId" :key="planId" :planId="planId" />
                    </div>
                    <p class="text-xs text-center text-gray-400 mt-2 max-w-md leading-relaxed">
                        Duke vazhduar, ju pranoni 
                        <a href="/terms" class="text-primary underline hover:text-secondary" target="_blank">Kushtet</a> 
                        dhe 
                        <a href="/privacy" class="text-primary underline hover:text-secondary" target="_blank">Privatësinë</a>.
                    </p>
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
/* Loading Dots Animation */
.dot { animation: bounce 1.4s infinite ease-in-out; font-size: 2.5rem; line-height: 1; }
.dot-1 { animation-delay: -0.32s; }
.dot-2 { animation-delay: -0.16s; }
.dot-3 { animation-delay: 0s; }
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
</style>