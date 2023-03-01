<template>
    <div class="size-full">
        <hui-console>
            <template #layout="context">
                <div v-loading="!context.isInited" class="size-full">
                    <div class="page-layout size-full v">
                        <div v-show="context.isInited" class="f-1 shrink-0 h align-stretch">
                            <!-- sidebar -->
                            <component :is="context.Sidebar" v-bind="context"></component>
                            <div class="main-main f-1 v">
                                <component :is="context.Tabs" v-bind="context"></component>
                                <component :is="context.Content" v-bind="context"></component>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #sidebar="{ openTab, isInited, menus, currentTab, configRolesMenusItem, configMenusMenuItem, configUsersMenusItem, setContext, }">
                <div class="sidebar shrink-0">
                    <div class="title">
                        <div class="brand h justify-space-between p-h-m">
                            <div>{{ $getters.huiconsole.brand }}</div>
                            <a-dropdown>
                                <div class="clickable">
                                    <SettingOutlined />
                                </div>
                                <template #overlay>
                                    <a-menu>
                                        <template v-if="$getters.isImAdmin">
                                            <a-menu-item @click="openTab(m)" v-for="m in [configRolesMenusItem, configUsersMenusItem, configMenusMenuItem]">
                                                <div class="h h-xs">
                                                    <component :is="m.dropDownIcon"></component>
                                                    <div>{{ m.name }}</div>
                                                </div>
                                            </a-menu-item>
                                        </template>
                                        <a-menu-item @click="$mutations.logout()">
                                            <div class="h h-xs">
                                                <LogoutOutlined />
                                                <div>退出登录</div>
                                            </div>
                                        </a-menu-item>
                                        <a-menu-item @click="$utils.switchTheme($const.routes.default)">
                                            <div class="h h-xs">
                                                <BgColorsOutlined />
                                                <div>切换默认主题</div>
                                            </div>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>
                    </div>
                    <div v-if="isInited">
                        <transition name="anfo-fade" mode="out-in">
                            <anfo-loop
                                transition-name=""
                                v-if="menus?.length > 0"
                                :datas="menus"
                                data-key="_id"
                                children-key="subMenus">
                                <template #="{ item: m, i, hasChildren, prevHasChildren, datas, toggle, isFold, isLast, isFirst }">
                                    <div
                                        :class="[
                                            'f-1 menu-item h h-s',
                                            m._id === currentTab?.menu?._id ? 'is-current':'',
                                            hasChildren ? 'has-children':'',
                                        ]"
                                        @click="hasChildren ? toggle() : openTab(m)">
                                        <div class="h h-s f-1">
                                            <div v-if="m.icon">
                                                <component :is="m.icon" />
                                            </div>
                                            <div>
                                                {{ m.name }}
                                            </div>
                                        </div>
                                        <div v-if="hasChildren" :style="{
                                            transition: 'transform .3s',
                                            transform: `rotate(${isFold ? 0 : 90}deg)`,
                                        }">
                                            <caret-right-outlined/>
                                        </div>
                                    </div>
                                </template>
                            </anfo-loop>
                            <div v-else class="p-m v align-flex-end desc">
                                <div>
                                    暂时没有菜单数据
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </template>
            <template #tabs="{ tabs, currentTabID, setContext }">
                <div class="main-tabs h h-s align-stretch">
                    <transition name="anfo-fade" mode="out-in">
                        <div class="f-1 h" v-if="tabs.length > 0">
                            <transition name="anfo-fade" mode="out-in">
                                <div class="p-h-s" v-if="tabs.length > 1">
                                    <a-tooltip placement="left" title="清除全部标签">
                                        <DeleteOutlined class="clickable" @click="setContext({tabs: []})" />
                                    </a-tooltip>
                                </div>
                            </transition>
                            <anfo-orderable-container channel="tabs" :datas="tabs"
                                @update:datas="val=>{
                                    val.forEach(i=>i.component = tabs.find(t=>t.id === i.id)?.component)
                                    tabs = val
                                }"
                                :data-key="d=>d.id" isHorizontal>
                                <template #="{ data: t, i }">
                                    <div @click="setContext({currentTabID: t.id})"
                                    style="height: 100%"
                                        :class="['main-tab p-h-s h h-s', t.id === currentTabID ? 'is-current':'']">
                                        <!-- {{ t.id }} -->
                                        <div v-if="t.menu?.icon"><component :is="t.menu?.icon"></component></div>
                                        <div class="f-1" style="word-break: break-all;">
                                            {{ t.menu?.name }}
                                        </div>
                                        <div class="tab-delete" @click.stop="handleDeleteTab(tabs, i, setContext)"><CloseOutlined/></div>
                                    </div>
                                </template>
                            </anfo-orderable-container>
                        </div>
                        <div v-else class="h h-s">
                            <div class="p-h-s">没有打开的标签页</div>
                        </div>
                    </transition>
                </div>
            </template>
            <template #content="{ currentTab, iframeTabs, componentTabs, currentTabID, menus }">
                <div class="main-pages f-1">
                        <template v-if="currentTab">
                            <div class="size-full p-m" v-if="currentTab.type === $const.menuType.component">
                                <keep-alive :include="componentTabs.map(t=>t.id)">
                                    <component :is="currentTab?.component"></component>
                                </keep-alive>
                            </div>
                        </template>
                        <div v-for="t in iframeTabs" :key="t.id"
                            v-show="currentTabID === t.id" class="size-full overflow-hidden">
                            <component :is="t.component"></component>
                        </div>
                        <!-- <transition name="anfo-fade" appear>
                            <div v-if="!currentTab"
                                class="size-full p-l v-s">
                                <h1 class="title">HUI CONSOLE</h1>
                                <p class="desc">longjiahui@hotmail.com</p>
                                <div>欢迎使用 <span class="title">HUI CONSOLE</span></div>
                                <div @click="openTab(configMenusMenuItem)" class="clickable" v-if="!(menus?.length > 0)">
                                    还没有菜单数据，点击创建
                                </div>
                            </div>
                        </transition> -->
                    </div>
            </template>
        </hui-console>
    </div>
