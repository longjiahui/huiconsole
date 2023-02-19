<template>
    <a-modal width="300px"
        @cancel="$emit('reject')"
        @ok="handleConfirm">
        <template #title>
            <div class="h h-s">
                <div v-if="role._id">
                    <component v-if="role.icon" :is="role.icon"></component>
                    <div>{{role.name}}</div>
                </div>
                <div v-else>{{ title }}</div>
            </div>
        </template>
        <div class="p-l v v-m">
            <div>
                <a-input v-model:value="lRole.key" placeholder="key"></a-input>
            </div>
            <div>
                <a-input v-model:value="lRole.name" placeholder="角色名称 (可选)"></a-input>
            </div>
            <div>
                <a-textarea v-model:value="lRole.description" placeholder="描述 (可选)"></a-textarea>
            </div>
            <div class="v v-m align-flex-end">
                <!-- 系统管理员拥有所有菜单的权限 -->
                <a-button v-if="!lRole.isAdmin" @click="handleConfigRoleMenus">
                    <div class="h h-s">
                        <div>配置菜单权限</div>
                        <span class="title">( {{ lRole.menus?.length || 0 }} )</span>
                    </div>
                </a-button>
                <div v-else class="desc">系统管理员拥有所有菜单权限</div>
                <div v-if="isMyRole && lRole.isAdmin" class="desc">不能取消自己的管理员权限</div>
                <div>
                    <!-- 不能取消自己的管理员资格 -->
                    <a-checkbox :disabled="isMyRole" v-model:checked="lRole.isAdmin">系统管理员</a-checkbox>
                </div>
            </div>
        </div>
    </a-modal>
</template>
<script setup>
import { computed } from 'vue'
import utils from '@/scripts/utils'
import api from '@/scripts/api'
import dialog from '@/scripts/dialog'

import extend from 'extend'
import { getters } from '../../store'

let props = defineProps({
    role: {
        type: Object,
        default: ()=>({})
    }
})
let emit = defineEmits(['reject', 'r'])

let lRole = utils.createMiddleware(()=>extend(true, {}, props.role))

let isEdit = computed(()=>!!lRole.value?._id)
let title = computed(()=>(isEdit.value ? '编辑' : '新建') + (!!lRole.value?.parent ? '子':'') + '角色')
let isMyRole = computed(()=>getters.myRoleID === props.role?._id)

function handleConfirm(){
    let role = utils.limitKeys(lRole.value, ['_id', 'key', 'name', 'description', 'isAdmin', 'menus'])
    // 管理员拥有所有菜单的权限，所以不需要存储menuIDs
    role.menus = !!role.isAdmin ? [] : role.menus
    api.role.save(role).then(data=>{
        emit('r', data)
    })
}

function handleConfigRoleMenus(){
    dialog.openRoleMenuSaveDialog({
        _id: lRole.value._id,
        menus: lRole.value.menus,
    }).then(menus=>{
        lRole.value.menus = menus
    })
}
</script>

<style lang="scss" scoped>
.role-icon{
    font-size: 1.4em;
    width: 32px;
    height: 32px;
    border-radius: 3px;
    border: 1px dashed lightgray;
}
</style>