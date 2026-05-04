<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import Albcaptions_logo from './logos/Albcaptions_logo.vue';
import Logo_lines from './logos/Logo_lines.vue';
import { useAlert } from '@/stores/useAlert'
import apiClient from '@/stores/apiClient';
import { supabase } from '@/lib/supabaseClient.js';

const props = defineProps({
  isLogin: {
    type: Boolean,
    default: false
  }
});
const { showAlert } = useAlert()
const router = useRouter();
const isLogin = ref(props.isLogin);
const loading = ref(false);
const showLogin = ref(props.isLogin);
const isInactiveAccount = ref(false);
const showConfirmPassword = ref(false);
const showSignInPassword = ref(false);
const formData = ref({
  name: '',
  surname: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  emailOrUsername: ''
});

const toggleForm = () => {
  if (showLogin.value) {
    router.push('/signup').then(() => {
      window.location.reload();
    });
  } else {
    router.push('/signin').then(() => {
      window.location.reload();
    });
  }
};

const handleSignup = async (e) => {
  e.preventDefault();
  loading.value = true;
  isInactiveAccount.value = false;

  if (!formData.value.name || !formData.value.surname || !formData.value.username || !formData.value.email || !formData.value.password || !formData.value.confirmPassword) {
    showAlert('warning', 'Të lutem plotësoni të gjitha fushat');
    loading.value = false;
    return;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    showAlert('warning', 'Fjalëkalimet nuk përputhen');
    loading.value = false;
    return;
  }

  try {
    const payload = {
      name: formData.value.name.trim(),
      surname: formData.value.surname.trim(),
      username: formData.value.username.trim(),
      email: formData.value.email.trim(),
      password: formData.value.password
    };

    const res = await apiClient.post('/auth/signup', payload);

    if (res?.data) {
      showAlert('success', 'Regjistrim me sukses! Ju lutem kontrolloni emailin tuaj për të konfirmuar llogarinë.');
      router.push({
        name: 'ConfirmEmail',
        query: { email: formData.value.email }
      });
    } else {
      showAlert('error', 'Ka ndodhur një gabim gjatë regjistrimit. Ju lutem provoni përsëri më vonë.');
    }
  } catch (error) {
    if (error.response?.data?.error) {
      showAlert('error', error.response.data.error);
    } else {
      showAlert('error', error.message || "Ka ndodhur një gabim gjatë regjistrimit. Provo përsëri.");
    }
  }
  loading.value = false;
}

const handleSignIn = async (e) => {
  console.log('Attempting to sign in with:', formData.value);
  e.preventDefault();
  loading.value = true;
  isInactiveAccount.value = false;

  try {
    if (!formData.value.emailOrUsername || !formData.value.password) {
      showAlert('warning', 'Të lutem plotësoni fushat e kërkuara');
      loading.value = false;
      return;
    }

    const payload = {
      emailOrUsername: formData.value.emailOrUsername.trim(),
      password: formData.value.password
    };

    const res = await apiClient.post('/auth/login', payload);

    if (res?.data) {
      const { user, session } = res.data;

      if (session) {
        const storageData = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
          expires_in: session.expires_in,
          token_type: session.token_type ?? 'bearer',
          user: user
        };

        localStorage.setItem(
          'supabase_auth', 
          JSON.stringify(storageData)
        );
        showAlert('success', 'Hyrje me sukses!')
        setTimeout(() => {
          router.push({ name: 'Dashboard' });
        }, 500);
        return;
      }

      router.push({
        name: 'ConfirmEmail',
        query: { email: formData.value.email }
      });
      return;
    }
    else {
      showAlert('error', 'Ka ndodhur një gabim gjatë hyrjes. Ju lutem provoni përsëri më vonë.');
    }
  } catch (error) {
    if (error.response?.status === 403) {
      isInactiveAccount.value = true;
    } else if (error.response?.data?.error) {
      isInactiveAccount.value = false;
      showAlert('error', error.response.data.error);
    } else {
      isInactiveAccount.value = false;
      showAlert('error', error.message || "Emaili/username ose passwordi gabuar. Provo përsëri.");
    }
  }
  loading.value = false;
}

onMounted(() => {
  showLogin.value = props.isLogin;
});

</script>

