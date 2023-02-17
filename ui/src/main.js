import { createApp } from 'vue'
import App from './App.vue'

let app = createApp(App)

import router from '@/router'
app.use(router)

import plugins from '@/scripts/plugins'
app.use(plugins)

app.mount('#app')