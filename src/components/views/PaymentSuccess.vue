<template>
  <!-- Changed h-screen to min-h-screen and allowed scrolling (overflow-y-auto) -->
  <div class="w-full min-h-screen bg-primary overflow-y-auto overflow-x-hidden">
    <div class="w-full h-full relative flex flex-col">
      
      <!-- Background SVG lines -->
      <div class="fixed bottom-0 left-0 z-0 w-full h-full pointer-events-none">
        <div class="w-full h-full flex items-end lg:block">
          <logo_lines class="h-1/2 w-full pointer-events-none text-secondary/10" />
        </div>
      </div>

      <!-- Main content container: Flex grow to fill space, centered vertically/horizontally -->
      <div class="relative z-10 w-full flex-grow flex justify-center items-center py-12 px-4">
        <div class="w-full max-w-3xl text-secondary flex flex-col items-center lg:items-start text-center lg:text-left">
          
            <!-- Loading state -->
            <div v-if="isProcessing" class="w-full flex flex-col items-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mb-6"></div>
              <div class="text-kollektif-bold text-4xl sm:text-5xl md:text-6xl leading-none">
                Duke procesuar...
              </div>
              <p class="font-poppins text-lg sm:text-xl font-normal mt-4 opacity-90">
                Po konfirmojmë pagesën tuaj. Ju lutemi prisni...
              </p>
            </div>

            <!-- Success state -->
            <div v-else-if="!hasError" class="w-full">
              
              <h1 class="text-kollektif-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mt-2">
                Abonimi juaj u aktivizua
              </h1>
              <p class="font-poppins text-lg sm:text-xl font-normal mt-4 opacity-90">
                Faleminderit për abonim! Tani mund të shijoni të gjitha benefitet e planit tuaj.
              </p>
              
              <div class="mt-4 text-white text-xs sm:text-sm italic font-poppins opacity-80 space-y-1">
                <p>*Plani juaj mund të dojë disa çaste të përditësohet.*</p>
                <p>
                  *Nëse ende keni probleme, mund të 
                  <RouterLink to="/contact" class="text-secondary underline decoration-secondary/50 hover:decoration-secondary transition-all">
                      na kontaktoni 
                  </RouterLink>ose 
                  <RouterLink to="/report" class="text-secondary underline decoration-secondary/50 hover:decoration-secondary transition-all">
                      raportoni një problem
                  </RouterLink> *
                </p>
              </div>

              <div v-if="subscriptionInfo" class="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20 inline-block w-full lg:w-auto">
                <p class="font-poppins text-sm sm:text-base opacity-80 break-all">
                  <strong>ID e abonimit:</strong> {{ subscriptionInfo.id }}
                </p>
              </div>

              <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                <router-link
                  to="/dashboard"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-secondary text-primary px-8 py-4 font-poppins font-medium hover:bg-white transition-colors shadow-lg shadow-secondary/10"
                >
                  Shko tek Dashboard
                </router-link>
                <router-link
                  to="/upload"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-secondary text-secondary px-8 py-4 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                >
                  Ngarko Video
                </router-link>
              </div>
            </div>

            <!-- Error state -->
            <div v-else class="w-full">
              <div class="flex justify-center lg:justify-start mb-6">
                <div class="rounded-full bg-red-500/20 p-4 backdrop-blur-sm">
                  <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              </div>
              
              <div class="text-kollektif-bold text-4xl sm:text-5xl lg:text-7xl leading-none text-red-400">
                Gabim!
              </div>
              <h1 class="text-kollektif-bold text-2xl sm:text-3xl lg:text-5xl leading-tight mt-2">
                Diçka shkoi keq
              </h1>
              <p class="font-poppins text-lg sm:text-xl font-normal mt-4 opacity-90">
                {{ errorMessage || 'Nuk arritëm të procesojmë pagesën tuaj. Ju lutemi provo përsëri ose na kontaktoni.' }}
              </p>

              <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                <router-link
                  to="/pricing"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-secondary text-primary px-8 py-4 font-poppins font-medium hover:bg-white transition-colors"
                >
                  Provo Përsëri
                </router-link>
                <a
                  href="mailto:hello@albcaptions.com"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-secondary text-secondary px-8 py-4 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                >
                  Na Kontakto
                </a>
              </div>
            </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo_lines from '../logos/Logo_lines.vue'

const route = useRoute()
const router = useRouter()

const isProcessing = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const subscriptionInfo = ref(null)

onMounted(async () => {
  // Check for PayPal's actual return parameters
  const hasSubscriptionId = route.query.subscription_id
  const hasToken = route.query.token
  const hasBAToken = route.query.ba_token
  
  // PayPal returns these parameters on successful subscription creation
  if (hasSubscriptionId && (hasToken || hasBAToken)) {
    
    subscriptionInfo.value = {
      id: hasSubscriptionId,
      token: hasToken || hasBAToken
    }
    
    // Simulate processing time (webhook might still be processing)
    setTimeout(() => {
      isProcessing.value = false
      hasError.value = false
    }, 2000)
    
  } else if (route.query.subscription === 'success') {
    // Fallback: Check for our custom success parameter
    if (route.query.id) {
      subscriptionInfo.value = {
        id: route.query.id
      }
    }
    
    setTimeout(() => {
      isProcessing.value = false
      hasError.value = false
    }, 2000)
    
  } else if (route.query.error) {
    // Handle error cases
    const errorType = route.query.error
    
    switch (errorType) {
      case 'missing_subscription':
        errorMessage.value = 'Nuk u gjet asnjë abonim për tu aktivizuar.'
        break
      case 'processing_failed':
        errorMessage.value = 'Procesimi i abonimit dështoi. Ju lutemi provo përsëri.'
        break
      case 'execution_failed':
        errorMessage.value = 'Aktivizimi i abonimit dështoi. Pagesa mund të jetë bërë por abonimi nuk u aktivizua.'
        break
      default:
        errorMessage.value = 'Ndodhi një gabim gjatë procesimit të pagesës.'
    }
    
    setTimeout(() => {
      isProcessing.value = false
      hasError.value = true
    }, 1500)
    
  } else {
    // No clear success or error indication
    
    setTimeout(() => {
      isProcessing.value = false
      hasError.value = true
      errorMessage.value = 'Statusi i pagesës nuk është i qartë. Ju lutemi kontrolloni dashboard-in tuaj ose na kontaktoni.'
    }, 1500)
  }
})
</script>