<template>
  <PaypalSubscribeButton :planId="planId" />
</template>

<script setup>
import PaypalSubscribeButton from './PaypalSubscribeButton.vue';

const props = defineProps({
  planId: {
    type: String,
    required: true
  }
})
</script>