import axios from './axios'

/*
    raw 的效果是
    let api = createAPI()
    api.user.pageData().$raw().then(data=>{// 此处的data是api返回的原数据})
    如果没有raw
    api.user.pageData().then(data=>{//此处的data 是{code: 0, data: []}中的data})
*/
let createAPI = options=>{
    let {
        route = './api',
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

export const api = createAPI()
export const fileAPI = createAPI({
    route: './',
    method: 'get',
})