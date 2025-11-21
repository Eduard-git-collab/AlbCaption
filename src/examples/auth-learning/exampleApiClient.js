import axios from 'axios'
import { useAuthExampleStore } from './authExampleStore'

// Create axios instance
const exampleApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

// Request interceptor - attach JWT token
exampleApiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthExampleStore()
    const token = authStore.getToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // Also pass userId in header for extra safety
      config.headers['X-User-ID'] = authStore.userId
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
exampleApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - sign out user
      const authStore = useAuthExampleStore()
      authStore.signOut()
    }
    return Promise.reject(error)
  }
)

export default exampleApiClient