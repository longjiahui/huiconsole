<template>
    <div v-loading="!isInited" class="size-full">
        <div class="page-layout size-full v v-m p-m">
            <div v-show="isInited" class="f-1 shrink-0 h align-stretch h-m">
                <!-- sidebar -->
                <div class="sidebar v-m shrink-0">
                    <div class="title h justify-flex-end">
                        <div class="card brand h h-s p-h-m" style="border-radius: 5px">
                            <div>HUI CONSOLE</div>
                            <a-dropdown>
                                <div class="clickable">
                                    <SettingOutlined />
                                </div>
                                <template #overlay>
                                    <a-menu>
                                        <template v-if="$getters.isImAdmin">
                                            <a-menu-item @click="openTab(m)" v-for="m in [configRolesMenusItem, configUsersMenusItem, configMenusMenuItem]">
                                                <div class="h h-xs">
                                                    <component :is="m.dropDownIcon"></component>
                                                    <div>{{ m.name }}</div>
                                                </div>
                                            </a-menu-item>
                                        </template>
                                        <a-menu-item @click="$mutations.logout()">
                                            <div class="h h-xs">
                                                <LogoutOutlined />
                                                <div>退出登录</div>
                                            </div>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>
                    </div>
                    <div v-if="isInited">
                        <transition name="anfo-fade-tr" appear mode="out-in">
                            <anfo-loop
                                v-if="menus?.length > 0"
                                style="border-radius: 5px;padding-left: 0"
                                :datas="menus"
                                :data-key="d=>d._id"
                                container-class="p-l-m"
                                children-key="subMenus">
                                <template #="{ item: m, i, hasChildren, prevHasChildren, datas, toggle, isFold, isLast, isFirst }">
                                    <div
                                        :class="[
                                            'f-1 menu-item h h-s',
                                            m._id === currentTab?.menu?._id ? 'is-current':'',
                                            hasChildren ? 'has-children':'',

                                            // 左上角圆角情况
                                            prevHasChildren ? 'has-top-left-radius':'',
                                            // 左下角圆角的情况 hasChildren || 树迭代的最后一个
                                            hasChildren || isLast ? 'has-bottom-left-radius':'',
                                            isLast ? 'has-bottom-right-radius':'',
                                            isFirst ? 'has-top-right-radius has-top-left-radius':'',
                                        ]"
                                        @click="hasChildren ? toggle() : handleClickMenuItem(m)">
                                        <div class="h h-s f-1 justify-flex-end">
                                            <div v-if="m.icon">
                                                <component :is="m.icon" />
                                            </div>
                                            <div>
                                                {{ m.name }}
                                            </div>
                                        </div>
                                        <div v-if="hasChildren" :style="{
                                            transition: 'transform .3s',
                                            transform: `rotate(${isFold ? 0 : 90}deg)`,
                                        }">
                                            <caret-right-outlined/>
                                        </div>
                                    </div>
                                </template>
                            </anfo-loop>
                            <div v-else class="card p-m v align-flex-end desc">
                                <div>
                                    暂时没有菜单数据
                                </div>
                            </div>
                            <!-- <div v-for="m in menus"
                                :class="['menu-item h h-s', m._id === currentTab?.menu?._id ? 'is-current':'']"
                                :key="m._id"
                                @click="handleClickMenuItem(m)">
                                <div>
                                    <component :is="m.icon" />
                                </div>
                                <div>
                                    {{ m.name }}
                                </div>
                            </div> -->
                        </transition>
                    </div>
                </div>
                <!-- tabs/page -->
                <div class="main-main f-1 v v-m">
                    <!-- tabs -->
                    <div class="main-tabs card h h-s p-s align-stretch">
                        <div class="h h-s" v-if="tabs.length !== 1">
                            <transition name="anfo-fade" mode="out-in">
                                <div v-if="tabs.length > 1">
                                    <a-tooltip placement="left" title="清除全部标签">
                                        <DeleteOutlined class="clickable" @click="tabs = []" />
                                    </a-tooltip>
                                </div>
                                <div v-else-if="!tabs?.length > 0" class="p-h-s desc">没有打开的标签页</div>
                            </transition>
                        </div>
                        <div class="f-1">
                            <anfo-orderable-container channel="tabs" :datas="tabs"
                                @update:datas="val=>{
                                    val.forEach(i=>i.component = tabs.find(t=>t.id === i.id)?.component)
                                    tabs = val
                                }"
                                :data-key="d=>d.id" isHorizontal class="h-s">
                                <template #="{ data: t, i }">
                                    <div @click="handleClickTab(t)"
                                    style="height: 100%"
                                        :class="['main-tab p-h-s h h-s', t.id === currentTabID ? 'is-current':'']">
                                        <!-- {{ t.id }} -->
                                        <div v-if="t.menu?.icon"><component :is="t.menu?.icon"></component></div>
                                        <div class="f-1" style="word-break: break-all;">
                                            {{ t.menu?.name }}
                                        </div>
                                        <div class="tab-delete" @click.stop="tabs.splice(i, 1)"><CloseOutlined/></div>
                                    </div>
                                </template>
                            </anfo-orderable-container>
                        </div>
                    </div>
                    <!-- page -->
                    <div class="main-pages f-1">
                        <template v-if="currentTab">
                            <div class="size-full" v-if="currentTab.type === $const.menuType.component">
                                <keep-alive :include="componentTabs.map(t=>t.id)">
                                    <component :is="currentTab?.component"></component>
                                </keep-alive>
                            </div>
                        </template>
                        <component v-show="currentTabID === t.id" v-for="t in iframeTabs" :key="t.id" :is="t.component"></component>
                        <transition name="anfo-fade-tr" appear>
                            <div v-if="!currentTab"
                                style="background: linear-gradient(45deg, whitesmoke, lightgray)!important;"
                                class="card size-full v v-m align-center justify-center">
                                <h1 class="title">HUI CONSOLE</h1>
                                <p class="desc">longjiahui@hotmail.com</p>
                                <div>欢迎使用 <span class="title">HUI CONSOLE</span></div>
                                <div @click="openTab(configMenusMenuItem)" class="clickable" v-if="!(menus?.length > 0)">
                                    还没有菜单数据，点击创建
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineComponent, ref, markRaw, h, withDirectives, resolveDirective, computed, watch, onMounted } from 'vue'
import moduleLoader from '@/scripts/moduleLoader'
import { CloseOutlined, SettingOutlined } from '@ant-design/icons-vue'
import shortid from 'shortid'
import utils from '@/scripts/utils'
import business from '@/scripts/business'
import routeUtils from '@/scripts/route'
import { api } from '@/scripts/api'
import $const from '@/const'
import { MessageTransporter } from '@anfo/huiconsole-web-sdk'

