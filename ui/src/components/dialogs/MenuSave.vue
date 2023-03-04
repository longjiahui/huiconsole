<template>
<a-modal width="300px"
    @cancel="$emit('reject')"
    @ok="handleConfirm">
    <template #title>
        <div class="h h-s">
            <div v-if="menu._id">
                <component v-if="menu.icon" :is="menu.icon"></component>
                <div>{{menu.name}}</div>
            </div>
            <div v-else>{{ title }}</div>
        </div>
    </template>
    <div class="p-l v v-m">
        <div class="h h-m">
            <div class="menu-icon h justify-center clickable" @click="$dialog.openIconPickerDialog().then(icon=>lMenu.icon = icon)">
                <component v-if="lMenu.icon" :is="lMenu.icon" />
            </div>
            <div class="f-1">
                <a-input v-focus v-model:value="lMenu.name" placeholder="菜单名称"></a-input>
            </div>
        </div>
        <!-- <div>
            <a-radio-group size="small" v-model:value="lMenu.type" button-style="solid">
                <a-radio-button :value="$const.MT.IFRAME">IFrame</a-radio-button>
                <a-radio-button :value="$const.MT.COMPONENT">VUE组件</a-radio-button>
            </a-radio-group>
        </div> -->
        <div class="v-xs">
            <div>
                <a-input v-model:value="lMenu.data.data" placeholder="/page/link or ComponentName"></a-input>
            </div>
            <!-- <div v-if="isExternalComponent">
                <a-input v-model:value="lMenu.data.externalComponentName" placeholder="组件名称 e.g. window.AnfoTree"></a-input>
            </div> -->
        </div>
        <div class="h h-s justify-space-between" v-if="type === $const.MT.IFRAME">
            <div></div>
            <div>
                <a-checkbox v-model:checked="lMenu.isTransparent">透明 <span class="title">IFRAME</span></a-checkbox>
            </div>
        </div>
        <div v-else-if="type === $const.MT.COMPONENT" class="h justify-flex-end">
            <button class="button" @click="$dialog.openAssetSelectDialog({ selected: lMenu.data.preloadAssets }).then(data=>lMenu.data.preloadAssets = data)">选择预加载资源 {{ lMenu.data.preloadAssets?.length > 0 ? `(${ lMenu.data.preloadAssets?.length })` : '' }}</button>
        </div>
    </div>
</a-modal>
</template>
<script setup>
import { computed } from 'vue'
import utils from '@/scripts/utils'
import { api } from '@/scripts/api'
import business from '@/scripts/business'
import $const from '@/const'

import extend from 'extend'

let props = defineProps({
    menu: {
        type: Object,
        default: ()=>({})
    }
})
let emit = defineEmits(['reject', 'r'])

let lMenu = utils.createMiddleware(()=>{
    let data = extend(true, {
        // type: $const.MT.COMPONENT,
        data: {},
    }, props.menu)
    return data
})
// let isExternalComponent = computed(()=>lMenu.value.type === $const.MT.COMPONENT && business.isURL(lMenu.value.data?.data))
let is

let isEdit = computed(()=>!!lMenu.value?._id)
let title = computed(()=>(isEdit.value ? '编辑' : '新建') + (!!lMenu.value?.parent ? '子':'') + '菜单')
let type = computed(()=>business.getMenuType(lMenu.value))

function handleConfirm(){
    let menu = utils.limitKeys(lMenu.value, ['type', 'isTransparent', '_id', 'name', 'data', 'icon', 'parent', 'order'])
    menu.order = menu.order || 0
    menu.type = type.value
    api.menu.save(menu).then(data=>{
        emit('r', data)
    })
}
</script>

<style lang="scss" scoped>
.menu-icon{
    font-size: 1.4em;
    width: 32px;
    height: 32px;
    border-radius: 3px;
    border: 1px dashed lightgray;
}
</style>