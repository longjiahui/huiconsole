import AnfoUI from '@anfo/ui'
import '@anfo/ui/style'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import * as Icons from '@ant-design/icons-vue'

import { state, mutations, getters } from '@/store'
import dialog from '@/scripts/dialog'
import $const from '@/const'

export default {
    install(app){
        app.use(AnfoUI)
        app.use(Antd)

        Object.keys(Icons).forEach(i=>app.component(i, Icons[i]))
        app.config.globalProperties.$state = state
        app.config.globalProperties.$getters = getters
        app.config.globalProperties.$mutations = mutations
        app.config.globalProperties.$dialog = dialog
        app.config.globalProperties.$const = $const
    }
}