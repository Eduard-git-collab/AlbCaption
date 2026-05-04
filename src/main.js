import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import Modal from './components/items/Modal.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.component('Modal', Modal)


const initApp = async () => {
  try {
    const authStore = useAuthStore()
    await authStore.init()

    app.mount('#app')
  } catch (error) {
    app.mount('#app')
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