import _axios from 'axios'
import { message } from 'ant-design-vue'
let axios = _axios.create({})

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

export default axios