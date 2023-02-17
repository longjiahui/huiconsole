import _axios from 'axios'

import { mutations } from '@/store'
import { message } from 'ant-design-vue'

let axios = _axios.create({
})

// 添加请求拦截器
axios.interceptors.request.use(config=>{
    return config
})

axios.interceptors.response.use(res=>{
    if(res.config.loading){
        mutations.releaseLoading()
    }
    // 对响应数据做点什么
    if(res.data.code < 0){
        // 未登陆
        if(res.data.code === -306){
            console.debug('未登陆')
            mutations.logout()
        }
        if(!res.config.ignoreError){
            message.error(res.data.msg)
        }
        throw new Error(`${res.config.url}: ${res.data.msg}`)
    }else if(res.data.code === 0){
        // let data = res.data?.data
        return res.data
    }else{
        return res
    }
}, error=>{
    if(error?.config?.loading){
        mutations.releaseLoading()
    }
    throw new Error(error)
})

/*
    raw 的效果是
    let api = createAPI()
    api.user.pageData().$raw().then(data=>{// 此处的data是api返回的原数据})
    如果没有raw
    api.user.pageData().then(data=>{//此处的data 是{code: 0, data: []}中的data})
*/
let createAPI = options=>{
    let {
        route = '/api',
        raw = false,
        dataMapper = d=>d,
        method = 'post'
    } = options || {}
    return new Proxy(()=>{}, {
        get(target, key){
            if(key === '$raw'){
                return createAPI({
                    ...options,
                    raw: true,
                })
            }
            return createAPI({
                ...options,
                route: `${route}/${key}`,
            })
        },
        apply(target, thisArg, args){
            let ret = axios[method](route, ...args)
            if(raw){
                return ret
            }else{
                return ret.then(res=>res.data).then(dataMapper)
            }
        }
    })
}

export default createAPI()