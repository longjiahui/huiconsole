import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const routeParamsKey = 'base64Params'

export default {
    useURLParams(){
        let route = useRoute()
        let router = useRouter()
        let context = {
            params: computed(()=>{
                let routeParams = route.params
                let base64Params = ''
                if(routeParams?.routeParamsKey){
                    base64Params = routeParams?.routeParamsKey
                }else{
                    let keys = routeParams && Object.keys(routeParams) || []
                    if(keys?.length > 0){
                        base64Params = routeParams[keys[0]]
                    }
                }
                let content = decodeURIComponent(window.atob(base64Params))
                try{
                    return content && JSON.parse(content) || null
                }catch(err){
                    console.debug('url params parse error: ', err)
                }
                return null
            }),
            route(params, {
                type = 'push',
                name,
            } = {}){
                name = name || route.name
                let base64Params = window.btoa(encodeURIComponent(JSON.stringify(params)))
                router[type]({name, params: {
                    [routeParamsKey]: base64Params,
                }})
            },
            routeKey(key, value){
                let params = context.params.value || {}
                if(typeof params !== 'object'){
                    params = {}
                }
                params[key] = value
                context.route(params)
            }
        }
        return context
    },
}