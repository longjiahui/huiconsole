<template>
<div class="v-m size-full">
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <button class="button primary">新建用户</button>
    </div>
    <div class="card p-m">
        <anfo-list-pagination :context="context">
            <template #="{ item }">
                <div class="h h-s">
                    <div>{{ item.username }}</div>
                    <div>{{ item.nickname }}</div>
                </div>
            </template>
        </anfo-list-pagination>
    </div>
</div>
</template>

<script setup>
import { useList } from '@anfo/ui'
import api from '@/scripts/api'
// import dialog from '@/scripts/dialog'

let list = useList()
let context = list.pagination.createContext({
    api: api.user.pageData,
})
context.refreshDatas()

// dialog.openUserSaveDialog()
</script>