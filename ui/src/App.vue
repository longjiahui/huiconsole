<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>

<template>
  <a-config-provider :locale="zhCN">
    <div class="v size-full overflow-overlay" v-loading="$getters.isLoading">
      <router-view v-slot="{ Component, route }">
        <transition name="anfo-fade-fast" mode="out-in" appear>
          <component :is="Component" class="f-1" />
        </transition>
      </router-view>
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
