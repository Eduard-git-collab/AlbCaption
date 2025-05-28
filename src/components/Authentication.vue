<script setup>
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
  password: '',
  terms: false
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
        !formData.value.username || !formData.value.terms) {
      throw new Error("Please fill out all fields and accept the terms");
    }
    
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
      options: {
        data: {
          name: formData.value.name,
          surname: formData.value.surname,
          username: formData.value.username,
          role: 'free'
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
      router.push('/dashboard');
    }, 500);
    
  } catch (err) {
    error.value = err.message || "Invalid email or password";
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


<template>
    <div class="w-screen min-h-screen px-60 bg-[#0f172a] font-poppins">
        <div class="w-full h-full flex gap-36 flex-row">
            <!-- <div class="w-full h-full flex flex-col justify-center items-center">
                <h1 class="inline-block text-center text-transparent bg-clip-text h-fit w-fit bg-gradient-to-tl from-[#a784ffd4] outline outline-whtie to-white text-6xl my-2">
                    Authentication Section
                </h1>
                
            </div> -->
            <div class="w-full h-full flex justify-center p-10">
                <div class="w-full h-full flex flex-col">
                    <h1 class="text-white text-6xl font-medium mb-10">
                        {{ showLogin ? 'Welcome back' : 'Join us today' }}
                    </h1>
                    <p class="text-[#92a3bb] text-lg font-regular">
                        {{ showLogin ? 'Sign in to your account' : 'Create an account to get started' }}
                    </p>
                    
                    <!-- Display error/success messages -->
                    <div v-if="error" class="bg-red-500 bg-opacity-20 border border-red-500 text-white px-5 py-3 rounded-full mt-5">
                        {{ error }}
                    </div>
                    <div v-if="success" class="bg-green-500 bg-opacity-20 border border-green-500 text-white px-5 py-3 rounded-full mt-5">
                        {{ success }}
                    </div>
                    
                    <div class="w-full h-fit mt-10 rounded-full">
                        <button class="w-full h-full flex flex-row items-center justify-center gap-2 bg-gray-800 py-4 text-white text-lg px-5 font-regular rounded-full hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-2 focus:outline-offset-2 focus:outline-gray-600 active:bg-gray-600">
                            <google class="h-6"/>
                            <span>
                                {{ showLogin ? 'Sign In with Google' : 'Sign Up with Google' }}
                            </span>
                        </button>
                    </div>
                    
                    <!-- Sign Up Form -->
                    <form v-if="!showLogin" @submit="handleSignUp" class="w-full h-fit mt-10 flex flex-col gap-4">
                        <div class="flex flex-row gap-2 justify-between">
                            <div>
                                <label class="text-md text-white" for="name">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    v-model="formData.name"
                                    class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" 
                                    placeholder="Enter your name" 
                                    required
                                >
                            </div>
                            <div>
                                <label class="text-md text-white" for="surname">Surname</label>
                                <input 
                                    type="text" 
                                    id="surname" 
                                    v-model="formData.surname"
                                    class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" 
                                    placeholder="Enter your surname" 
                                    required
                                >
                            </div>
                        </div>
                        
                        <div>
                            <label class="text-md text-white" for="username">Username</label>
                            <div>
                                <input 
                                    type="text" 
                                    id="username" 
                                    v-model="formData.username"
                                    class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" 
                                    placeholder="Enter your username" 
                                    required
                                >
                            </div>
                        </div>
                        
                        <div>
                            <label class="text-md text-white" for="email">E-mail</label>
                            <div>
                                <input 
                                    type="email" 
                                    id="email" 
                                    v-model="formData.email"
                                    class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" 
                                    placeholder="user@mail.com" 
                                    required
                                >
                            </div>
                        </div>
                        <div>
                            <label class="text-md text-white" for="password">Password</label>
                            <div>
                                <input 
                                    type="password" 
                                    id="password" 
                                    v-model="formData.password"
                                    class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" 
                                    placeholder="Min 8 characters" 
                                    required
                                    minlength="8"
                                >
                            </div>
                        </div>
                        <div class="w-full h-fit flex flex-row items-center justify-between mt-2">
                            <div class="flex flex-row items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="terms" 
                                    v-model="formData.terms"
                                    class="w-4 h-4 text-[#a784ffd4] bg-gray-800 border-gray-600 rounded focus:ring-[#a784ffd4] focus:ring-offset-gray-800" 
                                    required
                                >
                                <label for="terms" class="text-[#92a3bb] text-md font-regular">I agree to the terms and conditions</label>
                            </div>
                        </div>
                        <div class="w-full h-fit rounded-full">
                            <button 
                                type="submit" 
                                class="w-full h-full flex flex-row items-center justify-center gap-2 bg-gray-800 py-4 text-white text-md px-5 font-regular rounded-full hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-2 focus:outline-offset-2 focus:outline-gray-600 active:bg-gray-600"
                                :disabled="loading"
                            >
                                <span v-if="loading">Signing up...</span>
                                <span v-else>Sign Up</span>
                            </button>
                        </div>
                    </form>
                    
                    <!-- Sign In Form -->
                    <form v-if="showLogin" @submit="handleSignIn" class="w-full h-fit mt-10 flex flex-col gap-4">
                        <div>
                            <label class="text-md text-white" for="email">E-mail</label>
                            <div>
                                <input 
                                    type="email" 
                                    id="login-email" 
                                    v-model="formData.email"
                                    class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" 
                                    placeholder="user@mail.com" 
                                    required
                                >
                            </div>
                        </div>
                        <div>
                            <label class="text-md text-white" for="password">Password</label>
                            <div>
                                <input 
                                    type="password" 
                                    id="login-password" 
                                    v-model="formData.password"
                                    class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" 
                                    placeholder="Your password" 
                                    required
                                >
                            </div>
                        </div>
                        <div class="w-full h-fit rounded-full">
                            <button 
                                type="submit" 
                                class="w-full h-full flex flex-row items-center justify-center gap-2 bg-gray-800 py-4 text-white text-md px-5 font-regular rounded-full hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-2 focus:outline-offset-2 focus:outline-gray-600 active:bg-gray-600"
                                :disabled="loading"
                            >
                                <span v-if="loading">Signing in...</span>
                                <span v-else>Sign In</span>
                            </button>
                        </div>
                    </form>
                    
                    <div class="w-full h-fit flex flex-row items-center mt-5 justify-center gap-2">
                        <p class="text-[#92a3bb] text-lg font-regular">
                            {{ showLogin ? "Don't have an account?" : "Already have an account?" }}
                        </p>
                        <button @click="toggleForm" class="text-[#a784ffd4] text-lg font-regular hover:text-white transition duration-300 ease-in-out active:text-white">
                            {{ showLogin ? "Sign Up" : "Sign In" }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>