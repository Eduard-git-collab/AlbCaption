<template>
  <div class="auth-example-container">
    <h2>Authentication Example - Login</h2>
    
    <form @submit.prevent="handleLogin" class="login-form">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <div v-if="authStore.error" class="error">
      {{ authStore.error }}
    </div>

    <div v-if="authStore.isAuthed" class="success">
      <p>Login successful!</p>
      <p>User ID: {{ authStore.userId }}</p>
      <p>Email: {{ authStore.userEmail }}</p>
      <button @click="handleLogout">Logout</button>
      <router-link to="/example-dashboard">Go to Dashboard</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthExampleStore } from './authExampleStore'

const authStore = useAuthExampleStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await authStore.login(email.value, password.value)
}

const handleLogout = async () => {
  await authStore.signOut()
  email.value = ''
  password.value = ''
}
</script>

<style scoped>
.auth-example-container {
  padding: 20px;
  max-width: 400px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login-form div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.login-form input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-form button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-form button:disabled {
  opacity: 0.6;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>