<template>
  <div class="w-screen h-fit lg:h-screen">
    <div class="w-full h-full lg:p-10 p-3">
      <div class="w-full h-full">
        <div class="w-full h-full flex lg:flex-row md:flex-col flex-col-reverse lg:gap-10">
          <div class="lg:w-[45%] w-full lg:h-full h-100">
            <div class="w-full h-full py-3">
              <div class="w-full h-full rounded-3xl bg-linear-to-b from-secondary from-[-40%] to-primary to-50%">
                <div class="w-full h-full relative overflow-hidden">
                  <div class="w-full h-full flex flex-col items-center justify-center">
                    <h1 class="4xl:text-[200px] 2xl:text-9xl xl:text-7xl lg:text-5xl md:text-6xl text-4xl text-kollektif-bold font-bold text-secondary relative inline-block w-fit md:mb-10 my-3 text-center">
                      Regjistrohu <br class="block md:hidden"/>
                      <span class="relative">
                          falas
                          <svg 
                              class="absolute -bottom-2 left-0 w-full h-2 sm:h-3" 
                              viewBox="0 0 100 12" 
                          >
                              <path 
                                  d="M 0 8 Q 25 2 50 6 T 100 4" 
                                  stroke="#9FE29E" 
                                  stroke-width="4" 
                            fill="none"
                            stroke-linecap="round"
                              />
                          </svg>
                      </span>
                    </h1>
                    <span class="text-white lg:w-5/6 w-[95%] mx-auto text-center font-poppins font-normal leading-tight 4xl:text-4xl 2xl:text-2xl md:text-xl text-xs">
                        Bashkohu me AlbCaptions, mënyra më e shpejtë për të bërë video me cilësi profesionale që tërheqin dhe mbajnë vëmendjen e audiencës tënde
                    </span>
                    <span class="text-secondary 4xl:text-4xl 2xl:text-2xl md:text-xl text-sm text-center font-semibold font-poppins h-fit w-fit rounded-xl mx-3 sm:mx-6 px-3 py-2">
                        3 video falas në muaj,<br class="hidden lg:block xl:hidden"> shkarkim direkt në formatet .srt, .vtt, .txt
                    </span>
                  </div>
                  <div class="absolute z-0 inset-0 w-full h-full translate-y-1/3">
                    <Logo_lines class="w-full h-full scale-200"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:w-[55%] w-full h-full">
            <div class="w-full h-full py-3">
              <div class="w-full h-full flex flex-col justify-center items-center py-5">
                <div v-if="isLogin" class="w-full h-fit flex flex-col self-start justify-center items-center">
                  <RouterLink to="/">
                    <Albcaptions_logo class="4xl:h-40 2xl:h-30 h-20 w-auto mb-5"/>
                  </RouterLink>
                  <h2 class="4xl:text-7xl 2xl:text-5xl text-3xl font-poppins font-semibold text-primary mt-2">
                    Hyr në llogarinë tënde
                  </h2>
                  <span class="4xl:text-5xl 2xl:text-3xl text-center text-primary font-poppins font-thin mb-10 w-5/6 mt-2">
                    Plotëso formularin më poshtë për të hyrë
                  </span>
                  <div v-if="isInactiveAccount" class="w-5/6 h-fit bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5" role="alert">
                    <strong class="font-bold">Llogari inaktive!</strong>
                    <span class="block sm:inline">Kjo llogari është inaktive. <RouterLink to='/account-activation' class="font-semibold cursor-pointer underline">Kliko këtu</RouterLink> për të aktivizuar llogarinë tuaj.</span>
                  </div>
                </div>
                <div v-else class="w-full h-fit flex flex-col self-start justify-center items-center">
                  <RouterLink to="/">
                    <Albcaptions_logo class="4xl:h-40 2xl:h-30 h-20 w-auto mb-5"/>
                  </RouterLink>
                  <h2 class="text-3xl font-poppins font-semibold text-primary mt-2">
                    Krijoni llogarinë
                  </h2>
                  <span class="text-center text-primary font-poppins font-thin mb-10 w-5/6 mt-2">
                    Plotëso formularin më poshtë për të krijuar llogarinë
                  </span>
                </div>
                <div class="w-5/6 2xl:w-3/5">
                  <form v-if="!isLogin" class="flex flex-col gap-5">
                    <input 
                      type="text" 
                      placeholder="Username" 
                      v-model="formData.username"
                      class="w-full p-3 2xl:py-5 2xl:text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                    <div class="flex flex-row w-full gap-5">
                      <input 
                        type="text" 
                        placeholder="Emri" 
                        v-model="formData.name"
                        class="w-1/2 p-3 2xl:py-5 2xl:text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      />
                      <input 
                        type="text" 
                        placeholder="Mbiemri" 
                        v-model="formData.surname"
                        class="w-1/2 p-3 2xl:py-5 2xl:text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Email"
                      v-model="formData.email" 
                      class="w-full p-3 2xl:py-5 2xl:text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                    <div class="w-full relative">
                      <input 
                        :type="showSignInPassword ? 'text' : 'password'" 
                        id="signInPassword" 
                        v-model="formData.password"
                        class="w-full p-3 2xl:py-5 2xl:text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Fjalëkalimi" 
                        required
                      />
                      <button 
                        type="button" 
                        @click="showSignInPassword = !showSignInPassword"
                        class="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-secondary transition-colors"
                      >
                        <svg v-if="showSignInPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" class="w-5 h-5" stroke="currentColor">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a13.358 13.358 0 0 0 3 2.685M21 10a13.358 13.358 0 0 1-3 2.685m-8 1.624L9.5 16.5m.5-2.19a10.59 10.59 0 0 0 4 0m-4 0a11.275 11.275 0 0 1-4-1.625m8 1.624.5 2.191m-.5-2.19a11.275 11.275 0 0 0 4-1.625m0 0 1.5 1.815M6 12.685 4.5 14.5"></path>
                            </g>
                        </svg>
                      </button>
                    </div>
                    <div class="w-full relative">
                        <input 
                        :type="showConfirmPassword ? 'text' : 'password'" 
                        id="signInPassword" 
                        v-model="formData.confirmPassword"
                        class="w-full p-3 2xl:py-5 2xl:text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Fjalëkalimi" 
                        required
                        />
                        <button 
                        type="button" 
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-secondary transition-colors"
                        >
                        <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                        <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" class="w-5 h-5" stroke="currentColor">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a13.358 13.358 0 0 0 3 2.685M21 10a13.358 13.358 0 0 1-3 2.685m-8 1.624L9.5 16.5m.5-2.19a10.59 10.59 0 0 0 4 0m-4 0a11.275 11.275 0 0 1-4-1.625m8 1.624.5 2.191m-.5-2.19a11.275 11.275 0 0 0 4-1.625m0 0 1.5 1.815M6 12.685 4.5 14.5"></path>
                            </g>
                        </svg>
                        </button>
                    </div>
                    <button 
                      type="submit" 
                      @click.prevent="handleSignup"
                      class="cursor-pointer w-full bg-primary text-white py-3 rounded-lg font-poppins font-semibold hover:bg-primary-dark transition-colors 2xl:text-2xl"
                      :disabled="loading"
                    >
                      <span v-if="loading">Regjistrohu...</span>
                      <span v-else>Regjistrohu</span>
                    </button>
                    <button @click="toggleForm" class="text-center text-primary 2xl:text-2xl font-poppins font-thin mt-2 underline cursor-pointer">
                      Ke një llogari? Hyr
                    </button>
                  </form>
                  <form v-else class="flex flex-col gap-5">
                    <input 
                      type="text" 
                      placeholder="Username ose Email" 
                      v-model="formData.emailOrUsername"
                      class="w-full p-3 2xl:py-5 2xl:text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                    <div class="w-full relative">
                        <input 
                        :type="showSignInPassword ? 'text' : 'password'" 
                        id="signInPassword" 
                        v-model="formData.password"
                        class="w-full p-3 2xl:py-5 2xl:text-xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Fjalëkalimi" 
                        required
                        />
                        <button 
                        type="button" 
                        @click="showSignInPassword = !showSignInPassword"
                        class="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-secondary transition-colors"
                        >
                        <svg v-if="showSignInPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                        <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" class="w-5 h-5" stroke="currentColor">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a13.358 13.358 0 0 0 3 2.685M21 10a13.358 13.358 0 0 1-3 2.685m-8 1.624L9.5 16.5m.5-2.19a10.59 10.59 0 0 0 4 0m-4 0a11.275 11.275 0 0 1-4-1.625m8 1.624.5 2.191m-.5-2.19a11.275 11.275 0 0 0 4-1.625m0 0 1.5 1.815M6 12.685 4.5 14.5"></path>
                            </g>
                        </svg>
                        </button>
                    </div>

                    <button 
                      type="submit" 
                      @click="handleSignIn"
                      class="w-full bg-primary text-white py-3 rounded-lg font-poppins font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
                      :disabled="loading"
                    >
                      <span v-if="loading">Hyr...</span>
                      <span v-else>Hyr</span>
                    </button>
                    <button @click="toggleForm" class="text-center text-primary font-poppins font-thin mt-2 underline cursor-pointer">
                      Nuk ke një llogari? Regjistrohu
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  </div>
</template>

