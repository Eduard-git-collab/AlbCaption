<template>
    <div class="dashboard-container">
      <h2>Protected Dashboard - Example</h2>
  
      <div v-if="authStore.loading" class="loading">
        Loading user data...
      </div>
  
      <div v-else-if="!authStore.isAuthed" class="not-authed">
        <p>You are not authenticated. Please <router-link to="/example-login">login</router-link></p>
      </div>
  
      <div v-else class="user-info">
        <h3>Welcome, {{ authStore.userEmail }}</h3>
        
        <div class="info-box">
          <p><strong>User ID:</strong> {{ authStore.userId }}</p>
          <p><strong>Email:</strong> {{ authStore.userEmail }}</p>
          <p><strong>Token:</strong> {{ authStore.token?.substring(0, 20) }}...</p>
        </div>
  
        <div v-if="userData" class="user-data">
          <h4>Data from Backend (User-Scoped):</h4>
          <pre>{{ JSON.stringify(userData, null, 2) }}</pre>
        </div>
  
        <div v-if="dataLoading" class="loading">
          Fetching user data from backend...
        </div>
  
        <div v-if="dataError" class="error">
          {{ dataError }}
        </div>
  
        <button @click="fetchUserData">Fetch User Data from Backend</button>
        <button @click="handleLogout">Logout</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAuthExampleStore } from './authExampleStore'
  import exampleApiClient from './exampleApiClient'
  
  const authStore = useAuthExampleStore()
  const userData = ref(null)
  const dataLoading = ref(false)
  const dataError = ref(null)
  
  onMounted(async () => {
    await authStore.init()
  })
  
  const fetchUserData = async () => {
    dataLoading.value = true
    dataError.value = null
    
    try {
      const response = await exampleApiClient.get('/api/examples/me')
      userData.value = response.data
    } catch (error) {
      dataError.value = error.response?.data?.message || error.message
      console.error('Error fetching user data:', error)
    } finally {
      dataLoading.value = false
    }
  }
  
  const handleLogout = async () => {
    await authStore.signOut()
  }
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 20px;
    max-width: 600px;
  }
  
  .loading,
  .not-authed,
  .error {
    padding: 15px;
    border-radius: 4px;
    margin: 10px 0;
  }
  
  .loading {
    background-color: #e3f2fd;
    color: #1976d2;
  }
  
  .error {
    background-color: #ffebee;
    color: #c62828;
  }
  
  .not-authed {
    background-color: #fff3e0;
    color: #e65100;
  }
  
  .info-box {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 4px;
    margin: 15px 0;
  }
  
  .info-box p {
    margin: 8px 0;
  }
  
  .user-data {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    margin: 15px 0;
    border-left: 4px solid #4caf50;
  }
  
  .user-data pre {
    overflow-x: auto;
    font-size: 12px;
  }
  
  button {
    padding: 10px 15px;
    margin: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>