import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { supabase } from './lib/supabaseClient';

const app = createApp(App);

const initApp = async () => {
  const { data } = await supabase.auth.getSession();
  
  app.use(router);
  
  app.mount('#app');
};

initApp();