<template>
  <div class="w-full h-40 -mb-1 overflow-hidden">
    <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="w-full h-full">
      <path d="M0 80C200 0 500 0 720 40C940 80 1240 80 1440 0V160H0V80Z" fill="#052B28"/>
    </svg>
  </div>
  <div class="min-h-screen bg-primary relative overflow-hidden">
    <div class="absolute inset-0 grid-mask">
      <div class="absolute inset-0 bg-grid-pattern opacity-100"></div>
    </div>
    <div class="w-full h-fit flex flex-col gap-2 items-center justify-center my-12 relative z-10">
      <span class="text-5xl text-center leading-18 text-kollektif-bold text-secondary">
        Zgjidh 
        <span class="bg-secondary text-primary p-1 rounded-md">Abonimin</span>
        <br> që të Përshtatet Ty
      </span>
      <toggle @toggle="handleBillingToggle"/>

      <div class="w-full h-full my-10 p-3">
        <div class="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            :svg-color="plan.svgColor"
            :isRecommended="plan.isRecommended"
            @select="selectPlan(plan.key)"
          />
          <PricingCardEnterprise />
          <div class="col-span-1 md:col-span-2 text-lg lg:col-span-3 text-center text-secondary font-poppins font-thin mt-10"> 
            <RouterLink to="/pricing" class="text-xl text-secondary font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-secondary after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
              Krahaso Planet
            </RouterLink>
          </div>
        </div>
      </div>
    </div>  
  </div>
  <div class="w-full h-40 -mb-1 overflow-hidden rotate-180">
    <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="w-full h-full">
      <path d="M0 80C200 0 500 0 720 40C940 80 1240 80 1440 0V160H0V80Z" fill="#052B28"/>
    </svg>
  </div>

  <!-- Payment Modal -->
  <PayPalPayment
    v-if="showPayPalPayment"
    :key="selectedPlanId + ':' + (isYearly ? 'y' : 'm')"
    :open="showPayPalPayment"
    :plan-id="selectedPlanId"
    :plan="selectedPlan"
    :is-yearly="isYearly"
    @close="showPayPalPayment = false"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import toggle from './subcomponents/Toggle.vue'
import PricingCard from './subcomponents/PricingCard.vue'
import PricingCardEnterprise from './subcomponents/PricingCardEnterprise.vue'
import PayPalPayment from './items/PayPalPayment.vue'

// Calculate percent saved utility
function getPercentSaved(monthly, yearly) {
  const m = parseFloat(monthly)
  const y = parseFloat(yearly)
  if (!m || !y) return null
  return Math.round(((m - y) / m) * 100)
}

const router = useRouter()
const isYearly = ref(true)

function handleBillingToggle(yearly) {
  isYearly.value = yearly
}

const plans = [
  {
    key: 'starter',
    badgeText: 'Starter',
    badgeColor: '#6B7280',
    price: { monthly: '7', yearly: '5' },
    decimal: { monthly: '99', yearly: '99' },
    yearlytotal: {monthly:'', yearly:'59.99'},
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
    planfeatures: [
      { label: 'Video në muaj', value: '15 video' },
      { label: 'Minuta Totale Transkriptimi', value: '60 minuta' },
      { label: 'Minuta Totale për Video', value: '10 minuta' },
      { label: 'Limiti MB për Video', value: '250MB' },
      { label: 'Formate Shkarkimi', value: 'TXT, .srt, .vtt' },
      { label: 'Kufizimi i Shkarkimeve', value: 'Pa limit' },
      { label: 'Redaktim Manual', value: 'I përfshirë' },
      { label: 'Njohje Dialekti Automatike', value: 'I përfshirë' },
      { label: 'Transkript i Sinkronizuar', value: 'I përfshirë' },
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
    yearlytotal: {monthly:'', yearly:'119.99'},
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
    //planId: 'P-40P32125KN1577439NBNKI4A',
    planId: 'P-2JR743181G189825MNDNFCIY',
    isRecommended: true,
    svgColor: '#9FE29E'
  },
  {
    key: 'business',
    badgeText: 'Business',
    badgeColor: '#6B7280',
    price: { monthly: '33', yearly: '24' },
    decimal: { monthly: '99', yearly: '99' },
    yearlytotal: {monthly:'', yearly:'239'},
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
    planId: 'P-63C69562KG1645239NBNKF7A',
    svgColor: '#E5E7EB'
  }
]

// Modal state
const showPayPalPayment = ref(false)
const selectedPlan = ref(null)
const selectedPlanId = ref(null)

// Called when a PricingCard emits select with its key
function selectPlan(planType) {
  const plan = plans.find(p => p.key === planType)
  if (plan) {
    selectedPlan.value = plan
    selectedPlanId.value = plan.planId
    showPayPalPayment.value = true
  }
}
</script>

<style scoped>
.font-kollektif-bold { font-family: 'Kollektif', sans-serif; font-weight: bold; }
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3e%3cpath d='M0 0h40v40H0z' fill='none'/%3e%3cpath d='M20 0v40M0 20h40' stroke='%239FE29E' stroke-width='0.5' stroke-opacity='0.2'/%3e%3c/svg%3e");
  background-size: 40px 40px;
}
.grid-mask {
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%,rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 90%);
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%,rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 90%);
}
@media (max-width: 1024px) {
  .grid { grid-template-columns: 1fr !important; }
}
</style>