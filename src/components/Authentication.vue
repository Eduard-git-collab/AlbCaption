<template>
  <div class="min-h-screen w-screen bg-gray-100 overflow-x-hidden">
      <div class="p-2 sm:p-3 w-full h-full">
          <div class="min-h-screen flex flex-col md:flex-row gap-2 md:gap-4">
              <!-- Left Section -->
              <div class="w-full md:w-2/5 h-auto md:h-screen bg-primary rounded-2xl md:rounded-4xl relative py-8 md:py-0 order-2 md:order-1">
                  <div class="h-full z-10 relative w-full">
                      <div class="h-full w-full py-6 sm:py-8 md:py-10 px-4 sm:px-5 flex justify-between flex-col">
                          <div class="flex w-full flex-col gap-3 sm:gap-4">
                              <h1 class="text-2xl sm:text-3xl md:text-4xl text-kollektif-bold font-bold text-secondary mx-3 sm:mx-6 relative inline-block w-fit">
                                  Regjistrohu 
                                  <span class="relative">
                                      falas
                                      <svg 
                                          class="absolute -bottom-2 left-0 w-full h-2 sm:h-3" 
                                          viewBox="0 0 100 12" 
                                          preserveAspectRatio="none"
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
                              <span class="text-white text-xs sm:text-sm font-poppins font-thin mx-3 sm:mx-6 leading-relaxed">
                                  Bashkohu me AlbCaptions, mënyra më e shpejtë për të bërë video me cilësi profesionale që tërheqin dhe mbajnë vëmendjen e audiencës tënde
                              </span>
                              <span class="text-secondary text-sm md:text-lg font-poppins h-fit w-fit rounded-xl mx-3 sm:mx-6 px-3 py-2">
                                  3 video falas në muaj, shkarkim direkt në formatet .srt, .vtt, .txt
                              </span>
                          </div>
                      </div>
                  </div>

                  <Logo_lines class="absolute bottom-0 left-0 w-full z-0 pointer-events-none"/>
              </div> 

              <!-- Right Section -->
              <div class="w-full md:w-3/5 h-auto md:h-screen rounded-2xl md:rounded-3xl order-1 md:order-2">
                  <!-- Sign Up Form -->
                  <form v-if="!showLogin" @submit="handleSignUp" class="w-full h-full py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 rounded-2xl md:rounded-3xl overflow-y-auto md:overflow-hidden">
                      <div class="w-full h-fit flex flex-col items-center gap-2 sm:gap-3">
                          <RouterLink to="/">
                              <Albcaptions_logo class="h-12 sm:h-14 md:h-16 w-auto"/>
                          </RouterLink>
                          <h1 class="text-3xl sm:text-4xl md:text-5xl text-kollektif-bold text-primary text-center">
                              Krijoni llogarinë
                          </h1>
                          <span class="text-primary text-xs sm:text-sm md:text-base font-poppins font-thin text-center">
                              Plotëso formularin më poshtë për të krijuar llogarinë
                          </span>
                          <div v-if="error && !isInactiveAccount" class="bg-red-300 border border-red-400 text-xs sm:text-sm text-red-500 font-poppins font-normal p-2 sm:p-3 rounded-xl w-full max-w-md">
                              {{ error }}
                          </div>
                          <div v-if="success" class="bg-green-500 bg-opacity-20 border border-green-500 text-white text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-3 rounded-full mt-3 sm:mt-5 w-full max-w-md">
                              {{ success }}
                          </div>
                      </div>
                      <div class="w-full flex flex-col items-center gap-3 sm:gap-4 mt-2 sm:mt-4">
                          <input 
                          type="text" 
                          id="name" 
                          v-model="formData.name"
                          class="w-full max-w-md p-2 sm:p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                          placeholder="Emër" 
                          required
                          />
                          <input 
                          type="text" 
                          id="surname" 
                          v-model="formData.surname"
                          class="w-full max-w-md p-2 sm:p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                          placeholder="Mbiemër" 
                          required
                          />
                          <input 
                          type="text" 
                          id="username" 
                          v-model="formData.username"
                          class="w-full max-w-md p-2 sm:p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                          placeholder="Username" 
                          required
                          />
                          <input 
                          type="email" 
                          id="email" 
                          v-model="formData.email"
                          class="w-full max-w-md p-2 sm:p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                          placeholder="përdorues@mail.com" 
                          required
                          />
                          
                          <!-- Password Field with Toggle -->
                          <div class="w-full max-w-md relative">
                              <input 
                              :type="showPassword ? 'text' : 'password'" 
                              id="password" 
                              v-model="formData.password"
                              class="w-full p-2 sm:p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition-all pr-10"
                              placeholder="Fjalëkalimi" 
                              required
                              />
                              <button 
                              type="button" 
                              @click="showPassword = !showPassword"
                              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-secondary transition-colors"
                              >
                              <!-- Show Password Eye Icon -->
                              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <!-- Hide Password Eye Icon -->
                              <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" class="w-5 h-5" stroke="currentColor">
                                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                  <g id="SVGRepo_iconCarrier">
                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a13.358 13.358 0 0 0 3 2.685M21 10a13.358 13.358 0 0 1-3 2.685m-8 1.624L9.5 16.5m.5-2.19a10.59 10.59 0 0 0 4 0m-4 0a11.275 11.275 0 0 1-4-1.625m8 1.624.5 2.191m-.5-2.19a11.275 11.275 0 0 0 4-1.625m0 0 1.5 1.815M6 12.685 4.5 14.5"></path>
                                  </g>
                              </svg>
                              </button>
                          </div>
                          
                          <!-- Confirm Password Field with Toggle -->
                          <div class="w-full max-w-md relative">
                              <input
                              :type="showConfirmPassword ? 'text' : 'password'"
                              id="confirmPassword"
                              v-model="formData.confirmPassword"
                              class="w-full p-2 sm:p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition-all pr-10"
                              placeholder="Konfirmo Fjalëkalimin"
                              required
                              />
                              <button 
                              type="button" 
                              @click="showConfirmPassword = !showConfirmPassword"
                              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-secondary transition-colors"
                              >
                              <!-- Show Password Eye Icon -->
                              <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                              <!-- Hide Password Eye Icon -->
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
                              class="w-full max-w-md bg-secondary text-white font-bold py-2 sm:py-2.5 md:py-3 text-sm sm:text-base rounded-lg hover:bg-primary cursor-pointer duration-300 transition-colors"
                              :disabled="loading"
                          >
                              <span v-if="loading">Duke u regjistruar...</span>
                              <span v-else>Regjistrohu</span>
                          </button>
                          <span class="text-primary text-xs font-poppins font-normal text-center px-2 leading-relaxed">
                              Duke vazhduar, ti pranon
                              <a href="#" class="text-primary font-bold underline hover:text-secondary transition-all duration-300 ease-in-out">Kushtet e Shërbimit</a> 
                              dhe 
                              <a href="#" class="text-primary font-bold underline hover:text-secondary transition-all duration-300 ease-in-out">Politikën tonë të Privatësisë</a>
                          </span>
                          <div class="w-full flex items-center justify-center gap-2">
                              <button 
                                  type="button" 
                                  @click="toggleForm" 
                                  class="text-primary font-thin text-xs sm:text-sm underline hover:font-light p-2 sm:p-2.5 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                              Ke një llogari? Hyr
                              </button>
                          </div>
                      </div>
                  </form>

                  <!-- Sign In Form -->
                  <form v-if="showLogin" @submit="handleSignIn" class="w-full h-full py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 rounded-2xl md:rounded-3xl overflow-y-auto md:overflow-hidden">
                      <div class="w-full h-fit flex flex-col items-center gap-2 sm:gap-3">
                          <RouterLink to="/">
                              <Albcaptions_logo class="h-12 sm:h-14 md:h-16 w-auto"/>
                          </RouterLink>
                          <h1 class="text-3xl sm:text-4xl md:text-5xl text-kollektif-bold text-primary text-center">
                              Hyr 
                          </h1>
                          <span class="text-primary text-xs sm:text-sm md:text-base font-poppins font-thin text-center">
                              Plotëso formularin më poshtë për të hyrë
                          </span>
                          <div v-if="error && !isInactiveAccount" class="bg-red-300 border border-red-400 text-xs text-red-500 font-poppins font-normal p-2 sm:p-3 rounded-xl w-full max-w-md">
                              {{ error }}
                          </div>
                          <div v-if="isInactiveAccount" @click.prevent="handleInactiveAccountClick" class="bg-yellow-300 border border-yellow-400 text-xs text-yellow-700 font-poppins font-normal p-2 sm:p-3 rounded-xl cursor-pointer hover:bg-yellow-400 transition-colors duration-300 w-full max-w-md text-center">
                            {{ error }} <span class="underline"> Klikoni këtu për riaktivizim. </span>
                          </div>
                          <div v-if="success" class="bg-green-300 border border-green-400 text-green-500 font-poppins font-normal p-2 sm:p-3 rounded-xl text-xs sm:text-sm w-full max-w-md">
                              {{ success }}
                          </div>
                      </div>
                      <div class="w-full flex flex-col items-center gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10">
                          <input 
                          type="text" 
                          id="emailOrUsername" 
                          v-model="formData.emailOrUsername"
                          class="w-full max-w-md p-2 sm:p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                          placeholder="email ose username" 
                          required
                          />
                          
                          <!-- Sign In Password Field with Toggle -->
                          <div class="w-full max-w-md relative">
                              <input 
                              :type="showSignInPassword ? 'text' : 'password'" 
                              id="signInPassword" 
                              v-model="formData.password"
                              class="w-full p-2 sm:p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition-all pr-10"
                              placeholder="Fjalëkalimi" 
                              required
                              />
                              <button 
                              type="button" 
                              @click="showSignInPassword = !showSignInPassword"
                              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-secondary transition-colors"
                              >
                              <!-- Show Password Eye Icon -->
                              <svg v-if="showSignInPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                              <!-- Hide Password Eye Icon -->
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
                              class="w-full max-w-md bg-secondary text-white font-bold py-2 sm:py-2.5 md:py-3 text-sm sm:text-base rounded-lg hover:bg-primary cursor-pointer duration-300 transition-colors"
                              :disabled="loading"
                          >
                              <span v-if="loading">Hyr...</span>
                              <span v-else>Hyr</span>
                          </button>
                          <button 
                                  type="button" 
                                  @click="toggleForm" 
                                  class="text-primary font-thin text-xs sm:text-sm underline hover:font-light p-2 sm:p-2.5 transition-all duration-300 ease-in-out cursor-pointer"
                              >
                              Nuk ke llogari? Regjistrohu
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import Logo_lines from './logos/Logo_lines.vue';
import Albcaptions_logo from './logos/Albcaptions_logo.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient.js';
import apiClient from '@/stores/apiClient.js';

