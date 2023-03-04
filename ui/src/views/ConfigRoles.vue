<template>
    <div class="v-m size-full">
        <div class="card p-m h h-m align-stretch">
            <a-input v-model:value="keyword" placeholder="搜索" style="width: 300px" #suffix>
                <SearchOutlined />
            </a-input>
            <button class="shrink-0 button primary" @click="handleNewRole">新建角色</button>
        </div>
        <div class="card p-m">
            <Pagination></Pagination>
        </div>
        <div class="card">
            <div class="vbox-0">
                <div class="cf-2 ctitle hbox-0 align-stretch cp-h-m cp-v-m c0f-1" style="background: whitesmoke">
                    <div>角色名</div>
                    <div>KEY</div>
                    <div>管理员</div>
                    <div>操作</div>
                </div>
                <List #="{ data }">
                    <div class="vbox-0">
                        <div v-for="(item, i) in data">
                            <div class="clickable cv cjustify-center c0align-flex-start c0f-1 cf-2 hbox-0 align-stretch cp-s cp-h-m" @click="handleEditRole(item, i)">
                                <div>{{ item.name }}</div>
                                <div>{{ item.key }}</div>
                                <div>{{ item.isAdmin }}</div>
                                <div @click.stop>
                                    <div class="h h-s">
                                        <a-tooltip title="快速查看/修改用户角色">
                                            <button @click="$dialog.openQuickCheckUsersRoleDialog({ role: item._id }).then(()=>context.refresh())" class="button">
                                                <div class="h h-xxs">
                                                    <UserOutlined />
                                                    <div>{{ item.userAmount }}</div>
                                                </div>
                                            </button>
                                        </a-tooltip>
                                        <a-popconfirm
                                            v-if="$getters.myID !== item._id"
                                            title="确定删除吗？"
                                            @confirm="handleDelete(item, i)">
                                            <button class="button error">
                                                <DeleteOutlined />
                                            </button>
                                        </a-popconfirm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </List>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import { api } from '@/scripts/api'
import dialog from '@/scripts/dialog'
import { SearchOutlined } from '@ant-design/icons-vue';
import { debounce } from 'throttle-debounce'

import { usePagination } from '@anfo/ui'

let keyword = ref('')

let { List, Pagination, context } = usePagination(api.role.pageData, {
    params: ()=>({
        keyword: keyword.value,
    })
})

watch(keyword, debounce(500, ()=>context.refresh()))

function handleNewRole(){
    dialog.openRoleSaveDialog().then(data=>{
        return context.refresh()
    })
}
function handleEditRole(role, i){
    dialog.openRoleSaveDialog({role}).then(data=>{
        Object.assign(role, data)
    })
}
function handleDelete(role, i){
    api.role.delete({_id: role._id}).then(()=>{
        return context.refresh()
    })
}
</script>