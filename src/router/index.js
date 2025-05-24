import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import AuthComponent from '../components/Authentication.vue';
import Dashboard from '../components/Dashboard.vue';
import ConfirmationPage from '../components/ConfirmationPage.vue';
import TransactionDetails from '../components/TransactionDetails.vue';
import { supabase } from '../lib/supabaseClient';

// Create routes configuration
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: AuthComponent,
    props: { isLogin: false },
    // Prevent authenticated users from accessing signup
    beforeEnter: async (to, from, next) => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        next('/dashboard');
      } else {
        next();
      }
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: AuthComponent,
    props: { isLogin: true },
    // Prevent authenticated users from accessing signin
    beforeEnter: async (to, from, next) => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        next('/dashboard');
      } else {
        next();
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/confirm-email',
    name: 'ConfirmEmail',
    component: ConfirmationPage
  },
  {
    path: '/transaction/:id',
    name: 'Transaction Details',
    component: TransactionDetails,
    meta: { requiresAuth: true }
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      // Redirect to login if not authenticated
      next({ 
        name: 'SignIn',
        query: { redirect: to.fullPath } // Save the desired destination for later
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;