</template>

<script setup>
function handleDeleteTab(tabs, i, setContext){
    tabs.splice(i, 1)
    setContext({tabs})
}
</script>

<style lang="scss" scoped>
$primaryColor: #2d60b1;
.page-layout{
    color: darken($primaryColor, 15%)!important;
}
.title{
    color: $primaryColor;
}
.desc{
    color: lighten($primaryColor, 40%);
}

$navHeight: 40px;
.sidebar{
    width: 200px;

    .brand{
        color: $primaryTextColor;
        background: linear-gradient(45deg, $primaryColor, lighten($primaryColor, 5%));
        height: $navHeight;
    }
}
// .main-main{
//     background: #dedede;
// }
.main-tabs{
    height: $navHeight;
    // background: $primaryColor;
    background: linear-gradient(45deg, $primaryColor, lighten($primaryColor, 5%));
    overflow: hidden;
    color: $primaryTextColor;
}
.main-tab{
    min-width: 72px;
    transition: color .3s;
    background: linear-gradient(45deg, lighten($primaryColor, 15%), lighten($primaryColor, 10%));
    color: $primaryTextColor;
    position: relative;
    cursor: pointer;

    &.is-current{
        color: $primaryColor;
        background: $primaryTextColor;
    }
}

.menu-item{
    transition: background .3s, padding .3s, color .3s;
    cursor: pointer;
    background: rgba($primaryColor, calc(.04 + var(--layer) * .05));
    padding: 12px 8px;
    padding-left: calc(8px + var(--layer) * 16px);
    
    &.has-children{
        background: rgba($primaryColor, calc(var(--layer) * .05));
    }
    
    @mixin focus{
        color: $primaryTextColor;
        background: $primaryColor;
        // background: linear-gradient(45deg, $primaryColor, lighten($primaryColor, 10%));
    }
    &:hover {
        @include focus;
    }

    &.is-current{
        @include focus;
    }
}
.main-pages{
    background: white;
}
</style>