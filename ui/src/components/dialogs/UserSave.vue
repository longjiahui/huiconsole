<template>
    <a-modal
        :title="title"
        @cancel="emit('reject')"
        @ok="handleSave"
        width="350px">
        <div v-loading="!isInited" class="p-l v-m">
            <div>
                <a-input v-focus v-model:value="lUser.username" placeholder="登录用户名"></a-input>
            </div>
            <div>
                <a-input @keyup.enter="handleSave" v-model:value="lUser.name" placeholder="昵称 ( optional )"></a-input>
            </div>
            <div class="h justify-flex-end">
                <a-input @keyup.enter="handleSave" v-if="!isEdit" v-model:value="lUser.password" placeholder="初始化密码" type="password"></a-input>
                <a-button v-else-if="$getters.isImAdmin || user._id === $getters.myID" @click="handleModifyPassword">修改密码</a-button>
            </div>
            <div class="h h-s justify-flex-end">
                <a-select v-model:value="lUser.role" placeholder="选择角色" style="width: 150px" :options="roles.map(r=>({
                    label: r.name || r.key,
                    value: r._id,
                }))">
                </a-select>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import utils from '@/scripts/utils'
import api from '@/scripts/api'
import dialog from '@/scripts/dialog'
import { getters } from '@/store'

import extend from 'extend'
import md5 from 'md5'
import { message } from 'ant-design-vue'

let props = defineProps({
    user: {
        type: Object,
        default: ()=>({}),
    }
})

let roles = ref([])
let isInited = ref(false)

api.role.dict().then(data=>{
    roles.value = data
}).finally(()=>isInited.value = true)

let emit = defineEmits(['r', 'reject'])
let isEdit = computed(()=>!!props.user?._id)
let title = computed(()=>{
    return isEdit.value ? '修改用户' : '新建用户'
})

let _lUser = extend(true, {}, props.user)
_lUser.role = _lUser.role?._id || _lUser.role
let lUser = ref(_lUser)
watch(isInited, val=>{
    if(val && !lUser.value.role){
        lUser.value.role = roles.value?.filter?.(r=>!r.isAdmin)?.[0]?._id || roles.value?.[0]?._id
    }
})


function handleSave(){
    let user = utils.limitKeys(lUser.value, ['_id', 'username', 'name', 'password', 'role', 'avatar', 'description'])
    if(user.password){
        user.password = md5(user.password)
    }
    api.user.save(user).then(data=>{
        emit('r', data)
    })
}

async function handleModifyPassword(){
    if(isEdit.value){
        console.debug('before change password(isImAdmin): ', getters.isImAdmin)
        // 普通用户只能修改自己的信息，管理员可以修改任何用户的信息
        if(getters.isImAdmin){
            let to = await dialog.openInputDialog({
                desc: `请输入需要修改成`,
                validates: [[val=>!!val, '密码不能为空']],
            })
            await api.user.changePassword({
                _id: props.user?._id,
                to: md5(to),
            })
        }else{
            // 我不是管理员
            let token = await dialog.openInputDialog({
                desc: `请输入 ${props.user?.name || props.user?.username} 的密码用以确认你有权限修改。`,
                type: 'password',
                validates: [[val=>!!val, '密码不能为空']],
            }).then(to=>api.user.getChangingPasswordToken({
                password: md5(to),
            }))
            await api.user.changePasswordByToken({
                token,
            })
        }
        message.success('修改成功')
    } 
}
</script>