import { ref, computed, watch, onMounted, reactive, markRaw, defineComponent, withDirectives, resolveDirective, h, onUnmounted } from 'vue'
import utils from '@/scripts/utils'
import { api } from '@/scripts/api'
import routeUtils from '@/scripts/route'
import $const from '@/const'
import { MessageTransporter } from '@anfo/huiconsole-web-sdk'
import shortid from 'shortid'
import moduleLoader from '@/scripts/moduleLoader'
import { message } from 'ant-design-vue'
import { state, getters } from '@/store'
import url from 'url'

const constMenus = [{
    _id: '__menuConfig',
    name: '菜单项',
    dropDownIcon: 'MenuOutlined',
    icon: 'SettingOutlined',
    type: $const.MT.COMPONENT,
    data: {
        data: 'views/ConfigMenus',
    },
}, {
    _id: '__assetConfig',
    name: '资源管理',
    dropDownIcon: 'FileTextOutlined',
    icon: 'SettingOutlined',
    type: $const.MT.COMPONENT,
    data: {
        data: 'views/ConfigAssets',
    },
}, {
    _id: '__userconfig',
    name: '用户',
    dropDownIcon: 'UserOutlined',
    icon: 'SettingOutlined',
    type: $const.MT.COMPONENT,
    data: {
        data: 'views/ConfigUsers',
    },
}, {
    _id: '__roleConfig',
    name: '角色',
    dropDownIcon: 'UserOutlined',
    icon: 'SettingOutlined',
    type: $const.MT.COMPONENT,
    data: {
        data: 'views/ConfigRoles',
    },
}]

export default class {
    constructor(){
        let { params: urlParams, routeKey } = routeUtils.useURLParams()

        let isInited = ref(false)
        let isIniting = ref(false)

        // menus
        let menus = computed(()=>getters.menus)
        // tabs
        let tabs = ref([])

        let components = utils.createAsyncComputed(tabs, async val=>{
            return Promise.all(val?.map?.(async t=>[
                t.id, await this.buildComponentByTabID(t.id),
            ])).then(data=>{
                return (data || []).reduce((t, d)=>{
                    t[d[0]] = d[1]
                    return t
                }, {})
            })
        }, {})

        let data = {
            urlParams,
            routeKey,

            isInited,
            isIniting,
            menus,
            tabs,
            components,

            finalMenus: computed(()=>this.menus.value.concat(...constMenus)),
            currentComponent: computed(()=>this.components.value[this.currentTabID.value]),
            currentTabID: computed({
                get() {
                    return urlParams.value?.currentTabID || ''
                },
                set(val) {
                    routeKey('currentTabID', val)
                }
            }),
            currentTab: computed(() => this.tabs.value.find(t => t.id === data.currentTabID.value)),
            iframeTabs: computed(() => this.tabs.value.filter(t => t.menu?.type === $const.MT.IFRAME)),
            componentTabs: computed(() => this.tabs.value.filter(t => t.menu?.type === $const.MT.COMPONENT)),
            tabStack: computed(() => [...this.tabs.value].sort((a, b) => b._lastActive - a._lastActive)),

            constMenus,
        }
        this._data = data
        Object.assign(this, data)
    }

    setTabs(tabs){
        this.tabs.value = tabs
    }

    setCurrentTabID(id){
        this.currentTabID.value = id
    }

    buildReactiveTab(t){
        return reactive({
            ...t,
            menu: computed(()=>this.finalMenus.value.find(m=>m._id === t.menu?._id) || t.menu)
        })
    }

    async init(){
        await state.initPromise
        this.isIniting.value = true
        try{
            this.tabs.value = utils.getLocal('tabs', []).map(t=>this.buildReactiveTab(t))
            watch(this.tabs, val=>{
                utils.setLocal('tabs', val)
            }, { deep: true })
            watch(this.currentTab, async val => {
                if (!val) {
                    this.currentTabID.value = this.tabStack.value?.[0]?.id
                }
            }, {
                immediate: true,
            })
            watch(this.currentTabID, async val=>{
                if(val){
                    this.touchTab(val)
                }
            }, {
                immediate: true,
            })
            if (this.menus.value?.length > 0 && !(this.tabs.value?.length > 0)) {
                await utils.iterate(this.menus.value, 'children', async m => {
                    if (!(m.children?.length > 0)) {
                        await this.openTabByMenu(m._id)
                        return true
                    }
                })
            }
            // 决定是否修改currentTabID
            if (!this.currentTabID.value && this.tabs.value?.length > 0) {
                this.currentTabID.value = this.tabs.value?.[0]?.id
            }
            if (this.currentTabID.value && !this.currentTab.value) {
                this.currentTabID.value = ''
            }
        }catch(err){
            console.error(err)
            this.isIniting.value = false
            throw err
        }
        this.isInited.value = true
    }

