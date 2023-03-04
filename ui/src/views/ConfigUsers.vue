<template>
<div class="v-m size-full">
    <div class="card p-m h h-m align-stretch">
        <a-input v-model:value="keyword" placeholder="搜索" style="width: 300px" #suffix>
            <SearchOutlined />
        </a-input>
        <button class="shrink-0 button primary" @click="handleNewUser">新建用户</button>
    </div>
    <div class="card p-m">
        <Pagination></Pagination>
    </div>
    <div class="card">
        <div class="vbox-0">
            <div class="cf-2 ctitle hbox-0 align-stretch cp-h-m cp-v-m c0f-1" style="background: whitesmoke">
                <div>登陆用户名</div>
                <div>昵称</div>
                <div>角色</div>
                <div>操作</div>
            </div>
            <List #="{ data }">
                <div class="vbox-0">
                    <div v-for="(item, i) in data">
                        <div class="clickable cv cjustify-center c0align-flex-start cf-2 hbox-0 align-stretch cp-s cp-h-m c0f-1" @click="handleEditUser(item, i)">
                            <div>{{ item.username }}</div>
                            <div>{{ item.name }}</div>
                            <div>{{ item.role?.name }}</div>
                            <div @click.stop>
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

let { List, Pagination, context } = usePagination(api.user.pageData, {
    params: ()=>({
        keyword: keyword.value
    })
})

watch(keyword, debounce(500, ()=>context.refresh()))


function handleNewUser(){
    dialog.openUserSaveDialog().then(data=>{
        return context.refresh()
    })
}
function handleEditUser(user, i){
    dialog.openUserSaveDialog({user}).then(data=>{
        Object.assign(user, data)
    })
}
function handleDelete(user, i){
    api.user.delete({_id: user._id}).then(()=>{
        return context.refresh()
    })
}
</script>