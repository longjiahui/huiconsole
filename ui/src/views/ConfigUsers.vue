<template>
<div class="v-m size-full">
    <div class="card p-m h h-m align-stretch">
        <a-input v-model:value="keyword" placeholder="搜索" style="width: 300px" #suffix>
            <SearchOutlined />
        </a-input>
        <button class="shrink-0 button primary" @click="handleNewUser">新建用户</button>
    </div>
    <div class="card">
        <a-table
            class="p-m"
            bordered
            @change="handleLoadData"
            size="small"
            :loading="isLoading"
            :data-source="users"
            :pagination="{
                total,
                pageSize
            }"
            row-class-name="clickable"
            :columns="[{
                title: '登录用户名',
                dataIndex: 'username',
            }, {
                title: '昵称',
                dataIndex: 'name',
            }, {
                title: '角色',
                dataIndex: ['role', 'name'],
            }, {
                title: '操作',
                key: 'operation',
                width: '72px',
            }, ]"
            :custom-row="(...rest)=>({
                onClick: ()=>handleEditUser(...rest)
            })"
            row-key="_id">
            <template #bodyCell="{ column, record, index, text }">
                <div v-if="column.key === 'operation'" @click.stop>
                    <a-popconfirm
                        v-if="myID !== record._id"
                        title="确定删除吗？"
                        @confirm="handleDelete(record, index)">
                        <button class="button error">
                            <DeleteOutlined />
                        </button>
                    </a-popconfirm>
                </div>
            </template>
        </a-table>
        <!-- <anfo-list-pagination :context="context" container-class="vbox-s">
            <template #="{ item, i }">
                <div class="h h-s clickable" @click="handleEditUser(item, i)">
                    <div>{{ item.username }}</div>
                    <div>{{ item.nickname }}</div>
                </div>
            </template>
        </anfo-list-pagination> -->
    </div>
</div>
</template>

<script setup>
import { ref, watch } from 'vue'

import api from '@/scripts/api'
import dialog from '@/scripts/dialog'
import { getters } from '@/store'
import { SearchOutlined } from '@ant-design/icons-vue';
import { debounce } from 'throttle-debounce'

let { myID } = getters

let isLoading = ref(false)
let users = ref([])
let page = ref(1)
let pageSize = ref(20)
let total = ref(0)
let keyword = ref('')

watch(keyword, debounce(500, refreshDatas))

function handleLoadData({ current, pageSize }, ){
    page.value = current
    pageSize.value = pageSize
    refreshDatas()
}

function refreshDatas(){
    isLoading.value = true
    api.user.pageData({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value,
    }).then(({data: userDatas, total: datasTotal})=>{
        users.value = userDatas
        total.value = datasTotal
    }).finally(()=>isLoading.value = false)
}

refreshDatas()

function handleNewUser(){
    dialog.openUserSaveDialog().then(data=>{
        refreshDatas()
    })
}
function handleEditUser(user, i){
    console.debug(arguments)
    dialog.openUserSaveDialog({user}).then(data=>{
        Object.assign(user, data)
    })
}
function handleDelete(user, i){
    api.user.delete({_id: user._id}).then(()=>{
        users.value.splice(i, 1)
    })
}
</script>