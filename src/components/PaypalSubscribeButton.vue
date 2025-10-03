<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import PayPalLogo from './svg/PayPalLogo.vue'
import axios from 'axios'

const props = defineProps({
  planId: { type: String, required: true }
})

const userIdRef = ref(null)
const isLoading = ref(false)

async function getUserId() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) return null
  return data.user.id
}

// Direct PayPal subscription creation
async function createPayPalSubscription() {
  if (isLoading.value) return
  
  const uid = userIdRef.value || (userIdRef.value = await getUserId())
  if (!uid) return alert('Not logged in!')

  isLoading.value = true

  try {
    console.log(`Creating subscription for plan: ${props.planId}`)
    
    // Use relative URL instead of hardcoded localhost
    const response = await axios.post('http://localhost:3000/api/paypal/create-subscription', {
      planId: props.planId,
      userID: uid
    })

    console.log('Subscription creation response:', response.data)

    if (response.data.approvalUrl) {
      // Redirect to PayPal for approval
      console.log('Redirecting to PayPal:', response.data.approvalUrl)
      window.location.href = response.data.approvalUrl
    } else {
      throw new Error('No approval URL received')
    }
  } catch (error) {
    console.error('Subscription creation error:', error)
    alert('Unable to create subscription. Please try again.')
    isLoading.value = false
  }
}

onMounted(async () => {
  userIdRef.value = await getUserId()
})
</script>

<template>
  <div class="relative inline-block">
    <!-- Your custom button -->
    <div 
      class="w-fit mx-auto flex flex-col items-center justify-center gap-2 select-none cursor-pointer"
      @click="createPayPalSubscription"
    >
      <div 
        class="w-fit flex items-center justify-center gap-2 bg-primary rounded-md px-24 py-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
        :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
      >
        <PayPalLogo class="w-8 h-8" />
        <h1 class="font-poppins text-secondary font-medium text-xl">
          {{ isLoading ? 'Abonohu...' : 'Abonohu' }}
        </h1>
      </div>
      <span class="ml-3 text-gray-500 text-[10px] font-normal italic">
        Powered by
        <span class="italic text-[15px] font-poppins font-semibold">
          <span class="text-[#003087]">Pay</span><span class="text-[#009cde]">Pal</span>
        </span>
      </span>
    </div>
  </div>
</template>