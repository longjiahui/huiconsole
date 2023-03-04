<template>
    <a-modal width="460px"
        @cancel="$emit('reject')"
        title="选择资源"
        @ok="handleConfirm">
        <div class="p-l p-b-m">
            <div class="v-m">
                <List #="{ data }">
                    <div class="v-s">
                        <div @click="lSelected[asset._id] = !lSelected[asset._id]" v-for="(asset, i) in data"
                            :class="['asset-item clickable card p-xs p-h-s h h-s c3width-104', lSelected[asset._id] ? 'is-selected' : '']">
                            <div>
                                <a-checkbox :checked="!!lSelected[asset._id]"></a-checkbox>
                            </div>
                            <div>
                                <FileOutlined v-if="asset.type === $const.ASSET.SCRIPT"/>
                                <BgColorsOutlined v-else-if="asset.type === $const.ASSET.STYLE" />
                            </div>
                            <div class="shrink-0">{{ asset.name }}</div>
                            <div class="ellipsis">{{ asset.url }}</div>
                        </div>
                    </div>
                </List>
                <div class="h justify-flex-end">
                    <Pagination />
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import utils from '@/scripts/utils'
import extend from 'extend'
import { usePagination } from '@anfo/ui'
import { api } from '@/scripts/api'
import { BgColorsOutlined, FileOutlined } from '@ant-design/icons-vue';

const { List, Pagination } = usePagination(api.asset.pageData)

let props = defineProps({
    selected: {
        type: Array,
        default: ()=>[]
    }
})
let emit = defineEmits(['r', 'reject'])
let lSelected = utils.createMiddleware(()=>extend(true, {}, (props.selected || []).reduce((t, k)=>{
    t[k] = true
    return t
}, {})))

function handleConfirm(){
    emit('r', Object.keys(lSelected.value).filter(k=>!!lSelected.value[k]))
}
</script>

<style lang="scss" scoped>
.asset-item{
    &.is-selected{
        background: rgb(211, 239, 255);
    }
}
</style>