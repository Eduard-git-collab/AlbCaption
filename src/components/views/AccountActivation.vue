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
          <div class="max-w-3xl w-full">
            <h1 class="text-kollektif-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl leading-tight mt-2">
              Riaktivizoni llogarinë tuaj
            </h1>
            <p class="font-poppins text-lg sm:text-xl md:text-2xl lg:text-2xl font-normal mt-3 sm:mt-4 md:mt-5 opacity-90">
              Vendosni emailin dhe username e llogarisë tuaj për ta riaktivizuar atë.
            </p>
            
            <form class="mt-6 sm:mt-8 w-full" @submit.prevent="handleSubmit">
              <div class="space-y-4 max-w-xl">
                <input
                  v-model.trim="username"
                  type="text"
                  required
                  class="w-full rounded-full bg-white/10 border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/30 px-6 py-3 text-white placeholder:text-white/60 outline-none"
                  placeholder="username"
                />
                <input
                  v-model.trim="email"
                  type="email"
                  required
                  class="w-full rounded-full bg-white/10 border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/30 px-6 py-3 text-white placeholder:text-white/60 outline-none"
                  placeholder="Email"
                />
                <input
                  v-model="password"
                  type="password"
                  required
                  class="w-full rounded-full bg-white/10 border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/30 px-6 py-3 text-white placeholder:text-white/60 outline-none"
                  placeholder="Fjalëkalimi"
                />
              </div>

              <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button
                  type="submit"
                  class="cursor-pointer inline-flex items-center justify-center rounded-full bg-secondary text-primary px-5 sm:px-6 py-3 sm:py-3.5 font-poppins font-medium hover:bg-white transition-colors disabled:opacity-60"
                  :disabled="busy"
                >
                  <span v-if="busy">Duke ruajtur…</span>
                  <span v-else>Riaktivizoni llogarinë</span>
                </button>
                <span @click="$router.back(-1)"
                  to="/signin"
                  class="cursor-pointer inline-flex items-center justify-center rounded-full border border-secondary text-secondary px-5 sm:px-6 py-3 sm:py-3.5 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                >
                  Kthehu tek regjistrimi
                </span>
                <a
                  href="mailto:hello@albcaptions.com"
                  class="inline-flex items-center justify-center rounded-full border border-secondary text-secondary px-5 sm:px-6 py-3 sm:py-3.5 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                >
                  Na kontakto
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import logo_lines from '../logos/Logo_lines.vue'
  import apiClient from '@/stores/apiClient'

  const username = ref('')
  const password = ref('')
  const email = ref('')
  const busy = ref(false)

  const handleSubmit = async() =>{
    busy.value=true;
    try{
      if(!username.value || !email.value){
        alert("Ju lutem plotësoni të gjitha fushat.");
        busy.value=false;
        return;
      }
      const response = await apiClient.put('/auth/account-reactivation', {
        username: username.value,
        email: email.value,
        password: password.value
      });
      if(response.data.success){
        setTimeout(() => {
          alert("Llogaria juaj është riaktivizuar me sukses. Tani mund të identifikoheni.");
          window.location.href="/dashboard";
        }, 1000);
      }else{
        alert(response.data.message || "Ndodhi një gabim gjatë përpjekjes për riaktivizimin e llogarisë.");
      }
    }catch(error){
      console.error(error);
      alert("Ndodhi një gabim gjatë përpjekjes për riaktivizimin e llogarisë.");
    }
    busy.value=false;
  }
</script>