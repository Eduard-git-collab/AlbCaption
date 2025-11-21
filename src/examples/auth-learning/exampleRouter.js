import { createRouter, createWebHistory } from 'vue-router'
import { useAuthExampleStore } from './authExampleStore'
import ExampleLoginView from './ExampleLoginView.vue'
import ExampleDashboardView from './ExampleDashboardView.vue'

const exampleRoutes = [
  {
    path: '/example-login',
    name: 'ExampleLogin',
    component: ExampleLoginView,
    beforeEnter: async (to, from, next) => {
      const authStore = useAuthExampleStore()
      await authStore.init()
      if (authStore.isAuthed) {
        next('/example-dashboard')
      } else {
        next()
      }
    }
  },
  {
    path: '/example-dashboard',
    name: 'ExampleDashboard',
    component: ExampleDashboardView,
    meta: { requiresAuth: true }
  }
]

// Global route guard
export const setupExampleRouteGuard = (router) => {
  router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      const authStore = useAuthExampleStore()
      await authStore.init()
      
      if (!authStore.isAuthed) {
        next({
          name: 'ExampleLogin',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })
}

export default exampleRoutes