<template>
  <div class="w-screen min-h-screen bg-white"
  :class="isPricingPage ? '4xl:pt-50 2xl:pt-40 xl:pt-30 lg:pt-20 md:pt-20 pt-10' : ''">
    <div class="w-full h-full p-10 block lg:hidden">
      <div class="w-full h-fit flex flex-col my-5">
        <h3 class="text-kollektif-bold text-primary text-3xl md:text-7xl">
          Titro automatikisht <br>
          Pa shkruar një fjalë
        </h3>
        <p class="font-poppins font-light hidden md:block md:text-3xl">
          Zgjidh abonimin që të përshtatet
        </p>
        <div class="w-fit h-fit flex flex-row bg-[#D9D9D9]/50 rounded-md p-1 mt-5">
          <div
            class="px-2 py-0.5 rounded-md cursor-pointer transition-all duration-200"
            :class="!isYearly
              ? 'bg-white border border-[#353535]/70'
              : 'bg-transparent border border-transparent'"
            @click="isYearly = false"
          >
            <span class="text-primary font-poppins font-light text-sm whitespace-nowrap">
              Abonim mujor
            </span>
          </div>

          <div
            class="flex gap-2 items-center px-2 py-0.5 rounded-md cursor-pointer transition-all duration-200"
            :class="isYearly
              ? 'bg-white border border-[#353535]/70'
              : 'bg-transparent border border-transparent'"
            @click="isYearly = true"
          >
            <span class="text-primary font-poppins font-light text-sm whitespace-nowrap">
              Abonim vjetor
            </span>
            <div class="bg-secondary px-1 flex items-center py-0.5 rounded-sm">
              <span class="text-primary font-poppins font-light text-[8px] whitespace-nowrap">
                Kurse 30%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-fit flex flex-col gap-5">
        <div
            v-for="plan in plans"
            :key="plan.key"
            class="h-1/3"
          >
            <MobPricingCard
              :badge-text="plan.badgeText"
              :badge-color="plan.badgeColor"
              :price="isYearly ? plan.price.yearly : plan.price.monthly"
              :decimal="isYearly ? plan.decimal.yearly : plan.decimal.monthly"
              :old-monthly-price="isYearly ? plan.price.monthly : null"
              :old-decimal="isYearly ? plan.decimal.monthly : '99'"
              :show-old-monthly-price="isYearly"
              :percent-saved="isYearly ? plan.percentSaved : null"
              :currency="plan.currency"
              :price-description="'për muaj'"
              :description="plan.description"
              :features="plan.features"
              :svg-color="plan.svgColor"
              :is-recommended="plan.isRecommended || false"
              :plan-type="plan.key"
              @select="selectPlan"
            />
        </div>
        <PricingCardEnterprise class="my-10"/>      
      </div>
      <div v-if="!isPricingPage" class="w-full text-center mt-10">
        <RouterLink
            to="/pricing"
            class="text-lg md:text-2xl text-primary font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Krahaso Planet
          </RouterLink>
        </div>
      
    </div>
    <PricingDetails v-if="isPricingPage" class="lg:hidden block"/>
    <div class="w-full h-full p-10  hidden lg:block">

      <!-- ===== HEADER ===== -->
      <div class="w-full h-fit flex flex-col 4xl:gap-10 xl:gap-7 lg:gap-5">
        <h3 class="text-kollektif-bold text-primary 4xl:text-9xl xl:text-8xl lg:text-6xl">
          Titro automatikisht <br>
          Pa shkruar një fjalë
        </h3>
        <p class="font-poppins font-light 4xl:text-5xl xl:text-3xl lg:text-2xl">
          Zgjidh abonimin që të përshtatet
        </p>

        <!-- ===== BILLING TOGGLE ===== --> 
        <div class="w-fit flex flex-row items-center bg-[#D9D9D9]/50 gap-5 rounded-md">
          <!-- Monthly -->
          <div
            class="px-6 4xl:py-3 xl:py-2 lg:py-1 rounded-md cursor-pointer transition-all duration-200"
            :class="!isYearly
              ? 'bg-white border border-[#353535]/70'
              : 'bg-transparent border border-transparent'"
            @click="isYearly = false"
          >
            <span class="text-primary font-poppins font-light 4xl:text-3xl xl:text-xl lg:text-lg whitespace-nowrap">
              Abonim mujor
            </span>
          </div>

          <!-- Yearly -->
          <div
            class="flex gap-3 items-center px-3 4xl:py-3 xl:py-2 lg:py-1 rounded-md cursor-pointer transition-all duration-200"
            :class="isYearly
              ? 'bg-white border border-[#353535]/70'
              : 'bg-transparent border border-transparent'"
            @click="isYearly = true"
          >
            <span class="text-primary font-poppins font-light 4xl:text-3xl xl:text-xl lg:text-lg whitespace-nowrap">
              Abonim vjetor
            </span>
            <div class="bg-secondary xl:px-2 lg:px-1 lg:py-0.5 4xl:py-2 xl:py-1 lg:rounded-sm xl:rounded-lg">
              <span class="text-primary font-poppins 4xl:font-normal xl:font-light lg:font-thin 4xl:text-md xl:text-sm lg:text-xs whitespace-nowrap">
                Kurse 30%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== PRICING CARDS ===== -->
      <div class="my-10 w-full h-full">
        <div class="w-full h-full flex flex-row lg:gap-4 4xl:gap-12 xl:gap-10 my-5 items-stretch">
          <div
            v-for="plan in plans"
            :key="plan.key"
            class="w-1/3"
          >
            <PricingCard
              :badge-text="plan.badgeText"
              :badge-color="plan.badgeColor"
              :price="isYearly ? plan.price.yearly : plan.price.monthly"
              :decimal="isYearly ? plan.decimal.yearly : plan.decimal.monthly"
              :old-monthly-price="isYearly ? plan.price.monthly : null"
              :old-decimal="isYearly ? plan.decimal.monthly : '99'"
              :show-old-monthly-price="isYearly"
              :percent-saved="isYearly ? plan.percentSaved : null"
              :currency="plan.currency"
              :price-description="'për muaj'"
              :description="plan.description"
              :features="plan.features"
              :svg-color="plan.svgColor"
              :is-recommended="plan.isRecommended || false"
              :plan-type="plan.key"
              @select="selectPlan"
            />
          </div>
        </div>

        <PricingCardEnterprise class="my-10"/>

        <!-- Compare plans link -->
        <div v-if="!isPricingPage" class="w-full text-center mt-10">
          <RouterLink
            to="/pricing"
            class="4xl:text-3xl xl:text-xl lg:text-lg text-primary font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Krahaso Planet
          </RouterLink>
        </div>
      </div>
    </div>

    <PricingDetails v-if="isPricingPage" class="hidden lg:block"/>
    <FooterComponent v-if="isPricingPage" class="hidden lg:block"/>
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
import { ref, computed } from 'vue'
import PricingCard from './subcomponents/PricingCard.vue'
import PayPalPayment from './items/PayPalPayment.vue'
import PricingCardEnterprise from './subcomponents/PricingCardEnterprise.vue'
import MobPricingCard from './subcomponents/MobPricingCard.vue'
import PricingDetails from './PricingDetails.vue'
import { useRoute } from 'vue-router'
import FooterComponent from './FooterComponent.vue'


