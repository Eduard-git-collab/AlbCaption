<template>
    <div class="w-screen h-screen bg-primary overflow-hidden">
      <div class="w-full h-full relative">
        <!-- Background SVG lines -->
        <div class="absolute bottom-0 left-0 z-0 w-full h-full pointer-events-none">
          <div class="w-full h-full flex items-end lg:block">
            <logo_lines class="h-1/2 w-full pointer-events-none" />
          </div>
        </div>
  
        <!-- Main content -->
        <div class="relative z-10 w-full flex justify-center h-full items-center sm:items-center md:items-center lg:items-start xl:items-start">
          <div class="p-4 sm:p-6 md:p-8 lg:p-10 my-8 sm:my-0 md:my-0 lg:my-16 xl:my-20 text-secondary flex items-center w-full sm:w-11/12 md:w-5/6 lg:w-3/4 xl:w-3/4 h-fit justify-center text-center lg:text-left">
            <div class="max-w-3xl">
              <!-- Loading state -->
              <div v-if="isProcessing" class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto mb-6"></div>
                <div class="text-kollektif-bold text-4xl sm:text-5xl md:text-6xl leading-none">
                  Duke procesuar...
                </div>
                <p class="font-poppins text-lg sm:text-xl md:text-2xl font-normal mt-3 sm:mt-4 opacity-90">
                  Po konfirmojmë pagesën tuaj. Ju lutemi prisni...
                </p>
              </div>
  
              <!-- Success state -->
              <div v-else-if="!hasError" class="text-center lg:text-left">
                
                <h1 class="text-kollektif-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mt-2">
                  Abonimi juaj u aktivizua
                </h1>
                <p class="font-poppins text-lg sm:text-xl md:text-2xl font-normal mt-3 sm:mt-4 opacity-90">
                  Faleminderit për abonim! Tani mund të shijoni të gjitha benefitet e planit tuaj.
                </p>
                <span class="text-white text-[10px] italic font-poppins">*Plani juaj mund të dojë disa çaste të përditësohet.*<br>*Nëse ende keni probleme, mund të 
                <RouterLink to="/contact" class="text-secondary font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-secondary after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
                    na kontaktoni 
                </RouterLink>ose 
                <RouterLink to="/report" class="text-secondary font-poppins relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-secondary after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100">
                    raportoni një problem
                </RouterLink> *</span>
  
                <div v-if="subscriptionInfo" class="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p class="font-poppins text-sm sm:text-base opacity-80">
                    <strong>ID e abonimit:</strong> {{ subscriptionInfo.id }}
                  </p>
                </div>
  
                <div class="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <router-link
                    to="/dashboard"
                    class="inline-flex items-center justify-center rounded-full bg-secondary text-primary px-6 py-3.5 font-poppins font-medium hover:bg-white transition-colors"
                  >
                    Shko tek Dashboard
                  </router-link>
                  <router-link
                    to="/upload"
                    class="inline-flex items-center justify-center rounded-full border border-secondary text-secondary px-6 py-3.5 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                  >
                    Ngarko Video
                  </router-link>
                </div>
              </div>
  
              <!-- Error state -->
              <div v-else class="text-center lg:text-left">
                <div class="flex justify-center lg:justify-start mb-6">
                  <div class="rounded-full bg-red-500 p-4">
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="text-kollektif-bold text-5xl sm:text-6xl md:text-7xl leading-none text-red-400">
                  Gabim!
                </div>
                <h1 class="text-kollektif-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mt-2">
                  Diçka shkoi keq
                </h1>
                <p class="font-poppins text-lg sm:text-xl md:text-2xl font-normal mt-3 sm:mt-4 opacity-90">
                  {{ errorMessage || 'Nuk arritëm të procesojmë pagesën tuaj. Ju lutemi provoni përsëri ose na kontaktoni.' }}
                </p>
  
                <div class="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <router-link
                    to="/pricing"
                    class="inline-flex items-center justify-center rounded-full bg-secondary text-primary px-6 py-3.5 font-poppins font-medium hover:bg-white transition-colors"
                  >
                    Provo Përsëri
                  </router-link>
                  <a
                    href="mailto:hello@albcaptions.com"
                    class="inline-flex items-center justify-center rounded-full border border-secondary text-secondary px-6 py-3.5 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                  >
                    Na Kontakto
                  </a>
                </div>
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
    console.log('Payment success page mounted')
    console.log('Query params:', route.query)
    
    // Check for PayPal's actual return parameters
    const hasSubscriptionId = route.query.subscription_id
    const hasToken = route.query.token
    const hasBAToken = route.query.ba_token
    
    // PayPal returns these parameters on successful subscription creation
    if (hasSubscriptionId && (hasToken || hasBAToken)) {
      console.log('PayPal success parameters detected:', {
        subscription_id: hasSubscriptionId,
        token: hasToken,
        ba_token: hasBAToken
      })
      
      subscriptionInfo.value = {
        id: hasSubscriptionId,
        token: hasToken || hasBAToken
      }
      
      // Simulate processing time (webhook might still be processing)
      setTimeout(() => {
        isProcessing.value = false
        hasError.value = false
        console.log('Payment processing completed successfully')
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
        console.log('Custom success parameter detected')
      }, 2000)
      
    } else if (route.query.error) {
      // Handle error cases
      const errorType = route.query.error
      
      switch (errorType) {
        case 'missing_subscription':
          errorMessage.value = 'Nuk u gjet asnjë abonim për tu aktivizuar.'
          break
        case 'processing_failed':
          errorMessage.value = 'Procesimi i abonimit dështoi. Ju lutemi provoni përsëri.'
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
        console.log('Payment processing failed:', errorType)
      }, 1500)
      
    } else {
      // No clear success or error indication
      console.log('No clear payment status indicators found')
      
      setTimeout(() => {
        isProcessing.value = false
        hasError.value = true
        errorMessage.value = 'Statusi i pagesës nuk është i qartë. Ju lutemi kontrolloni dashboard-in tuaj ose na kontaktoni.'
        console.log('Payment status unclear')
      }, 1500)
    }
  })
  </script>