import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const initApp = async () => {
  try {
    // Only initialize auth store for non-public routes
    const authStore = useAuthStore()
    
    // Check if current route is public
    const currentPath = window.location.pathname
    const isPublicRoute = currentPath.includes('/auth/reset-password') || 
                         currentPath === '/' || 
                         currentPath.includes('/login') ||
                         currentPath.includes('/signin') ||
                         currentPath.includes('/signup')
    
    if (!isPublicRoute) {
      await authStore.init()
    }
    
    app.mount('#app')
  } catch (error) {
    console.error('Failed to initialize app:', error)
    app.mount('#app') // Mount anyway to show error state
  }
}

// GSAP Imports
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";
import { CustomWiggle } from "gsap/CustomWiggle";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
import { Draggable } from "gsap/Draggable";

// Register GSAP plugins
gsap.registerPlugin(CustomEase, CustomBounce, CustomWiggle, RoughEase, ExpoScaleEase, SlowMo, Draggable);

// Initialize the app
initApp()