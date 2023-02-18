import { ref, reactive, computed } from 'vue'
import utils from '@/scripts/utils'
import api from '@/scripts/api'
import router from '@/router'
import $const from '@/const'

export const state = reactive({
    token: utils.getToken(),
    loadingCounter: 0,
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
        router.push({name: $const.routes.default})
    },
    logout(){
        state.token = ''
        utils.setToken('')
        router.push({name: $const.routes.login})
    }
}

export const getters = {
    isLoading: computed(()=>state.loadingCounter > 0),
    myInfo: utils.createAsyncComputed(()=>state.token, async ()=>{
        if(state.token){
            return await api.user.myInfo()
        }else{
            return {}
        }
    }),
    isImAdmin: computed(()=>!!getters.myInfo.value?.role?.isAdmin),
    myID: computed(()=>getters.myInfo.value?._id),
    isLogin: computed(()=>!!getters.myID.value),
}