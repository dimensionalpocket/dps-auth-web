import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LoginSuccessView from '@/views/LoginSuccessView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/login-success', name: 'login-success', component: LoginSuccessView },
  { path: '/register', name: 'register', component: RegisterView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
