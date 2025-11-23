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

import AOS from 'aos'
import 'aos/dist/aos.css'

// Initialize AOS
// once: true means animations happen only once (don't reset when scrolling up)
AOS.init({
  once: true,
  offset: 100, // offset (in px) from the original trigger point
  duration: 800, // values from 0 to 3000, with step 50ms
  easing: 'ease-out-cubic', // default easing for AOS animations
})

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
                         currentPath.includes('/signup') ||
                         currentPath.includes('/example-') // Add example routes as public for learning
    
    if (!isPublicRoute) {
      await authStore.init()
    }

    // Initialize example auth store if on example routes (for learning)
    if (currentPath.includes('/example-')) {
      const exampleAuthStore = useAuthExampleStore()
      await exampleAuthStore.init()
    }
    
    app.mount('#app')
  } catch (error) {
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