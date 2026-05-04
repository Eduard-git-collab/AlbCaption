<template>
  <div class="relative">
    <section class="relative min-h-[200vh] bg-white">
      <div class="sticky top-0 z-0">
        <div class="w-screen min-h-screen md:h-screen relative overflow-hidden py-40 lg:py-0">
          <div class="w-full h-full px-10 z-20 relative">
            <div class="w-full h-full flex-col lg:flex-row flex gap-10 items-center">
              <div class="lg:w-2/3 w-full h-full flex flex-col justify-center gap-5">
                <h1
                  class="text-kollektif-bold text-primary 4xl:text-[250px] 2xl:text-[150px] xl:text-9xl lg:text-6xl md:text-7xl text-5xl text-center lg:text-left"
                >
                  Jemi gati të të ndihmojmë
                </h1>
                <span
                  class="w-full font-poppins font-normal 4xl:text-6xl 2xl:text-4xl xl:text-3xl lg:text-xl md:text-2xl text-lg text-center lg:text-left"
                >
                  Mbush formularin për çdo shqetësim ose vështirësi
                </span>
              </div>

              <form
                @submit.prevent="handleSubmitReport"
                class="lg:w-1/3 w-full h-fit bg-white rounded-xl border-2 border-[#E5E5E5] p-10 flex flex-col 4xl:gap-20 2xl:gap-16 xl:gap-12 gap-10 4xl:shadow-[12px_16px_12px_8px_rgba(0,0,0,0.25)] shadow-[5px_5px_0px_rgba(0,0,0,0.25)]"
              >
                <div class="w-full h-12 flex flex-col gap-1 mt-5 lg:mt-10">
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="e-mail"
                    class="w-full h-full rounded-lg 4xl:text-2xl 2xl:text-xl border-2 border-[#E5E5E5] 4xl:py-10 2xl:py-6 xl:py-4 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span class="text-[8px] md:text-sm lg:text-xs 2xl:text-lg font-poppins text-primary/20">
                    *Ju lutemi përdorni adresën me të cilën keni krijuar llogari në AlbCaptions*
                  </span>
                </div>

                <div class="w-full h-[25vh] flex flex-col gap-5">
                  <textarea
                    v-model="form.description"
                    placeholder="Problemi apo paqartësia jote..."
                    class="w-full h-full rounded-lg border-2 4xl:text-2xl 2xl:text-xl border-[#E5E5E5] 4xl:py-10 2xl:py-6 xl:py-4 p-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  ></textarea>

                  <div class="w-full h-fit">
                    <button
                      type="submit"
                      class="w-full h-full 4xl:py-8 2xl:py-5 py-3 bg-secondary text-primary rounded-lg font-poppins font-semibold 4xl:text-5xl 2xl:text-2xl lg:text-xl md:text-xl text-base hover:bg-primary hover:text-secondary cursor-pointer hover:ring-3 hover:ring-secondary transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="busy"
                    >
                      <span v-if="busy">Duke dërguar...</span>
                      <span v-else>Dërgo Formularin</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <Albcaption_logo_inv_nobg
            class="absolute z-0 bottom-0 -left-10 4xl:w-180 4xl:h-180 2xl:w-120 2xl:h-120 w-100 h-100 translate-y-1/3 opacity-50"
          />
        </div>
      </div>

      <div class="relative z-50 shadow-2xl">
        <FooterComponent />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAlert } from '@/stores/useAlert'
import apiClient from '@/stores/apiClient'
import FooterComponent from './FooterComponent.vue'
import Albcaption_logo_inv_nobg from './logos/Albcaption_logo_inv_nobg.vue'

const { showAlert } = useAlert()
const busy = ref(false)
const form = reactive({ email: '', description: '' })

async function handleSubmitReport() {
  if (!form.email.trim()) return showAlert('warning', 'Ju lutemi vendosni email-in')
  if (!form.description.trim()) return showAlert('warning', 'Përshkruani problemin tuaj')

  busy.value = true
  try {
    const { data } = await apiClient.post('/contact', form)
    if (data.success) {
      showAlert('success', 'Raporti u dërgua me sukses!')
      form.email = ''
      form.description = ''
    }
  } catch (error) {
    showAlert('error', error.response?.data?.error || 'Ndodhi një gabim në server')
  } finally {
    busy.value = false
  }
}
</script>