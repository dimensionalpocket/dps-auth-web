import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LoginSuccessView from '@/views/LoginSuccessView.vue'
import PasswordChangeView from '@/views/PasswordChangeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'
import AdminApp from '@/views/admin/AdminApp.vue'
import AdminHomeView from '@/views/admin/AdminHomeView.vue'
import AdminSitesView from '@/views/admin/AdminSitesView.vue'
import AdminUsersView from '@/views/admin/AdminUsersView.vue'

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
  { 
    path: '/password-change', 
    name: 'password-change', 
    component: PasswordChangeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminApp,
    children: [
      {
        path: '',
        name: 'admin-home',
        component: AdminHomeView,
      },
      {
        path: 'users',
        name: 'admin-users',
        component: AdminUsersView,
      },
      {
        path: 'sites',
        name: 'admin-sites',
        component: AdminSitesView,
      },
    ]
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    await authStore.ensureSession()
    if (!authStore.isAuthenticated) {
      next({ 
        name: 'login', 
        query: { redirect: to.fullPath } 
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
