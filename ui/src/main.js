import { createApp } from 'vue'
import App from './App.vue'

let app = createApp(App)

import router from '@/router'
app.use(router)

import plugins from '@/scripts/plugins'
app.use(plugins)

app.mount('#app')

import { fileAPI } from '@/scripts/api'
import { mutations } from '@/store'

// fetch huiconsoleConfig
fileAPI['huiconsole.config.json']().then(data=>{
    mutations.setHuiConsoleConfig(data)  
})