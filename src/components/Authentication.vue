<template>
    <div class="max-h-screen h-screen w-screen bg-gray-100 overflow-hidden">
        <div class="p-3 w-full h-full">
            <div class="h-full w-full flex gap-2 flex-row">
                <div class="w-2/5 h-full bg-[#052b28] rounded-4xl relative">
                    <div class="h-full z-10 relative w-full">
                        <div class="h-full w-full py-10 px-5 flex justify-between flex-col">
                            <div class="flex w-full h-full flex-col gap-4">
                                <h1 class="text-4xl text-kollektif-bold font-bold text-[#9FE29E] mx-6 relative inline-block w-fit">
                                    Regjistrohu 
                                    <span class="relative">
                                        falas
                                        <svg 
                                            class="absolute -bottom-2 left-0 w-full h-3" 
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
                                <span class="text-white text-sm font-poppins font-thin mx-6">
                                    Bashkohu me AlbCaptions, mënyra më e shpejtë për të bërë video me cilësi profesionale që tërheqin dhe mbajnë vëmendjen e audiencës tënde
                                </span>
                                <span class="text-[#9FE29E] text-lg font-poppins h-fit w-fit rounded-xl mx-6">
                                    3 video falas në muaj, shkarkim direkt në formatet .srt, .vtt, .txt
                                </span>
                            </div>
                        </div>
                    </div>

                    <Logo_lines class="absolute bottom-0 left-0 w-full z-0 pointer-events-none"/>
                </div> 
                <div class="w-3/5 h-full rounded-3xl">
                    <form v-if="!showLogin" @submit="handleSignUp" class="w-full h-full py-10 px-3 rounded-3xl">
                        <div class="w-full h-fit flex flex-col items-center gap-3">
                            <Albcaptions_logo class="h-16 w-auto"/>
                            <h1 class="text-5xl text-kollektif-bold text-[#052b28]">
                                Krijoni llogarinë
                            </h1>
                            <span class="text-[#052b28] text-md font-poppins font-thin">
                                Plotëso formularin më poshtë për të krijuar llogarinë
                            </span>
                            <div v-if="error" class="bg-red-300 border border-red-400 text-md text-red-500 font-poppins font-normal p-3 rounded-xl">
                                {{ error }}
                            </div>
                            <div v-if="success" class="bg-green-500 bg-opacity-20 border border-green-500 text-white px-5 py-3 rounded-full mt-5">
                                {{ success }}
                            </div>
                        </div>
                        <div class="w-full h-full flex flex-col items-center gap-4 mt-10">
                            <input 
                            type="text" 
                            id="name" 
                            v-model="formData.name"
                            class="w-full max-w-md p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9FE29E]"
                            placeholder="Emër" 
                            required
                            />
                            <input 
                            type="text" 
                            id="surname" 
                            v-model="formData.surname"
                            class="w-full max-w-md p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9FE29E]"
                            placeholder="Mbiemër" 
                            required
                            />
                            <input 
                            type="text" 
                            id="username" 
                            v-model="formData.username"
                            class="w-full max-w-md p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9FE29E]"
                            placeholder="Username" 
                            required
                            />
                            <input 
                            type="email" 
                            id="email" 
                            v-model="formData.email"
                            class="w-full max-w-md p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9FE29E]"
                            placeholder="përdorues@mail.com" 
                            required
                            />
                            <input 
                            type="password" 
                            id="password" 
                            v-model="formData.password"
                            class="w-full max-w-md p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9FE29E]"
                            placeholder="Fjalëkalimi" 
                            required
                            />
                            <button 
                                type="submit" 
                                class="w-full max-w-md bg-[#9FE29E] text-white font-bold py-2.5 rounded-lg hover:bg-[#052b28] cursor-pointer duration-300 transition-colors"
                                :disabled="loading"
                            >
                                <span v-if="loading">Duke u regjistruar...</span>
                                <span v-else>Regjistrohu</span>
                            </button>
                            <span class="text-[#052b28] text-xs font-poppins font-normal text-center">
                                Duke vazhduar, ti pranon
                                <a href="#" class="text-[#052b28] font-bold underline hover:text-[#9FE29E] transition-all duration-300 ease-in-out">Kushtet e Shërbimit</a> 
                                dhe 
                                <a href="#" class="text-[#052b28] font-bold underline hover:text-[#9FE29E] transition-all duration-300 ease-in-out">Politikën tonë të Privatësisë</a>
                            </span>
                            <div class="w-full flex items-center justify-center gap-2">
                                <button 
                                    type="button" 
                                    @click="toggleForm" 
                                    class="text-white font-bold p-2.5 rounded-xl bg-[#052b28] hover:bg-[#9FE29E] transition-all duration-300 ease-in-out cursor-pointer"
                                >
                                Ke një llogari? Hyr
                                </button>
                            </div>
                        </div>
                    </form>

                    <form v-if="showLogin" @submit="handleSignIn" class="w-full h-full py-10 px-3 rounded-3xl">
                        <div class="w-full h-fit flex flex-col items-center gap-3">
                            <Albcaptions_logo class="h-16 w-auto"/>
                            <h1 class="text-5xl text-kollektif-bold text-[#052b28]">
                                Hyr 
                            </h1>
                            <span class="text-[#052b28] text-md font-poppins font-thin">
                                Plotëso formularin më poshtë për të hyrë
                            </span>
                            <div v-if="error" class="bg-red-300 border border-red-400 text-xs text-red-500 font-poppins font-normal p-3 rounded-xl">
                                {{ error }}
                            </div>
                            <div v-if="success" class="bg-green-300 border border-green-400 text-green-500 font-poppins font-normal p-3 rounded-xl">
                                {{ success }}
                            </div>
                        </div>
                        <div class="w-full h-full flex flex-col items-center gap-4 mt-10">
                            <input 
                            type="email" 
                            id="email" 
                            v-model="formData.email"
                            class="w-full max-w-md p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9FE29E]"
                            placeholder="përdorues@mail.com" 
                            required
                            />
                            <input 
                            type="password" 
                            id="password" 
                            v-model="formData.password"
                            class="w-full max-w-md p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9FE29E]"
                            placeholder="Fjalëkalimi" 
                            required
                            />
                            <button 
                                type="submit" 
                                class="w-full max-w-md bg-[#9FE29E] text-white font-bold py-3 rounded-lg hover:bg-[#052b28] cursor-pointer duration-300 transition-colors"
                                :disabled="loading"
                            >
                                <span v-if="loading">Hyr...</span>
                                <span v-else>Hyr</span>
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
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient.js';
import google from './svg/google.vue';

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
  password: ''
});

