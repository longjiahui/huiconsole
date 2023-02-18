<template>
    <div class="v-m size-full">
        <div class="card p-m h h-m align-stretch">
            <a-input v-model:value="keyword" placeholder="搜索" style="width: 300px" #suffix>
                <SearchOutlined />
            </a-input>
            <button class="shrink-0 button primary" @click="handleNewRole">新建角色</button>
        </div>
        <div class="card">
            <a-table
                class="p-m"
                bordered
                @change="handleLoadData"
                size="small"
                :loading="isLoading"
                :data-source="roles"
                :pagination="{
                    total,
                    pageSize
                }"
                row-class-name="clickable"
                :columns="[{
                    title: '角色名',
                    dataIndex: 'name',
                }, {
                    title: 'key',
                    dataIndex: 'key',
                }, {
                    title: '管理员',
                    key: 'isAdmin',
                }, {
                    title: '操作',
                    key: 'operation',
                    width: '88px',
                }, ]"
                :custom-row="(...rest)=>({
                    onClick: ()=>handleEditRole(...rest)
                })"
                row-key="_id">
                <template #bodyCell="{ column, record, index, text }">
                    <div v-if="column.key === 'isAdmin'">
                        <div>{{ record.isAdmin ? '是' : '否' }}</div>
                    </div>
                    <div v-if="column.key === 'operation'" @click.stop>
                        <div class="h h-s justify-flex-end">
                            <a-tooltip title="快速查看/修改用户角色">
                                <button @click="$dialog.openQuickCheckUsersRoleDialog({ role: record._id }).then(()=>refreshDatas())" class="button">
                                    <div class="h h-xxs">
                                        <UserOutlined />
                                        <div>{{ record.userAmount }}</div>
                                    </div>
                                </button>
                            </a-tooltip>
                            <a-popconfirm
                                v-if="$getters.myRoleID !== record._id"
                                title="确定删除吗？"
                                @confirm="handleDelete(record, index)">
                                <button class="button error">
                                    <DeleteOutlined />
                                </button>
                            </a-popconfirm>
                        </div>
                    </div>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import api from '@/scripts/api'
import dialog from '@/scripts/dialog'
import { SearchOutlined } from '@ant-design/icons-vue';
import { debounce } from 'throttle-debounce'

let isLoading = ref(false)
let roles = ref([])
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
    api.role.pageData({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value,
    }).then(({data: roleDatas, total: datasTotal})=>{
        roles.value = roleDatas
        total.value = datasTotal
    }).finally(()=>isLoading.value = false)
}

refreshDatas()

function handleNewRole(){
    dialog.openRoleSaveDialog().then(data=>{
        refreshDatas()
    })
}
function handleEditRole(role, i){
    dialog.openRoleSaveDialog({role}).then(data=>{
        Object.assign(role, data)
    })
}
function handleDelete(role, i){
    api.role.delete({_id: role._id}).then(()=>{
        roles.value.splice(i, 1)
    })
}
</script>