let props = defineProps({
    base64Params: String,
})

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
                    class: isTransparent ? 'size-full' : 'card size-full overflow-hidden',
                }, h('iframe', {
                    ref: iframe,
                    src: data,
                    class: 'size-full',
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

function handleClickMenuItem(menu){
    openTab(menu)
}

function handleClickTab(tab){
    currentTabID.value = tab.id
}
</script>

<style lang="scss" scoped>
$navHeight: 48px;
.sidebar{
    width: 180px;
    // background: whitesmoke;

    .brand{
        border: 1px solid $primaryColor;
        color: $primaryTextColor;
        background: linear-gradient(45deg, $primaryColor, lighten($primaryColor, 5%));
        height: $navHeight;
    }
}
// .main-main{
//     background: #dedede;
// }
.main-tabs{
    height: $navHeight;
    // background: $primaryColor;
    background: linear-gradient(45deg, $primaryColor, lighten($primaryColor, 5%));
    overflow: hidden;
    border-radius: 5px;
    border: 1px solid $primaryColor;
    color: $primaryTextColor;
}
.main-tab{
    min-width: 72px;
    border-radius: 3px;
    transition: color .3s;
    background: linear-gradient(45deg, lighten($primaryColor, 15%), lighten($primaryColor, 10%));
    color: $primaryTextColor;
    position: relative;
    cursor: pointer;

    &.is-current{
        color: $primaryColor;
        background: linear-gradient(45deg, white 90%, lightgray);
        // background: whitesmoke;
    }
}

.menu-item{
    transition: background .3s, padding .3s, color .3s;
    cursor: pointer;
    background: rgba(0, 0, 0, calc(.04 + var(--layer) * .05));
    padding: 8px 8px;
    
    &.has-children{
        background: rgba(0, 0, 0, calc(var(--layer) * .05));
        box-shadow: rgba(0, 0, 0, .14) 0 0 24px;
    }
    &.has-top-left-radius{
        border-top-left-radius: 5px;
    }
    &.has-bottom-left-radius{
        border-bottom-left-radius: 5px;
    }
    &.has-top-right-radius{
        border-top-right-radius: 5px;
    }
    &.has-bottom-right-radius{
        border-bottom-right-radius: 5px;
    }
    
    @mixin focus{
        color: $primaryTextColor;
        background: $primaryColor;
        // background: linear-gradient(45deg, $primaryColor, lighten($primaryColor, 10%));
    }
    &:hover {
        @include focus;
    }

    &.is-current{
        @include focus;
    }
}
</style>