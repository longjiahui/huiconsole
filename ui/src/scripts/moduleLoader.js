import { markRaw, defineAsyncComponent } from 'vue'

const modules = import.meta.glob('/src/**/*.vue', {
    import: 'default',
})

export default {
    loadComponent(name){
        if(name){
            // let component = app.component(name)
            // if(component){
            //     return component
            // }
            let m = Object.keys(modules).find(k=>new RegExp(name).test(k))
            if(m){
                return markRaw(defineAsyncComponent(modules[m]))
            }
        }
    }
}