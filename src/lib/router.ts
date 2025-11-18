import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LoginSuccessView from '@/views/LoginSuccessView.vue'
import SignUpView from '@/views/SignUpView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/sign-in', component: LoginView },
  { path: '/sign-in-success', component: LoginSuccessView },
  { path: '/sign-up', component: SignUpView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