const props = defineProps({
  isLogin: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();

const formData = ref({
  name: '',
  surname: '',
  username: '',
  email: '',
  emailOrUsername: '',
  password: '',
  confirmPassword: ''
});

const loading = ref(false);
const error = ref(null);
const success = ref(null);
const showLogin = ref(props.isLogin);
const isInactiveAccount = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showSignInPassword = ref(false);

const handleSignUp = async (e) => {
  e.preventDefault();
  loading.value = true;
  error.value = null;
  success.value = null;
  isInactiveAccount.value = false;

  try {
    if (!formData.value.email || !formData.value.password || 
        !formData.value.name || !formData.value.surname || 
        !formData.value.username ) {
      throw new Error("Të lutem plotësoni të gjitha fushat");
    }
    if (formData.value.password.length < 6) {
      throw new Error("Fjalëkalimi duhet të ketë të paktën 6 karaktere");
    }
    if (formData.value.password !== formData.value.confirmPassword) {
      throw new Error("Fjalëkalimet nuk përputhen");
    }

    // Prepare payload
    const payload = {
      name: formData.value.name.trim(),
      surname: formData.value.surname.trim(),
      username: formData.value.username.trim(),
      email: formData.value.email.trim(),
      password: formData.value.password
    };

    // Call backend signup route
    const res = await apiClient.post('/auth/signup', payload);

    if (res?.data) {
      const { user, session } = res.data;

      if (session) {
        await supabase.auth.setSession(session);
        success.value = "Regjistrimi u krye. Po ridrejtohemi...";
        router.push('/dashboard');
        return;
      }

      router.push({
        name: 'ConfirmEmail',
        query: { email: formData.value.email }
      });
      return;
    }

    throw new Error('Regjistrimi dështoi - përgjigje e papritur nga serveri');
  } catch (err) {
    console.error("Sign up error:", err);
    if (err.response?.data?.error) {
      error.value = err.response.data.error;
    } else {
      error.value = err.message || "An error occurred during sign up";
    }
  } finally {
    loading.value = false;
  }
};

const handleSignIn = async (e) => {
  e.preventDefault();
  loading.value = true;
  error.value = null;
  success.value = null;
  isInactiveAccount.value = false;

  try {
    if (!formData.value.emailOrUsername || !formData.value.password) {
      throw new Error("Të lutem plotësoni email/username dhe fjalëkalimin");
    }

    const payload = {
      emailOrUsername: formData.value.emailOrUsername.trim(),
      password: formData.value.password
    };

    const res = await apiClient.post('/auth/login', payload);

    if (res?.data) {
      const { user, session } = res.data;

      if (session) {
        await supabase.auth.setSession(session);
        success.value = "Hyrja u krye me sukses. Po ridrejtohemi...";
        setTimeout(() => router.push('/dashboard'), 500);
        return;
      }

      throw new Error('Hyrja dështoi: asnjë sesion nuk u mor nga serveri');
    }

    throw new Error('Hyrja dështoi - përgjigje e papritur nga serveri');
  } catch (err) {
    console.error("Sign in error:", err);
    
    // Check for inactive account (403 status)
    if (err.response?.status === 403) {
      isInactiveAccount.value = true;
      error.value = err.response?.data?.error || "Llogaria nuk është aktive.";
    } else if (err.response?.data?.error) {
      isInactiveAccount.value = false;
      error.value = err.response.data.error;
    } else {
      isInactiveAccount.value = false;
      error.value = err.message || "Emaili/username ose passwordi gabuar. Provo përsëri.";
    }
  } finally {
    loading.value = false;
  }
};

const handleInactiveAccountClick = () => {
  router.push('/account-activation');
};

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

onMounted(() => {
  showLogin.value = props.isLogin;
});
</script>