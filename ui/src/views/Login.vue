<template>
<div v-loading="isLoading" class="page h justify-center" style="background: whitesmoke">
    <transition mode="out-in" name="anfo-fade">
        <div v-if="isAdminRegistered" class="card p-l v v-m align-center">
            <h1>HUI CONSOLE</h1>
            <p class="desc">欢迎使用HUI CONSOLE后台管理系统</p>
            <div class="v v-m">
                <a-input v-focus placeholder="用户名"
                    v-model:value="username"
                    @keyup.enter="handleLogin">
                    <template #prefix>
                        <UserOutlined/>
                    </template>
                </a-input>
                <a-input type="password" placeholder="密码"
                    v-model:value="password"
                    @keyup.enter="handleLogin">
                    <template #prefix>
                        <KeyOutlined />
                    </template>
                </a-input>
            </div>
            <a-button @click="handleLogin" type="primary">登录</a-button>
        </div>
        <div v-else class="card p-l v v-m align-center">
            <h1>HUI CONSOLE</h1>
            <p class="desc">初次进入，请输入初始管理员密码</p>
            <a-input type="password" v-focus placeholder="密码"
                    v-model:value="adminPassword"
                    @keyup.enter="handleRegisterAdmin">
                <template #prefix>
                    <KeyOutlined/>
                </template>
            </a-input>
            <a-button type="primary" @click="handleRegisterAdmin">进入系统</a-button>
        </div>
    </transition>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import md5 from 'md5'

import api from '@/scripts/api'
import { mutations } from '@/store'

let router = useRouter()

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

    api.user.registerAdmin({
        password: md5(password)
    }).then(token=>{
        adminPassword.value = ''
        mutations.login(token)
    })
}

function handleLogin(){
    api.user.login({
        username: username.value,
        password: md5(password.value),
    }).then(token=>{
        username.value = ''
        password.value = ''
        mutations.login(token)
    })
}
</script>

<style lang="scss" scoped>
</style>