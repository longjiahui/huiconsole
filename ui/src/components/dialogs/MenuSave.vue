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
        <div>
            <a-input v-model:value="lMenu.data" placeholder="/page/link"></a-input>
        </div>
        <div class="h h-s justify-space-between">
            <div></div>
            <transition appear name="anfo-fade">
                <div v-if="type === $const.menuType.iframe">
                    <a-checkbox v-model:checked="lMenu.isTransparent">透明 <span class="title">IFRAME</span></a-checkbox>
                </div>
            </transition>
        </div>
    </div>
</a-modal>
</template>
<script setup>
import { computed } from 'vue'
import utils from '@/scripts/utils'
import api from '@/scripts/api'
import business from '@/scripts/business'

import extend from 'extend'

let props = defineProps({
    menu: {
        type: Object,
        default: ()=>({})
    }
})
let emit = defineEmits(['reject', 'r'])

let lMenu = utils.createMiddleware(()=>extend(true, {}, props.menu))

let isEdit = computed(()=>!!lMenu.value?._id)
let title = computed(()=>(isEdit.value ? '编辑' : '新建') + (!!lMenu.value?.parent ? '子':'') + '菜单')
let type = computed(()=>business.getMenuType(lMenu.value))

function handleConfirm(){
    let menu = utils.limitKeys(lMenu.value, ['isTransparent', '_id', 'name', 'data', 'icon', 'parent'])
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