import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import AuthComponent from '../components/Authentication.vue';
import ConfirmationPage from '../components/ConfirmationPage.vue';
import TransactionDetails from '../components/TransactionDetails.vue';
import AccountActivation from '../components/views/AccountActivation.vue';
import { supabase } from '@/lib/supabaseClient';
import Pricing from '../components/Payment.vue';
import NotFound from '../components/views/NotFound.vue';
import Usage from '../components/Usage.vue'
import Test from '../components/Test.vue';
import ResetPassword from '../components/views/reset-password.vue'; 
import Upload from '../components/Upload.vue';
import PaymentSuccess from '../components/views/PaymentSuccess.vue';

// Import example routes
import exampleRoutes, { setupExampleRouteGuard } from '../examples/auth-learning/exampleRouter'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccess
  },
  {
    path: '/payment/error',
    name: 'PaymentError',
    component: PaymentSuccess
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
    path: '/usage',
    name: 'Usage',
    component: Usage
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
    path: '/auth/reset-password',
    name: 'ResetPassword',
    component: ResetPassword 
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/account-activation',
    name: 'Activate Account',
    component: AccountActivation,
  },
  
  // Add example routes here
  ...exampleRoutes,
  
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

// Setup example route guards
setupExampleRouteGuard(router)

export default router;