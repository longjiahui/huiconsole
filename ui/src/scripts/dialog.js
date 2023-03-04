import { createApp, reactive, ref, h, resolveComponent } from "vue"

import MenuSaveDialog from '@/components/dialogs/MenuSave.vue'
import AssetSaveDialog from '@/components/dialogs/AssetSave.vue'
import AssetSelectDialog from '@/components/dialogs/AssetSelect.vue'
import IconPickerDialog from '@/components/dialogs/IconPicker.vue'
import UserSaveDialog from '@/components/dialogs/UserSave.vue'
import InputDialog from '@/components/dialogs/Input.vue'
import RoleSaveDialog from '@/components/dialogs/RoleSave.vue'
import RoleMenuSaveDialog from '@/components/dialogs/RoleMenuSave.vue'
import QuickCheckUsersRoleDialog from '@/components/dialogs/QuickCheckUsersRole.vue'

import plugins from '@/scripts/plugins'

import zhCN from 'ant-design-vue/es/locale/zh_CN'

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
                    let dialog = ()=>h(DialogComponent, {
                        visible: visible.value,
                        'onUpdate:Visible': val=>visible.value = val,
                        ...params,
                        onR: r,
                        onReject: reject,
                    })
                    let configProvider = h(resolveComponent('a-config-provider'), {
                        locale: zhCN,
                    }, dialog)
                    return configProvider
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
    ['AssetSaveDialog', AssetSaveDialog],
    ['AssetSelectDialog', AssetSelectDialog],
    ['IconPickerDialog', IconPickerDialog],
    ['UserSaveDialog', UserSaveDialog],
    ['InputDialog', InputDialog],
    ['RoleSaveDialog', RoleSaveDialog],
    ['RoleMenuSaveDialog', RoleMenuSaveDialog],
    ['QuickCheckUsersRoleDialog', QuickCheckUsersRoleDialog],
].forEach(d=>{
    let key = d[0]
    let DialogComponent = d[1]
    dialogs[`open${key[0].toUpperCase()}${key.slice(1)}`] = params=>dialogs.openDialog(DialogComponent, params)
})

export default dialogs