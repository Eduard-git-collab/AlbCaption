<template>
    <div class="callback-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Completing sign in...</p>
      </div>
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="goToLogin" class="btn">Back to Login</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  
  const loading = ref(true)
  const error = ref(null)
  
  onMounted(async () => {
    const token = route.query.token
    const errorParam = route.query.error
  
    if (errorParam) {
      error.value = 'Authentication failed. Please try again.'
      loading.value = false
      return
    }
  
    if (!token) {
      error.value = 'No authentication token received.'
      loading.value = false
      return
    }
  
    try {
      const success = await authStore.handleOAuthCallback(token)
      
      if (success) {
        // Redirect to dashboard or home
        router.push('/dashboard')
      } else {
        error.value = authStore.error || 'Authentication failed'
        loading.value = false
      }
    } catch (e) {
      console.error('Callback error:', e)
      error.value = 'An unexpected error occurred'
      loading.value = false
    }
  })
  
  const goToLogin = () => {
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .callback-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f5f5f5;
  }
  
  .loading {
    text-align: center;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 16px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-container {
    text-align: center;
    padding: 32px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .error-message {
    color: #dc3545;
    margin-bottom: 20px;
    font-size: 16px;
  }
  
  .btn {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .btn:hover {
    background: #0056b3;
  }
  </style>