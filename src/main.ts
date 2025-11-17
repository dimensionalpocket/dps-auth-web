import './style.css'
import 'inter-ui/inter-variable.css'

import { createApp } from 'vue'
import { createHead } from '@vueuse/head'

import App from './App.vue'
import { router } from './lib/router'

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
app.mount('#app')
