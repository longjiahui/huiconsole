<template>
    <div v-loading="!context.isInited" class="size-full">
        <div class="page-layout size-full v v-m p-m">
            <div v-show="context.isInited" class="f-1 shrink-0 h align-stretch h-m">
                <div class="sidebar v-m shrink-0">
                    <div class="title h justify-flex-end">
                        <div class="card brand h h-s p-h-m" style="border-radius: 5px">
                            <div>{{ $getters.huiconsole.brand }}</div>
                            <a-dropdown>
                                <div class="clickable">
                                    <SettingOutlined />
                                </div>
                                <template #overlay>
                                    <a-menu>
                                        <template v-if="$getters.isImAdmin">
                                            <a-menu-item @click="huiconsole.openTabByMenu(m._id)"
                                                v-for="m in context.constMenus">
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
                                        <a-menu-item @click="$utils.switchTheme($const.routes.legacy)">
                                            <div class="h h-xs">
                                                <BgColorsOutlined />
                                                <div>切换Legacy主题</div>
                                            </div>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>
                    </div>
                    <div v-if="context.isInited">
                        <transition name="anfo-fade-tr" appear mode="out-in">
                            <anfo-loop v-if="context.menus?.length > 0" style="border-radius: 5px;padding-left: 0"
                                :datas="context.menus" data-key="_id" container-class="p-l-m" children-key="children">
                                <template
                                    #="{ item: m, i, hasChildren, prevHasChildren, datas, toggle, isFold, isLast, isFirst }">
                                    <div :class="[
                                        'f-1 menu-item h h-s',
                                        m._id === context.currentTab?.menu?._id ? 'is-current' : '',
                                        hasChildren ? 'has-children' : '',

                                        // 左上角圆角情况
                                        prevHasChildren ? 'has-top-left-radius' : '',
                                        // 左下角圆角的情况 hasChildren || 树迭代的最后一个
                                        hasChildren || isLast ? 'has-bottom-left-radius' : '',
                                        isLast ? 'has-bottom-right-radius' : '',
                                        isFirst ? 'has-top-right-radius has-top-left-radius' : '',
                                    ]" @click="hasChildren ? toggle() : huiconsole.openTabByMenu(m._id)">
                                        <div class="h h-s f-1 justify-flex-end">
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
                                            <caret-right-outlined />
                                        </div>
                                    </div>
                                </template>
                            </anfo-loop>
                            <div v-else class="card p-m v align-flex-end desc">
                                <div>
                                    暂时没有菜单数据
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
                <div class="main-main f-1 v v-m">
                    <div class="main-tabs card h h-s p-s align-stretch">
                        <div class="f-1 h h-s" v-if="context.tabs.length > 0">
                            <div v-if="context.tabs.length > 1">
                                <a-tooltip placement="left" title="清除全部标签">
                                    <DeleteOutlined class="clickable" @click="huiconsole.closeTabs()" />
                                </a-tooltip>
                            </div>
                            <anfo-orderable-container channel="tabs" :datas="context.tabs" @update:datas="tabs => huiconsole.setTabs(tabs)" :data-key="d => d.id" isHorizontal class="h-s">
                                <template #="{ data: t, i }">
                                    <div @click="huiconsole.setCurrentTabID(t.id)" style="height: 100%"
                                        :class="['main-tab p-h-s h h-s', t.id === context.currentTabID ? 'is-current' : '']">
                                        <!-- {{ t.id }} -->
                                        <div v-if="t.menu?.icon">
                                            <component :is="t.menu?.icon"></component>
                                        </div>
                                        <div class="f-1" style="word-break: break-all;">
                                            {{ t.menu?.name }}
                                        </div>
                                        <div class="tab-delete" @click.stop="huiconsole.closeTab(t.id)">
                                            <CloseOutlined />
                                        </div>
                                    </div>
                                </template>
                            </anfo-orderable-container>
                        </div>
                        <div v-else class="h h-s">
                            <div class="p-h-s">没有打开的标签页</div>
                        </div>
                    </div>
                    <div class="main-pages f-1">
                        <keep-alive :include="context.componentTabs.map(t => t.id)">
                            <component v-if="context.currentTab?.menu?.type === $const.MT.COMPONENT" :is="context.currentComponent"></component>
                        </keep-alive>
                        <div v-for="t in context.iframeTabs" :key="t.id" v-show="context.currentTabID === t.id"
                            :class="['size-full overflow-hidden', t?.menu?.isTransparent ? '' : 'card']">
                            <component :is="context.components[t.id]"></component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import HuiConsole from '@/scripts/huiconsole'

let huiconsole = new HuiConsole()
huiconsole.init()

let context = huiconsole.context()
</script>

<style lang="scss" scoped>

$navHeight: 48px;
.sidebar{
    width: 200px;
    // background: whitesmoke;

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
    border-radius: 5px;
    color: $primaryTextColor;
}
.main-tab{
    min-width: 72px;
    border-radius: 3px;
    // transition: color .3s;
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
    padding: 8px 8px;
    
    &.has-children{
        background: rgba($primaryColor, calc(var(--layer) * .05));
        box-shadow: rgba(0, 0, 0, .14) 0 0 24px;
    }
    &.has-top-left-radius{
        border-top-left-radius: 5px;
    }
    &.has-bottom-left-radius{
        border-bottom-left-radius: 5px;
    }
    &.has-top-right-radius{
        border-top-right-radius: 5px;
    }
    &.has-bottom-right-radius{
        border-bottom-right-radius: 5px;
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
</style>