<script setup>
import google from './svg/google.vue';
</script>
<template>
    <div class="w-screen h-screen px-60 bg-[#0f172a] font-poppins">
        <div class="w-full h-full flex gap-36 flex-row">
            <div class="w-full h-full flex flex-col justify-center items-center">
                <h1 class="inline-block text-center text-transparent bg-clip-text h-fit w-fit bg-gradient-to-tl from-[#a784ffd4] outline outline-whtie to-white text-6xl my-2">
                    Authentication Section
                </h1>
                
            </div>
            <div class="w-full h-full flex justify-center p-10">
                <div class="w-full h-full flex flex-col">
                    <h1 class="text-white text-6xl font-medium mb-10">
                        Join us today
                    </h1>
                    <p class="text-[#92a3bb] text-lg font-regular">
                        Create an account to get started
                    </p>
                    <div class=" w-full h-fit mt-10 rounded-full">
                        <button class="w-full h-full flex flex-row items-center justify-center gap-2 bg-gray-800 py-4 text-white text-lg px-5 font-regular rounded-full hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-2 focus:outline-offset-2 focus:outline-gray-600 active:bg-gray-600">
                            <google class="h-6"/>
                            <span>
                                Sign Up with Google
                            </span>
                        </button>
                    </div>
                    <form class="w-full h-fit mt-10 flex flex-col gap-4">
                        <div>
                            <label class="text-md text-white" for="name">Full name</label>
                            <div>
                                <input type="text" id="name" name="name" class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" placeholder="Enter your name" required>
                            </div>
                        </div>
                        
                        <div>
                            <label class="text-md text-white" for="username">Username</label>
                            <div>
                                <input type="text" id="username" name="username" class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" placeholder="Enter your username" required>
                            </div>
                        </div>
                        
                        <div>
                            <label class="text-md text-white" for="email">E-mail</label>
                            <div>
                                <input type="email" id="email" name="email" class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" placeholder="user@mail.com" required>
                            </div>
                        </div>
                        <div>
                            <label class="text-md text-white" for="password">Password</label>
                            <div>
                                <input type="password" id="password" name="password" class="w-full h-fit bg-transparent text-[#92a3bb] px-5 py-4 text-md rounded-full mt-2 ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-[#a784ffd4] focus:border-transparent" placeholder="Min 8 characters" required>
                            </div>
                        </div>
                        <div class="w-full h-fit flex flex-row items-center justify-between mt-2">
                            <div class="flex flex-row items-center gap-2">
                                <input type="checkbox" id="terms" name="terms" class="w-4 h-4 text-[#a784ffd4] bg-gray-800 border-gray-600 rounded focus:ring-[#a784ffd4] focus:ring-offset-gray-800" required>
                                <label for="terms" class="text-[#92a3bb] text-md font-regular">I agree to the terms and conditions</label>
                            </div>
                        </div>
                        <div class="w-full h-fit rounded-full">
                            <button type="submit" class="w-full h-full flex flex-row items-center justify-center gap-2 bg-gray-800 py-4 text-white text-md px-5 font-regular rounded-full hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-2 focus:outline-offset-2 focus:outline-gray-600 active:bg-gray-600">
                                <span>
                                    Sign Up
                                </span>
                            </button>
                        </div>
                    </form>
                    <div class="w-full h-fit flex flex-row items-center mt-5 justify-center gap-2">
                        <p class="text-[#92a3bb] text-lg font-regular">
                            Already have an account?
                        </p>
                        <button class="text-[#a784ffd4] text-lg font-regular hover:text-white transition duration-300 ease-in-out active:text-white">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>