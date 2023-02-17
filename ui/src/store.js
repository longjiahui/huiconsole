import { ref, reactive, computed } from 'vue'
import utils from '@/scripts/utils'
import router from '@/router'
import $const from '@/const'

export const state = reactive({
    token: '',
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
}