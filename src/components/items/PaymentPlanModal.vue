<template>
    <Teleport to="body">
      <transition name="fade">
        <div
          class="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="close" />
  
          <!-- Modal Panel -->
          <div
            class="relative z-20 w-[95%] max-w-6xl max-h-[90vh] overflow-auto rounded-2xl"
            @keydown.esc.prevent="close"
            tabindex="-1"
          >
  
            <div class="bg-primary relative overflow-hidden">
              <div class="absolute inset-0 grid-mask">
                <div class="absolute inset-0 bg-grid-pattern opacity-100"></div>
              </div>
  
              <!-- Header / Close -->
              <div class="w-full flex items-start justify-between p-6 relative z-10">
                <div>
                  <h2 class="text-2xl text-secondary font-kollektif-bold">
                    Zgjidh 
                    <span class="bg-secondary text-primary p-1 rounded-md">Abonimin</span>
                    që të Përshtatet Ty
                  </h2>
                  <br>
                  <toggle @toggle="handleBillingToggle" />
                </div>
  
                <div class="flex gap-3 items-center">
  
                  <!-- Close button -->
                  <button
                    class="ml-4 rounded-full bg-primary text-secondary border border-secondary px-3 py-2 hover:bg-secondary hover:text-primary transition"
                    @click="close"
                    aria-label="Close pricing modal"
                  >
                    Mbyll
                  </button>
                </div>
              </div>
  
              <!-- Cards -->
              <div class="w-full h-full p-6 relative z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <PricingCard
                    v-for="plan in plans"
                    :key="plan.key"
                    :badge-text="plan.badgeText"
                    :badge-color="plan.badgeColor"
                    :price="isYearly ? plan.price.yearly : plan.price.monthly"
                    :decimal="isYearly ? plan.decimal.yearly : plan.decimal.monthly"
                    :old-monthly-price="isYearly ? plan.price.monthly : null"
                    :show-old-monthly-price="isYearly"
                    :percent-saved="isYearly ? plan.percentSaved : null"
                    :currency="plan.currency"
                    :price-description="isYearly ? 'muaj, tarifë vjetore' : 'muaj'"
                    :description="plan.description"
                    :features="plan.features"
                    :to="`/paypal/${plan.planId}`"
                    :svg-color="plan.svgColor"
                    :isRecommended="plan.isRecommended"
                    @select="selectPlan"
                    :plan-type="plan.key"
                  />
                  <!-- Enterprise card: listen to its actions and close + forward events -->
                  <PricingCardEnterprise
                    @contact-enterprise="handleEnterpriseContact"
                    @apply-demo="handleApplyDemo"
                  />
                </div>
            </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import toggle from '../subcomponents/Toggle.vue'
  import PricingCard from './PricingCardModal.vue'
  import PricingCardEnterprise from './PricingCardEnterpriseModal.vue'
  
  // props / emits
  const props = defineProps({
    modelValue: { type: Boolean, default: false }
  })
  const emit = defineEmits(['update:modelValue', 'contact-enterprise', 'apply-demo'])
  
  // local reactive show so we can animate / focus
  const localShow = ref(props.modelValue)
  watch(() => props.modelValue, v => (localShow.value = v))
  watch(localShow, v => emit('update:modelValue', v))
  
  // keyboard esc handler
  function onEsc(e) {
    if (e.key === 'Escape' || e.key === 'Esc') close()
  }
  onMounted(() => document.addEventListener('keydown', onEsc))
  onUnmounted(() => document.removeEventListener('keydown', onEsc))
  
  const router = useRouter()
  
  // Close after route change so modal doesn't remain open when navigating via router-link inside cards
  let removeAfterHook = null
  onMounted(() => {
    removeAfterHook = router.afterEach(() => {
      if (localShow.value) {
        localShow.value = false
      }
    })
  })
  onUnmounted(() => {
    if (removeAfterHook) removeAfterHook()
  })
  
  // Billing toggle
  const isYearly = ref(true)
  function handleBillingToggle(yearly) {
    isYearly.value = yearly
  }
  
  // Calculate percent saved utility
  function getPercentSaved(monthly, yearly) {
    const m = parseFloat(monthly)
    const y = parseFloat(yearly)
    if (!m || !y) return null
    return Math.round(((m - y) / m) * 100)
  }
  
  const plans = [
    {
      key: 'starter',
      badgeText: 'Starter',
      badgeColor: '#6B7280',
      price: { monthly: '7', yearly: '5' },
      decimal: { monthly: '99', yearly: '99' },
      currency: '€',
      description: 'Krijo video që zbulojnë audienca të reja',
      priceDescription: 'muaj',
      percentSaved: getPercentSaved('7', '5'),
      features: [
        { text: '15 Video / Muaj' },
        { text: 'Limit 250MB / Video' },
        { text: 'Suportohet Çdo Dialekt' },
        { text: 'Transkript i sinkronizuar' },
        { text: 'Ngarkim në çdo format video dhe audio' },
        { text: 'Program Redaktimi'},
        { text: 'Shërbim Prioritar', locked: true }
      ],
      planId: 'P-93354509CK7566242NBNKHJQ',
      svgColor: '#E5E7EB'
    },
    {
      key: 'pro',
      badgeText: 'Pro',
      badgeColor: '#052B28',
      price: { monthly: '13', yearly: '9' },
      decimal: { monthly: '99', yearly: '99' },
      currency: '€',
      description: 'Transformo videot në mjete që të sjellin klientë',
      priceDescription: 'muaj',
      percentSaved: getPercentSaved('13', '9'),
      features: [
        { text: '35 Video / Muaj' },
        { text: 'Limit 500MB / Video' },
        { text: 'Suportohet Çdo Dialekt' },
        { text: 'Transkript i sinkronizuar' },
        { text: 'Ngarkim në çdo format video dhe audio' },
        { text: 'Program Redaktimi' },
        { text: 'Shkarko .srt .vtt' },
        { text: 'Shërbim Prioritar' },
        { text: 'Funksionalitete për skuadra (së shpejti)'}
      ],
      //planId: 'P-40P32125KN1577439NBNKI4A',
      planId:'P-2JR743181G189825MNDNFCIY',
      isRecommended: true,
      svgColor: '#9FE29E'
    },
    {
      key: 'business',
      badgeText: 'Business',
      badgeColor: '#6B7280',
      price: { monthly: '33', yearly: '24' },
      decimal: { monthly: '99', yearly: '99' },
      currency: '€',
      description: 'Optimizim i krijimit të videove për ekipe që mendojnë shpejt',
      priceDescription: 'muaj',
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
      planId: 'P-63C69562KG1645239NBNKF7A',
      svgColor: '#E5E7EB'
    }
  ]
  
  function selectPlan(planType) {
    const plan = plans.find(p => p.key === planType)
    if (plan) {
      // navigate and close modal
      router.push(`/paypal/${plan.planId}`)
      localShow.value = false
    }
  }
  
  function handleEnterpriseContact() {
    // close modal and forward the event to parent
    localShow.value = false
    emit('contact-enterprise')
  }
  
  function handleApplyDemo() {
    localShow.value = false
    emit('apply-demo')
  }
  
  function close() {
    localShow.value = false
  }
  </script>
  
  <style scoped>
  /* fade transition */
  .fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }
  
  /* keep original helpers */
  .font-kollektif-bold { font-family: 'Kollektif', sans-serif; font-weight: bold; }
  .bg-grid-pattern {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3e%3cpath d='M0 0h40v40H0z' fill='none'/%3e%3cpath d='M20 0v40M0 20h40' stroke='%239FE29E' stroke-width='0.5' stroke-opacity='0.2'/%3e%3c/svg%3e");
    background-size: 40px 40px;
  }
  .grid-mask {
    -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%,rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 90%);
    mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%,rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 90%);
  }
  </style>