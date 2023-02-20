<template>
<div v-loading="isLoading" class="page h justify-center" style="background: whitesmoke">
    <transition mode="out-in" name="anfo-fade">
        <div v-if="isAdminRegistered" class="card">
            <div class="block-header p-h-l p-v-l p-b-m v-s">
                <div class="title" style="font-size: 1.5em">{{ $getters.huiconsole.brand }}</div>
                <div class="desc">{{ $getters.huiconsole.description }}</div>
            </div>
            <div class="block-content v v-m p-h-l p-v-m">
                <a-input class="draw-style" v-focus placeholder="用户名"
                    v-model:value="username"
                    @keyup.enter="handleLogin">
                    <template #prefix>
                        <UserOutlined/>
                    </template>
                </a-input>
                <a-input class="draw-style" type="password" placeholder="密码"
                    v-model:value="password"
                    @keyup.enter="handleLogin">
                    <template #prefix>
                        <KeyOutlined />
                    </template>
                </a-input>
            </div>
            <div class="block-footer p-h-l p-v-m v">
                <button class="button primary" @click="handleLogin" type="primary">登录</button>
            </div>
        </div>
        <div v-else class="card">
            <div class="block-header p-h-l p-v-l p-b-m v-s">
                <div class="title" style="font-size: 1.5em">HUI CONSOLE</div>
                <div class="desc">初次进入，请输入初始管理员密码</div>
            </div>
            <div class="block-content p-h-l p-v-m">
                <a-input class="draw-style" type="password" v-focus placeholder="密码"
                        v-model:value="adminPassword"
                        @keyup.enter="handleRegisterAdmin">
                    <template #prefix>
                        <KeyOutlined/>
                    </template>
                </a-input>
            </div>
            <div class="block-footer p-h-l p-v-m v">
                <button class="button primary" @click="handleRegisterAdmin">进入系统</button>
            </div>
        </div>
    </transition>
</div>
</template>

<script setup>
import { ref } from 'vue'
import md5 from 'md5'

import { api } from '@/scripts/api'
import { mutations } from '@/store'


let isLoading = ref(true)
let isAdminRegistered = ref(true)
let username = ref('')
let password = ref('')
// for register
let adminPassword = ref('')

api.user.isAdminRegistered().then(data => {
    isAdminRegistered.value = data
}).finally(()=>{
    isLoading.value = false
})

function handleRegisterAdmin(){
    let password = adminPassword.value
    isLoading.value = true
    api.user.registerAdmin({
        password: md5(password)
    }).finally(()=>{
        isLoading.value = false
    }).then(token=>{
        adminPassword.value = ''
        mutations.login(token)
    })
}

function handleLogin(){
    isLoading.value = true
    api.user.login({
        username: username.value,
        password: md5(password.value),
    }).finally(()=>{
        isLoading.value = false
    }).then(token=>{
        username.value = ''
        password.value = ''
        mutations.login(token)
    })
}
</script>

<style lang="scss" scoped>
.block-content{
    background: whitesmoke;
}
</style>