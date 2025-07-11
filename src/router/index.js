import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import AuthComponent from '../components/Authentication.vue';
import Dashboard from '../components/Dashboard.vue';
import ConfirmationPage from '../components/ConfirmationPage.vue';
import TransactionDetails from '../components/TransactionDetails.vue';
import { supabase } from '../lib/supabaseClient';
import Paypal from '../components/PayPal.vue';
import Pricing from '../components/Payment.vue';
import NewDashboard from '../components/NewDashboard.vue';
import NotFound from '../components/views/NotFound.vue';
import Login from '../components/Login.vue';

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
    path: '/login',
    name: 'Login',
    component: Login
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
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing
  },
  { 
    path: '/paypal/:planId', 
    name: 'Paypal',
    component: Paypal,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/new-dashboard',
    name: 'NewDashboard',
    component: NewDashboard
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      next({ 
        name: 'SignIn',
        query: { redirect: to.fullPath } 
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;