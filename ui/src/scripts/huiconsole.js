import { ref, computed, watch, reactive, markRaw } from 'vue'
import utils from '@/scripts/utils'

export default class {
    constructor(){
        let tabs = ref([])
        Promise.all(utils.getLocal('tabs', []).map(async t => {
            t.component = await this.buildComponent(t)
            return t
        })).then(val=>tabs.value = val)
    }

    async buildComponent(tab) {
        tab.isLoading = true
        return (async () => {
            let {
                menu,
                menu: {
                    data: _data,
                    data: {
                        data
                    } = {},
                    type,
                } = {}
            } = tab || {}
            if (type === $const.MT.IFRAME) {
                return defineComponent({
                    name: tab.id,
                    setup() {
                        let isLoading = ref(true)
                        let iframe = ref(null)
                        let huiconsole = new MessageTransporter()
                        onMounted(() => {
                            let contentWindow = iframe.value?.contentWindow
                            if (contentWindow) {
                                huiconsole.to(contentWindow)
                                // 这边发出的是单向的，通过单向发出来设置channel
                                huiconsole.on('getToken', () => {
                                    return utils.getToken()
                                })
                                huiconsole.on('openTab', (menu) => {
                                    openTab(menu)
                                })
                                huiconsole.on('closeTab', () => {
                                    let ind = tabs.value.findIndex(t => t.id === tab.id)
                                    if (ind > -1) {
                                        tabs.value.splice(ind, 1)
                                    }
                                })
                            }
                        })
                        return () => withDirectives(h('div', {
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
                            onload(e) {
                                isLoading.value = false
                                huiconsole.syncChannel(tab.id)
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
                        name: tab.id,
                        render() {
                            return h(_c)
                        },
                    })
                }
            }
        })().then(c => {
            return c ? markRaw(c) : c
        })
    }
}