const loading = ref(false);
const error = ref(null);
const success = ref(null);
const showLogin = ref(props.isLogin);

const handleSignUp = async (e) => {
  e.preventDefault();
  loading.value = true;
  error.value = null;
  
  try {
    if (!formData.value.email || !formData.value.password || 
        !formData.value.name || !formData.value.surname || 
        !formData.value.username ) {
      throw new Error("Të lutem plotësoni të gjitha fushat dhe pranoni kushtet e shërbimit.");
    }
    
    const { data, error: authError } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        name: formData.value.name,
        surname: formData.value.surname,
        username: formData.value.username,
        role_id: 'c1a34890-3a46-4969-be5b-704a6b81a54d'
        }
      }
    });
    
    if (authError) throw authError;
    
    if (!data.user) {
      throw new Error("Registration failed: No user data returned");
    }
    
    router.push({
      name: 'ConfirmEmail',
      query: { email: formData.value.email }
    });
    
  } catch (err) {
    console.error("Sign up error:", err);
    error.value = err.message || "An error occurred during sign up";
  } finally {
    loading.value = false;
  }
};

const handleSignIn = async (e) => {
  e.preventDefault();
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.value.email,
      password: formData.value.password
    });
    
    if (signInError) throw signInError;
    
    success.value = "Signed in successfully!";
    
    setTimeout(() => {
      router.push('/new-dashboard');
    }, 500);
    
  } catch (err) {
    error.value = err.message || "Emaili ose passwordi gabuar.\nProvo përsëri.";
    console.error("Sign in error:", err);
  } finally {
    loading.value = false;
  }
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
