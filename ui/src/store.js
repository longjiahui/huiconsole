import { ref, reactive, computed } from 'vue'
import utils from '@/scripts/utils'
import { api, fileAPI } from '@/scripts/api'
import router from '@/router'
import $const from '@/const'

export const state = reactive({
    token: utils.getToken(),
    loadingCounter: 0,
    huiconsoleConfig: {},
})

export const mutations = {
    requestLoading(){
        state.loadingCounter++
    },
    releaseLoading(){
        state.loadingCounter--
    },
    login(token){
        state.token = token
        utils.setToken(token)
        utils.goTheme($const.routes.default)
    },
    logout(){
        state.token = ''
        utils.setToken('')
        router.push({name: $const.routes.login})
    },
    setHuiConsoleConfig(c){
        if(!c?.ui){
            c.ui = {}
        }
        state.huiconsoleConfig.ui = Object.assign({}, {
            title: 'HUI CONSOLE',
            brand: c.ui?.title || 'HUI CONSOLE',
            // in login
            description: '后台管理系统',
        }, c.ui,)
        document.title = state.huiconsoleConfig.ui.title
        console.debug('read config: ', c)
        console.debug('final config: ', state.huiconsoleConfig)
    }
}

// fetch huiconsoleConfig
fileAPI['huiconsole.config.json']().then(data=>{
    mutations.setHuiConsoleConfig(data)  
})

export const getters = reactive({
    isLoading: computed(()=>state.loadingCounter > 0),
    myInfo: utils.createAsyncComputed(()=>state.token, async ()=>{
        if(state.token){
            return await api.user.myInfo()
        }else{
            return {}
        }
    }),
    isImAdmin: computed(()=>!!getters.myInfo?.role?.isAdmin),
    myID: computed(()=>getters.myInfo?._id),
    myRoleID: computed(()=>getters.myInfo?.role?._id),
    isLogin: computed(()=>!!getters.myID),

    // huiconsole.config relative
    huiconsole: computed(()=>state.huiconsoleConfig?.ui || {})
})