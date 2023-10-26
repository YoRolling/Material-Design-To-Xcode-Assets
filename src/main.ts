import 'uno.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

import App from './App.vue'
import '@/utils/xif.handlebars'
const app = createApp(App)

app.use(createPinia())
app.use(FloatingVue)

app.mount('#app')
