<template>
    <slot name="layout" v-bind="{
        Tabs: ()=>h($slots.tabs, context),
        Content: ()=>h($slots.content, context),
        Sidebar: $slots.sidebar,
        ...context,
        isInited,
    }"></slot>
</template>


<script setup>
import { defineComponent, ref, markRaw, h, withDirectives, resolveDirective, computed, watch, onMounted, toRefs, reactive } from 'vue'
import moduleLoader from '@/scripts/moduleLoader'
import shortid from 'shortid'
import utils from '@/scripts/utils'
import business from '@/scripts/business'
import routeUtils from '@/scripts/route'
import api from '@/scripts/api'
import $const from '@/const'
import { MessageTransporter } from '@anfo/huiconsole-web-sdk'

let { params: urlParams, routeKey } = routeUtils.useURLParams()
let currentTabID = computed({
    get(){
        return urlParams.value?.currentTabID || ''
    },
    set(val){
        routeKey('currentTabID', val)
    }
})

let menus = ref([])
watch(menus, val=>console.debug(val))
// 初始化标志
let isInited = ref(false)
Promise.all([
    api.menu.pageData().then(data=>{
        menus.value = data.data
    })
]).finally(()=>{
    isInited.value = true
})

const configMenusMenuItem = {
    _id: '__menuConfig',
    name: '菜单项',
    dropDownIcon: 'MenuOutlined',
    icon: 'SettingOutlined',
    data: 'views/ConfigMenus',
}
const configUsersMenusItem = {
    _id: '__userconfig',
    name: '用户',
    dropDownIcon: 'UserOutlined',
    icon: 'SettingOutlined',
    data: 'views/ConfigUsers',
}
const configRolesMenusItem = {
    _id: '__roleConfig',
    name: '角色',
    dropDownIcon: 'UserOutlined',
    icon: 'SettingOutlined',
    data: 'views/ConfigRoles',
}

let tabs = ref(utils.getLocal('tabs', []).map(t=>{
    t.type = business.getMenuType(t.menu)
    t.component = buildComponentFromTab(t)
    return t
}))

let iframeTabs = computed(()=>tabs.value.filter(t=>t.type === $const.menuType.iframe))
let componentTabs = computed(()=>tabs.value.filter(t=>t.type === $const.menuType.component))
let tabStack = computed(()=>[...tabs.value].sort((a,b)=>a._lastActive - b._lastActive))
let currentTab = computed(()=>tabs.value.find(t=>t.id === currentTabID.value))
watch(tabs, val=>{
    utils.setLocal('tabs', val)
}, { deep: true })
watch(currentTab, async val=>{
    if(!val){
        currentTabID.value = tabStack.value?.[0]?.id
    }
})

function touchTab(tab){
    tab._lastActive = Date.now()
}


function buildComponentFromTab(tab){
    let { data, isTransparent } = tab.menu
    let c
    if(tab.type === $const.menuType.iframe){
        c = defineComponent({
            name: tab.id,
            setup(){
                let isLoading = ref(true)
                let iframe = ref(null)
                let huiconsole = new MessageTransporter()
                onMounted(()=>{
                    let contentWindow = iframe.value?.contentWindow
                    if(contentWindow){
                        huiconsole.to(contentWindow)
                        // 这边发出的是单向的，通过单向发出来设置channel
                        huiconsole.on('getToken', ()=>{
                            return utils.getToken()
                        })
                        huiconsole.on('openTab', (menu) => {
                            openTab(menu)
                        })
                        huiconsole.on('closeTab', () => {
                            let ind = tabs.value.findIndex(t=>t.id === tab.id)
                            if(ind > -1){
                                tabs.value.splice(ind, 1)
                            }
                        })
                    }
                })
                return ()=>withDirectives(h('div', {
                    class: 'size-full',
                    // class: isTransparent ? 'size-full' : 'size-full overflow-hidden',
                }, h('iframe', {
                    ref: iframe,
                    src: data,
                    class: 'size-full',
                    allowtransparency: true,
                    style: {
                        border: 'none',
                    },
                    onload(e){
                        isLoading.value = false
                        huiconsole.syncChannel(tab.id)
                    },
                })), [
                    [ resolveDirective('loading'), isLoading.value ]
                ])
            }
        })
    }else if(tab.type === $const.menuType.component){
        let _c = moduleLoader.loadComponent(data)
        c = defineComponent({
            name: tab.id,
            render(){
                return h(_c)
            },
        })
    }
    if(c){
        return markRaw(c)
    }else{
        console.warn('component not found: ', data)
    }
}
function openTab(menu){
    let { _id: menuID } = menu
    menuID = menuID || shortid.generate()
    let tab = tabs.value.find(t=>t.menu?._id === menuID)
    if(!tab){
        let id = shortid.generate()
        tab = {
            id,
            menu,
            type: business.getMenuType(menu)
        }
        tab.component = buildComponentFromTab(tab)
        tabs.value.push(tab)
    }
    currentTabID.value = tab.id
    touchTab(tab)
}

let context = reactive({
    menus,
    tabs,
    iframeTabs,
    componentTabs,
    currentTab,
    currentTabID,
    isInited,
    configMenusMenuItem,
    configUsersMenusItem,
    configRolesMenusItem,

    openTab,
    buildComponentFromTab,
    touchTab,

    setContext(data){
        Object.assign(context, data)
    },
})
</script>