<script setup>
import { getters } from '@/store'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

let { isLoading } = getters
</script>

<template>
  <a-config-provider :locale="zhCN">
    <div class="v size-full overflow-overlay" v-loading="isLoading">
      <router-view class="f-1"></router-view>
    </div>
  </a-config-provider>
</template>

<style lang="scss">
@import '@/styles/utils.scss';

#app{
  font-size: 14px;
  background: whitesmoke;
}
</style>
