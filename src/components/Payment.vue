<template>
    <div class="min-h-screen bg-[#0f172a] text-white font-poppins">
        <div class="container mx-auto px-4 py-20">
            <div class="text-center mb-16">
                <h1 class="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-tl from-[#a784ffd4] to-white">
                Payment
                </h1>
                <p class="text-xl text-[#92a3bb] max-w-3xl mx-auto">
                Subscribe to our service for premium features.
                </p>
            </div>
        </div>
        <div class="flex mx-2.5 px-3 w-full h-full">
            <div class="flex flex-wrap justify-center">
                <div class="bg-white text-black rounded-lg shadow-lg m-4 p-6 w-80">
                    <h2 class="text-2xl font-bold mb-4">Starter</h2>
                    <p class="mb-4">Description for card 1.</p>
                    <button 
                        @click="selectPlan('starter')" 
                        class="bg-blue-500 text-white rounded px-4 py-2"
                    >
                        Choose Starter
                    </button>
                </div>
                <div class="bg-white text-black rounded-lg shadow-lg m-4 p-6 w-80">
                    <h2 class="text-2xl font-bold mb-4">Pro</h2>
                    <p class="mb-4">Description for card 2.</p>
                    <button 
                        @click="selectPlan('pro')" 
                        class="bg-blue-500 text-white rounded px-4 py-2"
                    >
                        Choose Pro
                    </button>
                </div>
                <div class="bg-white text-black rounded-lg shadow-lg m-4 p-6 w-80">
                    <h2 class="text-2xl font-bold mb-4">Business</h2>
                    <p class="mb-4">Description for card 3.</p>
                    <button 
                        @click="selectPlan('business')" 
                        class="bg-blue-500 text-white rounded px-4 py-2"
                    >
                        Choose Business
                    </button>
                </div>
                <div class="bg-white text-black rounded-lg shadow-lg m-4 p-6 w-80">
                    <h2 class="text-2xl font-bold mb-4">Enterprise</h2>
                    <p class="mb-4">Description for card 4.</p>
                    <button 
                        @click="selectPlan('enterprise')" 
                        class="bg-blue-500 text-white rounded px-4 py-2"
                    >
                        Choose Enterprise
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const planIds = {
  starter: 'P-5V6094008X061394TNBIYGMQ', 
  pro: 'P-4Y0851619K9273149NBISTKY',
  business: 'P-71S44675RP008681TNBIWIOQ', 
  enterprise: 'P-8B0851619K9273149NBISTKY'
}

function selectPlan(planType) {
  const planId = planIds[planType]
  router.push(`/paypal/${planId}`)
}
</script>