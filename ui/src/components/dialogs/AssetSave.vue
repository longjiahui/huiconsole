<template>
    <a-modal width="300px"
        @cancel="$emit('reject')"
        :title="title"
        @ok="handleConfirm">
        <div class="p-l v v-m">
            <div>
                <a-input v-model:value="lAsset.name" placeholder="name (optional)" #prefix>
                    <SmileOutlined/>
                </a-input>
            </div>
            <div>
                <a-radio-group v-model:value="lAsset.type">
                    <a-radio-button :value="$const.ASSET.SCRIPT">script</a-radio-button>
                    <a-radio-button :value="$const.ASSET.STYLE">style</a-radio-button>
                </a-radio-group>
            </div>
            <div>
                <a-input v-model:value="lAsset.url" placeholder="url" #prefix>
                    <LinkOutlined/>
                </a-input>
            </div>
        </div>
    </a-modal>
</template>
<script setup>
import { computed } from 'vue'
import utils from '@/scripts/utils'
import { api } from '@/scripts/api'
import $const from '@/const'

import extend from 'extend'
import { LinkOutlined, SmileOutlined } from '@ant-design/icons-vue'

let props = defineProps({
    asset: {
        type: Object,
        default: ()=>({})
    },
})
let emit = defineEmits(['reject', 'r'])

let lAsset = utils.createMiddleware(()=>{
    let data = extend(true, {
        type: $const.ASSET.SCRIPT,
    }, props.asset)
    return data
})
let isEdit = computed(()=>!!lAsset.value?._id)
let title = computed(()=>(isEdit.value ? '编辑' : '新建') + '资源')

function handleConfirm(){
    let asset = utils.limitKeys(lAsset.value, ['type', 'name', 'url', '_id', ])
    api.asset.save(asset).then(data=>{
        emit('r', data)
    })
}
</script>

<style lang="scss" scoped>
.menu-icon{
    font-size: 1.4em;
    width: 32px;
    height: 32px;
    border-radius: 3px;
    border: 1px dashed lightgray;
}
</style>