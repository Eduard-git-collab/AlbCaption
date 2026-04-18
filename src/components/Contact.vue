<template>
    <div class="w-screen h-screen relative overflow-hidden">
        <div class="w-full h-full px-10 z-0">
            <div class="w-full h-full flex gap-10 items-center">
                <div class="w-2/3 h-full flex flex-col justify-center gap-5">
                    <h1 class="text-kollektif-bold text-primary text-9xl">
                        Jemi gati të të ndihmojmë
                    </h1>
                    <span class="w-fit font-poppins font-normal text-3xl">
                        Mbush formularin për çdo shqetësim ose vështirësi
                    </span>
                </div>
                <form @submit.prevent="handleSubmitReport" class="w-1/3 h-fit rounded-xl border-2 border-[#E5E5E5] p-10 flex flex-col gap-10 4xl:shadow-[12px_16px_12px_8px_rgba(0,0,0,0.25)] shadow-[5px_5px_0px_rgba(0,0,0,0.25)]">
                    <div class="w-full h-12 flex flex-col gap-1 mt-10">
                        <input 
                        v-model="form.email"
                        type="email" 
                        placeholder="e-mail"
                        class="w-full h-full rounded-lg border-2 border-[#E5E5E5] p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        oninvalid="this.setCustomValidity('Ju lutemi vendosni një adresë email të vlefshme')"
                        oninput="this.setCustomValidity('')"/>
                        <span class="text-xs font-poppins text-gray-300">*Ju lutemi përdorni adresën me të cilën keni krijuar llogari në AlbCaptions*</span>
                    </div>
                    <div class="w-full h-[25vh] flex flex-col gap-5">
                        <textarea 
                        v-model="form.description"
                        placeholder="Problemi apo paqartësia jote..."
                        class="w-full h-full rounded-lg border-2 border-[#E5E5E5] p-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
                        <div class="w-full h-fit">
                        <button 
                        type="submit"
                        class="w-full h-full py-3 bg-secondary text-primary rounded-lg font-poppins font-semibold text-xl hover:bg-primary hover:text-secondary cursor-pointer hover:ring-3 hover:ring-secondary transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="busy">
                            <span v-if="busy">Duke dërguar...</span>
                            <span v-else>Dërgo</span>
                        </button>
                    </div>
                    </div>
                    
                </form>
            </div>
        </div>
            <Albcaption_logo_inv_nobg class="absolute z-10 bottom-0 -left-10 w-100 h-100 translate-y-1/3 opacity-50" />
    </div>

</template>

<script setup>
import { ref, reactive } from 'vue'
//import apiClient from '@/stores/apiClient'
import Albcaption_logo_inv_nobg from './logos/Albcaption_logo_inv_nobg.vue';


const busy = ref(false)
const form = reactive({
    email: '',
    description: ''
})


async function handleSubmitReport() {
  // Validate form
  if (!form.email.trim()) {
    console.log('Email është i detyrueshëm')
    return
  }

  if (!form.description.trim()) {
    console.log('Pershkrimi është i detyrueshëm')
    return
  }

  console.log('Submitting report with data:', form)
  busy.value = true

//   try {
//     // Create FormData for file upload
//     const formData = new FormData()
//     formData.append('email', form.email.trim())
//     formData.append('description', form.description.trim())

//     const response = await apiClient.post('/auth/report-bug', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })

//     if (response.data.success) {
//       successMessage.value = 'Raporti u dërgua me sukses! Faleminderit për përshtypjet tuaja.'
      
//       setTimeout(() => {
//         emit('saved')
//         close()
//       }, 1500)
//     } else {
//       errorMessage.value = response.data.error || 'Gabim gjatë dërgimit të raportit'
//     }
//   } catch (error) {
//     console.error('[BUG-REPORT] Error:', error)
    
//     if (error.response?.data?.error) {
//       errorMessage.value = error.response.data.error
//     } else if (error.response?.status === 401) {
//       errorMessage.value = 'Ju duhet të jeni i regjistruar për të dërguar një raport'
//     } else {
//       errorMessage.value = error.message || 'Gabim gjatë dërgimit të raportit. Provo përsëri.'
//     }
//   } finally {
//     busy.value = false
//   }
}

</script>