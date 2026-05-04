import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import AuthComponent from '../components/Authentication.vue';
import ConfirmationPage from '../components/ConfirmationPage.vue';
import TransactionDetails from '../components/TransactionDetails.vue';
import AccountActivation from '../components/views/AccountActivation.vue';
import { supabase } from '@/lib/supabaseClient';
import apiClient from '@/stores/apiClient';
import Pricing from '../components/Payment.vue';
import NotFound from '../components/views/NotFound.vue';
import Usage from '../components/Usage.vue'
import Test from '../components/Test.vue';
import ResetPassword from '../components/views/reset-password.vue'; 
import Upload from '../components/Upload.vue';
import PaymentSuccess from '../components/views/PaymentSuccess.vue';
import AuthCallback from '../components/views/AuthCallback.vue';
import UserSegmentation from '../components/views/UserSegmentation.vue';
import About from '../components/About.vue';
import Contact from '../components/Contact.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('../components/FAQ.vue') // Lazy load FAQ component
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
    meta: { hideNav: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: AuthComponent,
    props: { isLogin: true },
    meta: { hideNav: true }
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
    // meta: { requiresAuth: true }
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
    // meta: { requiresAuth: true }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing
  },
  {
    path: '/auth/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { hideNav: true }
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
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: AuthCallback
  },
  {
    path: '/segmentation',
    name: 'Segmentation',
    component: UserSegmentation,
    meta: { hideNav: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { top: 0 }
  }
}
});

// New Global Navigation Guard
router.beforeEach(async (to, from, next) => {
  // -----------------------------------------------------------------------
  // FIX 1: Handle Recovery Redirect
  // If user lands on Home ('/') with "type=recovery" in the hash,
  // it means the email link was incorrect. Redirect them to ResetPassword.
  // -----------------------------------------------------------------------
  if (to.name === 'ResetPassword') {
  const hash = new URLSearchParams(to.hash.slice(1));
  const hasToken = hash.get('access_token') || 
                   hash.get('code') || 
                   to.query.code || 
                   to.query.token;
  
  if (!hasToken) {
    next({ name: 'SignIn' });
    return;
  }
}

  const { data: { session } } = await supabase.auth.getSession();

  // -----------------------------------------------------------------------
  // FIX 2: Protect Reset Password Route
  // Prevent random access to /auth/reset-password.
  // Only allow if:
  // 1. User is already logged in (session exists)
  // 2. OR URL has recovery tokens (access_token in hash or code in query)
  // -----------------------------------------------------------------------
  if (to.name === 'ResetPassword') {
    const hasToken = (to.hash && to.hash.includes('access_token')) || (to.query && to.query.code);
    
    // If not logged in AND no token provided -> Redirect to SignIn
    if (!session && !hasToken) {
      next({ name: 'SignIn' });
      return;
    }
  }

  // CASE 1: User is NOT logged in
  if (!session) {
    // If trying to access a protected route, redirect to signin
    if (to.meta.requiresAuth) {
      next({ name: 'SignIn', query: { redirect: to.fullPath } });
    } else {
      // Otherwise, allow navigation
      next();
    }
    return;
  }

  // CASE 2: User IS logged in
  let segmentationStatus;
  try {
    const { data } = await apiClient.get('/auth/segmentation-status');
    segmentationStatus = data.segmentation;
  } catch (error) {
    // Fail open: if API fails, assume segmentation is complete to avoid blocking user.
    segmentationStatus = true;
    console.error("Could not verify segmentation status. Allowing navigation.", error);
  }

  // If segmentation is NOT complete
  if (segmentationStatus === false) {
    if (to.name !== 'Segmentation') {
      next({ name: 'Segmentation' });
    } else {
      next();
    }
    return;
  }
  
  // If segmentation IS complete
  if (segmentationStatus === true) {
    if (['SignIn', 'SignUp', 'Segmentation'].includes(to.name)) {
      next({ name: 'Dashboard' });
    } else {
      next();
    }
    return;
  }

  // Default fallback
  next();
});


export default router;