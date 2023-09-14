import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './assets/main.scss'
import pinia from './stores/index.js'
const app = createApp(App)
// sb
app.use(pinia)
app.use(router)

app.mount('#app')
