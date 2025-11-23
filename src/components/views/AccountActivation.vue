<template>
  <!-- Changed h-screen to min-h-screen and allowed scrolling -->
  <div class="w-full min-h-screen bg-primary overflow-y-auto overflow-x-hidden">
    <div class="w-full h-full relative flex flex-col">
      
      <!-- Background SVG lines -->
      <div class="fixed bottom-0 left-0 z-0 w-full h-full pointer-events-none">
        <div class="w-full h-full flex items-end lg:block">
          <logo_lines class="h-1/2 w-full pointer-events-none text-secondary/10" />
        </div>
      </div>

      <!-- Main content -->
      <div class="relative z-10 w-full flex-grow flex justify-center items-center py-12 px-4">
        <div class="w-full max-w-3xl text-secondary flex flex-col items-center lg:items-start text-center lg:text-left">
          
            <h1 class="text-kollektif-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mt-2">
              Riaktivizoni llogarinë tuaj
            </h1>
            <p class="font-poppins text-lg sm:text-xl md:text-2xl font-normal mt-4 opacity-90">
              Vendosni emailin dhe username e llogarisë tuaj për ta riaktivizuar atë.
            </p>
            
            <form class="mt-8 w-full max-w-xl lg:max-w-full" @submit.prevent="handleSubmit">
              <div class="space-y-4 max-w-xl lg:mx-0 mx-auto">
                <input
                  v-model.trim="username"
                  type="text"
                  required
                  class="w-full rounded-full bg-white/10 border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/30 px-6 py-4 text-white placeholder:text-white/60 outline-none transition-all"
                  placeholder="Username"
                />
                <input
                  v-model.trim="email"
                  type="email"
                  required
                  class="w-full rounded-full bg-white/10 border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/30 px-6 py-4 text-white placeholder:text-white/60 outline-none transition-all"
                  placeholder="Email"
                />
                <input
                  v-model="password"
                  type="password"
                  required
                  class="w-full rounded-full bg-white/10 border border-secondary/40 focus:border-secondary focus:ring-2 focus:ring-secondary/30 px-6 py-4 text-white placeholder:text-white/60 outline-none transition-all"
                  placeholder="Fjalëkalimi"
                />
              </div>

              <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                <button
                  type="submit"
                  class="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-secondary text-primary px-8 py-3.5 font-poppins font-medium hover:bg-white transition-colors disabled:opacity-60 shadow-lg shadow-secondary/10"
                  :disabled="busy"
                >
                  <span v-if="busy">Duke ruajtur…</span>
                  <span v-else>Riaktivizoni llogarinë</span>
                </button>
                
                <RouterLink to="/signin"
                  class="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-secondary text-secondary px-8 py-3.5 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                >
                  Kthehu
              </RouterLink>
                
                <a
                  href="mailto:hello@albcaptions.com"
                  class="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-secondary text-secondary px-8 py-3.5 font-poppins font-medium hover:bg-secondary hover:text-primary transition-colors"
                >
                  Na kontakto
                </a>
              </div>
            </form>

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