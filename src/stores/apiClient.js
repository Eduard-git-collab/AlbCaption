import axios from 'axios'
import { supabase } from '@/lib/supabaseClient'

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

// Session cache to avoid repeated getSession() calls
let cachedSession = null
let sessionCacheTime = null
const CACHE_DURATION = 5000 // 5 seconds

// Listen for auth state changes to invalidate cache
supabase.auth.onAuthStateChange((event, session) => {
  cachedSession = session
  sessionCacheTime = Date.now()
  console.log('[API] Auth state changed:', event)
})

// Helper to get session with caching
async function getSessionWithCache() {
  const now = Date.now()
  
  // Return cached session if still valid
  if (cachedSession && sessionCacheTime && (now - sessionCacheTime) < CACHE_DURATION) {
    console.log('[API] Using cached session')
    return cachedSession
  }
  
  // Fetch fresh session
  const { data: { session } } = await supabase.auth.getSession()
  cachedSession = session
  sessionCacheTime = now
  
  return session
}

// Request interceptor - attach JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSessionWithCache()
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
        config.headers['X-User-ID'] = session.user?.id
        console.log('[API] ✓ Token attached to request:', config.url)
      } else {
        console.warn('[API] ⚠️ No session token available for:', config.url)
      }
    } catch (error) {
      console.error('[API] Error getting session:', error)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Track if a refresh is in progress to prevent multiple simultaneous refreshes
let refreshPromise = null

// Response interceptor - handle 401 errors with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn('[API] 401 Unauthorized - attempting to refresh session')
      originalRequest._retry = true
      
      try {
        // If a refresh is already in progress, wait for it
        if (refreshPromise) {
          await refreshPromise
        } else {
          // Start the refresh
          refreshPromise = supabase.auth.refreshSession()
          const { data, error: refreshError } = await refreshPromise
          refreshPromise = null
          
          if (refreshError || !data.session?.access_token) {
            console.error('[API] Session refresh failed:', refreshError?.message)
            // Clear cache and redirect to login
            cachedSession = null
            sessionCacheTime = null
            window.location.href = '/signin'
            return Promise.reject(error)
          }
          
          // Update cache with new session
          cachedSession = data.session
          sessionCacheTime = Date.now()
          console.log('[API] ✓ Session refreshed successfully')
        }
        
        // Retry the original request with new token
        const session = await getSessionWithCache()
        if (session?.access_token) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`
          console.log('[API] Retrying request with new token:', originalRequest.url)
          return apiClient.request(originalRequest)
        }
      } catch (refreshError) {
        console.error('[API] Refresh failed:', refreshError)
        cachedSession = null
        sessionCacheTime = null
        window.location.href = '/signin'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient