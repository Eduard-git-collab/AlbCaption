<template>
  <div class="w-full h-40 -mb-1 overflow-hidden my-20">
    <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="w-full h-full">
      <path d="M0 80C200 0 500 0 720 40C940 80 1240 80 1440 0V160H0V80Z" fill="#052B28"/>
    </svg>
  </div>
  <div class="min-h-screen bg-[#052B28] relative overflow-hidden">
    <div class="absolute inset-0 grid-mask">
      <div class="absolute inset-0 bg-grid-pattern opacity-100"></div>
    </div>
    <div class="w-full h-fit flex flex-col gap-2 items-center justify-center my-12 relative z-10">
      <span class="text-5xl text-center leading-18 text-kollektif-bold text-[#9FE29E]">
        Zgjidh 
        <span class="bg-[#9FE29E] text-[#052B28] p-1 rounded-md">Abonimin</span>
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
            :to="`/paypal/${plan.planId}`"
            :svg-color="plan.svgColor"
            :isRecommended="plan.isRecommended"
            @select="selectPlan"
            :plan-type="plan.key"
          />
          <PricingCardEnterprise />
          <div class="col-span-1 md:col-span-2 text-lg lg:col-span-3 text-center text-[#9FE29E] font-poppins font-thin mt-10"> 
              <RouterLink to="/pricing" class="text-xl text-[#9FE29E] font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#9FE29E] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
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
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import toggle from './subcomponents/Toggle.vue'
import PricingCard from './subcomponents/PricingCard.vue'
import PricingCardEnterprise from './subcomponents/PricingCardEnterprise.vue'

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
    planId: 'P-40P32125KN1577439NBNKI4A',
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
    router.push(`/paypal/${plan.planId}`)
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