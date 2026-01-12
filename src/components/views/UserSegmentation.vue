<template>
    <div class="w-full h-screen bg-primary overflow-y-auto overflow-x-hidden">
      <div class="w-full min-h-full relative flex flex-col items-center justify-center p-4">
        <!-- Background SVG lines -->
        <div class="fixed bottom-0 left-0 z-0 w-full h-full pointer-events-none">
          <div class="w-full h-full flex items-end lg:block">
            <logo_lines class="h-1/2 w-full pointer-events-none text-secondary/10" />
          </div>
        </div>
  
        <!-- One animated outlet; slides left/right depending on navigation direction -->
        <Transition :name="transitionName" mode="out-in">
          <!-- 1) FORM -->
          <div
            v-if="step === 'form'"
            key="form"
            class="h-fit w-full max-w-[400px] bg-white rounded-xl shadow-lg shadow-black z-20"
          >
            <div class="w-full h-full flex flex-col gap-2">
              <div class="w-full h-fit border-b border-black/30 p-4">
                <h1 class="text-kollektif-bold text-xl md:text-2xl leading-tight mt-2">
                  Mirësevini {{ userName }}
                </h1>
              </div>
  
              <div class="p-5">
                <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
                  <!-- Select 1 -->
                  <div class="my-1">
                    <label class="font-poppins text-sm md:text-md font-normal opacity-90">
                      Si do ta përdorësh albcaptions?
                    </label>
                    <select v-model="use" :class="selectClass(use)">
                      <option value="" disabled>Përzgjidh</option>
                      <option value="CC">Materiale Marketingu</option>
                      <option value="SMM">Materiale Shitjesh</option>
                      <option value="TV">Materiale Televizioni</option>
                      <option value="F">Argëtim</option>
                      <option value="O">Tjetër</option>
                    </select>
                    <Transition name="fade-down">
                      <input
                        v-if="use === 'O'"
                        v-model="otherUse"
                        type="text"
                        placeholder="Ju lutem specifikoni"
                        class="w-full p-2 border text-sm rounded-lg focus:outline-none mt-2 focus:ring-2 focus:ring-primary/50 transition text-black border-primary/50"
                      />
                    </Transition>
                  </div>
  
                  <!-- Select 2 -->
                  <div class="my-1">
                    <label class="font-poppins text-sm md:text-md font-normal opacity-90">
                      Cili është roli qe do të të përshkruante më mirë?
                    </label>
                    <select v-model="job" :class="selectClass(job)">
                      <option value="" disabled>Përzgjidh</option>
                      <option value="CC">Content Creator</option>
                      <option value="SMM">Marketing (SMM)</option>
                      <option value="E">Montazhier (Video Editor)</option>
                      <option value="OWN">Pronar</option>
                      <option value="O">Tjetër</option>
                    </select>
                    <Transition name="fade-down">
                      <input
                        v-if="job === 'O'"
                        v-model="otherJob"
                        type="text"
                        placeholder="Ju lutem specifikoni"
                        class="w-full p-2 border text-sm rounded-lg focus:outline-none mt-2 focus:ring-2 focus:ring-primary/50 transition text-black border-primary/50"
                      />
                    </Transition>
                  </div>
  
                  <!-- Select 3 -->
                  <div class="my-1">
                    <label class="font-poppins text-sm md:text-md opacity-90">
                      Cfarë të solli tek ne?
                    </label>
  
                    <select v-model="source" :class="selectClass(source)">
                      <option value="" disabled>Përzgjidh</option>
                      <option value="Web">Google ose i ngjashëm</option>
                      <option value="ChatBot">ChatGPT ose i ngjashëm</option>
                      <option value="YT">YouTube</option>
                      <option value="Social">Rrjete sociale</option>
                      <option value="Friend">Shok / koleg</option>
                      <option value="Other">Diku tjetër</option>
                    </select>
                    <Transition name="fade-down">
                      <input
                        v-if="source === 'Other'"
                        v-model="otherSource"
                        type="text"
                        placeholder="Ju lutem specifikoni"
                        class="w-full p-2 border text-sm rounded-lg focus:outline-none mt-2 focus:ring-2 focus:ring-primary/50 transition text-black border-primary/50"
                      />
                    </Transition>
                  </div>
  
                  <button
                    type="submit"
                    :disabled="allEmpty"
                    :class="[
                      'w-full md:w-fit mt-4 px-6 py-2 rounded-lg transition-colors',
                      allEmpty
                        ? 'bg-primary/40 text-white cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/80 cursor-pointer'
                    ]"
                  >
                    Vazhdo
                  </button>
                </form>
              </div>
            </div>
          </div>
  
          <!-- 2) EMAIL OPT-IN -->
          <div
            v-else-if="step === 'email'"
            key="email"
            class="h-fit w-full max-w-[700px] bg-white p-3 md:p-4 rounded-xl shadow-lg shadow-black z-20"
          >
            <div class="w-full h-full flex flex-col md:flex-row gap-4 md:gap-2">
              <div class="w-full md:w-2/5 bg-secondary h-48 md:h-auto p-3 rounded-lg relative overflow-hidden flex items-center justify-center">
                <logo_lines class="w-full h-auto text-primary opacity-20 md:opacity-100" />
                <div class="absolute inset-0 z-10 flex items-center justify-center p-3">
                  <img
                    src="../../assets/images/envelope.png"
                    alt="Email Envelope"
                    class="max-w-[150px] md:max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
  
              <div class="w-full md:w-3/5 flex flex-col justify-between p-2 md:p-3">
                <div class="flex flex-col gap-6 md:gap-8">
                  <div>
                    <h1 class="text-kollektif-bold text-lg md:text-xl leading-tight">
                      Dëshiron të marrësh njoftime përmes email?
                    </h1>
                    <p class="font-poppins text-xs md:text-sm font-normal opacity-90 mt-2">
                      Kontrollo preferencat e email-it në Cilësimet e Llogarisë.
                    </p>
                  </div>
  
                  <div class="flex flex-col gap-3 font-poppins text-xs md:text-sm font-light opacity-90">
                    <div class="flex flex-row gap-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 640 640"
                      >
                        <path
                          d="M224 384C330 384 416 305.2 416 208C416 110.8 330 32 224 32C118 32 32 110.8 32 208C32 247.6 46.3 284.2 70.4 313.6L34.8 380.8C29.9 390.1 31.6 401.5 39 409C46.4 416.5 57.9 418.2 67.2 413.2L148.8 370C171.9 379 197.3 384 224 384zM227.2 432C243.6 513.9 321.9 576 416 576C442.7 576 468.1 571 491.2 562L572.8 605.2C582.1 610.1 593.5 608.4 601 601C608.5 593.6 610.2 582.1 605.2 572.8L569.6 505.6C593.7 476.2 608 439.6 608 400C608 317.6 546.3 248.5 463 229.3C451.5 345.1 347.2 430.5 227.2 432zM228 96C239 96 248 105 248 116L248 120L256 120C267 120 276 129 276 140C276 151 267 160 256 160L208.5 160C201.6 160 196 165.6 196 172.5C196 178.6 200.4 183.8 206.4 184.8L248.1 191.8C273.4 196 292 217.9 292 243.6C292 269.7 273 291.3 248 295.4L248 300.1C248 311.1 239 320.1 228 320.1C217 320.1 208 311.1 208 300.1L208 296.1L184 296.1C173 296.1 164 287.1 164 276.1C164 265.1 173 256.1 184 256.1L239.5 256.1C246.4 256.1 252 250.5 252 243.6C252 237.5 247.6 232.3 241.6 231.3L199.9 224.3C174.6 220.1 156 198.2 156 172.5C156 143.7 179.2 120.3 208 120L208 116C208 105 217 96 228 96z"
                        />
                      </svg>
                      <p>Përfito zbritje dhe këshilla nga ekspertë</p>
                    </div>
  
                    <div class="flex flex-row gap-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 640 640"
                      >
                        <path
                          d="M64 64C46.3 64 32 78.3 32 96C32 113.7 46.3 128 64 128L136.9 128L229 404.2C206.5 421.8 192 449.2 192 480C192 533 235 576 288 576C340.4 576 383.1 534 384 481.7L586.1 414.3C602.9 408.7 611.9 390.6 606.3 373.8C600.7 357 582.6 348 565.8 353.6L363.8 421C346.6 398.9 319.9 384.5 289.8 384L197.7 107.8C188.9 81.6 164.5 64 136.9 64L64 64zM240 480C240 453.5 261.5 432 288 432C314.5 432 336 453.5 336 480C336 506.5 314.5 528 288 528C261.5 528 240 506.5 240 480zM312.5 153.3C287.3 161.5 273.5 188.6 281.7 213.8L321.3 335.5C329.5 360.7 356.6 374.5 381.8 366.3L503.5 326.7C528.7 318.5 542.5 291.4 534.3 266.2L494.8 144.5C486.6 119.3 459.5 105.5 434.3 113.7L312.5 153.3z"
                        />
                      </svg>
                      <p>Akses paraprak të mjeteve dhe shërbimeve të reja</p>
                    </div>
  
                    <div class="flex flex-row gap-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 640 640"
                      >
                        <path
                          d="M232 144C218.7 144 208 154.7 208 168L208 472C208 480.4 206.6 488.5 203.9 496L504 496C517.3 496 528 485.3 528 472L528 168C528 154.7 517.3 144 504 144L232 144zM136 544C96.2 544 64 511.8 64 472L64 176C64 162.7 74.7 152 88 152C101.3 152 112 162.7 112 176L112 472C112 485.3 122.7 496 136 496C149.3 496 160 485.3 160 472L160 168C160 128.2 192.2 96 232 96L504 96C543.8 96 576 128.2 576 168L576 472C576 511.8 543.8 544 504 544L136 544zM256 216C256 202.7 266.7 192 280 192L328 192C341.3 192 352 202.7 352 216L352 264C352 277.3 341.3 288 328 288L280 288C266.7 288 256 277.3 256 264L256 216zM408 240L456 240C469.3 240 480 250.7 480 264C480 277.3 469.3 288 456 288L408 288C394.7 288 384 277.3 384 264C384 250.7 394.7 240 408 240zM280 320L456 320C469.3 320 480 330.7 480 344C480 357.3 469.3 368 456 368L280 368C266.7 368 256 357.3 256 344C256 330.7 266.7 320 280 320zM280 400L456 400C469.3 400 480 410.7 480 424C480 437.3 469.3 448 456 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400z"
                        />
                      </svg>
                      <p>Përditësime dhe lajme për zhvillimin e Albcaptions</p>
                    </div>
                  </div>
                </div>
  
                <div class="flex flex-row gap-3 w-full md:w-fit h-fit mt-6">
                  <button
                    type="button"
                    class="flex-1 md:flex-none cursor-pointer px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm"
                    @click="goToPricing(true)"
                  >
                    Jo tani
                  </button>
  
                  <button
                    type="button"
                    class="flex-1 md:flex-none cursor-pointer px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                    @click="goToPricing(false)"
                  >
                    Pranoj!
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 3) PRICING -->
          <div
            v-else
            key="pricing"
            class="w-full max-w-[1100px] max-h-[90vh] bg-white rounded-xl shadow-lg shadow-black z-20 overflow-hidden flex flex-col"
          >
            <div class="w-full h-fit border-b border-black/30 p-4">
              <div class="w-full h-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 class="text-kollektif-bold text-xl md:text-2xl leading-tight mt-2">
                    Asnjë hap nuk hidhet pa plan
                  </h1>
                  <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1">
                    <div class="flex items-center gap-1">
                      <span class="text-primary/60 font-normal">✓</span>
                      <span class="font-poppins text-[10px] md:text-xs text-primary/50 font-thin">
                        Anuloni ose ndryshoni kudo dhe kurdo
                      </span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-primary/60 font-normal">✓</span>
                      <span class="font-poppins text-[10px] md:text-xs text-primary/50 font-thin">
                        Suport 24/7
                      </span>
                    </div>
                  </div>
                </div>
  
                <div class="flex items-center flex-row gap-2 self-end md:self-auto">
                  <button
                    type="button"
                    class="relative w-12 h-6 rounded-full bg-primary/10 border border-primary/15
                           transition-colors duration-300 hover:bg-primary/25
                           focus:ring-primary/30"
                    @click="toggleBilling"
                    :aria-pressed="isYearly"
                    aria-label="Toggle billing period"
                  >
                    <span class="absolute inset-0 flex items-center px-1">
                      <span
                        class="h-4 w-4 rounded-full bg-primary shadow-sm
                               transition-transform duration-300 ease-in-out will-change-transform"
                        :style="{ transform: isYearly ? 'translateX(24px)' : 'translateX(0px)' }"
                      />
                    </span>
                  </button>
                  <span class="text-xs text-primary/30 font-poppins font-light">
                    Abonim Vjetor
                  </span>
                </div>
              </div>
            </div>
  
            <div class="grid grid-cols-1 md:grid-cols-4 w-full overflow-y-auto flex-grow">
              <PricingCardSegmentation
                v-for="(plan, idx) in plans"
                :key="plan.key"
                :class="[
                  'w-full h-full px-6 lg:px-10 py-8 border-b md:border-b-0 border-black/5',
                  idx === 1 ? 'md:border-l md:border-r md:border-black/10' : ''
                ]"
                :badge-text="plan.badgeText"
                :badge-color="plan.badgeColor"
                :currency="plan.currency"
                :price="isYearly ? plan.price.yearly : plan.price.monthly"
                :decimal="isYearly ? plan.decimal.yearly : plan.decimal.monthly"
                :price-description="isYearly ? 'muaj, tarifë vjetore' : 'muaj'"
                :description="plan.description"
                :features="plan.features"
                @select="selectPlan(plan.key)"
              />
  
              <div class="relative h-full w-full flex flex-col border-t md:border-t-0 md:border-l border-black/10 min-h-[400px]">
                <div class="absolute w-full h-full bg-gradient-to-t from-secondary/50 to-transparent z-0"></div>
                <div class="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                  <h2 class="text-kollektif-bold text-lg text-primary mb-4">
                    Planet Enterprise
                  </h2>
                  <p class="font-poppins text-sm text-primary/80 mb-6">
                    Për organizatat që kërkojnë zgjidhje të plota dhe të personalizuara.
                  </p>
                  <div class="flex flex-col gap-2 font-poppins text-[11px] text-left w-full max-w-[200px] mx-auto mb-6">
                    <p>✓ Përdorim i palimituar</p>
                    <p>✓ Integrime ekskluzive</p>
                    <p>✓ Shërbim Klienti Individual</p>
                    <p>✓ Transkriptim në masë</p>
                    <p>✓ Hostimi skedarësh</p>
                    <p>✓ Akses mbi API (së shpejti)</p>
                  </div>
                  <div class="w-full flex flex-col gap-2">
                    <button
                      type="button"
                      class="cursor-pointer w-full px-4 py-2 bg-primary text-white text-xs md:text-sm rounded-full
                             hover:bg-primary/80 transition-colors"
                    >
                      Kontakto Shitjet
                    </button>
                    <button
                      type="button"
                      class="cursor-pointer w-full px-4 py-2 bg-primary/10 text-primary text-xs md:text-sm rounded-full
                             hover:bg-primary/20 transition-colors"
                    >
                      Apliko për Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="flex flex-col sm:flex-row justify-between items-center w-full h-fit border-t border-black/20 p-2 md:p-4 bg-gray-50 md:bg-white">
              <RouterLink to="/dashboard" class="font-poppins underline text-[10px] md:text-xs text-primary/60 font-normal opacity-90 p-2">
                Vazhdoni pa pagesë
              </RouterLink>
              <RouterLink to="/pricing" class="font-poppins text-[10px] md:text-xs text-primary/60 font-normal opacity-90 p-2 underline">
                Krahaso planet
              </RouterLink>
            </div>
          </div>
        </Transition>
  
        <PayPalPayment
          v-if="showPayPalPayment"
          :key="selectedPlanId + ':' + (isYearly ? 'y' : 'm')"
          :open="showPayPalPayment"
          :plan-id="selectedPlanId"
          :plan="selectedPlan"
          :is-yearly="isYearly"
          @close="showPayPalPayment = false"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import logo_lines from '../logos/Logo_lines.vue'
  import PricingCardSegmentation from '../subcomponents/PricingCardSegmentation.vue'
  import apiClient from '@/stores/apiClient'
  import PayPalPayment from '../items/PayPalPayment.vue'
  
  function getPercentSaved(monthly, yearly) {
    const m = parseFloat(monthly)
    const y = parseFloat(yearly)
    if (!m || !y) return null
    return Math.round(((m - y) / m) * 100)
  }
  
  function toggleBilling() {
    isYearly.value = !isYearly.value
  }
  
  const userName = ref('')
  
  // ---------- Step-based navigation (3 states) ----------
  const stepOrder = ['form', 'email', 'pricing']
  const step = ref('form')
  const navDir = ref(1)
  
  const transitionName = computed(() => (navDir.value === 1 ? 'slide-left' : 'slide-right'))
  
  function goTo(nextStep) {
    const from = stepOrder.indexOf(step.value)
    const to = stepOrder.indexOf(nextStep)
    navDir.value = to >= from ? 1 : -1
    step.value = nextStep
  }
  
  // ---------- Form state ----------
  const use = ref('')
  const job = ref('')
  const source = ref('')
  const otherUse = ref('')
  const otherJob = ref('')
  const otherSource = ref('')
  
  const allEmpty = computed(() => {
    if (use.value === '' || job.value === '' || source.value === '') {
      return true
    }
    return false
  })
  
  getUserName()
  
  async function getUserName(){
    try {
      const response = await apiClient.get('/auth/user-profile', {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        userName.value = response.data.name
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }
  
  async function handleSubmit() {
    if (allEmpty.value) return
    try {
      const payload = {
        use: use.value === 'O' ? otherUse.value : use.value,
        job: job.value === 'O' ? otherJob.value : job.value,
        source: source.value === 'Other' ? otherSource.value : source.value
      }
      const response = await apiClient.post(
        '/auth/user-segmentation',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
  
      if (response.status === 200) {
        goTo('email')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }
  
  // Email opt-in actions
  async function goToPricing(accepted) {
    try {
      if (accepted) {
        const response = await apiClient.post('/auth/user-email-optout', { emailOptIn: true })
        if (response.status !== 200) console.error(response)
      }
    } catch (e) {
      console.error(e)
    } finally {
      goTo('pricing')
    }
  }
  
  // ---------- Select styling ----------
  const baseSelect =
    'w-full p-2 border text-sm rounded-lg focus:outline-none mt-2 focus:ring-2 focus:ring-primary/50 transition'
  
  const selectClass = (value) => [
    baseSelect,
    value === '' ? 'text-gray-400 border-primary/30' : 'text-black border-primary/50'
  ]
  
  // ---------- Plan data ----------
  const isYearly = ref(true)
  const plans = ref([
    {
      key: 'starter',
      badgeText: 'Starter',
      badgeColor: '#9FE29E',
      price: { monthly: '7', yearly: '5' },
      decimal: { monthly: '99', yearly: '99' },
      yearlytotal: { monthly: '', yearly: '59.99' },
      currency: '€',
      description: 'Krijo video që zbulojnë audienca të reja',
      percentSaved: getPercentSaved('7', '5'),
      features: [
        { text: '15 Video / Muaj' },
        { text: 'Limit 250MB / Video' },
        { text: 'Suportohet Çdo Dialekt' },
        { text: 'Transkript i sinkronizuar' },
        { text: 'Ngarkim në çdo format video' },
        { text: 'Program Redaktimi' },
        { text: 'Shërbim Prioritar', locked: true }
      ],
      planfeatures: [
        { label: 'Video në muaj', value: '15 video' },
        { label: 'Minuta Totale Transkriptimi', value: '60 minuta' },
        { label: 'Minuta Totale për Video', value: '10 minuta' },
        { label: 'Limiti MB për Video', value: '250MB' },
        { label: 'Formate Shkarkimi', value: 'TXT, .srt, .vtt' },
        { label: 'Kufizimi i Shkarkimeve', value: 'Pa limit' },
        { label: 'Redaktim Manual', value: 'I përfshirë' },
        { label: 'Njohje Dialekti Automatike', value: 'I përfshirë' },
        { label: 'Transkript i Sinkronizuar', value: 'I përfshirë' }
      ],
      planId: 'P-93354509CK7566242NBNKHJQ'
    },
    {
      key: 'pro',
      badgeText: 'Pro',
      badgeColor: '#9FE29E',
      price: { monthly: '13', yearly: '9' },
      decimal: { monthly: '99', yearly: '99' },
      yearlytotal: { monthly: '', yearly: '119.99' },
      currency: '€',
      description: 'Transformo videot në mjete që të sjellin klientë',
      percentSaved: getPercentSaved('13', '9'),
      features: [
        { text: '35 Video / Muaj' },
        { text: 'Limit 500MB / Video' },
        { text: 'Suportohet Çdo Dialekt' },
        { text: 'Transkript i sinkronizuar' },
        { text: 'Ngarkim në çdo format video dhe audio' },
        { text: 'Program Redaktimi' },
        { text: 'Shkarko .srt .vtt' },
        { text: 'Shërbim Prioritar' }
      ],
      planfeatures: [
        { label: 'Video në muaj', value: '35 video' },
        { label: 'Minuta Totale Transkriptimi', value: '240 minuta' },
        { label: 'Minuta Totale për Video', value: '20 minuta' },
        { label: 'Limiti MB për Video', value: '500MB' },
        { label: 'Formate Shkarkimi', value: 'TXT, .srt, .vtt' },
        { label: 'Kufizimi i Shkarkimeve', value: 'Pa limit' },
        { label: 'Redaktim Manual', value: 'I përfshirë' },
        { label: 'Njohje Dialekti Automatike', value: 'I përfshirë' },
        { label: 'Transkript i Sinkronizuar', value: 'I përfshirë' },
        { label: 'Shërbim me prioritet', value: 'I përfshirë' }
      ],
      planId: 'P-2JR743181G189825MNDNFCIY'
    },
    {
      key: 'business',
      badgeText: 'Business',
      badgeColor: '#9FE29E',
      price: { monthly: '33', yearly: '24' },
      decimal: { monthly: '99', yearly: '99' },
      yearlytotal: { monthly: '', yearly: '239' },
      currency: '€',
      description: 'Optimizim i krijimit të videove për ekipe që mendojnë shpejt',
      percentSaved: getPercentSaved('33', '24'),
      features: [
        { text: '70 Video / Muaj' },
        { text: 'Limit 1GB / Video' },
        { text: 'Suportohet Çdo Dialekt' },
        { text: 'Transkript i sinkronizuar' },
        { text: 'Ngarkim në çdo format video dhe audio' },
        { text: 'Program Redaktimi' },
        { text: 'Shkarko .srt .vtt' },
        { text: 'Shërbim Prioritar' },
        { text: 'Funksionalitete për skuadra (së shpejti)' }
      ],
      planfeatures: [
        { label: 'Video në muaj', value: '70 video' },
        { label: 'Minuta Totale Transkriptimi', value: '450 minuta' },
        { label: 'Minuta Totale për Video', value: '30 minuta' },
        { label: 'Limiti MB për Video', value: '1000MB' },
        { label: 'Formate Shkarkimi', value: 'TXT, .srt, .vtt' },
        { label: 'Kufizimi i Shkarkimeve', value: 'Pa limit' },
        { label: 'Redaktim Manual', value: 'I përfshirë' },
        { label: 'Njohje Dialekti Automatike', value: 'I përfshirë' },
        { label: 'Transkript i Sinkronizuar', value: 'I përfshirë' },
        { label: 'Shërbim me prioritet', value: 'I përfshirë' }
      ],
      planId: 'P-63C69562KG1645239NBNKF7A'
    }
  ])
  
  // Modal state
  const showPayPalPayment = ref(false)
  const selectedPlan = ref(null)
  const selectedPlanId = ref(null)
  
  // Called when a PricingCard emits select with its key
  function selectPlan(planType) {
    const plan = plans.value.find((p) => p.key === planType)
    if (plan) {
      selectedPlan.value = plan
      selectedPlanId.value = plan.planId
      showPayPalPayment.value = true
    }
  }
  </script>
  
  <style scoped>
  /* Make transitions smooth (avoid horizontal scrollbars during slide) */
  :deep(.slide-left-enter-active),
  :deep(.slide-left-leave-active),
  :deep(.slide-right-enter-active),
  :deep(.slide-right-leave-active) {
    transition: transform 260ms ease, opacity 220ms ease;
    will-change: transform, opacity;
  }
  
  /* Forward navigation: new panel comes from right, old exits to left */
  :deep(.slide-left-enter-from) {
    opacity: 0;
    transform: translateX(24px);
  }
  :deep(.slide-left-leave-to) {
    opacity: 0;
    transform: translateX(-24px);
  }
  
  /* Back navigation: new panel comes from left, old exits to right */
  :deep(.slide-right-enter-from) {
    opacity: 0;
    transform: translateX(-24px);
  }
  :deep(.slide-right-leave-to) {
    opacity: 0;
    transform: translateX(24px);
  }
  
  /* Ensure resting state */
  :deep(.slide-left-enter-to),
  :deep(.slide-left-leave-from),
  :deep(.slide-right-enter-to),
  :deep(.slide-right-leave-from) {
    opacity: 1;
    transform: translateX(0);
  }
  
  :deep(.fade-down-enter-active),
  :deep(.fade-down-leave-active) {
    transition: transform 200ms ease, opacity 200ms ease;
    will-change: transform, opacity;
  }
  
  :deep(.fade-down-enter-from),
  :deep(.fade-down-leave-to) {
    transform: translateY(-10px);
    opacity: 0;
  }
  </style>