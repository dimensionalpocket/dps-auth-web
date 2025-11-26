import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LoginSuccessView from '@/views/LoginSuccessView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: HomeView,
    meta: { requiresAuth: true }
  },
  { path: '/login', name: 'login', component: LoginView },
  { 
    path: '/login-success', 
    name: 'login-success', 
    component: LoginSuccessView,
    meta: { requiresAuth: true }
  },
  { path: '/register', name: 'register', component: RegisterView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ 
      name: 'login', 
      query: { redirect: to.fullPath } 
    })
  } else {
    next()
  }
})
