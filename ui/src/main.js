import * as Vue from 'vue'
import { createApp } from 'vue'
window.Vue = Vue

import App from './App.vue'

let app = createApp(App)
window.app = app

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