<template>
    <div class="relative w-full rounded-xl overflow-hidden p-4 lg:hidden block
              bg-linear-to-br from-secondary from-[-30%] to-primary to-40%">

    <!-- Overlay (lighter for mobile) -->
    <div class="absolute inset-0 opacity-10 pointer-events-none grid-overlay"></div>

    <div class="relative z-10 flex flex-col gap-4">

      <!-- Title -->
      <h3 class="text-2xl text-secondary text-kollektif-bold md:text-4xl">
        Plan i personalizuar
      </h3>

      <!-- Optional description -->
      <p class="text-sm text-secondary opacity-80 md:text-lg">
        Zgjidhje të personalizuara për biznesin tuaj.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col gap-2">
        <button class="w-full py-3 rounded-md bg-primary text-secondary text-sm font-semibold md:text-lg hover:ring-2 hover:ring-primary hover:bg-secondary hover:text-primary duration-200 cursor-pointer">
          Kontakto
        </button>

        <button @click="showDemo = true" class="w-full py-3 rounded-md bg-secondary text-primary text-sm font-semibold md:text-lg hover:ring-2 hover:ring-secondary hover:bg-primary hover:text-secondary duration-200 cursor-pointer">
          Apliko për demo
        </button>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/20 my-2"></div>

      <!-- Features -->
      <ul class="flex text-secondary text-center flex-col gap-2 text-sm md:text-xl">
        <li class="flex items-start gap-2">
          • Çmim i personalizuar
        </li>
        <li class="flex items-start gap-2">
          • Përdorim i palimituar
        </li>
        <li class="flex items-start gap-2">
          • Akses mbi API (së shpejti)
        </li>
        <li class="flex items-start gap-2">
          • Shërbim hostimi skedarësh me afat të përjetshëm
        </li>
      </ul>

    </div>
  </div>

  <div class="w-full h-fit overflow-hidden relative p-3 rounded-md md:flex-row gap-5 hidden lg:block
        bg-linear-to-r from-secondary from-[-30%] to-primary to-40%">
          <div class="grid-overlay absolute scale-200 w-full -transalte-x-1/2 h-screen z-0"></div>
          <div class="w-full h-full flex flex-row justify-between z-10 relative">
            <div class="w-full h-fit p-5 flex flex-col 4xl:gap-7 xl:gap-5 lg:gap-3">
              <h3 class="text-kollektif-bold text-secondary 4xl:text-7xl xl:text-5xl lg:text-3xl ">
                Plan i personalizuar
              </h3>
              <div class="flex flex-row h-fit w-fit gap-5">
                <a href="mailto:demo@example.com" class="text-kollektif-bold 4xl:text-4xl xl:text-2xl lg:text-xl bg-primary hover:ring-2 hover:ring-primary hover:bg-secondary hover:text-primary text-secondary duration-300 transition-all 4xl:px-8 4xl:py-3 xl:px-5 xl:py-1 lg:px-3 lg:py-0.5 rounded-md cursor-pointer">
                  Kontakto
                </a>
                <div @click="DemoClick" class="text-kollektif-bold 4xl:text-4xl xl:text-2xl lg:text-xl bg-secondary hover:ring-2 hover:ring-secondary hover:bg-primary hover:text-secondary text-primary duration-300 transition-all 4xl:px-8 4xl:py-3 xl:px-5 xl:py-1 lg:px-3 lg:py-0.5 rounded-md cursor-pointer">
                  Apliko për demo
                </div>
              </div>
            </div>
            <div class="w-full flex items-center justify-center z-10 relative">
              <ul class="grid grid-cols-2 gap-x-10 gap-y-4 text-secondary 4xl:text-3xl xl:text-lg lg:text-md">
                
                <li class="flex items-start gap-2">
                  Çmim i personalizuar
                </li>
                <li class="flex items-start gap-2">
                  Përdorim i palimituar
                </li>
                <li class="flex items-start gap-2">
                  Akses mbi API (së shpejti)
                </li>
                <li class="flex items-start gap-2">
                  Shërbim hostimi skedarësh me afat të përjetshëm
                </li>

              </ul>
            </div>
          </div>
        </div>

       <div v-if="showDemo" class="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center px-4">        
          <!-- Modal -->
          <div class="relative w-full max-w-lg rounded-xl overflow-hidden
                      bg-linear-to-br from-secondary from-[-20%] to-primary to-50% p-[1px]">

            <!-- Inner container -->
            <div class="relative bg-white rounded-xl p-6 md:p-8 flex flex-col gap-5">

              <!-- Content -->
              <div class="relative z-10 flex flex-col gap-4">

                <!-- Title -->
                <h2 class="text-xl md:text-3xl text-primary text-kollektif-bold">
                  Aplikoni për demo
                </h2>

                <!-- Description -->
                <p class="text-sm md:text-base text-gray-600">
                  Plotësoni formularin për të aplikuar për një demo.
                </p>

                <!-- Form -->
                <form @submit.prevent="applyDemo" class="flex flex-col gap-3 mt-2">

                  <input 
                    type="text"
                    placeholder="Emri juaj"
                    v-model="form.name"
                    class="border border-gray-300 rounded-md px-3 py-2 text-sm md:text-base
                          focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >

                  <input 
                    type="email"
                    placeholder="Email-i juaj"
                    v-model="form.email"
                    class="border border-gray-300 rounded-md px-3 py-2 text-sm md:text-base
                          focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >

                  <textarea 
                    placeholder="Mesazhi juaj (opsionale)"
                    v-model="form.message"
                    rows="3"
                    class="border border-gray-300 rounded-md px-3 py-2 text-sm md:text-base
                          focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none">
                  </textarea>

                  <!-- Buttons -->
                  <div class="flex flex-col md:flex-row gap-2 mt-2">

                    <button 
                      type="button"
                      @click="showDemo = false"
                      class="w-full py-2 rounded-md border border-primary/30 text-primary
                            hover:bg-primary hover:text-secondary transition-all duration-200">
                      Anulo
                    </button>

                    <button 
                      type="submit"
                      class="w-full py-2 rounded-md bg-primary text-secondary
                            hover:bg-secondary hover:text-primary hover:ring-2 hover:ring-primary
                            transition-all duration-200"
                      :class="busy ? 'opacity-50 cursor-not-allowed' : ''"
                      :disabled="busy"
                    >
                      Apliko
                    </button>

                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
  </template>
  <script setup>
  import { ref, reactive } from 'vue'
  import {useAlert} from '@/stores/useAlert'
  import { set } from '@vueuse/core'
  import apiClient from '@/stores/apiClient'

  const showDemo = ref(false)
  const { showAlert } = useAlert()
  const busy = ref(false)
  const form = reactive({
    name: '',
    email: '',
    message: ''
  })

  function DemoClick() {
    console.log('Demo button clicked')
    showDemo.value = true
  }

  async function applyDemo() {
    busy.value = true
    if (!form.name || !form.email) {
      showAlert('warning', 'Ju lutemi plotësoni emrin dhe email-in tuaj.')
      setTimeout(() => {
        busy.value = false
      }, 2000)
      return
    }
    else{
      try{
        const { data } = await apiClient.post('/apply-demo', form)
        if (data.success) {
          showAlert('success', 'Aplikimi u dërgua me sukses! Do të kontaktojmë së shpejti.')
          form.email = ''
          form.name = ''
          form.message = ''
          setTimeout(() => {
          showDemo.value = false
        }, 2000)
        }
      } catch (error) {
        showAlert('error', error.response?.data?.error || 'Ndodhi një gabim në server')
      } finally {
        setTimeout(() => {
          busy.value = false
        }, 2000)
      }
    }
  }
  </script>
  