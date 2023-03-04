import { markRaw, defineAsyncComponent, resolveComponent } from 'vue'
import $const from '@/const'

const modules = import.meta.glob('/src/**/*.vue', {
    import: 'default',
})

export default {
    async loadComponent(tab){
        let {
            menu: {
                type,
                data: {
                    data,
                    preloadAssets
                } = {},
            } = {},
        } = tab || {}
        if(preloadAssets?.length > 0){
            await Promise.all(preloadAssets.map(asset=>{
                return new Promise((r, reject)=>{
                    if(asset.type === $const.ASSET.SCRIPT){
                        let script = document.createElement('script')
                        script.src = asset.url
                        script.onload = r
                        script.onerror = reject
                        script.async = true
                        document.body.appendChild(script)
                    }else if(asset.type === $const.ASSET.STYLE){
                        let link = document.createElement('link')
                        link.href = asset.url
                        link.onload = r
                        link.onerror = reject
                        link.rel = 'stylesheet'
                        document.head.appendChild(link)
                    }
                })
            }))
        }
        if(type === $const.MT.COMPONENT && data){
            let component = Object.keys(modules).find(k=>data && new RegExp(data).test(k))
            if(component){
                return markRaw(defineAsyncComponent(modules[component]))
            }
            component = data.split('.').reduce((t, k)=>t?.[k], window)
            if(component){
                return component
            }
            component = resolveComponent(data)
            if(component !== data){
                return markRaw(component)
            }
        }
    }
}