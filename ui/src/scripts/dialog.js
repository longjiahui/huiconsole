import { createApp, reactive, ref, h } from "vue"

import MenuSaveDialog from '@/components/dialogs/MenuSave.vue'
import IconPickerDialog from '@/components/dialogs/IconPicker.vue'
import UserSaveDialog from '@/components/dialogs/UserSave.vue'
import InputDialog from '@/components/dialogs/Input.vue'

import plugins from '@/scripts/plugins'

let openedDialogs = {}

let dialogs = {
    // 只能打开一个实例，目前
    async openDialog(DialogComponent, params){
        let key
        if(params?.key){
            key = params.key
            delete params.key
        }else{
            key = JSON.stringify(DialogComponent)
        }
        let promise = openedDialogs[key]
        if(promise){
            return promise
        }
        let app, div
        let visible = ref(true)
        params = reactive(params || {})
        openedDialogs[key] =  new Promise((r, reject)=>{
            app = createApp({
                components: {
                    DialogComponent
                },
                render(){
                    return h(DialogComponent, {
                        visible: visible.value,
                        'onUpdate:Visible': val=>visible.value = val,
                        ...params,
                        onR: r,
                        onReject: reject,
                    })
                    // return <dialog-component
                    //     v-model={[visible.value, 'visible']}
                    //     {...params}
                    //     onR={r}
                    //     onReject={reject}></dialog-component>
                }
            })
            app.use(plugins)
            div = document.createElement('div')
            document.body.appendChild(div)
            app.mount(div)
        }).finally(()=>{
            visible.value = false
            setTimeout(()=>{
                app?.unmount()
                if(div){
                    document.body.removeChild(div)
                }
            }, 3000)
        })
        promise = openedDialogs[key]
        promise.finally(()=>delete openedDialogs[key])
        return promise
    },
}

;[ 
    ['MenuSaveDialog', MenuSaveDialog],
    ['IconPickerDialog', IconPickerDialog],
    ['UserSaveDialog', UserSaveDialog],
    ['InputDialog', InputDialog],
].forEach(d=>{
    let key = d[0]
    let DialogComponent = d[1]
    dialogs[`open${key[0].toUpperCase()}${key.slice(1)}`] = params=>dialogs.openDialog(DialogComponent, params)
})

export default dialogs