const route = useRoute()
const isPricingPage = computed(() => route.path === '/pricing')

function getPercentSaved(monthly, yearly) {
  const m = parseFloat(monthly)
  const y = parseFloat(yearly)
  if (!m || !y) return null
  return Math.round(((m - y) / m) * 100)
}

const isYearly = ref(true)

const plans = [
  {
    key: 'starter',
    badgeText: 'Starter',
    badgeColor: '#6B7280',
    price: { monthly: '10', yearly: '8' },
    decimal: { monthly: '0', yearly: '00' },
    yearlytotal: { monthly: '', yearly: '96' },
    currency: '€',
    description: 'Krijo video që zbulojnë audienca të reja',
    percentSaved: getPercentSaved('10', '8'),
    features: [
      { text: '15 Video / Muaj' },
      { text: 'Limit 250MB / Video' },
      {text:  '60 Min / Muaj'},
      { text: 'Suportohet Çdo Dialekt' },
      { text: 'Transkript i sinkronizuar' },
      { text: 'Ngarkim në çdo format video dhe audio' },
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
    planId: 'P-93354509CK7566242NBNKHJQ',
    svgColor: '#E5E7EB'
  },
  {
    key: 'pro',
    badgeText: 'Pro',
    badgeColor: '#052B28',
    price: { monthly: '25', yearly: '20' },
    decimal: { monthly: '00', yearly: '00' },
    yearlytotal: { monthly: '', yearly: '240' },
    currency: '€',
    description: 'Transformo videot në mjete që të sjellin klientë',
    percentSaved: getPercentSaved('25', '20'),
    features: [
      { text: '35 Video / Muaj' },
      { text: 'Limit 500MB / Video' },
      { text:  '240 Min / Muaj'},
      { text: 'Suportohet Çdo Dialekt' },
      { text: 'Transkript i sinkronizuar' },
      { text: 'Ngarkim në çdo format video dhe audio' },
      { text: 'Program Redaktimi' },
      { text: 'Shkarko .srt .vtt' },
      { text: 'Shërbim Prioritar' },
      { text: 'Funksionalitete për skuadra (së shpejti)' }
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
    planId: 'P-0E8458666N319325DNHZBTKQ',
    isRecommended: true,
    svgColor: '#9FE29E'
  },
  {
    key: 'business',
    badgeText: 'Business',
    badgeColor: '#6B7280',
    price: { monthly: '40', yearly: '32' },
    decimal: { monthly: '00', yearly: '00' },
    yearlytotal: { monthly: '', yearly: '384' },
    currency: '€',
    description: 'Optimizim i krijimit të videove për ekipe që mendojnë shpejt',
    percentSaved: getPercentSaved('40', '32'),
    features: [
      { text: '70 Video / Muaj' },
      { text: 'Limit 1GB / Video' },
      { text:  '450 Min / Muaj'},
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

// Payment modal
const showPayPalPayment = ref(false)
const selectedPlan = ref(null)
const selectedPlanId = ref(null)

function selectPlan(planKey) {
  const plan = plans.find(p => p.key === planKey)
  if (plan) {
    selectedPlan.value = plan
    selectedPlanId.value = plan.planId
    showPayPalPayment.value = true
  }
}
</script>