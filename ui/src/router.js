import { createRouter, createWebHashHistory } from "vue-router"
import utils from '@/scripts/utils'
import $const from '@/const'

let router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/legacy/:base64Params?',
        props: true,
        name: 'legacy',
        component: () => import('@/views/LayoutLegacy.vue'),
    }, {
        path: '/:base64Params?',
        props: true,
        name: $const.routes.default,
        component: () => import('@/views/Layout.vue'),
    }, {
        path: '/login',
        name: $const.routes.login,
        component: () => import('@/views/Login.vue'),
    }]
})

router.beforeEach((to, from) => {
    if(to.name !== $const.routes.login){
        if(!utils.getToken()){
            router.push({name: $const.routes.login})
            return false
        }
    }
})

export default router