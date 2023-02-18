import AnfoUI from '@anfo/ui'
import '@anfo/ui/style'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import * as Icons from '@ant-design/icons-vue'

import { state, mutations, getters } from '@/store'
import dialog from '@/scripts/dialog'
import utils from '@/scripts/utils'
import $const from '@/const'

export default {
    install(app){
        app.use(AnfoUI)
        app.use(Antd)

        Object.keys(Icons).forEach(i=>app.component(i, Icons[i]))
        app.config.globalProperties.$state = state
        app.config.globalProperties.$mutations = mutations
        app.config.globalProperties.$dialog = dialog
        app.config.globalProperties.$const = $const
        app.config.globalProperties.$utils = utils

        // 当前的用法，直接在Template的dom元素属性上使用需要加上.value,有点不统一，所以使用方法统一在页面引入getters，将变量放在公共scope上
        app.config.globalProperties.$getters = getters
    }
}