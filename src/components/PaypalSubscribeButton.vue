<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabaseClient' 
import axios from 'axios'

const props = defineProps({
  planId: {
    type: String,
    required: true
  }
})

const paypal = ref(null)

async function getUserId() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) return null
  return data.user.id 
}

onMounted(async () => {
  const userId = await getUserId()
  if (!userId) return alert('Not logged in!')

  if (window.paypal && paypal.value) {
    window.paypal.Buttons({
      createSubscription(data, actions) {
        return actions.subscription.create({
          plan_id: props.planId // Use the plan ID prop here
        })
      },
      async onApprove(data, actions) {
        try {
          await axios.post('http://localhost:3000/api/paypal/subscribe', {
            subscriptionID: data.subscriptionID,
            userID: userId,
            planId: props.planId 
          })
          window.location.reload();
          window.location.href = '/dashboard'
        } catch (err) {
          alert('Problem activating your subscription.')
        }
      },
      onError(err) {
        alert('An error occurred during payment.')
      }
    }).render(paypal.value)
  }
})
</script>

<template>
  <div ref="paypal"></div>
</template>