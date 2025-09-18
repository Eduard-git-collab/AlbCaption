import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import AuthComponent from '../components/Authentication.vue';
import Dashboard from '../components/Dashboard.vue';
import ConfirmationPage from '../components/ConfirmationPage.vue';
import TransactionDetails from '../components/TransactionDetails.vue';
import { supabase } from '../lib/supabaseClient';
import Paypal from '../components/Paypal.vue';
import Pricing from '../components/Payment.vue';
import NewDashboard from '../components/NewDashboard.vue';
import NotFound from '../components/views/NotFound.vue';
import Login from '../components/Login.vue';
import Test from '../components/Test.vue';
import ResetPassword from '../components/views/reset-password.vue'; 
import Upload from '../components/Upload.vue';
import Payment from '../components/Paypal.vue';

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
      if (data.session) next('/dashboard');
      else next();
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: AuthComponent,
    props: { isLogin: true },
    beforeEnter: async (to, from, next) => {
      const { data } = await supabase.auth.getSession();
      if (data.session) next('/dashboard');
      else next();
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/usage',
    name: 'Usage',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Test,
    meta: { requiresAuth: true }
  },
  {
    path: '/upload',
    name: 'Ngarko',
    component: Upload,
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
    path:'/payment',
    name: 'Payment',
    component: Payment,
    meta: {requiresAuth: true}
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
    path: '/dashboard',
    name: 'NewDashboard',
    component: NewDashboard
  },
  {
    path: '/auth/reset-password',
    name: 'ResetPassword',
    component: ResetPassword // PUBLIC route; no requiresAuth
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
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
      next({ name: 'SignIn', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;