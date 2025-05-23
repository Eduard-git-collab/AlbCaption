<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const email = ref('');

onMounted(() => {
  email.value = route.params.email || route.query.email || '';
  
  if (!email.value) {
    router.push('/signup');
  }
});

const getEmailProvider = computed(() => {
  if (!email.value) return null;
  
  const domain = email.value.split('@')[1]?.toLowerCase();
  
  if (!domain) return {
    name: 'Email Provider',
    url: '#',
    logo: '',
    known: false
  };
  
  const providers = {
    'gmail.com': {
      name: 'Gmail',
      url: 'https://mail.google.com',
      logo: 'https://www.google.com/gmail/about/static-2.0/images/logo-gmail.png',
      known: true
    },
    'outlook.com': {
      name: 'Outlook',
      url: 'https://outlook.live.com/mail',
      logo: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b',
      known: true
    },
    'hotmail.com': {
      name: 'Outlook',
      url: 'https://outlook.live.com/mail',
      logo: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b',
      known: true
    },
    'yahoo.com': {
      name: 'Yahoo Mail',
      url: 'https://mail.yahoo.com',
      logo: 'https://s.yimg.com/rz/p/yahoo_frontpage_en-US_s_f_p_205x58_frontpage_2x.png',
      known: true
    },
    'aol.com': {
      name: 'AOL Mail',
      url: 'https://mail.aol.com',
      logo: 'https://s.yimg.com/wm/assets/images/ns/aol-logo-black-v.2.0.1.png',
      known: true
    },
    'protonmail.com': {
      name: 'ProtonMail',
      url: 'https://mail.proton.me',
      logo: 'https://proton.me/static/7c4a1dd070f5e47de2ed3f72254fffdf/proton-logo-dark.svg',
      known: true
    },
    'icloud.com': {
      name: 'iCloud Mail',
      url: 'https://www.icloud.com/mail',
      logo: 'https://www.apple.com/v/icloud/b/images/overview/icloud_logo__emva3buj52qi_large.png',
      known: true
    }
  };
  
  for (const [providerDomain, provider] of Object.entries(providers)) {
    if (domain.includes(providerDomain)) {
      return provider;
    }
  }
  
  return {
    name: domain,
    url: `https://${domain}`,
    logo: '',
    known: false
  };
});

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 font-poppins">
    <div class="bg-gray-800 bg-opacity-50 p-8 rounded-2xl max-w-lg w-full text-center">
      <div class="h-20 w-20 bg-[#a784ff30] rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#a784ffd4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
        </svg>
      </div>
      
      <h1 class="text-3xl font-bold text-white mb-3">Confirm Your Email</h1>
      <p class="text-[#92a3bb] mb-8">
        We've sent a confirmation link to <span class="text-white font-medium">{{ email }}</span>. 
        Please check your inbox and click the link to activate your account.
      </p>
      
      <div v-if="getEmailProvider" class="mb-8">
        <a 
          :href="getEmailProvider.url" 
          target="_blank" 
          rel="noopener noreferrer"
          class="block w-full py-3 px-4 rounded-full bg-[#a784ffd4] hover:bg-[#9163ff] text-white font-medium transition-colors duration-300"
        >
          <span v-if="getEmailProvider.known">
            Open {{ getEmailProvider.name }}
          </span>
          <span v-else>
            Check Your Email
          </span>
        </a>
      </div>
      
      <div class="text-sm text-[#92a3bb]">
        <p class="mb-4">Didn't receive an email? Check your spam folder or try these options:</p>
        <div class="flex justify-center gap-4">
          <button 
            @click="goToHome" 
            class="text-[#a784ffd4] hover:underline"
          >
            Return to Home
          </button>
          <router-link 
            to="/signin" 
            class="text-[#a784ffd4] hover:underline"
          >
            Try signing in
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.email-logo {
  max-height: 40px;
  max-width: 120px;
  object-fit: contain;
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(167, 132, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(167, 132, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(167, 132, 255, 0);
  }
}
</style>