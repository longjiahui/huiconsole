import { ref, reactive, computed, nextTick } from 'vue'
import utils from '@/scripts/utils'
import { api, fileAPI } from '@/scripts/api'
import router from '@/router'
import $const from '@/const'

let _rInit, _rejectInit
export const state = reactive({
    token: utils.getToken(),
    loadingCounter: 0,
    huiconsoleConfig: {},

    initPromise: new Promise((r, reject)=>{
        _rInit = r
        _rejectInit = reject
    })
})
state.myInfo = utils.createAsyncComputed(()=>state.token, async ()=>{
    try{
        let val
        if(state.token){
            val = await api.user.myInfo()
        }else{
            val = {}
        }
        nextTick(()=>{
            _rInit()
        })
        return val
    }catch(err){
        _rejectInit(err)
        throw err
    }
}, {}, {
    deep: false,
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
    setMenus(menus){
        if(state.myInfo){
            state.myInfo.menus = menus
        }
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
    },
}

export const getters = reactive({
    isLoading: computed(()=>state.loadingCounter > 0),
    menus: computed(()=>state.myInfo?.menus || []),
    isImAdmin: computed(()=>!!state.myInfo?.role?.isAdmin),
    myID: computed(()=>state.myInfo?._id),
    myRoleID: computed(()=>state.myInfo?.role?._id),
    isLogin: computed(()=>!!getters.myID),

    // huiconsole.config relative
    huiconsole: computed(()=>state.huiconsoleConfig?.ui || {})
})