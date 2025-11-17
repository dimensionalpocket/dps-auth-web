import './style.css'
import 'inter-ui/inter-variable.css'

import { createApp } from 'vue'
import { createHead } from '@vueuse/head'

import App from './App.vue'

const app = createApp(App)
const head = createHead()

app.use(head)
app.mount('#app')