    closeTabs(){
        this.tabs.value = []
    }
    closeTab(id){
        let ind = this.tabs.value.findIndex(t=>t.id === id)
        if(ind > -1){
            this.tabs.value.splice(ind, 1)
        }
    }

    async openTab(menu, from, resolveId){
        let tabID = shortid.generate()
        let tab = this.buildReactiveTab({
            id: tabID,
            // from tabid 传给huiconsole web sdk使用
            from,
            // resolveId 用来通信标记open的结果
            resolveId,
            menu,
        })
        this.tabs.value = this.tabs.value.concat(tab)
        this.currentTabID.value = tab.id
        return tab
    }

    async openTabByMenu(menuID, from, resolveId) {
        let tab = this.tabs.value.find(t => t.menu?._id === menuID)
        if (!tab) {
            let menu = this.finalMenus.value.find(m=>m._id === menuID)
            if(!menu){
                // 找不到菜单
                message.warn('打开TAB失败：没找到菜单！')
                throw new Error('打开TAB失败：没找到菜单！')
            }else{
                tab = await this.openTab(menu, from, resolveId)
            }
        }else{
            this.currentTabID.value = tab.id
        }
    }

    touchTab(tabID) {
        let tab = this.tabs.value.find(t => t.id === tabID)
        tab._lastActive = Date.now()
    }

    getRelID(tab){
        return tab?.menu?._id || tab.id
    }

    async buildComponentByTabID(tabID) {
        let tab = this.tabs.value.find(t => t.id === tabID)
        let {
            menu,
            menu: {
                data: _data,
                data: {
                    data
                } = {},
                type,
            } = {},
            from,
            resolveId,
        } = tab || {}
        if(this.components.value[tabID]){
            return this.components.value[tabID]
        }
        let iframe = ref(null)
        let that = this
        // 被管理的页面的messageTransporter id
        let to = shortid.generate()
        return (async () => {
            if (type === $const.MT.IFRAME) {
                return defineComponent({
                    setup() {
                        let isLoading = ref(true)
                        return () => withDirectives(h('div', {
                            class: 'size-full',
                            // class: isTransparent ? 'size-full' : 'size-full overflow-hidden',
                        }, h('iframe', {
                            ref: iframe,
                            src: url.format(Object.assign(url.parse(data), {
                                query: {
                                    _huiconsoleId: to,
                                    _tabId: tab.id,
                                    _fromTabId: from,
                                    _resolveId: resolveId,
                                },
                            })),
                            class: 'size-full',
                            allowtransparency: true,
                            style: {
                                border: 'none',
                            },
                            onload(e) {
                                isLoading.value = false
                            },
                        })), [
                            [resolveDirective('loading'), isLoading.value]
                        ])
                    }
                })
            } else if (type === $const.MT.COMPONENT) {
                let _c = await moduleLoader.loadComponent(tab)
                if (_c) {
                    return defineComponent({
                        setup(props) {
                            return ()=>h(_c, {
                                _huiconsoleId: to,
                                _tabId: tab.id,
                                _fromTabId: from,
                                _resolveId: resolveId,
                                ...props,
                            })
                        },
                    })
                }
            }
        })().then(c => {

            // opentab 的返回逻辑
            /*
            opentab 会生成一个resolveid，同时会带上 调用opentab的tabid
            
            一次opentab涉及4个huiconsole
            1个是 管理调用opentab页面的huiconsole
            1个是 调用opentab页面的huiconsole 与上面的那个通信

            1个是 打开的tab页面的huiconsole
            1个是 管理打开的tab页面的huiconsole
            */

            let _c = defineComponent({
                name: tab.id,
                setup(){
                    let huiconsole = new MessageTransporter({
                        to,
                        id: tab.id,
                    })
                    huiconsole.on('getToken', () => {
                        return utils.getToken()
                    })
                    if(resolveId){
                        huiconsole.once(resolveId, (...rest)=>{
                            console.debug(`huiconsole-3(${tab.id}) received resolveId:  ${resolveId}`)
                            huiconsole.window(window).to(from).command(resolveId, ...rest)
                        })
                    }
                    huiconsole.on('openTab', (menu, _resolveId, )=>{
                        console.debug('openTab: ', menu, _resolveId)
                        huiconsole.once(_resolveId, (...rest)=>{
                            console.debug(`huiconsole-2(${tab.id}) received resolveId:  ${_resolveId}`)
                            huiconsole.command(_resolveId, ...rest)
                        })
                        that.openTab(menu, tab.id, _resolveId)
                    })
                    huiconsole.on('closeTab', () => {
                        that.closeTab(tab.id)
                    })
                    onUnmounted(()=>{
                        huiconsole.offAll()
                        huiconsole = null
                    })
                    onMounted(()=>{
                        let contentWindow = iframe.value?.contentWindow || window
                        huiconsole.setWindow(contentWindow)
                    })
                    return ()=>h(c)
                }
            })
            return _c ? markRaw(_c) : _c
        })
    }

    context(){
        return reactive(this._data)
    }
}