<template>
  <a href="" class="text-md text-primary mx-4" @click.prevent="promptPrivacyPolicy">
    <span>Privacy Policy</span>
  </a>
  <a href="" class="text-md text-primary mx-4" @click.prevent="promptToSModal">
    <span>TOS</span>
  </a>
  <ToSModal
  v-model:open="ShowToSModal"
  />
  <PrivacyPolicyModal
    v-model:open="ShowPrivacyPolicy"
  />
</template>

<script setup>
import { ref } from 'vue';
import PrivacyPolicyModal from './items/PrivacyPolicyModal.vue'
import ToSModal from './items/ToSModal.vue';
const ShowPrivacyPolicy = ref(false);
const ShowToSModal = ref(false);
const promptPrivacyPolicy = () => {
  ShowPrivacyPolicy.value = true;
};
const promptToSModal = () => {
  ShowToSModal.value = true;
};

</script>